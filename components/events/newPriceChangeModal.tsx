"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  BadgeDollarSignIcon,
  CalendarIcon,
  ChartSpline,
  Save,
} from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { addMonths, format, formatDate } from "date-fns";
import { Calendar } from "../ui/calendar";
import { DateRange } from "react-day-picker";
const formSchema = z.object({
  data: z.array(
    z.object({
      roomId: z.string(),
      newPrice: z.number().min(0),
      roomName: z.string(),
    })
  ),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  listingId: z.string(),
  authorId: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;
interface NewPriceChangeEventModalProps {
  roomInfo: { roomId: string; roomName: string; roomBasePrice: number }[];
  listingId: string;
  authorId: string;
}
export function NewPriceChangeEventModal({
  authorId,
  roomInfo,
  listingId,
}: NewPriceChangeEventModalProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: roomInfo.map((room) => ({
        roomId: room.roomId,
        roomName: room.roomName,
        newPrice: room.roomBasePrice,
      })),
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
      listingId,
      authorId,
    },
  });

  const onSubmit = async (data: FormSchema): Promise<void> => {
    console.log(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={"sm"}
          className="flex items-center gap-2"
        >
          <BadgeDollarSignIcon className="text-primary" />
          New Price Change
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 mb-2">
            <BadgeDollarSignIcon className="text-primary" />
            New Price Change Event
          </DialogTitle>
          <DialogDescription>
            Create a new Price Change event on a specific date for your listing.
            Provide the price for each room. This will set the price of your
            listing rooms on the specified date.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full gap-4 mt-4"
          >
            <FormField
              control={form.control}
              name={`dateRange`}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date Range</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {formatDate(field.value.from, "PPP")} -{" "}
                                {formatDate(field.value.to, "PPP")}
                              </>
                            ) : (
                              formatDate(field.value.from, "PPP")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date > addMonths(new Date(), 3)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {roomInfo.map((room, index) => (
              <FormField
                key={room.roomId}
                control={form.control}
                name={`data.${index}.newPrice`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{room.roomName} (in $)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit" size="sm" className=" self-end w-max">
              <Save /> Create Event
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
