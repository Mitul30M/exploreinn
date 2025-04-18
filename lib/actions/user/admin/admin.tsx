'use server';
import prisma from "@/lib/prisma-client";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Checks if the currently logged in user is an Admin
 *
 * @returns true if the user is an Admin, false otherwise
 */
export async function isAdmin() {
  const user = await currentUser();
  if (!user) return false;

  const userId = (user.publicMetadata as PublicMetadataType).userDB_id;
  const role = (user.privateMetadata as PrivateMetadataType).role;

  const isUserAdmin = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      role: true,
    },
  });
  // confirm both the user's metadata and db record hold the role of "Admin" to grant admin access
  return isUserAdmin?.role === "Admin" && role === "Admin" ? true : false;
}

/**
 * Grants a user the Admin role.
 *
 * @param userId - The ID of the user to be promoted to Admin.
 *
 * This function updates the user's role in the database to "Admin"
 * and synchronizes the role in Clerk's user metadata. After updating,
 * it triggers a revalidation of the admin users' path to ensure the
 * changes are reflected.
 */
export async function makeAdmin(userId: string) {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: "Admin",
    },
  });
  const clerkUser = await currentUser();
  const privateMetadata = clerkUser?.privateMetadata as PrivateMetadataType;
  const client = await clerkClient();
  await client.users.updateUserMetadata(user.clerkId, {
    privateMetadata: {
      ...privateMetadata,
      role: user.role,
    },
  });
  revalidatePath("/admin/users");
  return user.role;
}

/**
 * Revokes a user's Admin role.
 *
 * @param userId - The ID of the user to be demoted from Admin.
 *
 * This function updates the user's role in the database to "User"
 * and synchronizes the role in Clerk's user metadata. After updating,
 * it triggers a revalidation of the admin users' path to ensure the
 * changes are reflected.
 */
export async function removeAdmin(userId: string) {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: "User",
    },
  });
  const clerkUser = await currentUser();
  const privateMetadata = clerkUser?.privateMetadata as PrivateMetadataType;
  const client = await clerkClient();
  await client.users.updateUserMetadata(user.clerkId, {
    privateMetadata: {
      ...privateMetadata,
      role: user.role,
    },
  });
  revalidatePath("/admin/users");
  return user.role;
}
