"use client";
import { Button } from "@/components/ui/button";
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
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { addManagerToListing } from "@/lib/actions/listings/listings";
import {
  CheckSquare,
  Loader,
  Loader2,
  PlusCircle,
  UserPlus,
} from "lucide-react";
import { useState } from "react";

export const AddManager = ({ listingId }: { listingId: string }) => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async () => {
    console.log("email", email);
    setLoading(true);
    const res = await addManagerToListing(listingId, email);
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
        title: `*Manager Added!`,
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
    setEmail("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full rounded-md border-border/90 border-[1px] p-4   h-max flex flex-col gap-4 justify-center items-center"
        >
          <UserPlus size={60} className="text-primary w-[60px] h-[60px]" />

          <span className="text-md  text-center font-semibold tracking-tight text-primary">
            Add New Manager
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Manager</DialogTitle>
          <DialogDescription>
            Enter the email address of the user you would like to invite.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="email" className="sr-only">
              Email address
            </Label>
            <Input id="email" onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            className="flex items-center gap-2 w-max self-end"
            disabled={loading}
            onClick={handleSubmit}
          >
            {!loading ? (
              <>
                <PlusCircle className="h-4 w-4" /> Add Manager
              </>
            ) : (
              <>
                <Loader className="h-4 w-4 animate-spin" /> Adding Manager
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
