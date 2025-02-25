"use server";

import { RoomType } from "@/app/listings/[listingId]/(dashboard)/rooms/new/page";
import prisma from "@/lib/prisma-client";
import { revalidatePath } from "next/cache";

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
        extras: data.extras,
        dynamicPrice: [
          {
            date: new Date(),
            price: data.basePrice,
          },
        ],
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

/**
 * Dynamically set the price of a room based on occupancy rate, season, day of the week,
 * and events like price changes and high demand. If the room is dynamically priced,
 * the price will be updated based on the current date and time. If the room is not
 * dynamically priced, the price will not be changed.
 * @param {string} roomId The ID of the room to update.
 * @returns {Promise<boolean>} True if the room is dynamically priced and the price was updated,
 * false otherwise.
 */
export async function dynamicallySetRoomPrice(roomId: string) {
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });
  if (!room) {
    console.error("Room not found");
    return !!room;
  }

  let finalPrice: number = room.basePrice;
  const totalRooms = room.totalRoomsAllocated;
  const bookedRooms = room.totalRoomsAllocated - room.currentlyAvailableRooms;
  const occupancyRate = (bookedRooms / totalRooms) * 100;

  const priceChangeEvent = await prisma.roomEvent.findFirst({
    where: {
      type: "PriceChange",
      roomIds: {
        hasSome: [roomId],
      },
      AND: {
        startDate: {
          lte: new Date(),
        },
        endDate: {
          gte: new Date(),
        },
      },
    },
  });

  const highDemandEvent = await prisma.roomEvent.findFirst({
    where: {
      type: "HighDemand",
      roomIds: {
        hasSome: [roomId],
      },
      AND: {
        startDate: {
          lte: new Date(),
        },
        endDate: {
          gte: new Date(),
        },
      },
    },
  });

  const roomPriceChangeEvent =
    priceChangeEvent?.priceChange?.find((change) => change.roomId === roomId) ??
    undefined;

  const roomHighDemandEvent =
    highDemandEvent?.highDemand?.find((change) => change.roomId === roomId) ??
    undefined;

  // set base price to the new price in the price change event
  finalPrice = roomPriceChangeEvent
    ? roomPriceChangeEvent.newPrice
    : finalPrice;

  // add the percentage increase to the new price in the high demand event
  finalPrice = roomHighDemandEvent
    ? finalPrice * (1 + roomHighDemandEvent.priceIncrementPercentage)
    : finalPrice;

  if (room.isDynamicallyPriced) {
    // Adjust price based on occupancy rate
    if (occupancyRate > 80) {
      finalPrice += finalPrice * 0.2; // Increase by 20% if occupancy > 80%
    } else if (occupancyRate > 50) {
      finalPrice += finalPrice * 0.1; // Increase by 10% if occupancy > 50%
    }

    // Adjust price based on season (according to the summer in US)
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 6 && currentMonth <= 8) {
      finalPrice += finalPrice * 0.1; // Increase by 10% during summer months
    }

    // Adjust price based on day of the week
    const currentDay = new Date().getDay();
    if (currentDay === 5 || currentDay === 6 || currentDay === 0) {
      finalPrice += finalPrice * 0.05; // Increase by 5% on Fri, Sat, Sun
    } else if (currentDay === 1 || currentDay === 2 || currentDay === 3) {
      finalPrice -= finalPrice * 0.05; // Decrease by 5% on Mon, Tue, Wed
    }

    // now set the finalPrice
    const updatedPriceRoom = await prisma.$transaction(async (tx) => {
      const updatedRoom = await tx.room.update({
        where: {
          id: roomId,
        },
        data: {
          price: finalPrice,
        },
      });

      // Get today's date without time
      const today = new Date();

      // Check if dynamicPrice array exists and has elements
      if (updatedRoom.dynamicPrice.length > 0) {
        return await tx.room.update({
          where: {
            id: roomId,
          },
          data: {
            dynamicPrice: {
              set: [
                { date: today, price: finalPrice },
                ...updatedRoom.dynamicPrice,
              ],
            },
            price: finalPrice,
          },
        });
      } else {
        return await tx.room.update({
          where: {
            id: roomId,
          },
          data: {
            dynamicPrice: {
              set: [{ date: today, price: finalPrice }],
            },
            price: finalPrice,
          },
        });
      }

      return updatedRoom;
    });
  } else {
    // set the price and create a new price entry in the room dynamic price
    await prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        dynamicPrice: {
          set: [{ date: new Date(), price: finalPrice }, ...room.dynamicPrice],
        },
        price: finalPrice,
      },
    });
  }

  console.log(`Updated Booking Fee for ${room.name}: $${finalPrice}`);
  revalidatePath(`/listings/${room.listingId}`);
  revalidatePath(`/listings/${room.listingId}/events`);
  revalidatePath(`/listings/${room.listingId}/rooms/${roomId}`);
  return room.isDynamicallyPriced;
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
