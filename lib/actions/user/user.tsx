"use server";

import { FormState } from "@/lib/types/forms/form-state";
import prisma from "@/lib/prisma-client";
import {
  updatePersonalInfoFormSchema,
  updateResidentialInfoFormSchema,
  UserOnboardingFormSchema,
} from "@/lib/schemas/zod-schema";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
import { resend } from "@/lib/resend";
import OnboardCompleteEmail from "@/components/emails/onboarding";
import { generateStripeId } from "../stripe/stripe";

export async function createUser(data: {
  clerkId: string;
  // stripeId: string;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImg: string;
}) {
  // Check if the user already exists in the database albeit deleted
  const existingUser = await prisma.user.findFirst({
    where: {
      email: data.email,
      // phoneNo: data.phone,
      isDeleted: true,
    },
  });
  if (existingUser) {
    console.log("User already exists in the database. Restoring user...");
    // If the user exists, update the user's isDeleted field to false
    const updatedUser = await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        isDeleted: false,
        clerkId: data.clerkId,
      },
    });
    return { user: updatedUser };
  }
  // Create a user in the database if not previously deleted
  const stripeId = await generateStripeId(data.email);
  const user = await prisma.user.create({
    data: {
      clerkId: data.clerkId,
      stripeId: stripeId,
      email: data.email,
      phoneNo: data.phone,
      firstName: data.firstName,
      lastName: data.lastName,
      profileImg: data.profileImg,
    },
  });

  return { user }; // Return the user and secret to save in Clerk's private metadata
}

export async function onboardUser(
  prevState: FormState,
  data: {
    dob: Date;
    gender: "Male" | "Female" | "Other";
    country: string;
    residence: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
    landmark?: string | undefined;
  }
): Promise<FormState> {
  try {
    const { userId, sessionClaims } = await auth();
    console.log(userId, sessionClaims);
    const userDbId = (sessionClaims?.public_metadata as PublicMetadataType)
      .userDB_id;
    if (!userId || !userDbId) {
      return {
        message: "Unauthorized",
        type: "error",
      };
    }

    // Validate using Zod
    const parsed = UserOnboardingFormSchema.safeParse(data);

    if (!parsed.success) {
      return {
        message: "Invalid form data",
        type: "error",
        fields: data,
        issues: parsed.error.issues.map((issue) => issue.message),
      };
    }

    console.log(parsed.data);

    if (
      userId &&
      userDbId &&
      !(sessionClaims.public_metadata as PublicMetadataType).onboardingComplete
    ) {
      const user = await prisma.user.update({
        where: {
          id: userDbId,
        },
        data: {
          dob: parsed.data.dob,
          gender: parsed.data.gender,
          country: parsed.data.country,
          address: {
            residence: parsed.data.residence,
            street: parsed.data.street,
            city: parsed.data.city,
            province: parsed.data.province,
            landmark: parsed.data.landmark ? parsed.data.landmark : "",
            postalCode: parsed.data.postalCode,
          },
        },
      });
      console.log(user);
      const client = await clerkClient(); // Call the function to get the instance
      //   to set the private metadata
      // await client.users.updateUser(clerkId, {
      //   privateMetadata: { secret, userDB_id: user.id },
      // });
      await client.users.updateUser(userId, {
        publicMetadata: {
          ...(sessionClaims.public_metadata as PublicMetadataType),
          onboardingComplete: true,
        },
      });

      await resend.emails.send({
        from: "exploreinn <onboarding@mitul30m.in>",
        to: [user.email],
        subject: "Account Onboarding Complete",
        react: OnboardCompleteEmail(user),
        scheduledAt: "in 2 minutes",
      });
    }
    revalidatePath("/");
    // Success

    return {
      message: "User Onboarding Completed successfully",
      type: "success",
      fields: parsed.data,
    };
  } catch (err) {
    console.error(err);
    return {
      type: "error",
      message: "Internal server error",
    };
  }
}

export async function getUser(userDbId?: string) {
  const whereClause = { id: userDbId, isDeleted: false };

  const user = await prisma.user.findUnique({
    where: whereClause,
  });

  if (!user) {
    return null;
  }

  return user;
}

