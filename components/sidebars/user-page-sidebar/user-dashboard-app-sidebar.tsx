"use client";
import * as React from "react";
import { NavUser } from "@/components/sidebars/user-page-sidebar/nav-user";
import {
  ArchiveX,
  BookHeart,
  CalendarCheck,
  CalendarClock,
  CalendarRange,
  CalendarX2,
  Cog,
  Coins,
  ConciergeBell,
  Contact,
  Gift,
  HandCoins,
  HeartHandshake,
  Hotel,
  IdCard,
  Inbox,
  MapPinHouse,
  Send,
  ShieldCheck,
  SquareUser,
  TicketCheck,
  TicketsPlane,
  Trash2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ScrollArea } from "../../ui/scroll-area";
import { NavMain } from "./nav-main";
import { useUser } from "@clerk/nextjs";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const userDB_id = (user?.publicMetadata as PublicMetadataType)?.userDB_id;

  const userAccountNavData = {
    account: [
      {
        title: "Account",
        url: `/users/:userId`,
        icon: SquareUser,
        items: [
          {
            title: "Personal Info",
            icon: IdCard,
            url: `/users/${userDB_id}/#personal-info`,
          },
          {
            title: "Contact Info",
            icon: Contact,
            url: `/users/${userDB_id}/#contact-info`,
          },
          {
            title: "Residential Address",
            icon: MapPinHouse,
            url: `/users/${userDB_id}/#residential-address`,
          },
          {
            title: "Preferences",
            icon: Cog,
            url: `/users/${userDB_id}/#preferences`,
          },
        ],
      },
      {
        title: "Wishlist",
        url: `/users/${userDB_id}/wishlist`,
        icon: BookHeart,
        items: [
          {
            title: "Hotels",
            url: `/users/${userDB_id}/wishlist`,
            icon: Hotel,
          },
        ],
      },
      {
        title: "Bookings",
        url: `/users/${userDB_id}/bookings`,
        icon: TicketsPlane,
        items: [
          {
            title: "Ongoing",
            icon: CalendarRange,
            url: `/users/${userDB_id}/bookings?bookingStatus=ongoing`,
          },
          {
            title: "Upcoming",
            url: `/users/${userDB_id}/bookings?bookingStatus=upcoming`,
            icon: CalendarClock,
          },
          {
            title: "Completed",
            url: `/users/${userDB_id}/bookings?bookingStatus=completed`,
            icon: CalendarCheck,
          },
          {
            title: "Cancelled",
            url: `/users/${userDB_id}/bookings?bookingStatus=cancelled`,
            icon: CalendarX2,
          },
        ],
      },
      {
        title: "Inbox",
        url: `/users/${userDB_id}/inbox`,
        icon: Inbox,
        items: [
          {
            title: "Mails",
            url: `/users/${userDB_id}/inbox`,
            icon: Inbox,
          },
          {
            title: "Sent",
            url: `/users/${userDB_id}/inbox/#sent`,
            icon: Send,
          },
          {
            title: "Archive",
            url: `/users/${userDB_id}/inbox/#archive`,
            icon: ArchiveX,
          },
        ],
      },
      {
        title: `Rewards`,
        url: `/users/${userDB_id}/rewards`,
        icon: Gift,
        items: [
          {
            title: `Redeem`,
            url: `/users/${userDB_id}/rewards/#redeem`,
            icon: TicketCheck,
          },
          {
            title: `Reward Points`,
            url: `/users/${userDB_id}/rewards/#reward-points`,
            icon: Coins,
          },
        ],
      },
      {
        title: `Listings`,
        url: `/users/${userDB_id}/listings`,
        icon: Hotel,
        items: [
          {
            title: `Hotel Owner`,
            url: `/users/${userDB_id}/listings/#hotel-owner`,
            icon: HandCoins,
          },
          {
            title: `Hotel Manager`,
            url: `/users/${userDB_id}/listings/#hotel-manager`,
            icon: ConciergeBell,
          },
        ],
      },
    ],
    security: [
      {
        title: `Account Security`,
        url: `/users/${userDB_id}/security`,
        icon: ShieldCheck,
        items: [
          {
            title: `Change Credentials`,
            url: `/users/${userDB_id}/security`,
            icon: IdCard,
          },
          {
            title: `Delete Account`,
            url: `/users/${userDB_id}/security/#delete-account`,
            icon: Trash2,
          },
        ],
      },
      {
        title: "Help & Support",
        url: "/support",
        icon: HeartHandshake,
        items: [
          {
            title: "Contact Support",
            url: "/support/#contact-support",
            icon: Inbox,
          },
        ],
      },
    ],
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <NavUser
          user={{
            name: user?.fullName ?? "",
            email: user?.emailAddresses[0]?.emailAddress ?? "",
            avatar: user?.imageUrl ?? "",
            userDB_id: userDB_id?.toString() ?? "",
          }}
        />
      </SidebarHeader>
      <ScrollArea className="h-[100vh] overflow-hidden whitespace-nowrap">
        <SidebarContent className="border-t-[1px] border-border/90">
          <NavMain items={userAccountNavData.account} label={`${user?.fullName ?? ""}'s Account`} />
          <NavMain
            items={userAccountNavData.security}
            label="Security & Support"
            className="border-t-[1px] border-border/90"
          />
        </SidebarContent>
      </ScrollArea>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
