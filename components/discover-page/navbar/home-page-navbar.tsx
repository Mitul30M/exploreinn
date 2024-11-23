import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { BookHeart, House, LibraryBig, Telescope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "../../ui/button";
import ThemeSwitcher from "../../ui/theme-switcher";
import { UserProfileDropdown } from "./user-profile-dropdown";
import { links } from "@/lib/navigation/main-nav";


const Navbar = () => {
  return (
    <header className="flex items-center justify-between max-h-14 w-full px-4 border-y-[1px] border-border/90 mt-1 sticky top-1 bg-background shadow-sm">
      {/* nav links */}
      <NavigationMenu className="flex flex-row justify-center items-center gap-4">
        <Link href={"/"} className="mr-4 flex items-center gap-1 font-semibold">
          <Image
            src={"/logos/logo-rose.svg"}
            alt="Exploreinn"
            height={34}
            width={34}
          />
          exploreinn
        </Link>

        <NavigationMenuList className="flex items-center gap-4 text-sm xl:gap-6">
          {links.map((link, idx) => (
            <Link href={link.href} key={idx}>
              <NavigationMenuItem className="flex *:hover:text-primary text-secondary-foreground justify-center items-center gap-1 ">
                <span className="mb-[0.5px]">{link.icon}</span>
                <p className="hover:text-foreground">{link.title}</p>
              </NavigationMenuItem>
            </Link>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* auth and theme */}
      <div className="flex flex-row justify-center items-center gap-1">
        <Button variant="default" className="rounded-3xl" size="sm">
          Login
        </Button>
        <Button variant="outline" className="rounded-3xl" size="sm">
          SignUp
        </Button>
        <UserProfileDropdown />
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Navbar;
