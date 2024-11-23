"use client";
import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { userAccountNavData } from "@/lib/navigation/user-account-nav";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <NavUser user={userAccountNavData.user} />
      </SidebarHeader>
      <SidebarContent className="border-t-[1px] border-border/90">
        <NavMain items={userAccountNavData.account} label="Account" />
        <NavMain
          items={userAccountNavData.security}
          label="Security & Support"
          className="border-t-[1px] border-border/90"
        />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
