import { offerType } from "@prisma/client";
import {
  BadgeDollarSign,
  BadgePercent,
  BadgePlusIcon,
  LucideIcon,
  Percent,
  PercentCircle,
} from "lucide-react";

export interface OfferStatusConfig {
  icon: LucideIcon;
  className: string;
  label: string;
  value: offerType;
}
const baseClassName =
  "border-none rounded-md flex items-center justify-center gap-2 p-1 px-3 w-max bg-rose-100/50 border-none dark:bg-emerald-950/50";
export const offerStatusArray: OfferStatusConfig[] = [
  {
    label: "% Discount",
    className: baseClassName,
    icon: BadgePercent,
    value: "Percentage_Discount",
  },
  {
    label: "$ Discount",
    className: baseClassName,
    icon: BadgeDollarSign,
    value: "Flat_Discount",
  },
  {
    label: "Free Perks",
    className: baseClassName,
    icon: BadgePlusIcon,
    value: "Extra_Perks",
  },
];
