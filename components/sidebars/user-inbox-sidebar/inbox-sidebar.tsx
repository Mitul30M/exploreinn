"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { inboxNav } from "@/lib/utils/seed/user-inbox/mails";
import MailList from "@/components/user-page/inbox/mail-list";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { NewUserMailDialogForm } from "./new-mail";

// This is sample data
interface InboxSidebarProps {
  userId: string;
  data: TMails[];
  // add a prop for the onMailClick function, keep it optional for now
  onMailClick?: (mail: TMails) => void;
}

export function InboxSidebar({
  userId,
  data,
  onMailClick,
  ...props
}: React.ComponentProps<typeof Sidebar> & InboxSidebarProps) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(inboxNav[0]);
  const { open } = useSidebar();
  const [readMails, setReadMails] = React.useState(false);

  const filteredMails = React.useCallback(() => {
    // Filter based on activeItem
    let filtered = [...data];
    // if activeItem is "sent", show all mails sent by the user
    if (activeItem.title.toLowerCase() === "sent") {
      filtered = filtered.filter((mail) => mail.senderId === userId);
    } else if (activeItem.title.toLowerCase() === "archive") {
      filtered = filtered.filter(
        (mail) => mail.archived === true && mail.receiverId === userId
      );
    } else if (activeItem.title.toLowerCase() === "trash") {
      filtered = filtered.filter(
        (mail) => mail.trashed === true && mail.receiverId === userId
      );
    } else {
      filtered = filtered.filter(
        (mail) => !mail.archived && !mail.trashed && mail.receiverId === userId
      );
    }

    // Filter based on readMails toggle
    if (readMails && activeItem.title.toLowerCase() !== "sent") {
      filtered = filtered.filter(
        (mail) => !mail.read && mail.receiverId === userId
      );
    }

    return filtered;
  }, [data, activeItem, userId, readMails]);

  const handleReadMailsToggle = (checked: boolean) => {
    setReadMails(checked);
  };

  // add a logic to handle the onMailClick function using redux or context api
  const handleMailClick = (mail: TMails) => {
    // ***add a logic to handle the onMailClick function using redux or context api
    // add a logic to handle the onMailClick function using redux or context api
    onMailClick?.(mail);
    toast({
      title: `${mail.subject}`,
      description: `from: ${mail.sender?.email}, ${format(
        new Date(mail.createdAt),
        "dd MMM yyyy"
      )}`,
      action: (
        <ToastAction
          altText="Try again"
          className="flex items-center gap-1 text-primary"
        >
          <CheckCircle2 className="size-4" />
          Done
        </ToastAction>
      ),
    });
  };

  return (
    <div className="flex-row bg-purple-400 !max-h-screen rounded-xl" {...props}>
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border border-x-0"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-0">
              <SidebarMenu>
                {inboxNav.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      isActive={activeItem.title === item.title}
                      className="px-2.5 md:px-2"
                      onClick={() => {
                        setActiveItem(item);
                      }}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter></SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar
        collapsible="none"
        className={`transition-transform duration-200 ease-linear ${"transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out"} border border-r-0 ${
          open ? "" : "hidden"
        }`}
      >
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {activeItem.title}
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Unread</span>
              <Switch
                className="shadow-none"
                checked={readMails}
                onCheckedChange={handleReadMailsToggle}
              />
            </Label>
          </div>
          <div className="flex flex-row gap-3 items-center">
            <SidebarInput placeholder="Type to search..." />

            <NewUserMailDialogForm />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0 overflow-y-hidden">
            <SidebarGroupContent className="overflow-y-hidden">
              <MailList
                userId={userId}
                mails={filteredMails()}
                onMailClick={(mail) => handleMailClick(mail)}
              />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
