"use client";
import * as React from "react";
import { NavUser } from "@/components/sidebars/user-page-sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { userAccountNavData } from "@/lib/navigation/user-account-nav";
import { ScrollArea } from "../../ui/scroll-area";
import { NavMain } from "./nav-main";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <NavUser user={userAccountNavData.user} />
      </SidebarHeader>
      <ScrollArea className="h-[100vh] overflow-hidden whitespace-nowrap">
        <SidebarContent className="border-t-[1px] border-border/90">
          <NavMain items={userAccountNavData.account} label="Account" />
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
