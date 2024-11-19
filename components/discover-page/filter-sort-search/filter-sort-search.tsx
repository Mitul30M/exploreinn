import React from "react";
import { FilterSheet } from "./filter-sheet";
import { SortListings } from "./sort";
import { MapViewToggle } from "./map-view-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const FilterSortSearchGroup = () => {
  return (
    <section className="flex items-center justify-between min-h-14 w-full px-4 border-b-[1px] border-border/90">
      <div className="flex items-center w-max justify-center gap-2 h-full">
        <SortListings />
        <FilterSheet />
        <MapViewToggle />
      </div>

      <div className="flex items-center w-max justify-center gap-2 h-full">
        <p className="text-sm text-black/80 dark:text-white/60">1200 Hotels Found</p>
        <Input placeholder="Search Hotels" className="w-[400px]" />
        <Button size="icon" className="rounded-full">
          <Search strokeWidth={3} />
        </Button>
      </div>

    </section>
  );
};

export default FilterSortSearchGroup;
