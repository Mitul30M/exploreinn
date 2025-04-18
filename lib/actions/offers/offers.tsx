"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../prisma-client";
import { Offer, offerScope } from "@prisma/client";
import { isAdmin } from "../user/admin/admin";

/**
 * Creates a new offer for a listing with the given details.
 *
 * @param {object} data - The offer details.
 * @param {string} data.listingID - The id of the listing for which the offer is to be created.
 * @param {string} data.name - The name of the offer.
 * @param {string} data.description - The description of the offer.
 * @param {"Percentage_Discount" | "Flat_Discount" | "Extra_Perks"} data.type - The type of the offer.
 * @param {string} data.couponCode - The coupon code for the offer.
 * @param {number} data.flatDiscount - The flat discount amount.
 * @param {number} data.percentageDiscount - The percentage discount amount.
 * @param {number} data.minimumBookingAmount - The minimum booking amount.
 * @param {number} data.maxDiscountAmount - The maximum discount amount.
 * @param {Date} data.startDate - The start date of the offer.
 * @param {Date} data.endDate - The end date of the offer.
 *
 * @returns {Promise<boolean>} A promise that resolves to true if the offer is created successfully, otherwise false.
 */
export async function createListingSpecificOffer(data: {
  listingID: string;
  name: string;
  description: string;
  type: "Percentage_Discount" | "Flat_Discount" | "Extra_Perks";
  couponCode: string;
  flatDiscount: number;
  percentageDiscount: number;
  minimumBookingAmount: number;
  maxDiscountAmount: number;
  startDate: Date;
  endDate: Date;
}) {
  try {
    console.log("Creating an Offer for listing:", data.listingID, data);
    const newListingOffer = await prisma.offer.create({
      data: {
        scope: "ListingWide",
        type: data.type,
        listingId: data.listingID,
        name: data.name,
        description: data.description,
        couponCode: data.couponCode.toUpperCase(),
        flatDiscount: data.flatDiscount,
        percentageDiscount: data.percentageDiscount,
        minimumBookingAmount: data.minimumBookingAmount,
        maxDiscountAmount: data.maxDiscountAmount,
        startDate: new Date(data.startDate.setHours(0, 0, 0, 0)),
        endDate: new Date(data.endDate.setHours(23, 59, 59, 999)),
      },
    });
    console.log("New Offer created:", newListingOffer);
    revalidatePath(`/listing/${data.listingID}`);
    revalidatePath(`/listing/${data.listingID}/offers`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * Creates a new AppWide offer in the database.
 *
 * @param data - The details of the offer to be created.
 *
 * @returns A promise that resolves to a boolean indicating whether the offer was created successfully.
 * If the offer is created successfully, it revalidates the /listings page.
 * If there is an error, it returns false.
 */
export async function createAppWideOffer(data: {
  name: string;
  description: string;
  type: "Percentage_Discount" | "Flat_Discount" | "Extra_Perks";
  couponCode: string;
  flatDiscount: number;
  percentageDiscount: number;
  minimumBookingAmount: number;
  maxDiscountAmount: number;
  redeemForPoints: number;
  startDate: Date;
  endDate: Date;
}) {
  try {
    const isAuthorized = await isAdmin();
    if (!isAuthorized) {
      throw new Error("Unauthorized");
    }

    console.log("Creating an AppWide Offer:", data);
    const newAppWideOffer = await prisma.offer.create({
      data: {
        scope: "AppWide",
        type: data.type,
        name: data.name,
        description: data.description,
        couponCode: data.couponCode.toUpperCase(),
        flatDiscount: data.flatDiscount,
        percentageDiscount: data.percentageDiscount,
        minimumBookingAmount: data.minimumBookingAmount,
        maxDiscountAmount: data.maxDiscountAmount,
        redeemForPoints: data.redeemForPoints,
        startDate: new Date(data.startDate.setHours(0, 0, 0, 0)),
        endDate: new Date(data.endDate.setHours(23, 59, 59, 999)),
      },
    });
    console.log("New AppWide Offer created:", newAppWideOffer);
    revalidatePath(`/listings`);
    revalidatePath(`/admin/offers`);
    return true;
  } catch (error) {
    console.error("Error creating AppWide Offer:", error);
    return false;
  }
}

/**
 * Toggles the isActive status of an offer.
 * @param offerId - The id of the offer.
 * @param isActive - The new status of the offer.
 * @returns A promise that resolves to true if the offer's isActive status was updated, false otherwise.
 */
export async function toggleIsActive(offerId: string, isActive: boolean) {
  try {
    console.log("Toggling isActive for offer: ", offerId, isActive);
    const updatedOffer = await prisma.offer.update({
      where: { id: offerId },
      data: { isActive: isActive },
    });
    console.log(
      "Offer updated:",
      updatedOffer.id,
      " ; isActive:",
      updatedOffer.isActive
    );
    revalidatePath(`/listing/${updatedOffer.listingId}`);
    revalidatePath(`/listing/${updatedOffer.listingId}/offers`);
    if (updatedOffer.scope === "AppWide") {
      revalidatePath(`/discover`);
      revalidatePath(`/admin/offers`);
    }
    return true;
  } catch (error) {
    console.error("Error toggling isActive:", error);
    return false;
  }
}

/**
 * Retrieves all offers for a given listing.
 * @param listingId - The id of the listing whose offers are to be retrieved.
 * @param activeOnly - If true, only active offers are retrieved. Defaults to false.
 * @returns A promise that resolves to an array of offer objects in descending order of creation date.
 */
export async function getListingOffers(
  listingId: string,
  activeOnly?: boolean
) {
  const whereClause = activeOnly
    ? {
        listingId,
        isActive: true,
        scope: "ListingWide" as offerScope,
        startDate: {
          lte: new Date(),
        },
        endDate: {
          gte: new Date(),
        },
      }
    : { listingId, scope: "ListingWide" as offerScope };
  const offers = await prisma.offer.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
  });
  return offers;
}

/**
 * Retrieves all Exploreinn offers with optional filters.
 *
 * This function fetches offers that are available on the Exploreinn platform,
 * with options to filter by active status and whether they are free to redeem.
 *
 * @param activeOnly - If true, only retrieves offers that are currently active.
 * @param freeOnly - If true, only retrieves offers that can be redeemed for free.
 * @returns A promise that resolves to an array of offer objects sorted by
 *          creation date in descending order.
 */

export async function getExploreinnOffers(
  activeOnly?: boolean,
  freeOnly?: boolean
) {
  const whereClause = {
    scope: "AppWide" as offerScope,
    ...(activeOnly && {
      isActive: true,
      startDate: {
        lte: new Date(),
      },
      endDate: {
        gte: new Date(),
      },
    }),
    ...(freeOnly && {
      redeemForPoints: 0,
    }),
  };

  const offers = await prisma.offer.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
  });
  return offers;
}