export async function updateUser(
  data: {
    email?: string;
    phoneNo?: string;
    firstName?: string;
    lastName?: string;
    profileImg?: string;
  },
  clerkId?: string,
  userId?: string
) {
  const whereClause = clerkId ? { clerkId } : { id: userId };

  const user = await prisma.user.update({
    where: whereClause,
    data,
  });

  revalidatePath(`/users/${user.id}`);
  return user;
}

export async function deleteUser(clerkId?: string, userId?: string) {
  const whereClause = clerkId ? { clerkId } : { id: userId };
  //soft delete user
  const user = await prisma.user.update({
    where: whereClause,
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
  // soft delete user's listings
  await prisma.listing.updateMany({
    where: {
      ownerId: user.id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
  return user;
}

export async function updatePersonalInfo(
  prevState: FormState,
  data: {
    dob: Date;
    gender: "Male" | "Female" | "Other";
    country: string;
  }
): Promise<FormState> {
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
    // Validate using Zod
    const parsed = updatePersonalInfoFormSchema.safeParse(data);

    if (!parsed.success) {
      return {
        message: "Invalid form data",
        type: "error",
        fields: data,
        issues: parsed.error.issues.map((issue) => issue.message),
      };
    }
    const user = await prisma.user.update({
      where: {
        id: userDbId,
      },
      data: {
        dob: parsed.data.dob,
        gender: parsed.data.gender,
        country: parsed.data.country,
      },
    });
    console.log(user);

    // Success
    revalidatePath(`/users/${user.id}`);
    return {
      message: "User info updated successfully",
      type: "success",
      fields: parsed.data,
    };
  } catch (err) {
    console.error(err);
    return {
      type: "error",
      message: "Internal server error",
    };
  }
}

export async function updateResidentialInfo(
  prevState: FormState,
  data: {
    residence: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
    landmark?: string | undefined;
  }
): Promise<FormState> {
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
    // Validate using Zod
    const parsed = updateResidentialInfoFormSchema.safeParse(data);

    if (!parsed.success) {
      return {
        message: "Invalid form data",
        type: "error",
        fields: data,
        issues: parsed.error.issues.map((issue) => issue.message),
      };
    }
    const user = await prisma.user.update({
      where: {
        id: userDbId,
      },
      data: {
        address: {
          residence: parsed.data.residence,
          street: parsed.data.street,
          city: parsed.data.city,
          province: parsed.data.province,
          landmark: parsed.data.landmark ? parsed.data.landmark : "",
          postalCode: parsed.data.postalCode,
        },
      },
    });
    console.log(user);

    // Success
    revalidatePath(`/users/${user.id}`);
    return {
      message: "Residential info updated successfully",
      type: "success",
      fields: parsed.data,
    };
  } catch (err) {
    console.error(err);
    return {
      type: "error",
      message: "Internal server error",
    };
  }
}

export async function addListingToWishlist(listingId: string, userId: string) {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      wishlistIds: {
        push: listingId,
      },
    },
    select: {
      wishlistIds: true,
    },
  });
  if (!user) {
    return {
      message: "User not found",
      type: "error",
    };
  }
  revalidatePath(`/listings/${listingId}`);
  revalidatePath(`/users/${userId}/wishlist`);
  return {
    message: "Listing added to wishlist successfully",
    type: "success",
  };
}

export async function removeListingFromWishlist(
  listingId: string,
  userId: string
) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      wishlistIds: true,
    },
  });

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      wishlistIds: {
        set: user?.wishlistIds.filter((id) => id !== listingId),
      },
    },
    select: {
      wishlistIds: true,
    },
  });
  if (!user || !updatedUser) {
    return {
      message: "User not found",
      type: "error",
    };
  }
  revalidatePath(`/listings/${listingId}`);
  revalidatePath(`/users/${userId}/wishlist`);
  return {
    message: "Listing removed from wishlist successfully",
    type: "success",
  };
}

export async function isListingWishlisted(listingId: string, userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      wishlistIds: true,
    },
  });
  if (!user) {
    return false;
  }
  return user.wishlistIds.includes(listingId);
}
