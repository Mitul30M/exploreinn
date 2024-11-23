import { Cog, Contact, IdCard, MapPinHouse } from "lucide-react";

export default function ProfilePage() {
  return (
    <section className="w-full space-y-4 mb-8 p-4 border-border/90 border-y-[1px]">

      {/* Personal Info */}
      <div id="personal-info" className="space-y-4">
        <h1 className="text-lg rounded flex justify-start items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-[1px] border-border/90 text-foreground/90">
          <IdCard size={22} className="text-primary" />
          Personal Info
        </h1>

        <div className="min-h-[40vh] bg-accent/30 w-full p-4 rounded border-[1px] border-border/90"></div>
      </div>

      {/* Contact Info */}
      <div id="contact-info" className="space-y-4">
        <h1 className="text-lg rounded flex justify-start items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-[1px] border-border/90 text-foreground/90">
          <Contact size={22} className="text-primary" />
          Contact Info
        </h1>

        <div className="min-h-[40vh] bg-accent/30 w-full p-4 rounded border-[1px] border-border/90"></div>
      </div>

      {/* Residential Address */}
      <div id="residential-address" className="space-y-4">
        <h1 className="text-lg rounded flex justify-start items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-[1px] border-border/90 text-foreground/90">
          <MapPinHouse size={22} className="text-primary" />
          Residential Address
        </h1>

        <div className="min-h-[40vh] bg-accent/30 w-full p-4 rounded border-[1px] border-border/90"></div>
      </div>

      {/* Preferences */}
      <div id="preferences" className="space-y-4">
        <h1 className="text-lg rounded flex justify-start items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-[1px] border-border/90 text-foreground/90">
          <Cog size={22} className="text-primary" />
          Preferences
        </h1>

        <div className="min-h-[40vh] bg-accent/30 w-full p-4 rounded border-[1px] border-border/90"></div>
      </div>
    
    </section>
  );
}
