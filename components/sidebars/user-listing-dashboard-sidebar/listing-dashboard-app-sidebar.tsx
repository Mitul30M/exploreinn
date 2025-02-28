"use client";
import * as React from "react";
import { NavUser } from "@/components/sidebars/user-page-sidebar/nav-user";
import {
  BedDouble,
  CalendarRange,
  DoorOpen,
  HandCoins,
  Hotel,
  Tag,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ScrollArea } from "../../ui/scroll-area";
import { useUser } from "@clerk/nextjs";
import { NavMain } from "../user-page-sidebar/nav-main";

export function AppSidebar({
  listingID,
  ...props
}: React.ComponentProps<typeof Sidebar> & { listingID: string }) {
  const { user } = useUser();
  const userDB_id = (user?.publicMetadata as PublicMetadataType)?.userDB_id;

  const listingDashboardNavData = {
    menu: [
      {
        title: `Overview`,
        url: `/listings/${listingID}/overview`,
        icon: Hotel,
      },
      {
        title: "Bookings",
        url: `/listings/${listingID}/bookings`,
        icon: DoorOpen,
      },
      {
        title: "Transactions",
        url: `/listings/${listingID}/transactions`,
        icon: HandCoins,
      },
      {
        title: "Rooms",
        url: `/listings/${listingID}/rooms`,
        icon: BedDouble,
      },
      {
        title: "Events",
        url: `/listings/${listingID}/events`,
        icon: CalendarRange,
      },
      {
        title: "Offers",
        url: `/listings/${listingID}/offers`,
        icon: Tag,
      },
    ],
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <NavUser
          user={{
            name: user?.fullName!,
            email: user?.emailAddresses[0]!.emailAddress!,
            avatar: user?.imageUrl!,
            userDB_id: userDB_id as string,
          }}
        />
      </SidebarHeader>
      <ScrollArea className="h-[100vh] overflow-hidden whitespace-nowrap">
        <SidebarContent className="border-t-[1px] border-border/90">
          <NavMain items={listingDashboardNavData.menu} label="Dashboard" />
        </SidebarContent>
      </ScrollArea>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
