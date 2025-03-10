"use server";

import prisma from "@/lib/prisma-client";

/**
 * Retrieves all mail records for a given user.
 * The function returns a promise that resolves to an array of mail objects
 * with sender, receiver, and listing details.
 * @param userId - The id of the user whose mail records are to be retrieved.
 * @returns A promise that resolves to an array of mail objects with sender, receiver, and listing details.
 */
export async function getUserMails(userId: string) {
  const userMails = await prisma.mail.findMany({
    where: {
      OR: [
        {
          senderId: userId,
        },
        {
          receiverId: userId,
        },
      ],
    },
    include: {
      sender: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          profileImg: true,
        },
      },
      receiver: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          profileImg: true,
        },
      },
      listing: {
        select: {
          id: true,
          name: true,
          email: true,
          coverImage: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return userMails;
}
