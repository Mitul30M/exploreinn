import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// add a interface for the mail prop for the mails array , each mail will be of type Mail, exported from the /seeds/user-inbox/mails.tsx file

interface MailListProps {
  mails: TMails[];
  onMailClick: (mail: TMails) => void;
}

const AdminMailList = ({ mails, onMailClick }: MailListProps) => {
  const exploreinnSupportEmail =
    process.env.NEXT_PUBLIC_EXPLOREINN_SUPPORT_EMAIL ??
    "support@exploreinn.com";

  return (
    <ScrollArea className="h-[calc(100vh-1rem)]">
      {mails.map((mail) => (
        <li
          key={mail.id}
          className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:cursor-pointer"
          onClick={() => onMailClick?.(mail)}
        >
          <div className="flex w-full items-center gap-2 ">
            <p className="font-semibold text-foreground/70 text-[12px]">
              {mail.from === mail.listing?.email
                ? mail.listing.name
                : mail.from === mail.sender?.email
                  ? mail.sender?.firstName + " " + mail.sender?.lastName
                  : mail.from}
            </p>
            <p className="ml-auto text-xs">{formatDate(mail.createdAt)}</p>
          </div>
          <p className="font-semibold flex items-center gap-2 text-[14px] w-full">
            <span>{mail.subject}</span>
            {!mail.read && mail.to === exploreinnSupportEmail && (
              <span className="inline-flex rounded-full h-2 w-2 bg-primary"></span>
            )}
          </p>
          <p className="line-clamp-2 text-foreground/70 w-[260px] whitespace-break-spaces text-xs font-medium">
            {mail.text}
          </p>

          <div className="flex gap-1 mt-1">
            {mail.labels.length <= 2
              ? mail.labels.map((label) => (
                  <Badge
                    key={label}
                    variant={"outline"}
                    className="text-xs rounded-full bg-primary/10 border-0 dark:text-foreground dark:bg-accent"
                  >
                    {label}
                  </Badge>
                ))
              : [
                  ...mail.labels.slice(0, 2).map((label) => (
                    <Badge
                      key={label}
                      variant={"outline"}
                      className="text-xs rounded-full bg-primary/10 border-0 dark:text-foreground dark:bg-accent"
                    >
                      {label}
                    </Badge>
                  )),
                  <Badge
                    key="more"
                    variant={"outline"}
                    className="text-xs rounded-full bg-primary/10 border-0 dark:text-foreground dark:bg-accent"
                  >
                    +{mail.labels.length - 2}
                  </Badge>,
                ]}
          </div>
        </li>
      ))}
    </ScrollArea>
  );
};
export default AdminMailList;
