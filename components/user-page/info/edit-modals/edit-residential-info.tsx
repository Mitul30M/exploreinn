// import { EditPersonalInfoForm } from "@/components/forms/user-page/edit-personal-info-form";
import EditPersonalInfoForm from "@/components/forms/user-page/edit-personal-info-form";
import EditResidentialInfoForm from "@/components/forms/user-page/edit-residential-info-form";
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
import { Separator } from "@/components/ui/separator";
import { PenTool } from "lucide-react";

export function EditResidentialInfoModal({ ...props }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" {...props}>
          Edit Residential Info
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 mb-2">
            {" "}
            <PenTool size={20} className="text-primary" />
            Edit Residential Info
          </DialogTitle>
          <DialogDescription>
            Make changes to your residential information here. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-2" />
        <EditResidentialInfoForm />
      </DialogContent>
    </Dialog>
  );
}
