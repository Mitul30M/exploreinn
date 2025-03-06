"use client";

import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { removeManagerFromListing } from "@/lib/actions/listings/listings";
import { CheckSquare, Loader, Loader2, UserMinus2 } from "lucide-react";
import { useState } from "react";

export const RemoveManagerBtn = ({
  listingId,
  managerId,
}: {
  listingId: string;
  managerId: string;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await removeManagerFromListing(listingId, managerId);
    if (res.type === "error") {
      toast({
        title: `*An Error Occurred!`,
        description: res.message,
        action: (
          <ToastAction
            className="text-primary text-nowrap flex items-center gap-1 justify-center"
            altText="error"
          >
            <Loader2 className="size-4 text-primary" /> OK
          </ToastAction>
        ),
      });
    } else if (res.type === "success") {
      toast({
        title: `*Manager Removed!`,
        description: res.message,
        action: (
          <ToastAction
            className="text-primary text-nowrap flex items-center gap-1 justify-center"
            altText="error"
          >
            <CheckSquare className="size-4 text-primary" /> OK
          </ToastAction>
        ),
      });
    }
    setLoading(false);
  };

  return (
    <Button
      variant={"ghost"}
      disabled={loading}
      onClick={handleSubmit}
      className="self-end flex w-max! gap-2 items-center"
    >
      {!loading ? (
        <>
          <UserMinus2 className="w-4 h-4 text-primary" />
          Remove Manager
        </>
      ) : (
        <>
          <Loader className="w-4 h-4 text-primary animate-spin" />
          Removing Manager
        </>
      )}
    </Button>
  );
};
