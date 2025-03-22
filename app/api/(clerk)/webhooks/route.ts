// Import statements
import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user/user";
import { User } from "@prisma/client";
// import { generateStripeId } from "@/lib/actions/stripe/stripe";
// import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma-client";
// import { redirect } from "next/dist/server/api-utils";

/**
 * Handles incoming Clerk webhooks and processes user-related events.
 *
 * This function is the main entry point for the Clerk webhook route. It verifies the incoming webhook payload, extracts relevant user data, and performs corresponding actions such as creating, updating, or deleting users in the application's database.
 *
 * @param req - The incoming HTTP request object.
 * @returns A response indicating the success or failure of the webhook processing.
 */
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
export async function POST(req: Request) {
  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", { status: 400 });
  }

  // Get the body
  const payload: object = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Webhook triggered with an ID of ${id} and type of ${eventType}`);
  // console.log("Webhook body:", body);

  switch (eventType) {
    case "user.created": {
      const existingUser = await prisma.user.findFirst({
        where: {
          AND: [
            { clerkId: id },
            { email: evt.data.email_addresses[0].email_address },
            { phoneNo: evt.data.phone_numbers[0].phone_number },
            { isDeleted: false },
          ],
        },
        select: {
          id: true,
        },
      });

      if (existingUser) {
        console.log(`User already exists: ${existingUser.id}`);
        return new Response("", { status: 200 });
      }

      const {
        email_addresses,
        phone_numbers,
        first_name,
        last_name,
        image_url,
        id: clerkId,
      } = evt.data;
      const email = email_addresses[0]?.email_address ?? "";
      const phone = phone_numbers[0]?.phone_number ?? "";
      const firstName = first_name || ""; // Default to an empty string if null
      const lastName = last_name || ""; // Default to an empty string if null
      // const stripeId = await generateStripeId(email);

      const { user }: { user: User } = await createUser({
        clerkId,
        // stripeId,
        email,
        phone,
        firstName,
        lastName,
        profileImg: image_url,
      });

      if (user) {
        try {
          const client = await clerkClient(); // Call the function to get the instance
          //   to set the private metadata
          // await client.users.updateUser(clerkId, {
          //   privateMetadata: { secret, userDB_id: user.id },
          // });
          await client.users.updateUser(clerkId, {
            publicMetadata: {
              userDB_id: user.id,
              onboardingComplete:
                user.address && user.dob && user.gender ? true : false,
            },
          });
          await client.users.updateUserMetadata(clerkId, {
            privateMetadata: {
              stripeId: user.stripeId,
            },
          });
        } catch (err) {
          console.error("Error updating Clerk metadata:", err);
        }
      }

      console.log(`User created: ${user.id}`);
      break;
    }

    case "user.updated": {
      const {
        email_addresses,
        phone_numbers,
        first_name,
        last_name,
        image_url,
        id: clerkId,
      } = evt.data;
      const email = email_addresses[0]?.email_address;
      const phoneNo = phone_numbers[0]?.phone_number ?? "";
      const firstName = first_name || ""; // Default to an empty string if null
      const lastName = last_name || ""; // Default to an empty string if null
      const updatedUser: User = await updateUser(
        {
          email,
          phoneNo,
          firstName,
          lastName,
          profileImg: image_url,
        },
        clerkId
      );
      console.log(`User updated: ${updatedUser.id}`);
      break;
    }

    case "user.deleted": {
      const { id: clerkId } = evt.data;
      const deletedUser = await deleteUser(clerkId);
      console.log(`User soft-deleted: ${deletedUser.id}`);
      // console.log("Deleting stripe account: ", deletedUser.stripeId);
      // await stripe.accounts.del(deletedUser.stripeId);
      break;
    }

    default:
      console.log(`Unhandled event type: ${evt.type}`);
  }

  return new Response("", { status: 200 });
}
