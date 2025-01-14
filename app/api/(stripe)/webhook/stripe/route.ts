import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma-client";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  console.log("Webhook received");

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

  console.log("Webhook signature:", signature ? "Present" : "Missing");

  let event: Stripe.Event;

  try {
    console.log("Attempting to construct webhook event");
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("Webhook event constructed successfully:", event.type);
  } catch (err) {
    console.error("Webhook construction failed:", err);
    return new Response(`Webhook Error: ${(err as Error).message}`, {
      status: 400,
    });
  }

  switch (event.type) {
    case "account.updated":
      console.log("Processing account.updated");
      const account = event.data.object;
      const user = await prisma.user.update({
        where: {
          stripeId: account.id,
        },
        data: {
          isStripeConnectedAccount:
            account.capabilities?.transfers !== "pending" &&
            account.capabilities?.transfers !== "inactive",
        },
        select: {
          clerkId: true,
          stripeId: true,
          id: true,
        },
      });
      if (!user) break;
      revalidatePath(`/users/${user.id}`);
      console.log(
        `successfully updated user ${user.id}'s stripe account linking status`
      );
      break;

    case "checkout.session.completed":
      console.log("Processing checkout.session.completed");
      break;
  }
  return new Response(null, { status: 200 });
}
