import {
  Cog,
  Contact,
  SquareUser,
  MapPinHouse,
  Mail,
  Phone,
  IdCard,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import PersonalInfo from "@/components/user-page/info/personal-info";
import { Button } from "@/components/ui/button";
import ResidentialInfo from "@/components/user-page/info/residential-info";
import { EditPersonalInfoModal } from "@/components/user-page/info/edit-modals/edit-personal-info";
import { EditResidentialInfoModal } from "@/components/user-page/info/edit-modals/edit-residential-info";
import { currentUser } from "@clerk/nextjs/server";

export default async function ProfilePage() {
  // instead of using currentUser(), just obtain the user's id from the url and find the user in the database and then pass it to the component & revalidate the path whenever any server action changes the user's data
  const user = await currentUser();

  return (
    <section className="w-full space-y-4 pb-4 border-border/90 border-y-[1px]">
      <h1 className="text-md rounded-none flex justify-start items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-b-[1px] border-border/90 text-foreground/90">
        <SquareUser size={22} className="text-primary" />
        {user?.firstName}'s Account
      </h1>

      <div className="p-4 flex gap-6 h-max border-border/90 border m-4 rounded-md">
        {/* profile card */}
        <div className="flex flex-col gap-4 max-w-[300px]">
          <Avatar className="w-24 h-24 border-2 border-accent">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>{`${user?.firstName?.[0]?.toUpperCase()}${user?.lastName?.[0]?.toUpperCase()}`}</AvatarFallback>
          </Avatar>

          <div className="">
            {/* name */}
            <h4 className="scroll-m-20 text-md font-semibold tracking-tight">
              {user?.firstName} {user?.lastName}, 20
            </h4>
            <Separator className="my-4" />
            {/* email */}
            <p className="text-sm flex items-center gap-1">
              <Mail size={14} />
              {user?.emailAddresses[0]?.emailAddress}
            </p>
            {/* phone */}
            <p className="text-sm flex items-center gap-1">
              <Phone size={14} />
              {user?.phoneNumbers[0]?.phoneNumber}
            </p>
            <Separator className="my-2" />
            <p className="text-sm flex items-center gap-1 text-foreground/75 mb-6">
              Loves to travel, explore new places, and meet new people ❤️🤗. I
              am a Full Stack Developer 👨🏽‍💻 from Mumbai, India.
            </p>
            <Separator className="my-4" />
            <div className="flex justify-start items-start gap-2">
              <EditPersonalInfoModal className="rounded-full" size="sm" />
              <EditResidentialInfoModal className="rounded-full" size="sm" />
            </div>
          </div>
        </div>
        <Separator
          orientation="vertical"
          className="!h-full border-t-[1px] border-border/90"
        />

        {/* info card */}
        <div className="flex flex-1 flex-col gap-8 p-4 border border-border/90 text-foreground/90 rounded-md">
          {/* personal info */}
          <div className="flex flex-col gap-2">
            <h4 className="scroll-m-20 text-md font-semibold tracking-tight flex items-center gap-2">
              <IdCard size={18} className="text-primary" /> Personal Info
            </h4>
            <Separator className="mb-4" />
            {/* accepts the user data as a prop */}
            <PersonalInfo />
          </div>

          {/* residential info */}
          <div className="flex flex-col gap-2 mt-4">
            <h4 className="scroll-m-20 text-md font-semibold tracking-tight flex items-center gap-2">
              <MapPinHouse size={18} className="text-primary" /> Residential
              Info
            </h4>
            <Separator className="mb-4" />
            {/* accepts the user's residential data as a prop */}
            <ResidentialInfo />
          </div>
        </div>
      </div>
    </section>
  );
}
