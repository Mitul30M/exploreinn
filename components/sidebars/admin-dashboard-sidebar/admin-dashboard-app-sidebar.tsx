"use client";
import * as React from "react";
import { NavUser } from "@/components/sidebars/user-page-sidebar/nav-user";
import {
  DoorOpen,
  HandCoins,
  Hotel,
  Inbox,
  LayoutDashboard,
  Tag,
  UserCircle2,
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

export function AppAdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & {}) {
  const { user } = useUser();
  const userDB_id = (user?.publicMetadata as PublicMetadataType)?.userDB_id;

  const adminDashboardNavData = {
    menu: [
      {
        title: `Overview`,
        url: `/admin`,
        icon: LayoutDashboard,
      },
      {
        title: `Users`,
        url: `/admin/users`,
        icon: UserCircle2,
      },
      {
        title: `Listings`,
        url: `/admin/listings`,
        icon: Hotel,
      },
      {
        title: "Bookings",
        url: `/admin/bookings`,
        icon: DoorOpen,
      },
      {
        title: "Transactions",
        url: `/admin/transactions`,
        icon: HandCoins,
      },
      {
        title: "Inbox",
        url: `/admin/inbox`,
        icon: Inbox,
      },
      {
        title: "Offers",
        url: `/admin/offers`,
        icon: Tag,
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
            userDB_id: userDB_id ?? "",
          }}
        />
      </SidebarHeader>
      <ScrollArea className="h-[100vh] overflow-hidden whitespace-nowrap">
        <SidebarContent className="border-t-[1px] border-border/90">
          <NavMain items={adminDashboardNavData.menu} label="Admin Dashboard" />
        </SidebarContent>
      </ScrollArea>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
