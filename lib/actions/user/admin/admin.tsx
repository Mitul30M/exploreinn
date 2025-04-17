import prisma from "@/lib/prisma-client";
import { currentUser } from "@clerk/nextjs/server";

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
  //   confirm both the user's metadata and db record hold the role of "Admin" to grant admin access
  return isUserAdmin?.role === "Admin" && role === "Admin" ? true : false;
}
