"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteEvent } from "../../../lib/actions/room-events/room-events";

interface DeleteEventProps {
  eventId: string;
}

export function DeleteEventForm({ eventId }: DeleteEventProps) {
  const [isPending, startTransition] = useTransition();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await deleteEvent(eventId);
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <Button
        type="submit"
        variant="outline"
        className="flex w-max gap-1 items-center text-primary"
        size="sm"
        disabled={isPending}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </form>
  );
}
