"use server";

import { z } from "zod";
import { FormState } from "@/lib/types/forms/form-state";

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
