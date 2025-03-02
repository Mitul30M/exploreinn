"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../prisma-client";
import { offerScope } from "@prisma/client";

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
    return true;
  } catch (error) {
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
    return true;
  } catch (error) {
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
    ? { listingId, isActive: true, scope: "ListingWide" as offerScope }
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
 * Retrieves all active "AppWide" offers.
 * The function returns a promise that resolves to an array of active offers
 * with a scope of "AppWide", ordered by their creation date in descending order.
 *
 * @returns A promise that resolves to an array of active "AppWide" offers.
 */
export async function getExploreinnOffers(activeOnly?: boolean) {
  const whereClause = activeOnly
    ? { scope: "AppWide" as offerScope, isActive: true }
    : { scope: "AppWide" as offerScope };
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
    return true;
  } catch (error) {
    return false;
  }
}
