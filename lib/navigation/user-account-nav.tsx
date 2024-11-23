import {
  ArchiveX,
  AudioWaveform,
  BedDouble,
  BookHeart,
  BookOpen,
  Bot,
  CalendarCheck,
  CalendarClock,
  CalendarRange,
  CalendarX2,
  Cog,
  Coins,
  Command,
  ConciergeBell,
  Contact,
  Frame,
  GalleryVerticalEnd,
  Gift,
  HandCoins,
  Heart,
  HeartHandshake,
  Hotel,
  icons,
  IdCard,
  Inbox,
  Mail,
  Mails,
  Map,
  MapPinHouse,
  PieChart,
  Send,
  Settings2,
  ShieldCheck,
  SquareTerminal,
  SquareUser,
  TicketCheck,
  TicketsPlane,
  Trash2,
} from "lucide-react";

export const userAccountNavData = {
  user: {
    name: "Mitul Mungase",
    email: "mitul30m@icloud.com",
    avatar:
      "https://avatars.githubusercontent.com/u/120619177?s=400&u=d943ef3e7faacbfad1bdcb92d31e6946fee0a3af&v=4",
  },
  account: [
    {
      title: "Account",
      url: "/users/:userId",
      icon: SquareUser,
      isActive: true,
      items: [
        {
          title: "Personal Info",
          icon: IdCard,
          url: "/users/:userId/#personal-info",
        },
        {
          title: "Contact Info",
          icon: Contact,
          url: "/users/:userId/#contact-info",
        },
        {
          title: "Residential Address",
          icon: MapPinHouse,
          url: "/users/:userId/#residential-address",
        },
        {
          title: "Preferences",
          icon: Cog,
          url: "/users/:userId/#preferences",
        },
      ],
    },
    {
      title: "Wishlist",
      url: "/users/:userId/wishlist",
      icon: BookHeart,
      items: [
        {
          title: "Hotels",
          url: "/users/:userId/wishlist/#hotels",
          icon: Hotel,
        },
      ],
    },
    {
      title: "Bookings",
      url: "/users/:userId/bookings",
      icon: TicketsPlane,
      items: [
        {
          title: "Ongoing",
          icon: CalendarRange,
          url: "/users/:userId/bookings/#ongoing",
        },
        {
          title: "Upcoming",
          url: "/users/:userId/bookings/#upcoming",
          icon: CalendarClock,
        },
        {
          title: "Completed",
          url: "/users/:userId/bookings/#completed",
          icon: CalendarCheck,
        },
        {
          title: "Cancelled",
          url: "/users/:userId/bookings/#cancelled",
          icon: CalendarX2,
        },
      ],
    },
    {
      title: "Inbox",
      url: "/users/:userId/inbox",
      icon: Inbox,
      items: [
        {
          title: "Mails",
          url: "/users/:userId/inbox",
          icon: Inbox,
        },
        {
          title: "Sent",
          url: "/users/:userId/inbox/sent",
          icon: Send,
        },
        {
          title: "Archive",
          url: "/users/:userId/inbox/archive",
          icon: ArchiveX,
        },
      ],
    },
    {
      title: "Rewards",
      url: "/users/:userId/rewards",
      icon: Gift,
      items: [
        {
          title: "Redeem",
          url: "/users/:userId/rewards/#redeem",
          icon: TicketCheck,
        },
        {
          title: "Reward Points",
          url: "/users/:userId/rewards/#reward-points",
          icon: Coins,
        },
      ],
    },
    {
      title: "Listings",
      url: "/users/:userId/listings",
      icon: Hotel,
      items: [
        {
          title: "Hotel Owner",
          url: "/users/:userId/listings/#hotel-owner",
          icon: HandCoins,
        },
        {
          title: "Hotel Manager",
          url: "/users/:userId/listings/#hotel-manager",
          icon: ConciergeBell,
        },
      ],
    },
  ],
  security: [
    {
      title: "Account Security",
      url: "/users/:userId/security",
      icon: ShieldCheck,
      items: [
        {
          title: "Change Credentials",
          url: "/users/:userId/security",
          icon: IdCard,
        },
        {
          title: "Delete Account",
          url: "/users/:userId/security/#delete-account",
          icon: Trash2,
        },
      ],
    },
    {
      title: "Help & Support",
      url: "/support",
      icon: HeartHandshake,
      items: [
        {
          title: "Contact Support",
          url: "/support/#contact-support",
          icon: Inbox,
        },
      ],
    },
  ],
};
