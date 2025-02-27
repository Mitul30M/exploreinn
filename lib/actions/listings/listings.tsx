"use server";

import prisma from "@/lib/prisma-client";
import { RegisterListing } from "@/lib/redux-store/slices/register-listing-slice";
import { FormState } from "@/lib/types/forms/form-state";
import { auth } from "@clerk/nextjs/server";
import { Booking, Transaction } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { dynamicallySetRoomPrice } from "../rooms/rooms";

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
    price: number;
  }[];
};
export async function getListingsPreview(
  query: string
): Promise<TListingCard[]> {
  console.log("\nsearching for: ", query);
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
          price: true,
        },
      },
    },
  });

  return listings as TListingCard[];
}

/**
 * Retrieves a listing by its id.
 * The function returns the listing with all of its rooms and reviews.
 * If the listing does not exist, the function returns null.
 * @param listingId - The id of the listing to be retrieved.
 * @returns A promise that resolves to the listing with all of its rooms and reviews if it exists, otherwise null.
 */
export async function getListingById(listingId: string) {
  console.log("\nsearching for: ", listingId);
  const closedBookingRooms = await prisma.roomEvent.findFirst({
    where: {
      type: "BookingClosed",
      listingId: listingId,
      startDate: {
        lte: new Date(),
      },
      endDate: {
        gte: new Date(),
      },
    },
    select: {
      roomIds: true,
    },
  });

  const closedBookingRoomsIds = closedBookingRooms?.roomIds || [];

  const roomIds = await prisma.room.findMany({
    where: {
      listingId: listingId,
    },
    select: {
      id: true,
    },
  });
  await prisma.room.updateMany({
    where: {
      id: {
        in: closedBookingRoomsIds,
      },
    },
    data: {
      isAvailable: false,
    },
  });
  roomIds.forEach(async (room) => {
    await dynamicallySetRoomPrice(room.id);
  });

  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
    include: {
      rooms: {
        where: {
          id: {
            notIn: closedBookingRoomsIds,
          },
        },
        select: {
          area: true,
          basePrice: true,
          beds: true,
          coverImage: true,
          extras: true,
          hasCityView: true,
          hasSeaView: true,
          isAirConditioned: true,
          isWifiAvailable: true,
          name: true,
          perks: true,
          totalRoomsAllocated: true,
          isDynamicallyPriced: true,
          maxOccupancy: true,
          currentlyAvailableRooms: true,
          id: true,
          images: true,
          isAvailable: true,
          price: true,
          tag: true,
        },
      },
      reviews: {
        select: {
          author: {
            select: {
              firstName: true,
              lastName: true,
              profileImg: true,
            },
          },
          stars: true,
          cleanliness: true,
          comfort: true,
          communication: true,
          checkIn: true,
          valueForMoney: true,
          location: true,
          overallRating: true,
          createdAt: true,
          updatedAt: true,
          id: true,
          content: true,
          authorId: true,
        },
      },
    },
  });
  if (!listing) return null;
  return listing;
}

/**
 * Retrieves all listings owned by the currently authenticated user.
 * @returns A promise that resolves to an array of listings with their respective details.
 * @throws {Error} If the user is not authenticated.
 */
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
  Booking: Booking[];
  Transaction: Transaction[];
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
      Booking: true,
      Transaction: true,
    },
    where: { ownerId: userDbId },
  });

  return listings as TOwnedListing[];
}

/**
 * Checks if a given user is the owner of a given listing.
 * @param userID - The id of the user to be checked.
 * @param listingId - The id of the listing to be checked.
 * @returns A promise that resolves to a boolean indicating if the given user is the owner of the given listing.
 * If the listing does not exist, the function returns false.
 */
export async function isListingOwner(userID: string, listingId: string) {
  const listing = await prisma.listing.findFirst({
    where: {
      id: listingId,
    },
  });
  if (!listing) return false;
  return listing.ownerId === userID;
}

/**
 * Checks if a given user is a manager of a given listing.
 * @param userID - The id of the user to be checked.
 * @param listingId - The id of the listing to be checked.
 * @returns A promise that resolves to a boolean indicating if the given user is a manager of the given listing.
 * If the listing does not exist, the function returns false.
 */
export async function isListingManager(userID: string, listingId: string) {
  const listing = await prisma.listing.findFirst({
    where: {
      id: listingId,
    },
  });
  if (!listing) return false;
  return listing.managerIds.includes(userID);
}
