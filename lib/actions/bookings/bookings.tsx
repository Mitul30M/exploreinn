"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma-client";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Booking, BookingStatus, Listing, Transaction } from "@prisma/client";
import OnboardCompleteEmail from "@/components/emails/onboarding";
import { resend } from "@/lib/resend";
import BookingConfirmationMail from "@/components/emails/booking-confirmation";
import {
  startOfWeek,
  endOfWeek,
  getDay,
  format,
  endOfYear,
  startOfYear,
  getMonth,
} from "date-fns";
import { stripe } from "@/lib/stripe";

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
  // listing dashboard side revalidation
  revalidatePath(`/listings/${newBooking.listingId}/bookings`);
  revalidatePath(`/listings/${newBooking.listingId}/bookings/${newBooking.id}`);
  // guest side revalidation
  revalidatePath(`/users/${newBooking.guestId}/bookings`);
  revalidatePath(`/user/${newBooking.guestId}/bookings/${newBooking.id}`);
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

/**
 * Retrieves all bookings made by the currently authenticated user.
 * @returns A promise that resolves to an array of bookings with their respective details.
 * @throws {Error} If the user is not authenticated.
 */
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

/**
 * Retrieves the latest booking for a given listing.
 * The function returns a promise that resolves to the latest booking object
 * with the booking's transaction and guest details.
 * @param listingId - The id of the listing whose latest booking is to be retrieved.
 * @returns A promise that resolves to the latest booking object with the booking's transaction and guest details.
 */
export async function getListingLatestBooking(listingId: string) {
  const latestBooking = await prisma.booking.findFirst({
    where: {
      listingId: listingId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      transaction: true,
      guest: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phoneNo: true,
          profileImg: true,
        },
      },
    },
  });
  return latestBooking;
}

/**
 * Retrieves all bookings for a given listing.
 * The function returns a promise that resolves to an array of bookings,
 * including the transaction details and guest information for each booking.
 * @param listingId - The id of the listing whose bookings are to be retrieved.
 * @returns A promise that resolves to an array of bookings with their respective transaction and guest details.
 */
export async function getListingBookings(listingId: string) {
  const bookings = await prisma.booking.findMany({
    where: {
      listingId: listingId,
    },
    include: {
      transaction: true,
      guest: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phoneNo: true,
          profileImg: true,
        },
      },
    },
  });
  return bookings;
}

/**
 * Retrieves the bookings for a given listing within the current week.
 * The function returns a promise that resolves to an array of objects
 * containing the day of the week and the number of bookings for that day.
 * @param listingId - The id of the listing whose bookings are to be retrieved.
 * @returns A promise that resolves to an array of objects with the day of the week and the number of bookings for that day.
 */
export async function getListingCurrentWeekBookings(listingId: string) {
  const bookings = await getListingBookings(listingId);

  // Get the start and end of the current week
  const now = new Date();
  const startDate = startOfWeek(now, { weekStartsOn: 1 }); // Monday as the first day of the week
  const endDate = endOfWeek(now, { weekStartsOn: 1 }); // Sunday as the last day of the week

  // Initialize an object to store daily bookings
  const dailyBookings = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };

  // Filter bookings within the current week and count them by day
  bookings.forEach((booking) => {
    const bookingDate = new Date(booking.createdAt);

    // Ensure the booking falls within the current week
    if (bookingDate >= startDate && bookingDate <= endDate) {
      const dayOfWeek = format(bookingDate, "EEE"); // Get the 3-letter day format
      // Explicitly cast dayOfWeek to ensure it matches the type of dailyBookings keys
      const day: keyof typeof dailyBookings =
        dayOfWeek as keyof typeof dailyBookings;
      dailyBookings[day] += 1; // Increment the count for that day
    }
  });

  // Format the data for the chart or further usage
  return Object.entries(dailyBookings).map(([day, count]) => ({
    day,
    bookings: count,
  }));
}

/**
 * Compares the monthly bookings for a given listing between the current year and the past year.
 * The function returns a promise that resolves to an array of objects containing the month,
 * the number of bookings in the past year, and the number of bookings in the current year.
 * @param listingId - The id of the listing whose monthly bookings are to be compared.
 * @returns A promise that resolves to an array of objects with the month, past year's bookings count, and current year's bookings count.
 */
