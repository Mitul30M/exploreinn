"use server";

import prisma from "@/lib/prisma-client";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Adds a new review for a listing.
 *
 * @param {object} data - The data for the review
 * @param {string} data.content - The content of the review
 * @param {number} data.stars - The number of stars given to the listing
 * @param {number} data.cleanliness - The rating for cleanliness
 * @param {number} data.comfort - The rating for comfort
 * @param {number} data.communication - The rating for communication
 * @param {number} data.checkIn - The rating for check-in experience
 * @param {number} data.valueForMoney - The rating for value for money
 * @param {number} data.location - The rating for location
 * @param {string} data.listingId - The id of the listing being reviewed
 *
 * @returns {Promise<{ message: string; type: "success" | "error" }>} - A promise that resolves to
 * an object with a message and a type. If the review is added successfully, the type will be "success"
 * and the message will be "Review added successfully". If there is an error, the type will be "error"
 * and the message will be an error message.
 */
export async function addNewReview(data: {
  content: string;
  stars: number;
  cleanliness: number;
  comfort: number;
  communication: number;
  checkIn: number;
  valueForMoney: number;
  location: number;
  listingId: string;
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
  const author = await prisma.user.findUnique({
    where: {
      id: userDbId,
    },
    select: {
      firstName: true,
      lastName: true,
      id: true,
      profileImg: true,
    },
  });

  if (!author) {
    return {
      message: "Unauthorized",
      type: "error",
    };
  }

  const hasACompletedBooking = await prisma.booking.findFirst({
    where: {
      listingId: data.listingId,
      guestId: author.id,
      bookingStatus: "completed",
    },
  });

  if (!hasACompletedBooking) {
    return {
      message: "You must have a completed booking to leave a review",
      type: "error",
    };
  }

  const review = await prisma.review.create({
    data: {
      content: data.content,
      stars: data.stars,
      cleanliness: data.cleanliness,
      comfort: data.comfort,
      communication: data.communication,
      checkIn: data.checkIn,
      valueForMoney: data.valueForMoney,
      location: data.location,
      overallRating:
        (data.cleanliness +
          data.comfort +
          data.communication +
          data.checkIn +
          data.valueForMoney +
          data.location) /
        6,
      listingId: data.listingId,
      authorId: author.id,
    },
  });

  if (!review) {
    return {
      message: "Internal Server Error. Please try again later",
      type: "error",
    };
  }
  await setListingOverallRatingAndGrade(data.listingId);
  revalidatePath(`/listings/${data.listingId}/overview`);

  return {
    message: "Review added successfully",
    type: "success",
  };
}

export async function setListingOverallRatingAndGrade(listingId: string) {
  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
    select: {
      reviews: true,
    },
  });
  if (!listing) {
    return {
      message: "Listing not found",
      type: "error",
    };
  }

  const starRating = Number(
    (
      listing.reviews.reduce((acc, review) => {
        return acc + review.stars;
      }, 0) / listing.reviews.length
    ).toFixed(1)
  );

  const overallRating = Number(
    (
      listing.reviews.reduce((acc, review) => {
        return acc + review.overallRating;
      }, 0) / listing.reviews.length
    ).toFixed(1)
  );

  const grade =
    overallRating >= 9
      ? "Excellent"
      : overallRating >= 8
        ? "VeryGood"
        : overallRating >= 6
          ? "Good"
          : overallRating >= 4
            ? "Fair"
            : "Poor";

  await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      overallRating: overallRating,
      exploreinnGrade: grade,
      starRating: starRating,
    },
  });

  revalidatePath(`/listings/${listingId}`);
}
