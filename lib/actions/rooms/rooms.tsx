"use server";

import { RoomType } from "@/app/listings/[listingId]/(dashboard)/rooms/new/page";
import prisma from "@/lib/prisma-client";
import { Room } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Retrieves all rooms for a given listing.
 * The function returns a promise that resolves to an array of room objects.
 * @param listingId - The id of the listing whose rooms are to be retrieved.
 * @returns A promise that resolves to an array of room objects.
 */
export async function getListingRooms(listingId: string) {
  const rooms = await prisma.room.findMany({
    where: {
      listingId,
    },
  });
  return rooms;
}

/**
 * Creates a new room for a given listing.
 * The function takes the listing ID and room data excluding the files as arguments.
 * It returns a promise that resolves to the newly created room object if successful.
 * If there is an error, it logs the error and returns null.
 * @param listingId - The id of the listing for which the room is to be created.
 * @param data - The room data without the files.
 * @returns A promise that resolves to the newly created room object if successful, otherwise null.
 */
export async function createListingRoom(
  listingId: string,
  data: Omit<RoomType, "files">
) {
  try {
    console.log(`Creating New ${data.name} for Listing with ID:`, listingId);
    const room = await prisma.room.create({
      data: {
        listingId,
        area: data.area,
        basePrice: data.basePrice,
        beds: data.beds,
        coverImage: data.images[0],
        currentlyAvailableRooms: data.totalRoomsAllocated,
        hasCityView: data.hasCityView,
        hasSeaView: data.hasSeaView,
        isAirConditioned: data.isAirConditioned,
        isWifiAvailable: data.isWifiAvailable,
        isAvailable: true,
        maxOccupancy: data.maxOccupancy,
        name: data.name,
        price: data.basePrice,
        tag: data.tag,
        totalRoomsAllocated: data.totalRoomsAllocated,
        images: data.images,
        perks: data.perks,
      },
    });
    console.log("Room Created Successfully", room);
    revalidatePath(`/listings/${listingId}/rooms`);
    revalidatePath(`/listings/${listingId}`);
    return room;
  } catch (error) {
    console.error("Error creating room:", error);
    return null;
  }
}

export async function getRoomById(roomId: string) {
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });
  return room;
}

/**
 * Adds new images to a room.
 * The function takes the room ID and an array of image URLs as arguments.
 * It returns a promise that resolves to the updated room object if successful.
 * If there is an error, it logs the error and returns null.
 * @param roomId - The id of the room to which the images are to be added.
 * @param images - The array of image URLs to be added to the room.
 * @returns A promise that resolves to the updated room object if successful, otherwise null.
 */
export async function addRoomImages(roomId: string, images: string[]) {
  const room = await prisma.room.update({
    where: {
      id: roomId,
    },
    data: {
      images: {
        push: images,
      },
    },
  });
  revalidatePath(`/listings/${room.listingId}/rooms`);
  revalidatePath(`/listings/${room.listingId}`);
  revalidatePath(`/listings/${room.listingId}/rooms/${roomId}`);
  return room;
}

/**
 * Deletes an image from a room.
 * The function takes the room ID and the image URL to be removed from the room's images.
 * It returns a promise that resolves to a boolean indicating whether the image was successfully deleted.
 * If there is an error, it logs the error and returns false.
 * @param roomId - The ID of the room from which the image is to be deleted.
 * @param imageUrl - The URL of the image to be deleted from the room.
 * @returns A promise that resolves to true if the image was successfully deleted, otherwise false.
 */

export async function deleteRoomImg(roomId: string, imageUrl: string) {
  const room = await prisma.room.update({
    where: {
      id: roomId,
    },
    data: {
      images: {
        set: (await getRoomById(roomId))?.images.filter(
          (img) => img !== imageUrl
        ),
      },
    },
  });
  revalidatePath(`/listings/${room.listingId}/rooms`);
  revalidatePath(`/listings/${room.listingId}`);
  revalidatePath(`/listings/${room.listingId}/rooms/${roomId}`);
  return !!room;
}

/**
 * Updates the cover image of a room.
 * The function takes the room ID and a new cover image URL and updates the room's
 * cover image in the database. It returns a promise that resolves to a boolean
 * indicating whether the cover image was successfully updated.
 * After updating, it revalidates the paths to ensure the changes are reflected.
 * If the update is successful, the function returns true, otherwise false.
 *
 * @param roomId - The ID of the room whose cover image is to be updated.
 * @param coverImage - The new URL for the cover image of the room.
 * @returns A promise that resolves to true if the cover image was successfully updated, otherwise false.
 */

/**
 * Updates the cover image of a room.
 * The function takes the room ID and a new cover image URL and updates the room's
 * cover image in the database. It returns a promise that resolves to a boolean
 * indicating whether the cover image was successfully updated.
 * After updating, it revalidates the paths to ensure the changes are reflected.
 * If the update is successful, the function returns true, otherwise false.
 *
 * @param roomId - The ID of the room whose cover image is to be updated.
 * @param coverImage - The new URL for the cover image of the room.
 * @returns A promise that resolves to true if the cover image was successfully updated, otherwise false.
 */
export async function updateRoomCoverImage(
  roomId: string,
  coverImage: string
): Promise<boolean> {
  const room = await prisma.room.update({
    where: {
      id: roomId,
    },
    data: {
      coverImage,
    },
  });
  revalidatePath(`/listings/${room.listingId}/rooms`);
  revalidatePath(`/listings/${room.listingId}`);
  revalidatePath(`/listings/${room.listingId}/rooms/${roomId}`);
  return !!room;
}

export async function updateIsAcceptingBooking(
  roomId: string,
  isAcceptingBookings: boolean
) {
  const room = await prisma.room.update({
    where: {
      id: roomId,
    },
    data: {
      isAvailable: isAcceptingBookings,
    },
  });
  revalidatePath(`/listings/${room.listingId}/rooms`);
  revalidatePath(`/listings/${room.listingId}`);
  revalidatePath(`/listings/${room.listingId}/rooms/${roomId}`);
  return !!room;
}

export async function updateIsDynamicallyPriced(
  roomId: string,
  isDynamicallyPriced: boolean
) {
  const room = await prisma.room.update({
    where: {
      id: roomId,
    },
    data: {
      isDynamicallyPriced,
    },
  });
  revalidatePath(`/listings/${room.listingId}/rooms`);
  revalidatePath(`/listings/${room.listingId}`);
  revalidatePath(`/listings/${room.listingId}/rooms/${roomId}`);
  return !!room;
}
