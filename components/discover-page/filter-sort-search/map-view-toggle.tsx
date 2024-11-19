import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LayoutDashboard, Map } from "lucide-react";

export function MapViewToggle() {
  return (
    <div className="flex items-center space-x-2 border border-1 p-2 rounded-md mt-0">
      <Label htmlFor="map-view" className="flex items-center space-x-2">
        <LayoutDashboard size={18} /> <p>Card View</p>
      </Label>
      <Switch id="map-view" />
      <Label htmlFor="map-view" className="flex items-center space-x-2">
        <Map size={18} /> <p>Map View</p>
      </Label>
    </div>
  );
}
