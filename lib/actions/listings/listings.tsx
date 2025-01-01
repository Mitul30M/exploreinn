"use server";

import { RegisterListing } from "@/lib/redux-store/slices/register-listing-slice";
import { FormState } from "@/lib/types/forms/form-state";

export async function enlistListing(
  prevState: FormState,
  data: RegisterListing
): Promise<FormState> {
  console.log(data);

  // add a delay of 3 secs
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // return success
  return {
    message: "New listing created successfully",
    type: "success",
  };
}
