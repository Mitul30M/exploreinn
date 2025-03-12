"use server";

import prisma from "@/lib/prisma-client";
import { MailType } from "@prisma/client";

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

export const getUserBookingIDs = async (userId: string) => {
  const userBookings = await prisma.booking.findMany({
    where: {
      guestId: userId,
    },
    include: {
      listing: {
        select: {
          id: true,
          name: true,
          email: true,
          coverImage: true,
        },
      },
    },
  });
  return userBookings;
};

export async function sendMailfromUser(data: {
  receiver: "exploreinn" | "listing";
  userId: string;
  subject: string;
  text: string;
  type: MailType;
  labels: string[];
  email: string;
  attachments: string[];
  bookingId?: string;
  listingId?: string;
}) {
  console.log(data);
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return {
    message: "Mail sent successfully",
  };
}
