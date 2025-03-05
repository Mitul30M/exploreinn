"use client";
import * as React from "react";
import { SelectTrigger } from "@radix-ui/react-select";
import {
  CheckCircle2,
  ConciergeBell,
  Download,
  Loader,
  MessageSquareX,
} from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { bookingStatus } from "@/lib/utils/types/status/booking-status";
import { BookingStatusConfig } from "@/lib/utils/types/status/booking-status";
import { Badge } from "@/components/ui/badge";
import { updateListingBookingStatus } from "@/lib/actions/bookings/bookings";
import { Booking, BookingStatus, Transaction } from "@prisma/client";
import Link from "next/link";

interface FloatingBarProps {
  booking: Booking & {
    transaction: Transaction | null;
  };
  isOwnerOrManager?: boolean;
}

export function BookingFloatingActionBar({
  booking,
  isOwnerOrManager = false,
}: FloatingBarProps) {
  const [isPending, startTransition] = React.useTransition();
  const [action, setAction] = React.useState<
    "update-booking-status" | "update-transaction-status" | "export" | "cancel"
  >();
  const { toast } = useToast();

  return (
    <Portal>
      <div className="fixed inset-x-0 bottom-6 z-50 mx-auto w-fit px-2.5">
        <div className="w-full overflow-x-auto">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-md border bg-background p-2 text-foreground shadow">
            <div className="flex items-center gap-1.5">
              {/* to update booking status */}
              {isOwnerOrManager && (
                <Select
                  onValueChange={(value) => {
                    startTransition(async () => {
                      if (
                        Object.values(BookingStatus).includes(
                          value as BookingStatus
                        )
                      ) {
                        console.log(value);
                        const error = await updateListingBookingStatus(
                          booking.id,
                          value as BookingStatus
                        );

                        if (error) {
                          toast({
                            title: "Error",
                            description: error.message,
                            variant: "destructive",
                          });
                          return;
                        }

                        toast({
                          title: "Booking Status Updated",
                          description: `Updated Booking Status from ${booking.bookingStatus?.charAt(0).toUpperCase() + booking.bookingStatus?.slice(1)} to: ${value.charAt(0).toUpperCase() + value.slice(1)}`,
                        });
                      }
                    });
                  }}
                >
                  <Tooltip>
                    <SelectTrigger asChild>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="size-7 border data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                          disabled={isPending}
                        >
                          {isPending && action === "update-booking-status" ? (
                            <Loader
                              className="size-3.5 animate-spin text-primary"
                              aria-hidden="true"
                            />
                          ) : (
                            <ConciergeBell
                              className="size-3.5 text-primary"
                              aria-hidden="true"
                            />
                          )}
                        </Button>
                      </TooltipTrigger>
                    </SelectTrigger>
                    <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                      <p>Update Booking Status</p>
                    </TooltipContent>
                  </Tooltip>
                  <SelectContent align="center">
                    <SelectGroup>
                      {["ongoing", "completed", "cancelled"].map((_status) => {
                        if (_status === booking.bookingStatus) return null;

                        const status: BookingStatusConfig =
                          bookingStatus[_status as keyof typeof bookingStatus];
                        return (
                          <SelectItem
                            key={_status}
                            value={_status}
                            className="capitalize"
                          >
                            <div className="w-full flex items-center justify-center">
                              <Badge
                                variant="outline"
                                className={status.className}
                              >
                                {status.icon && <status.icon size={16} />}{" "}
                                {status.label}
                              </Badge>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}

              {/* cancel a booking */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="size-7 border"
                    onClick={() => {
                      setAction("cancel");

                      startTransition(async () => {
                        const error = await updateListingBookingStatus(
                          booking.id,
                          "cancelled" as BookingStatus
                        );

                        if (error) {
                          toast({
                            title: "Error",
                            description: error.message,
                            variant: "destructive",
                          });
                          return;
                        }

                        toast({
                          variant: "destructive",
                          title: "Booking Status Updated",
                          description: `Updated Booking Status from ${booking.bookingStatus?.charAt(0).toUpperCase() + booking.bookingStatus?.slice(1)} to: Cancelled`,
                        });
                      });
                    }}
                    disabled={
                      isPending || booking.bookingStatus === "cancelled"
                    }
                  >
                    {isPending && action === "cancel" ? (
                      <Loader
                        className="size-3.5 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <MessageSquareX className="size-3.5" aria-hidden="true" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                  <p>Cancel Booking</p>
                </TooltipContent>
              </Tooltip>
              {/* to export mulitple rows or single row from a DataTable*/}
              {["completed", "refunded", "requested_refund"].includes(
                booking.paymentStatus
              ) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={booking?.transaction?.receiptURL ?? ""}>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="size-7 border"
                        onClick={() => {
                          setAction("export");

                          startTransition(() => {
                            toast({
                              title: "Invoice Exported",
                              description:
                                "Booking's invoice has been exported successfully",
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
                          });
                        }}
                        disabled={isPending}
                      >
                        {isPending && action === "export" ? (
                          <Loader
                            className="size-3.5 animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <Download className="size-3.5" aria-hidden="true" />
                        )}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                    <p>Download Invoice</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
