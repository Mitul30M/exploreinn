"use client";
import * as React from "react";
import { NavUser } from "@/components/sidebars/user-page-sidebar/nav-user";
import {
  ArchiveX,
  AudioWaveform,
  BedDouble,
  BookHeart,
  BookOpen,
  Bot,
  CalendarCheck,
  CalendarClock,
  CalendarRange,
  CalendarX2,
  Cog,
  Coins,
  Command,
  ConciergeBell,
  Contact,
  DoorOpen,
  Frame,
  GalleryVerticalEnd,
  Gift,
  HandCoins,
  Heart,
  HeartHandshake,
  Hotel,
  icons,
  IdCard,
  Inbox,
  Mail,
  Mails,
  Map,
  MapPinHouse,
  PieChart,
  Send,
  Settings2,
  ShieldCheck,
  SquareTerminal,
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
import { useUser } from "@clerk/nextjs";
import { getUser } from "@/lib/actions/user/user";
import { string } from "zod";
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
