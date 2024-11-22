import {
  Wifi,
  BedDouble,
  UtensilsCrossed,
  Wind,
  ConciergeBell,
  BellElectric,
  AlarmSmoke,
  Cctv,
  CreditCard,
  FireExtinguisher,
  ArrowUp10,
  Accessibility,
  Dog,
  Projector,
  Presentation,
  Handshake,
  ShoppingBag,
  Binoculars,
  Globe,
  Wallet,
  Euro,
  Car,
  CarTaxiFront,
  Dices,
  AirVent,
  Waves,
  HandPlatter,
  DoorOpen,
  Bath,
  CircleParking,
  Dumbbell,
  Sparkles,
  WashingMachine,
  FerrisWheel,
  Microwave,
  Refrigerator,
  TvMinimal,
  Luggage,
  Cigarette,
  Beer,
  BatteryCharging,
  Vault,
} from "lucide-react";

export interface HotelAmenities {
  isAvailable: boolean;
  name: string;
  icon: JSX.Element; // Using JSX.Element for better type safety
}


export const hotelAmenities: HotelAmenities[] = [
  {
    name: "WiFi",
    isAvailable: true, // Replace with true/false based on hotel availability
    icon: <Wifi />,
  },
  {
    name: "King-Size Bed",
    isAvailable: true, 
    icon: <BedDouble />,
  },
  {
    name: "Restaurant",
    isAvailable: true, 
    icon: <UtensilsCrossed />,
  },
  {
    name: "24/7 Room Service",
    isAvailable: true, 
    icon: <ConciergeBell />,
  },
  {
    name: "Air Conditioning",
    isAvailable: true, 
    icon: <AirVent />,
  },
  {
    name: "Swimming Pool",
    isAvailable: true, 
    icon: <Waves />,
  },
  {
    name: "Local Dining",
    isAvailable: true, 
    icon: <HandPlatter />,
  },
  {
    name: "Housekeeping",
    isAvailable: true, 
    icon: <DoorOpen />,
  },
  {
    name: "Bath/Shower",
    isAvailable: true, 
    icon: <Bath />,
  },
  {
    name: "Free Parking",
    isAvailable: true, 
    icon: <CircleParking />,
  },
  {
    name: "Gym",
    isAvailable: true, 
    icon: <Dumbbell />,
  },
  {
    name: "Spa",
    isAvailable: true, 
    icon: <Sparkles />,
  },
  {
    name: "Laundry Service",
    isAvailable: true, 
    icon: <WashingMachine />,
  },
  {
    name: "Play Area",
    isAvailable: true,
    icon: <FerrisWheel />,
  },
  {
    name: "Microwave",
    isAvailable: true, 
    icon: <Microwave />,
  },
  {
    name: "Refrigerator",
    isAvailable: true, 
    icon: <Refrigerator />,
  },
  {
    name: "TV",
    isAvailable: true,
    icon: <TvMinimal />,
  },
  {
    name: "Hair Dryer",
    isAvailable: true, 
    icon: <Wind />,
  },
  {
    name: "Baggage Storage",
    isAvailable: true, 
    icon: <Luggage />,
  },
  {
    name: "Smoking Allowed",
    isAvailable: true,
    icon: <Cigarette />,
  },
  {
    name: "Bar",
    isAvailable: true,
    icon: <Beer />,
  },
  {
    name: "Power Backup",
    isAvailable: true,
    icon: <BatteryCharging />,
  },
  {
    name: "Safe Locker",
    isAvailable: true,
    icon: <Vault />,
  },
  {
    name: "24/7 Help Desk",
    isAvailable: true,
    icon: <ConciergeBell />,
  },
  {
    name: "Security Alarm",
    isAvailable: true,
    icon: <BellElectric />,
  },
  {
    name: "Smoke Detector",
    isAvailable: true,
    icon: <AlarmSmoke />,
  },
  {
    name: "CCTV Camera",
    isAvailable: true,
    icon: <Cctv />,
  },
  {
    name: "Key Card Access",
    isAvailable: true,
    icon: <CreditCard />,
  },
  {
    name: "Fire Extinguisher",
    isAvailable: true,
    icon: <FireExtinguisher />,
  },
  {
    name: "Elevator",
    isAvailable: true,
    icon: <ArrowUp10 />,
  },
  {
    name: "Wheelchair Accessible",
    isAvailable: true,
    icon: <Accessibility />,
  },
  {
    name: "Pet Friendly",
    isAvailable: true,
    icon: <Dog />,
  },
  {
    name: "Conference Room",
    isAvailable: true,
    icon: <Projector />,
  },
  {
    name: "Meeting Room",
    isAvailable: true,
    icon: <Presentation />,
  },
  {
    name: "Business Center",
    isAvailable: true,
    icon: <Handshake />,
  },
  {
    name: "Shopping Mall",
    isAvailable: true,
    icon: <ShoppingBag />,
  },
  {
    name: "Concierge Service",
    isAvailable: true,
    icon: <ConciergeBell />,
  },
  {
    name: "Tour Assistance",
    isAvailable: true,
    icon: <Binoculars />,
  },
  {
    name: "Multi Linguage Staff",
    isAvailable: true,
    icon: <Globe />,
  },
  {
    name: "ATM",
    isAvailable: true,
    icon: <Wallet />,
  },
  {
    name: "Currency Exchange",
    isAvailable: true,
    icon: <Euro />,
  },
  {
    name: "Car Rental",
    isAvailable: true,
    icon: <Car />,
  },
  {
    name: "Airport Shuttle",
    isAvailable: true,
    icon: <CarTaxiFront />,
  },
  {
    name: "In-house Casino",
    isAvailable: true,
    icon: <Dices />,
  },
];

