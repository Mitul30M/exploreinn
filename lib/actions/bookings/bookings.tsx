"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma-client";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Booking, BookingStatus, Listing } from "@prisma/client";
import { resend } from "@/lib/resend";
import BookingConfirmationMail from "@/components/emails/booking-confirmation";
import {
  startOfWeek,
  endOfWeek,
  format,
  endOfYear,
  startOfYear,
  getMonth,
} from "date-fns";
import { stripe } from "@/lib/stripe";
import { dynamicallySetRoomPrice } from "../rooms/rooms";
// import ChargeInvoice from "@/components/emails/charge-invoice";

const _bookingFormSchema = z.object({
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
  isOfferApplied: z.boolean().optional(),
  offerId: z.string().optional(),
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
  bookingDetails: z.infer<typeof _bookingFormSchema>
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

  const parsedBookingDetails = _bookingFormSchema.parse(bookingDetails);
  if (!parsedBookingDetails) {
    throw new Error("Invalid booking details");
  }
  const newBooking = await prisma.booking.create({
    data: {
      listingId: bookingDetails.listingID,
      guestId: user.id,
      checkInDate: bookingDetails.checkIn,
      checkOutDate: bookingDetails.checkOut,
      guests: bookingDetails.guests,
      rooms: bookingDetails.rooms.map(
        (room: {
          roomID: string;
          name: string;
          rate: number;
          noOfRooms: number;
        }) => ({
          roomId: room.roomID,
          name: room.name,
          rate: room.rate,
          noOfRooms: room.noOfRooms,
        })
      ),
      extras: bookingDetails.extras,
      bookingType: "BOOK_NOW_PAY_LATER",
      paymentStatus: "pending",
      taxRates: bookingDetails.taxes,
      tax: bookingDetails.tax,
      totalCost: bookingDetails.totalPayable,
      bookingStatus: "upcoming",
    },
  });
  if (!newBooking) {
    throw new Error("Error creating new booking");
  }
  if (newBooking && bookingDetails.isOfferApplied && bookingDetails.offerId) {
    try {
      await prisma.$transaction([
        prisma.booking.update({
          where: {
            id: newBooking.id,
          },
          data: {
            offerId: bookingDetails.offerId,
          },
        }),
        prisma.offer.update({
          where: {
            id: bookingDetails.offerId,
          },
          data: {
            bookingIds: {
              push: newBooking.id,
            },
          },
        }),
      ]);
      console.log("Offer updated successfully");
    } catch (error) {
      console.error("Failed to update offer details:", error);
      // Continue execution even if offer update fails
    }
  }
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
  await resend.emails.send({
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
    orderBy: {
      createdAt: "desc",
    },
  });
  return bookings;
}

/**
 * Retrieves a booking by its id.
 * The function returns a promise that resolves to a booking object with its transaction and guest details.
 * @param bookingId - The id of the booking to be retrieved.
 * @returns A promise that resolves to a booking object with its transaction and guest details.
 */
export async function getUserBooking(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
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
      listing: {
        select: {
          id: true,
          name: true,
          coverImage: true,
          address: true,
          email: true,
          phoneNo: true,
        },
      },
    },
  });
  return booking;
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
    if (
      bookingDate >= startDate &&
      bookingDate <= endDate &&
      ["upcoming", "completed", "ongoing"].includes(booking.bookingStatus)
    ) {
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
      bookingStatus: {
        not: "cancelled",
      },
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
 * Retrieves an overview of all bookings for a given room, grouped by booking status.
 * The function returns a promise that resolves to an object with the following keys:
 * - upcoming: The number of bookings that are upcoming.
 * - ongoing: The number of bookings that are ongoing.
 * @param roomId - The id of the room whose bookings are to be retrieved.
 * @returns A promise that resolves to an object with the booking status overview.
 */
export async function getRoomsBookingStatusOverview(roomId: string) {
  const bookings = await prisma.booking.findMany({
    where: {
      rooms: {
        some: {
          roomId: roomId,
        },
      },
    },
    select: {
      bookingStatus: true,
    },
  });

  const statusOverview = {
    upcoming: 0,
    ongoing: 0,
  };

  bookings.forEach((booking) => {
    if (
      booking.bookingStatus === "upcoming" ||
      booking.bookingStatus === "ongoing"
    ) {
      statusOverview[booking.bookingStatus] += 1;
    }
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
  const updateBooking = await prisma.booking.findUnique({
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

  if (!updateBooking) {
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
      for (const room of onGoingBooking.rooms) {
        await prisma.room.update({
          where: {
            id: room.roomId,
          },
          data: {
            currentlyAvailableRooms: {
              decrement: room.noOfRooms,
            },
          },
        });
      }

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

      for (const room of completedBooking.rooms) {
        await prisma.room.update({
          where: {
            id: room.roomId,
          },
          data: {
            currentlyAvailableRooms: {
              increment: room.noOfRooms,
            },
          },
        });
      }
      // Send a notification & email to the guest
      // Send a notification & email to the host
      break;

    case "cancelled":
      // Handle cancelled status
      // check first if payment is paid or not
      const paymentStatus = updateBooking.paymentStatus;

      // if payment is made, ie. ONLINE_BOOKING bookingType, also update respective payment status and booking status in transaction table as well
      if (paymentStatus === "completed") {
        // Calculate time differences
        const timeTillCheckin =
          new Date(updateBooking.checkInDate).getTime() - new Date().getTime();
        const creationToCheckinTime =
          new Date(updateBooking.checkInDate).getTime() -
          new Date(updateBooking.createdAt).getTime();
        const HOURS_48 = 48 * 60 * 60 * 1000;
        const HOURS_72 = 72 * 60 * 60 * 1000;

        if (timeTillCheckin >= HOURS_48 || creationToCheckinTime <= HOURS_72) {
          console.log(
            "Full refund: Cancellation is either 2+ days before checkin OR booking was created within 3 days of checkin"
          );
          // Process full refund
          const refund = await stripe.refunds.create({
            payment_intent: updateBooking.transaction?.paymentId as string,
            refund_application_fee: true,
            reverse_transfer: true,
          });
          console.log(`Refund ID: ${refund.id}\nRefunded: ${refund.charge}`);
        } else {
          console.log(
            "Partial refund: Cancellation is less than 48 hours before checkin - Charging 5% cancellation fee"
          );
          // Calculate refund amount (95% of total)
          const refundAmount = Math.floor(updateBooking.totalCost * 0.95);

          const refund = await stripe.refunds.create({
            payment_intent: updateBooking.transaction?.paymentId as string,
            amount: refundAmount,
            refund_application_fee: true,
            reverse_transfer: true,
          });
          console.log(
            `Refund ID: ${refund.id}\nRefunded: ${refund.charge} $${refund.amount}`
          );
        }

        console.log(
          `Booking ${updateBooking.id} opted for cancellation. \nRefunding full amount: `,
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(updateBooking.totalCost)
        );

        // update the payment status in the database
        await prisma.booking.update({
          where: { id: updateBooking.id },
          data: {
            paymentStatus: "refunded",
            bookingStatus: "cancelled",
          },
        });
        await prisma.transaction.update({
          where: { id: updateBooking.transaction?.id },
          data: {
            paymentStatus: "refunded",
            refundedAt: new Date(),
          },
        });
      }
      // if payment is not made, ie. BOOK_NOW_PAY_LATER bookingType
      else if (paymentStatus === "pending") {
        // if payment is not made,
        //     if booking is being cancelled withing 48hrs of createdAt date, do nothing just cancel the booking,no charge
        if (
          new Date(updateBooking.createdAt).getTime() + 48 * 60 * 60 * 1000 >=
          new Date().getTime()
        ) {
          console.log(
            `Booking ${updateBooking.id} opted for cancellation. \nNo Charge issued.`
          );
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
        //     if booking is being cancelled after 48hrs of createdAt date, charge the guest 5% of the total amount as a penalty for late cancellation through a stripe invoice, then cancel the booking
        else {
          const customer = await stripe.customers.create({
            email: updateBooking.guest.email,
            name: `${updateBooking.guest.firstName} ${updateBooking.guest.lastName}`,
            metadata: {
              bookingId: updateBooking.id,
            },
          });

          const invoice = await stripe.invoices.create({
            customer: customer.id,
            collection_method: "send_invoice",
            due_date: Math.floor(Date.now() / 1000) + 5 * 24 * 60 * 60, // Set due date to 5 days from now
            application_fee_amount: Math.round(
              updateBooking.totalCost * 0.05 * 0.05 * 100
            ),
            transfer_data: {
              destination: updateBooking.listing.owner.stripeId as string,
            },
          });

          // Create an invoice item for the late cancellation fee
          const invoiceItem = await stripe.invoiceItems.create({
            customer: customer.id,
            amount: Math.round(updateBooking.totalCost * 0.05 * 100), // 5% of totalCost
            currency: "usd", // Specify the currency
            description: "Late cancellation fee. 5% of the total amount", // Description of the invoice item
            invoice: invoice.id,
          });

          console.log("Invoice Items: ", invoiceItem);

          // Send the Invoice
          await stripe.invoices.sendInvoice(invoice.id);
          console.log(
            `Booking ${updateBooking.id} opted for cancellation. \nInvoice created for late cancellation: ${invoice.id}. \nInvoice Amount: ${updateBooking.totalCost * 0.05}`
          );

          await prisma.booking.update({
            where: {
              id: bookingId,
            },
            data: {
              bookingStatus: "cancelled",
              paymentStatus: "charged",
            },
          });
          // create a new transaction for the charged transaction
          const chargedTransaction = await prisma.transaction.create({
            data: {
              paymentId: invoice.id,
              paymentMethod: "BOOK_NOW_PAY_LATER",
              paymentStatus: "charged",
              bookingId: updateBooking.id,
              guestId: updateBooking.guestId,
              listingId: updateBooking.listingId,
              tax: 0,
              totalCost: updateBooking.totalCost * 0.05,
              bookingType: "BOOK_NOW_PAY_LATER",
              chargedAt: new Date(),
              receiptURL: invoice.hosted_invoice_url,
            },
          });
          console.log(
            `Booking ${updateBooking.id} opted for cancellation. \nCharged for late cancellation: ${chargedTransaction.id}`
          );
        }
      }

      // Send a notification & email to the guest
      // Send a notification & email to the host
      break;

    default:
      return new Error(`Invalid booking status: ${status}`);
  }

  updateBooking.rooms.forEach(async (room) => {
    await dynamicallySetRoomPrice(room.roomId);
    revalidatePath(`/listings/${updateBooking.listingId}/rooms/${room.roomId}`);
  });

  // listing dashboard revalidation
  revalidatePath(`/listings/${updateBooking.listingId}/bookings`);
  revalidatePath(
    `/listings/${updateBooking.listingId}/bookings/${updateBooking.id}`
  );
  // guest side revalidation
  revalidatePath(`/users/${updateBooking.guestId}/bookings`);
  revalidatePath(`/user/${updateBooking.guestId}/bookings/${updateBooking.id}`);
  revalidatePath(`/listings/${updateBooking.listingId}`);
}

/**
 * Sets a booking's payment status to "completed".
 * @param bookingId - The id of the booking to update.
 * @returns A promise that resolves to an object with a type field set to either "success" or "error" and a message that describes the outcome of the operation.
 * If the booking is not found, it will return an error with a message of "Booking not found".
 * If the booking's payment status is already "completed", it will return an error with a message of "Booking's Payment is already completed".
 * If the booking is successfully updated, it will return a success with a message of "Booking's Payment is completed".
 */
export async function setPaymentStatusCompleted(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    return {
      type: "error",
      message: "Booking not found",
    };
  }

  if (booking.paymentStatus === "completed") {
    return {
      type: "error",
      message: "Booking's Payment is already completed",
    };
  }

  const updateBooking = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      paymentStatus: "completed",
    },
  });

  if (!updateBooking) {
    return {
      type: "error",
      message: "Booking not found",
    };
  }
  // Send a notification & email to the guest
  revalidatePath(`/users/${updateBooking.guestId}/bookings`);
  revalidatePath(`/user/${updateBooking.guestId}/bookings/${updateBooking.id}`);
  revalidatePath(`/listings/${updateBooking.listingId}/bookings`);
  revalidatePath(
    `/listings/${updateBooking.listingId}/bookings/${updateBooking.id}`
  );
  return {
    type: "success",
    message: "Booking's Payment is completed",
  };
}

// to create invnvoice for late cancellation
// await stripe.invoiceItems.create({
//   customer: updateBooking.guest.stripeId as string,
//   amount: updateBooking.totalCost * 0.05 * 100, // 5% penalty fee
//   currency: "usd",
//   description: `Late cancellation fee for booking ${updateBooking.id}. 5%  of the total amount.`,
// });

// // generate Invoice for the Guest
// const invoice = await stripe.invoices.create({
//   customer: updateBooking.guest.stripeId as string,
//   collection_method: "send_invoice",
//   days_until_due: 3,
//   transfer_data: {
//     amount: updateBooking.totalCost * 0.05 * 100, // Send penalty amount to host
//     destination: updateBooking.listing.owner.stripeId as string,
//   },
// });

// First transfer 95% of the total amount from owner to app
// const transferToApp = await stripe.transfers.create({
//   amount: Math.round(updateBooking.totalCost * 0.95 * 100), // 95% of total amount
//   currency: "usd",
//   destination: updateBooking.listing.owner.stripeId as string,
//   description: "Transfer back to app for refund processing",
//   transfer_group: `group_${updateBooking.id}`,
// });

// // Secondly, refund 95% to customer
// const refund = await stripe.refunds.create({
//   payment_intent: updateBooking.transaction?.paymentId as string,
//   amount: Math.round(updateBooking.totalCost * 0.95 * 100), // 95% refund
//   refund_application_fee: false, // Don't refund app fee since we need it for the late fee
// });

// // Then transfer 95% of the 5% commission to owner as late fee
// const transferToOwner = await stripe.transfers.create({
//   amount: Math.round(updateBooking.totalCost * 0.05 * 0.95 * 100), // 95% of 5% commission
//   currency: "usd",
//   destination: updateBooking.listing.owner.stripeId as string,
//   description: "Late cancellation fee",
// });
