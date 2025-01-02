"use server";

import prisma from "@/lib/prisma-client";
import {
  RegisterListing,
  RegisterListingSchema,
} from "@/lib/redux-store/slices/register-listing-slice";
import { FormState } from "@/lib/types/forms/form-state";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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
    revalidatePath("/");
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
