"use client";

import { Heart, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  addListingToWishlist,
  removeListingFromWishlist,
} from "@/lib/actions/user/user";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { useState, useCallback } from "react";

export function WishlistBtn({
  listingId,
  userId,
  isWishlisted = false,
}: {
  listingId: string;
  userId: string;
  isWishlisted?: boolean;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleWishlist = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = isWishlisted
        ? await removeListingFromWishlist(listingId, userId)
        : await addListingToWishlist(listingId, userId);

      toast({
        title:
          response.type === "success"
            ? isWishlisted
              ? "Listing removed from wishlist"
              : "Listing added to wishlist!"
            : "Error",
        description: response.message,
        action: (
          <ToastAction
            className="text-primary text-nowrap flex items-center gap-1 justify-center"
            altText="success"
          >
            <Save className="size-4 text-primary" /> Ok
          </ToastAction>
        ),
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        action: (
          <ToastAction
            className="text-primary text-nowrap flex items-center gap-1 justify-center"
            altText="error"
          >
            <Save className="size-4 text-primary" /> Ok
          </ToastAction>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  }, [listingId, userId, isWishlisted]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size={"icon"}
          className="w-8 h-8 rounded-full text-primary"
          onClick={handleWishlist}
          disabled={isLoading}
        >
          <Heart
            strokeWidth={2.5}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
