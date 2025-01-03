import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookHeart,
  Cog,
  Gift,
  HeartHandshake,
  Hotel,
  IdCard,
  Inbox,
  LogOut,
  Mail,
  Menu,
  Phone,
  ShieldCheck,
  TicketsPlane,
} from "lucide-react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { getUser } from "@/lib/actions/user/user";

export async function UserProfileDropdown() {
  const clerkUser = await currentUser();
  const userDB_id = (clerkUser?.publicMetadata as PublicMetadataType).userDB_id;
  const user = await getUser(userDB_id);

  return (
    <DropdownMenu>
      {/* Trigger for dropdown */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="rounded-xl ps-3 pe-1 shadow-none hover:shadow-sm"
        >
          <Menu />
          <Avatar className="h-max w-max border">
            <AvatarImage
              className="h-6 w-6"
              src={user?.profileImg}
              alt="@username"
            />
            <AvatarFallback>{`${user?.firstName?.[0]?.toUpperCase()}${user?.lastName?.[0]?.toUpperCase()}`}</AvatarFallback>{" "}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      {/* dropdown content */}
      <DropdownMenuContent className="w-56 ">
        <Link href={`/users/${user?.id}`}>
          <DropdownMenuItem className="flex justify-start items-center gap-2 cursor-pointer">
            <Avatar className="h-max w-max border">
              <AvatarImage
                className="h-8 w-8"
                src={user?.profileImg}
                alt="@username"
              />
              <AvatarFallback>{`${user?.firstName?.[0]?.toUpperCase()}${user?.lastName?.[0]?.toUpperCase()}`}</AvatarFallback>{" "}
            </Avatar>

            <div className="font-semibold">
              {user?.firstName} {user?.lastName}{" "}
              {user?.gender === "Male"
                ? "(M)"
                : user?.gender === "Female"
                ? "(F)"
                : null}
              {/* <p className="text-xs my-1 text-foreground/70 font-medium flex flex-row items-center gap-[6px]">
                {user?.email}
              </p> */}
              <p className="text-xs h-max w-full text-foreground/70 font-medium flex flex-row items-center gap-[6px] line-clamp-1">
                {user?.email && user.email.length > 24 ? `${user.email.slice(0, 24)}...` : user?.email}
              </p>{" "}
            </div>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        {/* dropdown group1 */}
        <DropdownMenuGroup>
          <Link href={`/users/${user?.id}`}>
            <DropdownMenuItem className="hover:cursor-pointer">
              <IdCard />
              Profile
            </DropdownMenuItem>
          </Link>
          <Link href={`/users/${user?.id}/wishlist`}>
            <DropdownMenuItem className="hover:cursor-pointer">
              <BookHeart />
              Wishlist
            </DropdownMenuItem>
          </Link>
          <Link href={`/users/${user?.id}/bookings`}>
            <DropdownMenuItem className="hover:cursor-pointer">
              <TicketsPlane />
              Bookings
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="hover:cursor-pointer">
            <Inbox />
            Inbox
          </DropdownMenuItem>
          <Link href={`/users/${user?.id}/rewards`}>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Gift />
              Rewards
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* dropdown group2 */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer">
            <Hotel />
            Listings
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer">
            <Cog />
            Preferences
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer">
            <ShieldCheck />
            Account Security
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer">
            <HeartHandshake />
            Help & Support{" "}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <SignOutButton>
          <DropdownMenuItem className="text-primary">
            <LogOut />
            Log out
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
