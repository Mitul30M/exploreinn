import { AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Form from "next/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Mail } from "@/lib/utils/seed/user-inbox/mails";
import { Avatar } from "@radix-ui/react-avatar";
import { format } from "date-fns";
import { Archive, MailX, Send, Trash2 } from "lucide-react";
import React from "react";

interface CurrentMailProps {
  mail: Mail | null;
  className?: string;
}
const CurrentMail = ({ mail, ...props }: CurrentMailProps) => {
  // instead of taking the mail as prop use the redux store to fetch current active mail
  // and use that to display the mail
  return (
    <div {...props}>
      <div className="h-full max-w-[700px] m-auto ">
        <div className="flex h-full flex-col">
          {mail ? (
            <div className="flex flex-1 flex-col">
              <div className="flex items-center p-0">
                <div className="flex items-center gap-2 py-2">
                  <SidebarTrigger className="" />
                  <Separator
                    orientation="vertical"
                    className="h-6 border-r-0"
                  />
                  {/* Archive and move to trash buttons */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={!mail}
                        className="h-7 w-7"
                      >
                        <Archive className="h-4 w-4" />
                        <span className="sr-only">Archive</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Archive</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={!mail}
                        className="h-7 w-7"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Move to trash</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Move to trash</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <Separator />
              <div className="flex items-start p-4">
                <div className="flex items-start gap-4 text-sm">
                  <Avatar className="h-10 w-10">
                    {/* <AvatarImage alt={mail.name} /> */}
                    <AvatarFallback className="rounded-full border font-semibold text-lg">
                      {mail.sender.name
                        .split(" ")
                        .map((chunk) => chunk[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="font-semibold">{mail.sender.name}</div>
                    <div className="line-clamp-1 text-xs">{mail.subject}</div>
                    <div className="line-clamp-1 text-xs">
                      <span className="font-medium">Reply-To:</span>{" "}
                      {mail.sender.email}
                    </div>
                  </div>
                </div>
                {mail.date && (
                  <div className="ml-auto text-xs text-muted-foreground">
                    {format(new Date(mail.date), "PPpp")}
                  </div>
                )}
              </div>
              <Separator />
              <ScrollArea className="flex-1 max-h-[50%]  whitespace-pre-wrap p-4 text-sm">
                {mail.text}
              </ScrollArea>
              <Separator className="" />
              <div className="p-4">
                <Form action="#">
                  <div className="grid gap-4">
                    <Textarea
                      className="p-4"
                      placeholder={`Reply ${mail.sender.name}...`}
                    />
                    <div className="flex items-center">
                      <Button
                        onClick={(e) => e.preventDefault()}
                        size="sm"
                        className="ml-auto rounded-full"
                      >
                        Send <Send className=" h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          ) : (
            <div className="p-8 flex flex-col gap-2 items-center justify-center text-center text-muted-foreground font-medium"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentMail;
