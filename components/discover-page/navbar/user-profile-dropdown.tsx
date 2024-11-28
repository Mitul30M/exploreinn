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
  Menu,
  ShieldCheck,
  TicketsPlane,
} from "lucide-react";
import Link from "next/link";

export function UserProfileDropdown() {
  return (
    <DropdownMenu>
      {/* Trigger for dropdown */}
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full ps-3 pe-1">
          <Menu />
          <Avatar className="h-max w-max border">
            <AvatarImage
              className="h-6 w-6"
              src="https://avatars.githubusercontent.com/u/120619177?s=400&u=d943ef3e7faacbfad1bdcb92d31e6946fee0a3af&v=4"
              alt="@username"
            />
            <AvatarFallback>MM</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      {/* dropdown content */}
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="flex justify-start items-center gap-3">
          <Avatar className="h-max w-max border">
            <AvatarImage
              className="h-8 w-8"
              src="https://avatars.githubusercontent.com/u/120619177?s=400&u=d943ef3e7faacbfad1bdcb92d31e6946fee0a3af&v=4"
              alt="@username"
            />
            <AvatarFallback>MM</AvatarFallback>
          </Avatar>

          <div>
            Mitul Mungase
            <p className="text-sm font-medium dark:text-white/70 text-black/70">
              mitul30m@icloud
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* dropdown group1 */}
        <DropdownMenuGroup>
          <Link href={"/users/:userId"}>
            <DropdownMenuItem className="hover:cursor-pointer">
              <IdCard />
              Profile
            </DropdownMenuItem>
          </Link>
          <Link href={"/users/:userId/wishlist"}>
            <DropdownMenuItem className="hover:cursor-pointer">
              <BookHeart />
              Wishlist
            </DropdownMenuItem>
          </Link>
          <Link href={"/users/:userId/bookings"}>
            <DropdownMenuItem className="hover:cursor-pointer">
              <TicketsPlane />
              Bookings
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="hover:cursor-pointer">
            <Inbox />
            Inbox
          </DropdownMenuItem>
          <Link href={"/users/:userId/rewards"}>
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
        <DropdownMenuItem>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
