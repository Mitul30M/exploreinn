import { BookHeart, House, LibraryBig, Telescope } from "lucide-react";
import { ReactNode } from "react";

export const links: {
  title: string;
  href: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    title: "Home",
    href: "#",
    icon: <House size={18} />,
    description: "Exploreinn Home Page",
  },
  {
    title: "Discover",
    href: "#",
    icon: <Telescope size={18} />,
    description: "Exploreinn Discover Page",
  },
  {
    title: "Community",
    href: "#",
    icon: <BookHeart size={18} />,
    description: "Exploreinn Community Page",
  },
  {
    title: "About",
    href: "#",
    icon: <LibraryBig size={18} />,
    description: "Exploreinn About Page",
  },
];
