"use client";
import { AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar } from "@radix-ui/react-avatar";
import { format } from "date-fns";
import {
  Archive,
  ArchiveRestore,
  Paperclip,
  RefreshCw,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";
import React, { useEffect } from "react";
import { RenderHTML } from "@/components/listing-page/register-listing-page/multi-stepper-form/step4-render";
import { Badge } from "@/components/ui/badge";
import {
  setMailArchived,
  setMailRead,
  setMailTrash,
  setMailUnarchived,
  setMailUnTrash,
} from "@/lib/actions/mails/mails";
import Link from "next/link";

interface CurrentMailProps {
  mail: TMails | null;
  mailAddress: string;
  className?: string;
  onMailClose: () => void;
}
const CurrentMail = ({
  mail,
  onMailClose,
  mailAddress,
  ...props
}: CurrentMailProps) => {
  useEffect(() => {
    const checkMailRead = async () => {
      if (mail && !mail.read && mail.to === mailAddress) {
        await setMailRead(mail.id);
      }
    };
    checkMailRead();
  }, [mail, mailAddress]);
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
                  {/* Close, Archive & Move to trash buttons */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={!mail}
                        onClick={() => onMailClose()}
                        className="h-7 w-7"
                      >
                        <XCircle className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Close</TooltipContent>
                  </Tooltip>
                  {mail.to === mailAddress && (
                    <>
                      {!mail.archived ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={!mail}
                              onClick={async () => {
                                await setMailArchived(mail.id);
                              }}
                              className="h-7 w-7"
                            >
                              <Archive className="h-4 w-4" />
                              <span className="sr-only">Archive</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Archive</TooltipContent>
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={!mail}
                              onClick={async () => {
                                await setMailUnarchived(mail.id);
                              }}
                              className="h-7 w-7"
                            >
                              <ArchiveRestore className="h-4 w-4" />
                              <span className="sr-only">Unarchive</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Unarchive</TooltipContent>
                        </Tooltip>
                      )}

                      {!mail.trashed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={!mail}
                              onClick={async () => {
                                await setMailTrash(mail.id);
                              }}
                              className="h-7 w-7"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Move to trash</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Move to trash</TooltipContent>
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={!mail}
                              onClick={async () => {
                                await setMailUnTrash(mail.id);
                              }}
                              className="h-7 w-7"
                            >
                              <RefreshCw className="h-4 w-4" />
                              <span className="sr-only">Remove from trash</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Remove from trash</TooltipContent>
                        </Tooltip>
                      )}
                    </>
                  )}
                </div>
              </div>
              <Separator />
              <div className="flex items-start p-4">
                <div className="flex items-start gap-4 text-sm">
                  <Avatar className="h-10 w-10">
                    {/* <AvatarImage alt={mail.name} /> */}
                    <AvatarFallback className="rounded-full border font-semibold text-lg">
                      {mail.from === mail.listing?.email
                        ? mail.listing.name
                            .split(" ")
                            .map((chunk) => chunk[0])
                            .join("")
                        : mail.from ===
                            process.env.NEXT_PUBLIC_EXPLOREINN_SUPPORT_EMAIL
                          ? "ES"
                          : (
                              mail.sender?.firstName +
                              " " +
                              mail.sender?.lastName
                            )
                              .split(" ")
                              .map((chunk) => chunk[0])
                              .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="font-semibold">
                      {/* {mail.sender?.firstName + " " + mail.sender?.lastName} */}
                      {mail.from === mail.listing?.email
                        ? `Hotel Manager, ${mail.listing.name}`
                        : mail.from ===
                            process.env.NEXT_PUBLIC_EXPLOREINN_SUPPORT_EMAIL
                          ? "ExploreInn Support Team"
                          : mail.sender?.firstName +
                            " " +
                            mail.sender?.lastName}
                    </div>
                    <div className="line-clamp-1 text-xs">{mail.subject}</div>
                    <div className="line-clamp-1 text-xs">
                      <span className="font-medium">Reply-To:</span> {mail.from}
                    </div>
                  </div>
                </div>
                {mail.createdAt && (
                  <div className="ml-auto text-xs text-muted-foreground text-right">
                    {format(new Date(mail.createdAt), "PPpp")}
                    <br />
                    {mail.bookingId && <>Booking ID: {mail.bookingId}</>}
                    <br />
                    {mail.listingId && <>Listing ID: {mail.listingId}</>}
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex flex-row gap-2 items-center p-4">
                {mail.labels.length &&
                  mail.labels.map((label,idx) => (
                    <Badge key={idx} className="text-xs rounded-full ">
                      {label}
                    </Badge>
                  ))}
              </div>
              <Separator />
              <p className="p-4 text-[15px] font-medium text-primary">
                {mail.subject}
              </p>

              <Separator />
              <ScrollArea className="flex-1 max-h-[50%]  whitespace-pre-wrap p-4 text-sm">
                {/* {mail.text} */}
                <RenderHTML content={mail.text} />
              </ScrollArea>
              <Separator />
              <div className="flex flex-row gap-2 items-center p-4">
                {mail.attachments.length &&
                  mail.attachments.map((attachment, index) => (
                    <Badge
                      key={attachment}
                      className="text-xs "
                      variant={"secondary"}
                    >
                      <Link
                        href={attachment}
                        className="flex flex-row w-max items-center gap-2 no-underline"
                      >
                        Attachment {index + 1} <Paperclip size={16} />
                      </Link>
                    </Badge>
                  ))}
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
