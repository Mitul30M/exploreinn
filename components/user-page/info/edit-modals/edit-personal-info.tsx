// import { EditPersonalInfoForm } from "@/components/forms/user-page/edit-personal-info-form";
import EditPersonalInfoForm from "@/components/forms/user-page/edit-personal-info-form";
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
import { Separator } from "@/components/ui/separator";
import { PenTool } from "lucide-react";

export function EditPersonalInfoModal({ ...props }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" {...props}>
          Edit Personal Info
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 mb-2">
            {" "}
            <PenTool size={20} className="text-primary"/>
            Edit Personal Info
          </DialogTitle>
          <DialogDescription>
            Make changes to your personal information here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-2" />
        <EditPersonalInfoForm />
      </DialogContent>
    </Dialog>
  );
}
