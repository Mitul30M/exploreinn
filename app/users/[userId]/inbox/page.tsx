import { AppSidebar } from "@/components/sidebars/user-inbox-sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Inbox } from "lucide-react";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const UserInboxPage = () => {
  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-b-[1px]">
      <h1 className="text-md  flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
        <Inbox size={22} className="text-primary" />
        Mitul's Mails
      </h1>

      <SidebarProvider
        style={
          {
            "--sidebar-width": "320px",
          } as React.CSSProperties
        }
        className="max-h-[70vh] "
      >
        <AppSidebar className="flex items-start justify-start rounded-md" />

        {/* selected mail is displayed here; create a separate component for it */}
        <ScrollArea className="max-h-[80%] w-full p-4 border border-border/90">
          <SidebarTrigger className="" />
        </ScrollArea>
      </SidebarProvider>
    </section>
  );
};

export default UserInboxPage;
