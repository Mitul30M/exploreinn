import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, Save, Undo2 } from "lucide-react";

export function FilterSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Filter />
          Filter
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="space-y-2">
          <SheetTitle className="flex items-center flex-row gap-3 mb-2">
            <Filter />
            Filter Hotels
          </SheetTitle>
          <SheetDescription>
            Find yourself a perfect hotel as per your likings!
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        <SheetFooter className="flex flex-row items-center">
          <Button variant="outline" className="w-max">
            <Undo2 />
            Revert
          </Button>
          <Button type="submit">
            <Save />
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
