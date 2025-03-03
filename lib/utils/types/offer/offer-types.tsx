import { cn } from "@/lib/utils";
import { offerType } from "@prisma/client";
import {
  BadgeDollarSign,
  BadgePercent,
  BadgePlusIcon,
  LucideIcon,
} from "lucide-react";

export interface OfferStatusConfig {
  icon: LucideIcon;
  className: string;
  label: string;
  value: offerType;
}

// type OfferStatusKey = "Percentage_Discount" | "Flat_Discount" | "Extra_Perks";

export type OfferStatus = {
  Percentage_Discount: OfferStatusConfig;
  Flat_Discount: OfferStatusConfig;
  Extra_Perks: OfferStatusConfig;
};

const baseClassName =
  "border-none rounded-md flex items-center justify-center gap-2 p-1 px-3 w-max" as const;

export const offerStatus: OfferStatus = {
  Percentage_Discount: {
    label: "% Discount",
    className: cn(`${baseClassName} bg-rose-100/50 dark:bg-rose-950/50`),
    icon: BadgePercent,
    value: "Percentage_Discount",
  },
  Flat_Discount: {
    label: "$ Discount",
    className: cn(`${baseClassName} bg-rose-100/50 dark:bg-rose-950/50`),
    icon: BadgeDollarSign,
    value: "Flat_Discount",
  },
  Extra_Perks: {
    label: "Free Perks",
    className: cn(`${baseClassName} bg-rose-100/50 dark:bg-rose-950/50`),
    icon: BadgePlusIcon,
    value: "Extra_Perks",
  },
};

export const offerStatusArray = [
  {
    label: "% Discount",
    className: cn(`${baseClassName} bg-rose-100/50 dark:bg-rose-950/50`),
    icon: BadgePercent,
    value: "Percentage_Discount",
  },
  {
    label: "$ Discount",
    className: cn(`${baseClassName} bg-rose-100/50 dark:bg-rose-950/50`),
    icon: BadgeDollarSign,
    value: "Flat_Discount",
  },
  {
    label: "Free Perks",
    className: cn(`${baseClassName} bg-rose-100/50 dark:bg-rose-950/50`),
    icon: BadgePlusIcon,
    value: "Extra_Perks",
  },
];
