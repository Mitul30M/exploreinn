"use server";

import prisma from "@/lib/prisma-client";

export async function getListingRooms(listingId: string) {
  const rooms = await prisma.room.findMany({
    where: {
      listingId,
    },
  });
  return rooms;
}
