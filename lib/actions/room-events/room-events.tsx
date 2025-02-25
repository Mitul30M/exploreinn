"use server";
import prisma from "@/lib/prisma-client";
import { PriceChange, HighDemand } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { dynamicallySetRoomPrice } from "../rooms/rooms";

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

  const eventRooms = await Promise.all(
    rooms.map((roomId) =>
      prisma.room.update({
        where: { id: roomId },
        data: {
          roomEventIds: {
            push: priceChange.id,
          },
        },
        select: {
          roomEvents: true,
          roomEventIds: true,
        },
      })
    )
  );

  console.log("Event Rooms: ", eventRooms);

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

  const eventRooms = await Promise.all(
    rooms.map((roomId) =>
      prisma.room.update({
        where: { id: roomId },
        data: {
          roomEventIds: {
            push: highDemandChange.id,
          },
        },
        select: {
          roomEvents: true,
          roomEventIds: true,
        },
      })
    )
  );

  console.log("Event Rooms: ", eventRooms);

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
      type: "BookingClosed",
      roomIds: roomIds,
      startDate,
      endDate,
      listingId,
      authorId,
    },
  });
  console.log("Created Booking Closed Event: ", bookingClosedEvent);

  const eventRooms = await Promise.all(
    roomIds.map((roomId: string) =>
      prisma.room.update({
        where: { id: roomId },
        data: {
          roomEventIds: {
            push: bookingClosedEvent.id,
          },
        },
        select: {
          roomEvents: true,
          roomEventIds: true,
        },
      })
    )
  );

  console.log("Event Rooms: ", eventRooms);

  revalidatePath(`/listings/${listingId}/events`);
  for (const room of roomIds) {
    revalidatePath(`/listings/${listingId}/rooms/${room}`);
  }

  return !!bookingClosedEvent;
}

export async function deleteEvent(eventId: string) {
  const event = await prisma.roomEvent.delete({
    where: {
      id: eventId,
    },
  });
  console.log("Deleted Event: ", event);
  await Promise.all(
    event.roomIds.map(async (roomId: string) => {
      const room = await prisma.room.findUnique({ where: { id: roomId } });
      const updatedEventIds =
        room?.roomEventIds.filter((id) => id !== eventId) ?? [];
      await dynamicallySetRoomPrice(roomId);
      return prisma.room.update({
        where: { id: roomId },
        data: {
          roomEventIds: {
            set: updatedEventIds,
          },
        },
        select: {
          roomEvents: true,
          roomEventIds: true,
        },
      });
    })
  );

  return !!event;
}

export async function fetchEvents({
  date,
  month,
  year,
  listingId,
}: {
  date?: Date;
  month?: string;
  year?: number;
  listingId: string;
}) {
  let whereClause = {};

  if (date) {
    whereClause = {
      listingId,
      AND: [
        {
          AND: [
            {
              startDate: {
                lte: new Date(date),
              },
            },
            {
              endDate: {
                gte: new Date(date),
              },
            },
          ],
        },
      ],
    };
  } else if (month && year) {
    const monthNumber =
      new Date(Date.parse(`${month} 1, ${year}`)).getMonth() + 1;
    const startOfMonth = new Date(year, monthNumber - 1, 1);
    const endOfMonth = new Date(year, monthNumber, 0);
    whereClause = {
      listingId,
      AND: [
        {
          startDate: {
            lte: endOfMonth,
          },
        },
        {
          endDate: {
            gte: startOfMonth,
          },
        },
      ],
    };
  } else {
    whereClause = {
      listingId,
    };
  }

  console.log("Where Clause: ", JSON.stringify(whereClause));

  const events = await prisma.roomEvent.findMany({
    where: whereClause,
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
          profileImg: true,
          email: true,
          role: true,
          phoneNo: true,
        },
      },
      rooms: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });

  return events;
}
