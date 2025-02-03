import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma-client";
import { revalidatePath } from "next/cache";
import BookingConfirmationMail from "@/components/emails/booking-confirmation";
import { resend } from "@/lib/resend";
import { Booking, Listing } from "@prisma/client";
import OnlinePaymentBookingComplete from "@/components/emails/online-payment-booking-complete";
import Invoice from "@/components/emails/invoice";

export async function POST(req: Request) {
  console.log("Webhook received");

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

  console.log("Webhook signature:", signature ? "Present" : "Missing");

  let event: Stripe.Event;

  try {
    console.log("Attempting to construct webhook event");
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("Webhook event constructed successfully:", event.type);
  } catch (err) {
    console.error("Webhook construction failed:", err);
    return new Response(`Webhook Error: ${(err as Error).message}`, {
      status: 400,
    });
  }

  try {
    switch (event.type) {
      case "account.updated":
        console.log("Processing account.updated");
        const account = event.data.object;
        const userDb = await prisma.user.update({
          where: {
            stripeId: account.id,
          },
          data: {
            isStripeConnectedAccount:
              account.capabilities?.transfers !== "pending" &&
              account.capabilities?.transfers !== "inactive",
          },
          select: {
            clerkId: true,
            stripeId: true,
            id: true,
          },
        });
        if (!userDb) break;
        revalidatePath(`/users/${userDb.id}`);
        console.log(
          `successfully updated user ${userDb.id}'s stripe account linking status`
        );
        break;

      case "checkout.session.completed":
        console.log("Processing checkout.session.completed");
        const checkoutSession = event.data.object;
        const paymentId = event.data.object.payment_intent;
        if (!paymentId) {
          console.log("Payment intent not found");
          break;
        }
        if (
          !checkoutSession.metadata ||
          !checkoutSession.metadata.userID ||
          !checkoutSession.metadata.listingID ||
          !checkoutSession.metadata.bookingDate ||
          !checkoutSession.metadata.checkIn ||
          !checkoutSession.metadata.checkOut ||
          !checkoutSession.metadata.guests ||
          !checkoutSession.metadata.nights ||
          !checkoutSession.metadata.rooms ||
          !checkoutSession.metadata.extras ||
          !checkoutSession.metadata.taxes ||
          !checkoutSession.metadata.tax ||
          !checkoutSession.metadata.totalPayable ||
          !checkoutSession.metadata.totalWithoutTaxes
        ) {
          console.log("Metadata not found. Booking Not Created");
          break;
        }
        const bookingData = {
          userID: checkoutSession.metadata.userID.replace(/^"|"$/g, ""),
          listingID: checkoutSession.metadata.listingID,
          bookingDate: new Date(checkoutSession.metadata.bookingDate),
          checkIn: new Date(checkoutSession.metadata.checkIn),
          checkOut: new Date(checkoutSession.metadata.checkOut),
          guests: parseInt(checkoutSession.metadata.guests),
          nights: parseInt(checkoutSession.metadata.nights),
          rooms: JSON.parse(checkoutSession.metadata.rooms).map(
            (room: any) => ({
              roomId: room.roomID,
              name: room.name,
              rate: room.rate,
              noOfRooms: room.noOfRooms,
            })
          ) as {
            roomId: string;
            name: string;
            rate: number;
            noOfRooms: number;
          }[],
          extras: JSON.parse(checkoutSession.metadata.extras) as {
            name: string;
            cost: number;
          }[],
          taxes: JSON.parse(checkoutSession.metadata.taxes) as {
            name: string;
            rate: number;
          }[],
          tax: parseFloat(checkoutSession.metadata.tax),
          totalCost: parseFloat(checkoutSession.metadata.totalPayable),
        };
        console.log("creating new booking");
        console.log(bookingData);

        const newBooking = await prisma.booking.create({
          data: {
            listingId: bookingData.listingID,
            guestId: bookingData.userID,
            checkInDate: bookingData.checkIn,
            checkOutDate: bookingData.checkOut,
            guests: bookingData.guests,
            rooms: bookingData.rooms,
            extras: bookingData.extras,
            bookingStatus: "upcoming",
            bookingType: "ONLINE_PAYMENT",
            paymentId: paymentId as string,
            paymentStatus: "completed",
            taxRates: bookingData.taxes,
            tax: bookingData.tax,
            totalCost: bookingData.totalCost,
          },
        });

        console.log("New Booking created successfully: ", newBooking);
        // listing dashboard side revalidation
        revalidatePath(`/listings/${newBooking.listingId}/bookings`);
        revalidatePath(
          `/listings/${newBooking.listingId}/bookings/${newBooking.id}`
        );
        // guest side revalidation
        revalidatePath(`/users/${newBooking.guestId}/bookings`);
        revalidatePath(`/user/${newBooking.guestId}/bookings/${newBooking.id}`);
        break;

      case "charge.updated":
        console.log("Processing charge.updated");
        const charge = event.data.object;
        const id = event.data.object.payment_intent;

        if (!id) {
          console.log("Payment intent not found");
          break;
        }

        console.log("Payment intent: ", id);

        // Retry logic to ensure booking is created before proceeding
        let booking;
        const maxRetries = 5;
        for (let i = 0; i < maxRetries; i++) {
          booking = await prisma.booking.findFirst({
            where: { paymentId: id as string },
          });
          if (booking) break;
          await new Promise((resolve) => setTimeout(resolve, 200)); // Wait 2 seconds
        }

        if (!booking) {
          console.error("Booking still not found after retries");
          break;
        }

        // Check if transaction already exists
        const existingTransaction = await prisma.transaction.findFirst({
          where: { paymentId: id as string },
        });
        if (existingTransaction) {
          console.log("Transaction already exists, skipping creation.");
          break;
        }

        console.log("Creating new transaction");
        const newTransaction = await prisma.transaction.create({
          data: {
            paymentId: id as string,
            listingId: booking.listingId,
            guestId: booking.guestId,
            bookingId: booking.id,
            paymentStatus: "completed",
            taxRates: booking.taxRates,
            tax: booking.tax,
            totalCost: booking.totalCost,
            receiptURL: charge.receipt_url as string,
            paymentMethod: "ONLINE_PAYMENT",
            card: {
              billingEmail: charge.billing_details.email as string,
              billingPhone: charge.billing_details.phone as string,
              billingName: charge.billing_details.name as string,
              cardBrand: charge.payment_method_details?.card?.brand as string,
              last4: charge.payment_method_details?.card?.last4 as string,
              expMonth: charge.payment_method_details?.card
                ?.exp_month as number,
              expYear: charge.payment_method_details?.card?.exp_year as number,
            },
          },
        });

        console.log("New Transaction created successfully: ", newTransaction);

        const updatedBooking = await prisma.booking.update({
          where: {
            id: booking.id,
          },
          data: {
            transactionId: newTransaction.id,
          },
        });

        const user = await prisma.user.findUnique({
          where: {
            id: booking.guestId,
          },
        });

        const listing = await prisma.listing.findUnique({
          where: {
            id: booking.listingId,
          },
        });
        console.log("Updated Booking to include the transactionId");

        await resend.emails.send({
          from: "exploreinn@mitul30m.in",
          to: [user!.email],
          subject: "Booking & Payment Successful",
          react: OnlinePaymentBookingComplete({
            user: user!,
            listing: listing!,
            transaction: newTransaction,
            booking: updatedBooking,
          }),
          scheduledAt: "in 1 minute",
        });

        await resend.emails.send({
          from: "exploreinn@mitul30m.in",
          to: [user!.email],
          subject: "Invoice for Recent Transaction",
          react: Invoice({
            user: user!,
            transaction: newTransaction,
            booking: updatedBooking,
          }),
          scheduledAt: "in 1 minute",
        });

        revalidatePath(`/users/${newTransaction.guestId}/bookings`);
        revalidatePath(`/users/${newTransaction.guestId}/billing`);
        revalidatePath(`/listings/${newTransaction.listingId}/bookings`);
        revalidatePath(`/listings/${newTransaction.listingId}/transactions`);
        break;
    }
  } catch (error) {
    console.log("Error processing webhook:", error);
    return new Response(null, { status: 500 });
  }
  return new Response(null, { status: 200 });
}