/**
 * Deletes an offer by its id.
 *
 * @param offerId - The id of the offer to be deleted.
 *
 * @returns A promise that resolves to true if the offer was deleted successfully, false otherwise.
 * If the offer is deleted successfully, it revalidates the /listings and /listings/:listingId/offers pages.
 * If there is an error, it returns false.
 */
export async function deleteOffer(offerId: string) {
  try {
    console.log("Deleting offer: ", offerId);
    const deletedOffer = await prisma.offer.delete({
      where: { id: offerId },
    });
    console.log("Offer deleted:", deletedOffer);
    revalidatePath(`/listing/${deletedOffer.listingId}`);
    revalidatePath(`/listing/${deletedOffer.listingId}/offers`);
    if (deletedOffer.scope === "AppWide") {
      revalidatePath("/admin/offers");
    }
    return true;
  } catch (error) {
    console.error("Error deleting offer:", error);
    return false;
  }
}

/**
 * Redeems an offer for a user based on the given offerId and userId.
 *
 * This function checks the validity of the offer and the user's eligibility to redeem it.
 *
 * @param offerId - The ID of the offer to be redeemed.
 * @param userId - The ID of the user attempting to redeem the offer.
 *
 * @returns A promise that resolves to an object containing a status type ("success" or "error") and a message.
 *          On success, the message indicates successful redemption of the offer.
 *          On error, the message provides the reason for failure, such as insufficient reward points, unauthorized access,
 *          offer not found, or an existing active offer.
 *
 * The function updates the user's reward points and redeemed offer IDs if the offer is redeemed successfully.
 * It also logs relevant information and errors during the process.
 */

