import SignInForm from "@/components/auth/sign-in-form";
import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";
// export const metadata: Metadata = {
//   title: "exploreinn : Sign In Page",
//   description: "Exploreinn Authentication",
// };

export default function SignInPage() {
  return (
    <>
      <SignInForm />
      {/* <SignIn /> */}
    </>
  );
}
