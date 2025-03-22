"use server";

import prisma from "@/lib/prisma-client";
import { RegisterListing } from "@/lib/redux-store/slices/register-listing-slice";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Booking, Transaction } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { dynamicallySetRoomPrice } from "../rooms/rooms";
import { redirect } from "next/navigation";

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
export async function enlistListing(data: RegisterListing) {
  console.log(data);
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
    console.log(error);
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
    where: {
      isDeleted: false,
    },
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

export async function getWishListedListings(userId: string) {
  const userWishlistedListings = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      wishlistIds: true,
    },
  });
  if (!userWishlistedListings) {
    return [];
  }
  const listings = await prisma.listing.findMany({
    where: {
      isDeleted: false,
      id: {
        in: userWishlistedListings.wishlistIds,
      },
    },
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
export async function getListingById(
  listingId: string,
  reviewSort: EReviewSort = "recent" // forGuestBooking = false
) {
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
        orderBy: {
          ...(reviewSort === "recent" && { createdAt: "desc" }),
          ...(reviewSort === "top" && { stars: "desc" }),
          ...(reviewSort === "low" && { stars: "asc" }),
        },
        take: 20,
      },
      offers: {
        where: {
          AND: [
            {
              startDate: {
                lte: new Date(),
              },
            },
            {
              endDate: {
                gte: new Date(),
              },
            },
            {
              isActive: true,
            },
          ],
        },
      },
    },
  });
  if (!listing || listing.isDeleted) return null;
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
    where: {
      AND: [{ ownerId: userDbId }, { isDeleted: false }],
    },
  });

  return listings as TOwnedListing[];
}

/**
 * Retrieves all listings that the currently authenticated user is a manager of.
 * @returns A promise that resolves to an array of listings with their respective details.
 * @throws {Error} If the user is not authenticated.
 */
