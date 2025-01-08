"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Label } from "../ui/label";
import { convertCurrency } from "@/lib/utils/currency/currency-convertor";
import { Checkbox } from "../ui/checkbox";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import {
  addExtra,
  removeExtra,
} from "@/lib/redux-store/slices/new-booking-slice";

interface Extra {
  name: string;
  cost: number;
}

interface AddOns {
  roomExtras: Extra[];
}

export function Extras({ roomExtras }: AddOns) {
  const { extras, guests } = useAppSelector(
    (state: RootState) => state.newBooking
  );
  const dispatch: AppDispatch = useAppDispatch();

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-2">
        {roomExtras.map((extra) => (
          <Label
            key={extra.name}
            className="flex items-center space-x-3 space-y-0 rounded-lg   cursor-pointer "
          >
            <Checkbox
              value={extra.name}
              id={extra.name}
              checked={extras.some((e) => e.name === extra.name)}
              onCheckedChange={(checked) => {
                if (checked) {
                  dispatch(
                    addExtra({ name: extra.name, cost: extra.cost * guests })
                  );
                } else {
                  dispatch(removeExtra(extra.name));
                }
              }}
            />
            <div className="flex flex-1 justify-between items-center">
              <span className="font-medium text-card-foreground">
                {extra.name}
              </span>
              {/* use the currency symbol as per users preferred currency */}
              <span className="text-[15px] ">${extra.cost * guests}</span>
            </div>
          </Label>
        ))}
      </div>
    </div>
  );
}

{
  /* <Checkbox checked={field.value} onCheckedChange={field.onChange} />; */
}
