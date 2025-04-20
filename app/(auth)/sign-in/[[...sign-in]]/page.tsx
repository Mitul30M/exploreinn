// import SignInForm from "@/components/auth/sign-in-form";
import { SignIn } from "@clerk/nextjs";
// export const metadata: Metadata = {
//   title: "exploreinn : Sign In Page",
//   description: "Exploreinn Authentication",
// };

export default function SignInPage() {
  return (
    <>
      {" "}
      {/* for development only */}
      {/* <SignInForm /> */}
      {/* for production */}
      <SignIn />
    </>
  );
}
