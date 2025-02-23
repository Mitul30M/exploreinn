"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  CalendarOff,
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
import { addMonths, formatDate } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
const formSchema = z.object({
  data: z.array(z.string()),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  listingId: z.string(),
  authorId: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;
interface BookingEventModalProps {
  roomInfo: { roomId: string; roomName: string }[];
  listingId: string;
  authorId: string;
}
export function BookingClosedEventModal({
  authorId,
  roomInfo,
  listingId,
}: BookingEventModalProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: roomInfo.map((room) => room.roomId),
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
          <CalendarOff className="text-primary" />
          Booking Closed
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 mb-2">
            <CalendarOff className="text-primary" />
            New booking Closed Event
          </DialogTitle>
          <DialogDescription>
            Create a new Booking Closed event on a specific date for your
            listing. The bookings for selected rooms will be closed for the
            selected date range.
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

            <div className="space-y-3">
              <p className="font-medium text-[14px]">
                Select Rooms for which Bookings to be closed
              </p>
              {roomInfo.map((room) => (
                <FormField
                  key={room.roomId}
                  control={form.control}
                  name="data"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={room.roomId}
                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(room.roomId)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, room.roomId])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== room.roomId
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {room.roomName}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <Button type="submit" size="sm" className=" self-end w-max">
              <Save /> Create Event
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
