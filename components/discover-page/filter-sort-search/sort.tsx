import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

export function SortListings() {
  return (
    <Select>
      <SelectTrigger className="w-max flex justify-start gap-2">
        <ArrowUpDown size={18} />
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="asc-price">Price Low to High</SelectItem>
          <SelectItem value="desc-price">Price High to Low</SelectItem>
          <SelectItem value="asc-ratings">Guest Ratings</SelectItem>
          <SelectItem value="recommendations">Recommendations</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
