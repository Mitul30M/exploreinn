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
import { redirect } from "next/navigation";

export async function createUser(data: {
  clerkId: string;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImg: string;
}) {
  const user = await prisma.user.create({
    data: {
      clerkId: data.clerkId,
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
  data: Record<string, any>
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
    // Parse `dob` as a Date
    if (data.dob) {
      data.dob = new Date(data.dob as string);
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
  const whereClause = { id: userDbId };

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

  const user = await prisma.user.delete({
    where: whereClause,
  });

  return user;
}

export async function updatePersonalInfo(
  prevState: FormState,
  data: Record<string, any>
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
    // Parse `dob` as a Date
    if (data.dob) {
      data.dob = new Date(data.dob as string);
    }

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
    return {
      type: "error",
      message: "Internal server error",
    };
  }
}

export async function updateResidentialInfo(
  prevState: FormState,
  data: Record<string, any>
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
    return {
      type: "error",
      message: "Internal server error",
    };
  }
}
