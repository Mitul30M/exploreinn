import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Exploreinn Onboarding page",
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (
    ((await auth()).sessionClaims?.metadata as PublicMetadataType)
      ?.onboardingComplete === true
  ) {
    redirect("/");
  }

  return <>{children}</>;
}
