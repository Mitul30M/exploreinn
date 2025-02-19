import prisma from "@/lib/prisma-client";
import { PriceChange, HighDemand } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createPriceChangeEvent(args: {
  data: PriceChange[];
  startDate: Date;
  endDate: Date;
  listingId: string;
  authorId: string;
}) {
  const { data, startDate, endDate, listingId, authorId } = args;
  const rooms = data.map((room) => room.roomId);
  const priceChange = await prisma.roomEvent.create({
    data: {
      type: "PriceChange",
      roomIds: rooms,
      startDate,
      endDate,
      listingId,
      authorId,
      priceChange: data,
    },
  });
  console.log("Created Price Change Event: ", priceChange);

  revalidatePath(`/listings/${listingId}/events`);
  for (const room of rooms) {
    revalidatePath(`/listings/${listingId}/rooms/${room}`);
  }

  return !!priceChange;
}

export async function createHighDemandChangeEvent(args: {
  data: HighDemand[];
  startDate: Date;
  endDate: Date;
  listingId: string;
  authorId: string;
}) {
  const { data, startDate, endDate, listingId, authorId } = args;
  const rooms = data.map((room) => room.roomId);
  const highDemandChange = await prisma.roomEvent.create({
    data: {
      type: "HighDemand",
      roomIds: rooms,
      startDate,
      endDate,
      listingId,
      authorId,
      highDemand: data,
    },
  });
  console.log("Created High Demand Change Event: ", highDemandChange);

  revalidatePath(`/listings/${listingId}/events`);
  for (const room of rooms) {
    revalidatePath(`/listings/${listingId}/rooms/${room}`);
  }

  return !!highDemandChange;
}

export async function createBookingClosedEvent(args: {
  roomIds: string[];
  startDate: Date;
  endDate: Date;
  listingId: string;
  authorId: string;
}) {
  const { roomIds, startDate, endDate, listingId, authorId } = args;
  const bookingClosedEvent = await prisma.roomEvent.create({
    data: {
      type: "HighDemand",
      roomIds: roomIds,
      startDate,
      endDate,
      listingId,
      authorId,
    },
  });
  console.log("Created Booking Closed Event: ", bookingClosedEvent);

  revalidatePath(`/listings/${listingId}/events`);
  for (const room of roomIds) {
    revalidatePath(`/listings/${listingId}/rooms/${room}`);
  }

  return !!bookingClosedEvent;
}
