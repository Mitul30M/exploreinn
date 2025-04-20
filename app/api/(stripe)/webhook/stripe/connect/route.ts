import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
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
      process.env.STRIPE_CONNECT_WEBHOOK_SECRET!
    );
    console.log("Webhook event constructed successfully:", event.type);
  } catch (err) {
    console.error("Webhook construction failed:", err);
    return new Response(`Webhook Error: ${(err as Error).message}`, {
      status: 400,
    });
  }

  try {
    switch (event.type) {
      case "account.updated":
        console.log("Processing account.updated");
        const account = event.data.object;
        const userDb = await prisma.user.update({
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
        if (!userDb) break;
        revalidatePath(`/users/${userDb.id}`);
        console.log(
          `successfully updated user ${userDb.id}'s stripe account linking status`
        );
        break;
    }
  } catch (error) {
    console.log("Error processing webhook:", error);
    return new Response(null, { status: 500 });
  }
  return new Response(null, { status: 200 });
}
