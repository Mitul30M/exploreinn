"use server";

import { z } from "zod";
import { FormState } from "@/lib/types/forms/form-state";
import prisma from "@/lib/prisma-client";

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

  return user;
}

export async function deleteUser(clerkId?: string, userId?: string) {
  const whereClause = clerkId ? { clerkId } : { id: userId };

  const user = await prisma.user.delete({
    where: whereClause,
  });

  return user;
}

const updatePersonalInfoFormSchema = z.object({
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Please select your gender.",
  }),
  country: z.string({
    required_error: "Please select your country.",
  }),
});

export async function updatePersonalInfo(
  prevState: FormState,
  data: Record<string, any>
): Promise<FormState> {
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

    // Success
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

const updateResidentialInfoFormSchema = z.object({
  residence: z.string({
    required_error: "Residence is required",
  }),
  street: z.string({
    required_error: "Street is required",
  }),
  city: z.string({
    required_error: "City is required",
  }),
  province: z.string({
    required_error: "Province/State is required",
  }),
  landmark: z.string().optional(),
  postalCode: z
    .string({
      required_error: "Postal code is required",
    })
    .max(10, {
      message: "Invalid postal code",
    }),
});

export async function updateResidentialInfo(
  prevState: FormState,
  data: Record<string, any>
): Promise<FormState> {
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

    // Success
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
