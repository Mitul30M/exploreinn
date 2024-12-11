import { z } from "zod";

export const UserOnboardingFormSchema = z.object({
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Please select your gender.",
  }),
  country: z.string({
    required_error: "Please select your country.",
  }),
  residence: z
    .string({
      required_error: "Residence is required",
    })
    .min(1, {
      message: "Residence is required",
    }),
  street: z
    .string({
      required_error: "Street is required",
    })
    .min(1, {
      message: "Street is required",
    }),
  city: z
    .string({
      required_error: "City is required",
    })
    .min(1, {
      message: "City is required",
    }),
  province: z
    .string({
      required_error: "Province/State is required",
    })
    .min(1, {
      message: "Province/State is required",
    }),
  landmark: z.string().optional(),
  postalCode: z
    .string({
      required_error: "Postal code is required",
    })
    .max(10, {
      message: "Invalid postal code",
    })
    .min(3, {
      message: "Postal code is required",
    }),
});

export const updatePersonalInfoFormSchema = z.object({
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

export const updateResidentialInfoFormSchema = z.object({
  residence: z
    .string({
      required_error: "Residence is required",
    })
    .min(1, {
      message: "Residence is required",
    }),
  street: z
    .string({
      required_error: "Street is required",
    })
    .min(1, {
      message: "Street is required",
    }),
  city: z
    .string({
      required_error: "City is required",
    })
    .min(1, {
      message: "City is required",
    }),
  province: z
    .string({
      required_error: "Province/State is required",
    })
    .min(1, {
      message: "Province/State is required",
    }),
  landmark: z.string().optional(),
  postalCode: z
    .string({
      required_error: "Postal code is required",
    })
    .max(10, {
      message: "Invalid postal code",
    })
    .min(1, {
      message: "Postal code is required",
    }),
});
