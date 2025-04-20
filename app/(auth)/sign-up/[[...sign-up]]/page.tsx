// import SignUpForm from "@/components/auth/sign-up-form";
import { SignUp } from "@clerk/nextjs";
// export const metadata: Metadata = {
//   title: "exploreinn : Sign Up Page",
//   description: "Exploreinn Authentication",
// };

export default function SignInPage() {
  return (
    <>
      {/* for development only */}
      {/* <SignUpForm /> */}
      {/* for production */}
      <SignUp />
    </>
  );
}
