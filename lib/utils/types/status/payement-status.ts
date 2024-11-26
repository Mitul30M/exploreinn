import { cn } from "@/lib/utils";
import { ThumbsUp, CalendarClock, HandCoins, CalendarOff, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface PaymentStatusConfig {
  icon: LucideIcon;
  className: string;
  label: string;
}

type PaymentStatusKey = 'completed' | 'pending' | 'refunded' | 'cancelled';

export type PaymentStatus = {
  completed: PaymentStatusConfig;
  pending: PaymentStatusConfig;
  refunded: PaymentStatusConfig;
  cancelled: PaymentStatusConfig;
};

const baseClassName = "border-none rounded-md flex items-center justify-center gap-2 p-1 px-3 w-max" as const;

export const paymentStatus: PaymentStatus = {
  completed: {
    icon: ThumbsUp,
    className: cn(`${baseClassName} bg-emerald-100/50 text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100`),
    label: "Completed",
  },
  pending: {
    icon: CalendarClock,
    className: `${baseClassName} bg-amber-100/50 text-amber-950 dark:bg-amber-900/50 dark:text-amber-100`,
    label: "Pending",
  },
  refunded: {
    icon: HandCoins,
    className: `${baseClassName} bg-zinc-100/50 text-zinc-950 dark:bg-zinc-900/50 dark:text-zinc-100`,
    label: "Refunded",
  },
  cancelled: {
    icon: CalendarOff,
    className: `${baseClassName} bg-red-100/50 text-red-950 dark:bg-red-900/50 dark:text-red-100`,
    label: "Cancelled",
  },
};


export const paymentStatusArray = [
  {
    label: "Completed",
    value: "completed",
    icon: ThumbsUp,
    className: `${baseClassName} bg-emerald-100/50 text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100`,
  },
  {
    label: "Pending",
    value: "pending",
    icon: CalendarClock,
    className: `${baseClassName} bg-amber-100/50 text-amber-950 dark:bg-amber-900/50 dark:text-amber-100`,
  },
  {
    label: "Refunded",
    value: "refunded",
    icon: HandCoins,
    className: `${baseClassName} bg-zinc-100/50 text-zinc-950 dark:bg-zinc-900/50 dark:text-zinc-100`,
  },
  {
    label: "Cancelled",
    value: "cancelled",
    icon: CalendarOff,
    className: `${baseClassName} bg-red-100/50 text-red-950 dark:bg-red-900/50 dark:text-red-100`,
  },
];
