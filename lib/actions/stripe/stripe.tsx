"use server";
import prisma from "@/lib/prisma-client";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";
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
  isOfferApplied: z.boolean().optional(),
  offerId: z.string().optional(),
}); /**
 * Creates a Stripe Checkout Session for a booking.
 *
 * @param bookingDetails - The booking details form data
 * @returns A void promise that redirects to the Stripe Checkout Session
 *
 * @throws {Error} If the user is not authenticated or authorized
 */
export async function createStripeCheckoutSession(
  bookingDetails: z.infer<typeof bookingFormSchema>
): Promise<void> {
  console.log(bookingDetails);
  const parsedBookingDetails = bookingFormSchema.parse(bookingDetails);
  if (!parsedBookingDetails) {
    throw new Error("Invalid booking details");
  }
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
    select: {
      id: true,
      clerkId: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNo: true,
      profileImg: true,
      address: true,
      dob: true,
      gender: true,
    },
  });

  const listing = await prisma.listing.findUnique({
    where: {
      id: bookingDetails.listingID,
    },
    select: {
      id: true,
      name: true,
      address: true,
      coverImage: true,
      starRating: true,
      overallRating: true,
      exploreinnGrade: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
    redirect("/sign-up");
  }

  if (!listing) {
    throw new Error("Listing not found");
    redirect("/sign-up");
  }
  const sellerStripeConnectID = await prisma.listing.findUnique({
    where: {
      id: bookingDetails.listingID,
    },
    include: {
      owner: {
        select: {
          stripeId: true,
        },
      },
    },
  });

  // const rooms = await prisma.room.findMany({
  //   where: {
  //     id: {
  //       in: bookingDetails.rooms.map((room) => room.roomID),
  //     },
  //   },
  // });

  // const roomCart = bookingDetails.rooms.map((room) => {
  //   // Calculate total for each room without taxes
  //   const roomTotalWithoutTaxes =
  //     room.rate * room.noOfRooms * bookingDetails.nights;

  //   // Calculate total tax rate by summing all tax rates
  //   const taxRate = bookingDetails.taxes.reduce((total, tax) => {
  //     return total + tax.rate;
  //   }, 0);

  //   // Calculate tax amount
  //   const tax = (taxRate * roomTotalWithoutTaxes) / 100;

  //   // Calculate total payable including tax
  //   const totalPayable = roomTotalWithoutTaxes + tax;

  //   // For Stripe, we need per-room price, so divide totalPayable by number of rooms
  //   // This ensures correct multiplication when Stripe applies the quantity
  //   return {
  //     price_data: {
  //       currency: "usd",
  //       product_data: {
  //         name: room.name,
  //         description: `${room.noOfRooms}x ${room.name} ${bookingDetails.nights} nights`,
  //         images: [rooms.find((r) => r.id === room.roomID)?.coverImage],
  //       },
  //       unit_amount: Math.round((totalPayable / room.noOfRooms) * 100),
  //     },
  //     quantity: room.noOfRooms,
  //   };
  // });

  // const extrasCart = bookingDetails.extras.map((extra) => {
  //   // Calculate total for each extra without taxes
  //   const extraTotalWithoutTaxes =
  //     extra.cost * bookingDetails.nights * bookingDetails.guests;
  //   // Calculate total tax rate by summing all tax rates
  //   const taxRate = bookingDetails.taxes.reduce((total, tax) => {
  //     return total + tax.rate;
  //   }, 0);
  //   // Calculate tax amount
  //   const tax = (taxRate * extraTotalWithoutTaxes) / 100;

  //   // Calculate total payable including tax
  //   const totalPayable = extraTotalWithoutTaxes + tax;

  //   return {
  //     price_data: {
  //       currency: "usd",
  //       product_data: {
  //         name: extra.name,
  //         description: `${bookingDetails.guests}x ${extra.name}`,
  //       },
  //       unit_amount: Math.round((totalPayable / bookingDetails.guests) * 100),
  //     },
  //     quantity: bookingDetails.guests,
  //   };
  // });

  const cart = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: `${user.firstName} ${user.lastName}'s ${listing.name} booking `,
          description: `${user.firstName} ${user.lastName}'s ${listing.name} booking for ${bookingDetails.nights} nights`,
          images: [listing.coverImage],
        },
        unit_amount: Math.round(bookingDetails.totalPayable * 100),
      },
      quantity: 1,
    },
  ];

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    payment_intent_data: {
      application_fee_amount: Math.round(
        bookingDetails.totalPayable * 0.05 * 100
      ),
      transfer_data: {
        destination: sellerStripeConnectID?.owner.stripeId as string,
      },
    },
    invoice_creation: {
      enabled: true,
    },
    // line_items: [...roomCart, ...extrasCart],
    line_items: cart,
    expires_at: Math.floor(Date.now() / 1000) + 1800, // 30 minutes (stripe checkout minimum expiration time)
    success_url: `${process.env.NEXT_PUBLIC_ORIGIN as string}/stripe/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_ORIGIN as string}/stripe/cancel`,
    metadata: {
      userID: JSON.stringify(user.id),
      listingID: bookingDetails.listingID,
      bookingDate: new Date().toISOString(),
      checkIn: bookingDetails.checkIn.toISOString(),
      checkOut: bookingDetails.checkOut.toISOString(),
      guests: bookingDetails.guests.toString(),
      nights: bookingDetails.nights.toString(),
      rooms: JSON.stringify(bookingDetails.rooms),
      extras: JSON.stringify(bookingDetails.extras),
      taxes: JSON.stringify(bookingDetails.taxes),
      totalWithoutTaxes: bookingDetails.totalWithoutTaxes.toString(),
      tax: bookingDetails.tax.toString(),
      totalPayable: bookingDetails.totalPayable.toString(),
      isOfferApplied: (bookingDetails.isOfferApplied ?? false).toString(),
      offerId: bookingDetails.offerId,
    } as StripeCheckoutSessionMetaData,
  });
  return redirect(session.url as string);
}

