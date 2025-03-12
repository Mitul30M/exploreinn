"use server";

import prisma from "@/lib/prisma-client";
import { auth } from "@clerk/nextjs/server";
import { MailType } from "@prisma/client";
import { revalidatePath } from "next/cache";

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
  intendedReceiver: "exploreinn" | "listing";
  subject: string;
  text: string;
  type: MailType;
  labels: string[];
  email: string;
  attachments: string[];
  bookingId?: string;
  listingId?: string;
}): Promise<{ message: string; type: "success" | "error" }> {
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
  const sender = await prisma.user.findUnique({
    where: {
      id: userDbId,
    },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      id: true,
      profileImg: true,
    },
  });
  if (!sender) {
    return {
      message: "Unauthorized",
      type: "error",
    };
  }

  // send mail to exploreinn support
  if (data.intendedReceiver === "exploreinn") {
    const mail = await prisma.mail.create({
      data: {
        from: sender.email,
        to: data.email,
        subject: data.subject,
        text: data.text,
        type: data.type,
        attachments: data.attachments,
        labels: data.labels,
        senderId: sender.id,
        bookingId: data.bookingId,
        listingId: data.listingId,
      },
    });
    console.log(mail);
    if (!mail) {
      return {
        message:
          "Internal server error. Error occurred while sending mail to exploreinn support",
        type: "error",
      };
    }
    revalidatePath(`/users/${mail.senderId}/inbox`);
    // revalidatePath(`/admin/inbox`);
    return {
      message: "Mail sent successfully to exploreinn support",
      type: "success",
    };
  }
  // send mail to a listing
  else if (data.intendedReceiver === "listing") {
    const mail = await prisma.mail.create({
      data: {
        from: sender.email,
        to: data.email,
        subject: data.subject,
        text: data.text,
        type: data.type,
        attachments: data.attachments,
        labels: data.labels,
        senderId: sender.id,
        bookingId: data.bookingId,
        listingId: data.listingId,
      },
    });
    console.log(mail);
    revalidatePath(`/users/${mail.senderId}/inbox`);
    revalidatePath(`/listings/${mail.listingId}/inbox`);
    return {
      message: "Mail sent successfully to listing",
      type: "success",
    };
  }

  return {
    message: "Internal server error",
    type: "error",
  };
}