export async function redeemOffer(offerId: string, userId: string) {
  try {
    console.log("Redeeming offer: ", offerId, " for user: ", userId);
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
    });
    if (!offer) {
      return {
        type: "error",
        message: "Offer not found",
      };
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        rewardPoints: true,
        id: true,
        redeemedOfferIds: true,
        Booking: true,
      },
    });
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized.",
      };
    }

    if (typeof offer.redeemForPoints === "number") {
      if (offer.redeemForPoints > user.rewardPoints) {
        return {
          type: "error",
          message: "Insufficient reward points to redeem this offer.",
        };
      }

      const userBookingsWithOffers = await prisma.booking.findMany({
        where: {
          guestId: user.id,
          offerId: { in: user.redeemedOfferIds || [] },
        },
        include: {
          offer: true,
        },
      });

      const existingUnusedOffer = userBookingsWithOffers.filter(
        (booking) =>
          booking.offerId === offerId &&
          booking.offer!.isActive &&
          booking.offer!.startDate <= new Date() &&
          booking.offer!.endDate >= new Date()
      ).length;

      const timesOfferRedeemed = user.redeemedOfferIds.filter(
        (id) => id === offerId
      ).length;

      if (existingUnusedOffer < timesOfferRedeemed) {
        return {
          type: "error",
          message:
            "You already have an active offer. You cannot redeem this offer until your current offer expires or you use it up. ",
        };
      }

      const [updatedUser] = await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: {
            rewardPoints: { decrement: offer.redeemForPoints },
            redeemedOfferIds: { push: offerId },
          },
          select: { rewardPoints: true, id: true },
        }),
        prisma.offer.update({
          where: { id: offerId },
          data: { redeemerIds: { push: userId } },
          select: { redeemerIds: true },
        }),
      ]);
      console.log(
        "User updated:",
        updatedUser,
        " with reward points balance: ",
        updatedUser.rewardPoints
      );
      revalidatePath(`/users/${userId}`);
      return {
        type: "success",
        message: "Offer redeemed successfully.",
      };
    }
    return {
      type: "error",
      message: "This offer cannot be redeemed for points.",
    };
  } catch (error) {
    console.error("Error redeeming offer:", error);
    return {
      type: "error",
      message: "An error occurred while redeeming the offer. Please try again.",
    };
  }
}

type OfferWithExtras = Offer & {
  redeemedAt?: Date;
  bookingId?: string;
};

export async function getUserRedeemedOffers(
  userId: string,
  activeOnly?: boolean
): Promise<OfferWithExtras[]> {
  const userRedeemedOffers = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      redeemedOffers: {
        where: activeOnly
          ? {
              isActive: true,
              scope: "AppWide",
              startDate: { lte: new Date() },
              endDate: { gte: new Date() },
            }
          : { scope: "AppWide" },
      },
    },
  });

  const userBookingsWithOffers = await prisma.booking.findMany({
    where: {
      guestId: userId,
      offerId: {
        in: userRedeemedOffers?.redeemedOffers.map((offer) => offer.id) ?? [],
      },
    },
    select: {
      offerId: true,
      id: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  let userBookings = [...userBookingsWithOffers];
  let userOffers = [...(userRedeemedOffers?.redeemedOffers ?? [])];
  const enrichedUserRedeemedOffers: OfferWithExtras[] = [];

  for (const booking of userBookings) {
    const offerIndex = userOffers.findIndex(
      (offer) => offer.id === booking.offerId
    );
    if (offerIndex !== -1) {
      const offer = userOffers[offerIndex];
      enrichedUserRedeemedOffers.push({
        ...offer,
        bookingId: booking.id,
        redeemedAt: booking.createdAt,
      });
      userOffers.splice(offerIndex, 1); // remove matched offer
    }
  }

  // Append unmatched offers (not associated with bookings)
  enrichedUserRedeemedOffers.push(...userOffers);

  return enrichedUserRedeemedOffers;
}
