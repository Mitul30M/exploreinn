import {
  BedDouble,
  CalendarCheck2,
  CalendarClock,
  CalendarOff,
  LucideIcon,
} from "lucide-react";

export interface BookingStatusConfig {
  icon: LucideIcon;
  className: string;
  label: string;
}

// type BookingStatusKey = "ongoing" | "upcoming" | "completed" | "cancelled";

export type BookingStatus = {
  ongoing: BookingStatusConfig;
  upcoming: BookingStatusConfig;
  completed: BookingStatusConfig;
  cancelled: BookingStatusConfig;
};

const baseClassName =
  "border-none rounded-md flex items-center justify-center gap-2 p-1 px-3 w-max";

export const bookingStatus: BookingStatus = {
  ongoing: {
    icon: BedDouble,
    className: `bg-emerald-100/50 border-none text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100 ${baseClassName}`,
    label: "Ongoing",
  },
  upcoming: {
    icon: CalendarClock,
    className: `bg-amber-100/50 border-none text-amber-950 dark:bg-amber-900/50 dark:text-amber-100 ${baseClassName}`,
    label: "Upcoming",
  },
  completed: {
    icon: CalendarCheck2,
    className: `bg-zinc-100/50 border-none text-zinc-950 dark:bg-zinc-900/50 dark:text-zinc-100  ${baseClassName}`,
    label: "Completed",
  },
  cancelled: {
    icon: CalendarOff,
    className: `bg-red-100/50 border-none text-red-950 dark:bg-red-900/50 dark:text-red-100  ${baseClassName}`,
    label: "Cancelled",
  },
} as const;

export const bookingStatusArray = [
  {
    label: "Ongoing",
    value: "ongoing",
    icon: BedDouble,
    className: `bg-emerald-100/50 border-none text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100 ${baseClassName}`,
  },
  {
    label: "Upcoming",
    value: "upcoming",
    icon: CalendarClock,
    className: `bg-amber-100/50 border-none text-amber-950 dark:bg-amber-900/50 dark:text-amber-100 ${baseClassName}`,
  },
  {
    label: "Completed",
    value: "completed",
    icon: CalendarCheck2,
    className: `bg-zinc-100/50 border-none text-zinc-950 dark:bg-zinc-900/50 dark:text-zinc-100  ${baseClassName}`,
  },
  {
    label: "Cancelled",
    value: "cancelled",
    icon: CalendarOff,
    className: `bg-red-100/50 border-none text-red-950 dark:bg-red-900/50 dark:text-red-100  ${baseClassName}`,
  },
];
