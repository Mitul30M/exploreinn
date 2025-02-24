"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BadgeDollarSignIcon, CalendarIcon, Save } from "lucide-react";
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
import { startTransition, useState } from "react";
import { createPriceChangeEvent } from "@/lib/actions/room-events/room-events";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const onSubmit = async (formData: FormSchema): Promise<void> => {
    console.log(formData);
    setIsLoading(true);
    startTransition(async () => {
      console.log("Creating High Demand Event");
      const isEventCreated = await createPriceChangeEvent({
        data: formData.data.map((room) => ({
          roomId: room.roomId,
          newPrice: room.newPrice,
          roomName: room.roomName,
        })),
        authorId,
        startDate: new Date(formData.dateRange.from.toISOString()),
        endDate: new Date(formData.dateRange.to.toISOString()),
        listingId,
      });
      if (isEventCreated) {
        toast({
          title: `*Price Change Event Created Successfully!`,
          description: "Your Price Change Event has been created.",
          action: (
            <ToastAction
              className="text-primary text-nowrap flex items-center gap-1 justify-center"
              altText="success"
            >
              <Save className="size-4 text-primary" /> Ok
            </ToastAction>
          ),
        });
      } else {
        toast({
          title: `*Error while Enlisting New Price Change Event!`,
          description: "Something went wrong! Please Try Again.",
          action: (
            <ToastAction
              className="text-primary text-nowrap flex items-center gap-1 justify-center"
              altText="error"
            >
              <Save className="size-4 text-primary" /> Try Again
            </ToastAction>
          ),
        });
      }
    });
    setIsLoading(false);
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
                    <div className="flex items-center gap-2">
                      <FormLabel>{room.roomName} (Price in USD $)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="submit"
              size="sm"
              className={" self-end w-max"}
              disabled={isLoading}
            >
              <Save className={isLoading ? "animate-spin" : ""} />
              {isLoading ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