export async function getMonthlyListingBookingsComparison(listingId: string) {
  const bookings = await prisma.booking.findMany({
    where: {
      listingId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const currentYear = new Date().getFullYear();
  const pastYear = currentYear - 1;

  // Get the year ranges
  const pastYearStartDate = startOfYear(new Date(pastYear, 0, 1));
  const pastYearEndDate = endOfYear(new Date(pastYear, 0, 1));
  const currentYearStartDate = startOfYear(new Date(currentYear, 0, 1));
  const currentYearEndDate = endOfYear(new Date(currentYear, 0, 1));

  // Initialize arrays to store monthly bookings
  const pastYearBookings = Array(12).fill(0);
  const currentYearBookings = Array(12).fill(0);

  // Count bookings for each month in both years
  bookings.forEach((booking) => {
    const bookingDate = new Date(booking.createdAt);
    const month = getMonth(bookingDate);

    if (bookingDate >= pastYearStartDate && bookingDate <= pastYearEndDate) {
      pastYearBookings[month] += 1;
    } else if (
      bookingDate >= currentYearStartDate &&
      bookingDate <= currentYearEndDate
    ) {
      currentYearBookings[month] += 1;
    }
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months.map((month, index) => ({
    month,
    pastYear: pastYearBookings[index],
    currentYear: currentYearBookings[index],
  }));
}

/**
 * Retrieves an overview of all bookings for a given listing, grouped by booking status.
 * The function returns a promise that resolves to an object with the following keys:
 * - upcoming: The number of bookings that are upcoming.
 * - ongoing: The number of bookings that are ongoing.
 * - completed: The number of bookings that are completed.
 * - cancelled: The number of bookings that are cancelled.
 * @param listingId - The id of the listing whose bookings are to be retrieved.
 * @returns A promise that resolves to an object with the booking status overview.
 */
export async function getAllBookingsStatusOverview(listingId: string) {
  const bookings = await prisma.booking.findMany({
    where: {
      listingId: listingId,
    },
    select: {
      bookingStatus: true,
    },
  });

  const statusOverview = {
    upcoming: 0,
    ongoing: 0,
    completed: 0,
    cancelled: 0,
  };

  bookings.forEach((booking) => {
    statusOverview[booking.bookingStatus] += 1;
  });

  return statusOverview;
}

/**
 * Updates the booking status of a booking belonging to a given listing.
 * The function returns a promise that resolves to the updated booking object with the booking's transaction and guest details.
 * @param bookingId - The id of the booking whose status is to be updated.
 * @param status - The new status of the booking.
 * @returns A promise that resolves to the updated booking object with the booking's transaction and guest details.
 */
export async function updateListingBookingStatus(
  bookingId: string,
  status: BookingStatus
) {
  const updatedBookings = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      transaction: true,
      listing: {
        select: {
          owner: {
            select: {
              stripeId: true,
            },
          },
        },
      },
      guest: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phoneNo: true,
          profileImg: true,
          stripeId: true,
        },
      },
    },
  });

  if (!updatedBookings) {
    throw new Error("Failed to update booking status");
  }

  switch (status) {
    // skip "upcoming" status

    case "ongoing":
      // Handle ongoing status
      // Update the booking status in the database
      const onGoingBooking = await prisma.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          bookingStatus: "ongoing",
        },
      });
      // Send a notification & email to the guest
      // Send a notification & email to the host
      break;

    case "completed":
      // Handle completed status
      // Update the booking status in the database
      const completedBooking = await prisma.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          bookingStatus: "completed",
        },
      });
      // Send a notification & email to the guest
      // Send a notification & email to the host
      break;

    case "cancelled":
      // Handle cancelled status
      // check first if payment is paid or not
      const paymentStatus = updatedBookings.paymentStatus;

      // if payment is made, ie. ONLINE_BOOKING bookingType, also update respective payment status and booking status in transaction table as well
      if (paymentStatus === "completed") {
        //     if booking is being cancelled withing 48hrs of createdAt date, refund the full payment, but then also charge the host for the cancellation & refund

        if (
          new Date(updatedBookings.createdAt).getTime() + 48 * 60 * 60 * 1000 >=
          new Date().getTime()
        ) {
          console.log("in server action");
          // refund the payment
          const refund = await stripe.refunds.create({
            payment_intent: updatedBookings.transaction?.paymentId as string,
            refund_application_fee: true,
            reverse_transfer: true,
          });
          console.log(`Refund ID: ${refund.id}\nRefunded: ${refund.charge}`);

          console.log(
            `Booking ${updatedBookings.id} opted for cancellation. \nRefunding full amount: `,
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(updatedBookings.totalCost)
          );
        }
        //     if booking is being cancelled after 48hrs of createdAt date, send a refund whilst deducting 5% of the total amount as a penalty for late cancellation
        else {
          // set a transfer for cancellation
          const transfer = await stripe.transfers.create(
            {
              amount: Math.round(updatedBookings.totalCost * 0.95 * 100),
              currency: "usd",
              destination: process.env.EXPLOREINN_STRIPE_ACCOUNT_ID as string,
            },
            {
              stripeAccount: updatedBookings.listing.owner.stripeId as string,
            }
          );
          console.log(
            `Transfer ID: ${transfer.id}\nTransfer Amount: ${transfer.amount}`
          );
          // refund the payment
          const refund = await stripe.refunds.create({
            payment_intent: updatedBookings.transaction?.paymentId as string,
            amount: Math.round(updatedBookings.totalCost * 0.95 * 100),
          });
          console.log(`Refund ID: ${refund.id}\nRefunded: ${refund.charge}`);

          console.log(
            `Booking ${updatedBookings.id} opted for cancellation. \nRefunding amount with 5% late cancellation fee: `,
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(updatedBookings.totalCost)
          );
        }
        // update the payment status in the database
        await prisma.booking.update({
          where: { id: updatedBookings.id },
          data: {
            paymentStatus: "refunded",
            bookingStatus: "cancelled",
          },
        });
        await prisma.transaction.update({
          where: { id: updatedBookings.transaction?.id },
          data: {
            paymentStatus: "refunded",
          },
        });
      }
      // if payment is not made, ie. BOOK_NOW_PAY_LATER bookingType
      else if (paymentStatus === "pending") {
        // if payment is not made,
        //     if booking is being cancelled withing 48hrs of createdAt date, do nothing just cancel the booking,no charge
        if (
          new Date(updatedBookings.createdAt).getTime() + 48 * 60 * 60 * 1000 >=
          new Date().getTime()
        ) {
          console.log(
            `Booking ${updatedBookings.id} opted for cancellation. \nNo refund issued.`
          );
        }
        //     if booking is being cancelled after 48hrs of createdAt date, charge the guest 5% of the total amount as a penalty for late cancellation through a stripe invoice, then cancel the booking
        else {
          const customer = await stripe.customers.create({
            email: updatedBookings.guest.email,
            name: `${updatedBookings.guest.firstName} ${updatedBookings.guest.lastName}`,
            metadata: {
              bookingId: updatedBookings.id,
            },
          });
          // create an Invoice Item for the Guest
          const invoice = await stripe.invoices.create({
            on_behalf_of: updatedBookings.listing.owner.stripeId as string,
            application_fee_amount:
              updatedBookings.totalCost * 0.05 * 0.05 * 100,
            transfer_data: {
              destination: updatedBookings.listing.owner.stripeId as string,
            },
            customer: customer.id,
          });
          console.log(
            `Booking ${updatedBookings.id} opted for cancellation. \nInvoice created for late cancellation: ${invoice.id}. \nInvoice Amount: ${invoice.amount_due}`
          );
        }
        await prisma.booking.update({
          where: {
            id: bookingId,
          },
          data: {
            bookingStatus: "cancelled",
            paymentStatus: "cancelled",
          },
        });
      }

      // Send a notification & email to the guest
      // Send a notification & email to the host
      break;

    default:
      return new Error(`Invalid booking status: ${status}`);
  }

  // listing dashboard revalidation
  revalidatePath(`/listings/${updatedBookings.listingId}/bookings`);
  revalidatePath(
    `/listings/${updatedBookings.listingId}/bookings/${updatedBookings.id}`
  );
  // guest side revalidation
  revalidatePath(`/users/${updatedBookings.guestId}/bookings`);
  revalidatePath(
    `/user/${updatedBookings.guestId}/bookings/${updatedBookings.id}`
  );
}

// to create invnvoice for late cancellation
// await stripe.invoiceItems.create({
//   customer: updatedBookings.guest.stripeId as string,
//   amount: updatedBookings.totalCost * 0.05 * 100, // 5% penalty fee
//   currency: "usd",
//   description: `Late cancellation fee for booking ${updatedBookings.id}. 5%  of the total amount.`,
// });

// // generate Invoice for the Guest
// const invoice = await stripe.invoices.create({
//   customer: updatedBookings.guest.stripeId as string,
//   collection_method: "send_invoice",
//   days_until_due: 3,
//   transfer_data: {
//     amount: updatedBookings.totalCost * 0.05 * 100, // Send penalty amount to host
//     destination: updatedBookings.listing.owner.stripeId as string,
//   },
// });
