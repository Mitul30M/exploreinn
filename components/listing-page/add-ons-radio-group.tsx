"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Label } from "../ui/label";
import { convertCurrency } from "@/lib/utils/currency/currency-convertor";

interface Extra {
  name: string;
  cost: number;
}

interface AddOnsRadioGroupProps {
  extras: Extra[];
}

export function AddOnsRadioGroup({ extras }: AddOnsRadioGroupProps) {
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    const selected = extras.find((extra) => extra.name === value);
  };

  return (
    <div className="w-full">
      <RadioGroup
        onValueChange={handleValueChange}
        value={selectedValue}
        className="flex flex-col space-y-2"
      >
        {extras.map((extra) => (
          <Label
            key={extra.name}
            className="flex items-center space-x-3 space-y-0 rounded-lg   cursor-pointer "
          >
            <RadioGroupItem value={extra.name} id={extra.name} />
            <div className="flex flex-1 justify-between items-center">
              <span className="font-medium text-card-foreground">
                {extra.name}
              </span>
              {/* use the currency symbol as per users preferred currency */}
              <span className="text-[15px] ">${extra.cost}</span>
            </div>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}
