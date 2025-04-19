import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../ui/button";
import ThemeSwitcher from "../../ui/theme-switcher";
import { UserProfileDropdown } from "./user-profile-dropdown";
import { links } from "@/lib/navigation/main-nav";
import { auth } from "@clerk/nextjs/server";

const Navbar = async () => {
  const { userId } = await auth();
  return (
    <header className="flex items-center justify-between max-h-14 w-full px-4 border-[1px] border-border/90  sticky top-0 bg-background  z-10">
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
        {userId ? (
          <UserProfileDropdown />
        ) : (
          <>
            <Button variant="default" className="rounded-3xl" size="sm">
              <Link href={"/sign-in"}>Login</Link>
            </Button>
            <Button variant="outline" className="rounded-3xl" size="sm">
              <Link href={"/sign-up"}>SignUp</Link>
            </Button>
          </>
        )}

        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Navbar;