export async function getManagedListings(): Promise<TOwnedListing[]> {
  const { userId, sessionClaims } = await auth();
  const userDbId = (sessionClaims?.public_metadata as PublicMetadataType)
    .userDB_id;
  if (!userId || !userDbId) {
    throw new Error("User not authenticated");
  }

  const userManagedListings = await prisma.listing.findMany({
    where: {
      managerIds: {
        has: userDbId,
      },
    },
    select: {
      id: true,
    },
  });

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
    where: {
      id: { in: userManagedListings.map((l) => l.id) },
      isDeleted: false,
    },
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

/**
 * Retrieves all managers of a given listing.
 * @param listingId - The id of the listing whose managers are to be retrieved.
 * @returns A promise that resolves to an array of manager objects with their respective details.
 * If the listing does not exist, the function returns an empty array.
 */
export async function getListingManagers(listingId: string) {
  const listing = await prisma.listing.findFirst({
    where: {
      id: listingId,
    },
    select: {
      managerIds: true,
    },
  });
  if (!listing) return [];
  const managerIds = listing.managerIds;
  const managers = await prisma.user.findMany({
    where: {
      id: {
        in: managerIds,
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNo: true,
      profileImg: true,
      dob: true,
      address: true,
      gender: true,
    },
  });
  return managers;
}

/**
 * Adds a manager to a given listing.
 * The function checks if the currently authenticated user is the owner of the given listing.
 * If the user is not authenticated or is not the owner of the listing, the function returns an error.
 * If the managerEmail is invalid, the function returns an error.
 * If the function is successful, it returns a success message.
 * @param listingId - The id of the listing to which the manager is to be added.
 * @param managerEmail - The email of the manager to be added.
 * @returns A promise that resolves to an object with a type and a message.
 * The type can be either "success" or "error" and the message is a string that describes the result of the operation.
 */
export async function addManagerToListing(
  listingId: string,
  managerEmail: string
) {
  // check if current user is owner of listing
  const user = await currentUser();
  if (!user)
    return {
      type: "error",
      message: "You are not Authenticated.",
    };
  const ownerID = (user?.publicMetadata as PublicMetadataType).userDB_id;

  const userID = await prisma.user.findUnique({
    where: {
      email: managerEmail,
    },
    select: {
      id: true,
    },
  });
  if (!userID) {
    return {
      type: "error",
      message: "No user found with this email. Ensure the email is correct.",
    };
  }
  // add manager
  try {
    await prisma.$transaction([
      prisma.listing.update({
        where: {
          id: listingId,
          ownerId: ownerID,
        },
        data: {
          managerIds: {
            push: userID.id,
          },
        },
      }),
      prisma.user.update({
        where: {
          id: userID.id,
        },
        data: { managedListingIds: { push: listingId } },
      }),
    ]);
  } catch (error) {
    console.log(error);
    return {
      type: "error",
      message: "Failed to add manager to listing. Please try again.",
    };
  }
  revalidatePath(`/listings/${listingId}/managers`);
  return {
    type: "success",
    message: "New Manager added successfully.",
  };
}

/**
 * Removes a manager from a given listing.
 * The function checks if the currently authenticated user is the owner of the given listing.
 * If the user is not authenticated or is not the owner of the listing, the function returns an error.
 * If the managerId is invalid, the function returns an error.
 * If the function is successful, it returns a success message.
 * @param listingId - The id of the listing from which the manager is to be removed.
 * @param managerId - The id of the manager to be removed.
 * @returns A promise that resolves to an object with a type and a message.
 * The type can be either "success" or "error" and the message is a string that describes the result of the operation.
 */
export async function removeManagerFromListing(
  listingId: string,
  managerId: string
) {
  // check if current user is owner of listing
  const user = await currentUser();
  if (!user)
    return {
      type: "error",
      message: "You are not Authenticated.",
    };
  const ownerID = (user?.publicMetadata as PublicMetadataType).userDB_id;

  const userID = await prisma.user.findUnique({
    where: {
      id: managerId,
    },
    select: {
      id: true,
    },
  });
  if (!userID) {
    return {
      type: "error",
      message: "No user found with this userID. Ensure the userID is correct.",
    };
  }
  // remove manager
  try {
    const listingManagers = await prisma.listing.findUnique({
      where: {
        id: listingId,
        ownerId: ownerID,
      },
      select: {
        managerIds: true,
      },
    });

    const managerIds = listingManagers?.managerIds;
    const updatedManagerIds = managerIds?.filter((id) => id !== managerId);
    await prisma.listing.update({
      where: {
        id: listingId,
        ownerId: ownerID,
      },
      data: {
        managerIds: updatedManagerIds,
      },
    });

    // remove listingID from removed manager's managedListings's array
    const manager = await prisma.user.findUnique({
      where: {
        id: managerId,
      },
      select: {
        id: true,
        managedListingIds: true,
      },
    });
    const updatedManagedListings = manager?.managedListingIds.filter(
      (id) => id !== listingId
    );
    await prisma.user.update({
      where: {
        id: managerId,
      },
      data: {
        managedListingIds: updatedManagedListings,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      type: "error",
      message: "Failed to remove manager from listing. Please try again.",
    };
  }
  revalidatePath(`/listings/${listingId}/managers`);
  return {
    type: "success",
    message: "Manager removed successfully.",
  };
}

export async function deleteListing(listingId: string) {
  // check if current user is owner of listing
  const user = await currentUser();
  if (!user)
    return {
      type: "error",
      message: "You are not Authenticated.",
    };
  const ownerID = (user.publicMetadata as PublicMetadataType).userDB_id;
  if (!ownerID) {
    return {
      type: "error",
      message: "You are not Authenticated.",
    };
  }
  if (!(await isListingOwner(ownerID, listingId))) {
    return {
      type: "error",
      message: "Unauthorized. Only the owner can delete this listing.",
    };
  }
  try {
    await prisma.listing.update({
      where: {
        id: listingId,
        ownerId: ownerID,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  } catch (error) {
    console.log(error);
    return {
      type: "error",
      message: "Failed to delete listing. Please try again.",
    };
  }
  redirect(`/users/${ownerID}`);
  return {
    type: "success",
    message: "Listing deleted successfully.",
  };
}
