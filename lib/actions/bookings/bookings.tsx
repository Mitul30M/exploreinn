"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma-client";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Booking, Listing } from "@prisma/client";
import OnboardCompleteEmail from "@/components/emails/onboarding";
import { resend } from "@/lib/resend";
import BookingConfirmationMail from "@/components/emails/booking-confirmation";

const bookingFormSchema = z.object({
  listingID: z.string(),
  checkIn: z.date(),
  checkOut: z.date(),
  nights: z.number(),
  guests: z.number(),
  rooms: z.array(
    z.object({
      roomID: z.string(),
      name: z.string(),
      rate: z.number(),
      noOfRooms: z.number(),
    })
  ),
  taxes: z.array(
    z.object({
      name: z.string(),
      rate: z.number(),
    })
  ),
  extras: z.array(
    z.object({
      name: z.string(),
      cost: z.number(),
    })
  ),
  totalWithoutTaxes: z.number(),
  tax: z.number(),
  totalPayable: z.number(),
  paymentMethod: z.enum(["book-now-pay-later", "online-payment"], {
    required_error: "Please a Payment Method",
  }),
});

/**
 * Creates a new booking with the given details and a payment status of "pending".
 *
 * The user is redirected to their bookings page after the booking is created.
 *
 * @param bookingDetails - The booking details form data
 * @throws {Error} If the user is not authenticated or authorized
 * @throws {Error} If the booking creation fails
 */
export async function createBookNowPayLaterBooking(
  bookingDetails: z.infer<typeof bookingFormSchema>
): Promise<void> {
  console.log("creating new booking");
  console.log(bookingDetails);
  const { userId, sessionClaims } = await auth();
  const userDbId = (sessionClaims?.public_metadata as PublicMetadataType)
    .userDB_id;
  if (!userId || !userDbId) {
    throw new Error("User not authenticated");
    redirect("/sign-up");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: userDbId,
    },
  });

  if (!user) {
    throw new Error("User not found");
    redirect("/sign-up");
  }

  const newBooking = await prisma.booking.create({
    data: {
      listingId: bookingDetails.listingID,
      guestId: user.id,
      checkInDate: bookingDetails.checkIn,
      checkOutDate: bookingDetails.checkOut,
      guests: bookingDetails.guests,
      rooms: bookingDetails.rooms.map((room: any) => ({
        roomId: room.roomID,
        name: room.name,
        rate: room.rate,
        noOfRooms: room.noOfRooms,
      })),
      extras: bookingDetails.extras,
      bookingType: "BOOK_NOW_PAY_LATER",
      paymentStatus: "pending",
      taxRates: bookingDetails.taxes,
      tax: bookingDetails.tax,
      totalCost: bookingDetails.totalPayable,
      bookingStatus: "upcoming",
    },
  });
  const listing = await prisma.listing.findUnique({
    where: {
      id: bookingDetails.listingID,
    },
  });

  console.log("New Booking created successfully: ", newBooking);
  await revalidatePath(`/users/${newBooking.guestId}/bookings`);
  const { data, error } = await resend.emails.send({
    from: "exploreinn <no-reply@mitul30m.in>",
    to: [user.email],
    subject: "Booking Successful",
    react: BookingConfirmationMail({
      user,
      booking: newBooking as Booking,
      listing: listing as Listing,
    }),
    scheduledAt: "in 1 minute",
  });
  redirect(`/users/${newBooking.guestId}/bookings`);
}

export async function getUserBookings() {
  const { userId, sessionClaims } = await auth();
  const userDbId = (sessionClaims?.public_metadata as PublicMetadataType)
    .userDB_id;
  if (!userId || !userDbId) {
    throw new Error("User not authenticated");
  }
  const userBookings = await prisma.booking.findMany({
    where: {
      guestId: userDbId,
    },
    include: {
      listing: {
        select: {
          id: true,
          name: true,
          coverImage: true,
          address: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return userBookings;
}
