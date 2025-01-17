import {
  clerkMiddleware,
  createRouteMatcher,
  currentUser,
} from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "./lib/prisma-client";
import { isStripeConnectedAccount } from "./lib/actions/stripe/stripe";

const isPublicRoute = createRouteMatcher([
  "/",
  "/discover",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/webhook/stripe(.*)",
  "/listings(.*)",
]);
const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isStripeRoute = createRouteMatcher([
  "/api/stripe(.*)",
  "/users/(.*)/billing(.*)",
]);

const isRegisterNewListingRoute = createRouteMatcher(["/listings/register"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  // For users visiting /onboarding, don't try to redirect
  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next();
  }

  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && !isPublicRoute(req))
    return redirectToSignIn({ returnBackUrl: req.url });

  // Catch users who do not have `onboardingComplete: true` in their publicMetadata
  // Redirect them to the /onboading route to complete onboarding
  if (
    userId &&
    !(sessionClaims.public_metadata as PublicMetadataType).onboardingComplete
  ) {
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // comment out when testing locally since prisma client cant run on edge middleware & runtime
  // if (userId && isRegisterNewListingRoute(req)) {
  //   if (await isStripeConnectedAccount({ userId })) {
  //     return NextResponse.next();
  //   } else {
  //     const billingUrl = new URL(
  //       `/users/${
  //         (sessionClaims.public_metadata as PublicMetadataType).userDB_id
  //       }/billing`,
  //       req.url
  //     );
  //     return NextResponse.redirect(billingUrl);
  //   }
  // }

  // If the user is logged in and the route is protected, let them view.
  if (userId && !isPublicRoute(req)) return NextResponse.next();
});
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
