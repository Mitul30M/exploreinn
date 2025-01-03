"use server";

import prisma from "@/lib/prisma-client";
import {
  RegisterListing,
  RegisterListingSchema,
} from "@/lib/redux-store/slices/register-listing-slice";
import { FormState } from "@/lib/types/forms/form-state";
import { auth } from "@clerk/nextjs/server";
import { Listing } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Creates a new listing and a room in the database.
 * The function takes a prevState object which is a form state
 * and a data object which is a RegisterListing object.
 * It returns a form state object with a message and a type.
 * The function first checks if the user is authenticated and has a userDbId.
 * If not, it returns an error message.
 * Then it creates a listing and a room in the database.
 * If the creation is successful, it logs a success message and returns a success message.
 * If there is an error, it logs an error message and returns an error message.
 * @param prevState - a form state
 * @param data - a RegisterListing object
 * @returns a form state object with a message and a type
 */
export async function enlistListing(
  prevState: FormState,
  data: RegisterListing
): Promise<FormState> {
  // console.log(data);
  const { userId, sessionClaims } = await auth();
  const userDbId = (sessionClaims?.public_metadata as PublicMetadataType)
    .userDB_id;
  if (!userId || !userDbId) {
    return {
      message: "Unauthorized",
      type: "error",
    };
  }

  try {
    // create a listing and a room
    const listing = await prisma.listing.create({
      data: {
        ownerId: userDbId,
        name: data.listingName,
        type: data.listingType,
        email: data.email,
        phoneNo: data.phone,
        description: data.description,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        geometry: data.geometry!,
        address: data.address,
        distanceFrom: data.distanceFrom,
        images: data.images,
        legalDocs: data.legalDocs,
        coverImage: data.coverImage,
        amenities: data.amenities,
        taxIN: data.taxIN,
        taxRates: data.taxRates,
        isBookNowPayLaterAllowed: data.isBookNowPayLaterAllowed,
        checkInRulesAndRestrictions: data.checkInRulesAndRestrictions,
        groundRulesAndRestrictions: data.groundRulesAndRestrictions,
        cancellationPolicy: data.cancellationPolicy,
        starRating: 3.5,
        socialMediaLinks: data.socialMediaLinks,
        tags: data.tags,
        rooms: {
          create: {
            name: data.room.name,
            tag: data.room.tag,
            isAvailable: true,
            price: data.room.basePrice,
            basePrice: data.room.basePrice,
            maxOccupancy: data.room.maxOccupancy,
            totalRoomsAllocated: data.room.totalRoomsAllocated,
            currentlyAvailableRooms: data.room.totalRoomsAllocated,
            beds: data.room.beds,
            coverImage: data.room.coverImage,
            images: data.room.images,
            area: data.room.area,
            perks: data.room.perks,
            extras: data.room.extras,
            isWifiAvailable: data.room.isWifiAvailable,
            isAirConditioned: data.room.isAirConditioned,
            hasCityView: data.room.hasCityView,
            hasSeaView: data.room.hasSeaView,
          },
        },
      },
    });
    console.log(
      `New Listing Created Successfully: ${listing.name} [${listing.id}]`
    );
    const newListing = await prisma.listing.findFirst({
      where: {
        id: listing.id,
      },
      include: {
        rooms: true,
        owner: true,
        managers: true,
      },
    });

    console.log(newListing); // return success
    revalidatePath("/discover");
    return {
      message: "New listing created successfully",
      type: "success",
    };
  } catch (error) {
    return {
      type: "error",
      message: "Internal server error",
    };
  }
}

/**
 * Fetches a list of listing previews from the database.
 * The function retrieves various details about each listing,
 * including its id, name, address, cover image, star rating,
 * overall rating, exploreinn grade, amenities, reviews, and room pricing.
 *
 * @param isCard - A boolean indicating if the listings are to be displayed as cards. Defaults to false.
 * @returns A promise that resolves to an array of listing previews with selected fields.
 */

export type TListingCard = {
  id: string;
  name: string;
  address: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    fullAddress: string;
    landmark: string | null;
  };
  coverImage: string;
  starRating: number;
  overallRating: number;
  exploreinnGrade: "Excellent" | "VeryGood" | "Good" | "Fair" | "Poor";
  amenities: string[];
  reviews: {
    id: string;
    content: string;
    stars: number;
    cleanliness: number;
    comfort: number;
    communication: number;
    checkIn: number;
    valueForMoney: number;
    location: number;
    overallRating: number;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    listingId: string;
  }[];
  rooms: {
    basePrice: number;
  }[];
};

export async function getListingsPreview(): Promise<TListingCard[]> {
  const listings = await prisma.listing.findMany({
    select: {
      id: true,
      name: true,
      address: true,
      coverImage: true,
      starRating: true,
      overallRating: true,
      exploreinnGrade: true,
      amenities: true,
      reviews: true,
      rooms: {
        select: {
          basePrice: true,
        },
      },
    },
  });

  return listings as TListingCard[];
}

export type TOwnedListing = {
  id: string;
  name: string;
  address: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    fullAddress: string;
    landmark?: string;
  };
  coverImage: string;
  starRating: number;
  overallRating: number;
  exploreinnGrade: "Excellent" | "VeryGood" | "Good" | "Fair" | "Poor";
  rooms: {
    totalRoomsAllocated: number;
    currentlyAvailableRooms: number;
  }[];
};

export async function getOwnedListings(): Promise<TOwnedListing[]> {
  const { userId, sessionClaims } = await auth();
  const userDbId = (sessionClaims?.public_metadata as PublicMetadataType)
    .userDB_id;
  if (!userId || !userDbId) {
    throw new Error("User not authenticated");
  }

  const listings = await prisma.listing.findMany({
    select: {
      id: true,
      name: true,
      address: true,
      coverImage: true,
      starRating: true,
      overallRating: true,
      exploreinnGrade: true,
      rooms: {
        select: {
          totalRoomsAllocated: true,
          currentlyAvailableRooms: true,
        },
      },
      // also select ongoing bookings, upcoming bookings, revenue today,  overall revenue
    },
    where: { ownerId: userDbId },
  });

  return listings as TOwnedListing[];
}