/**
 * Generates a Stripe Connect account for the given email address.
 * @param email Email address associated with the Stripe Connect account.
 * @returns Stripe Connect account ID.
 */
export async function generateStripeId(email: string) {
  const account = await stripe.accounts.create({
    email,
    controller: {
      losses: {
        payments: "application",
      },
      fees: {
        payer: "application",
      },
      stripe_dashboard: {
        type: "express",
      },
    },
  });

  return account.id;
}

/**
 * Retrieves the Stripe customer ID for the authenticated user.
 *
 * @returns {Promise<string | null>} The Stripe customer ID if it exists, or null if it does not.
 *
 * @throws {Error} If the user is not authenticated.
 */
export async function getCustomerStripeID() {
  const { userId, sessionClaims } = await auth();

  if (!userId || !sessionClaims) {
    throw new Error("User not authenticated");
  }

  const userDbId = (sessionClaims.public_metadata as PublicMetadataType)
    .userDB_id;

  const user = await prisma.user.findUnique({
    where: { id: userDbId },
    select: { stripeId: true },
  });

  if (user && user.stripeId) {
    return user.stripeId;
  }

  return null;
}

/**
 * Redirects user to Stripe account onboarding.
 *
 * If the user doesn't have a Stripe account, creates one and redirects to the
 * onboarding page. If the user already has a Stripe account, redirects to the
 * dashboard.
 *
 * @returns A redirect to the Stripe onboarding page or dashboard
 * @throws {Error} If the user is not authenticated or authorized
 */
export async function createStripeAccountLink() {
  const stripeId = await getCustomerStripeID();

  const { sessionClaims } = await auth();
  const userDbId = (sessionClaims?.public_metadata as PublicMetadataType)
    .userDB_id;

  if (!stripeId || !userDbId) {
    return null;
  }

  const accountLink = await stripe.accountLinks.create({
    account: stripeId,
    refresh_url: `${
      process.env.NEXT_PUBLIC_ORIGIN as string
    }/users/${userDbId}/billing`,
    return_url: `${process.env.NEXT_PUBLIC_ORIGIN as string}/stripe/return`,
    type: "account_onboarding",
  });
  return redirect(accountLink.url as string);
}

/**
 * Checks if the user has a Stripe connected account.
 *
 * @param {object} - User ID
 * @returns {boolean} - true if the user has a Stripe connected account, false otherwise
 */
export async function isStripeConnectedAccount({ userId }: { userId: string }) {
  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
    select: {
      id: true,
      isStripeConnectedAccount: true,
      stripeId: true,
    },
  });
  console.log(user);
  if (!user) return false;
  return user.isStripeConnectedAccount;
}

/**
 * Retrieves a login link to the Stripe dashboard for the authenticated user's account.
 *
 * @returns {Promise<void | null>} - Redirects to the Stripe dashboard if the user has a Stripe account,
 *                                   otherwise returns null.
 *
 * @throws {Error} - If there is an issue creating the login link.
 */
export async function getStripeDashboardLink() {
  const stripeId = await getCustomerStripeID();
  if (!stripeId) return null;
  const dashboardLink = await stripe.accounts.createLoginLink(stripeId);
  redirect(dashboardLink.url as string);
}
