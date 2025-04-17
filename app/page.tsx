import Navbar from "@/components/discover-page/navbar/home-page-navbar";
import Link from "next/link";
import { UserButton, SignedIn } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background border-border/90 border-x-[1px] max-w-7xl m-auto">
      <Navbar />

      <h1 className="text-center mt-4">
        Home Page &apos;https://exploreinn.mitul30m.in/&apos;
      </h1>

      <div className="p-4 text-center flex flex-col items-center justify-center gap-4">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <Link
          href="/protected/server"
          className="text-primary hover:text-foreground"
        >
          /protected/server
        </Link>
        <Link
          href="/protected/client"
          className="text-primary hover:text-foreground"
        >
          /protected/client
        </Link>
        <Link href="/admin" className="text-primary hover:text-foreground">
          /admin
        </Link>
        <Link href="/discover" className="text-primary hover:text-foreground">
          /discover
        </Link>
        <Link
          href="/listings/new"
          className="text-primary hover:text-foreground"
        >
          /listings/new
        </Link>
      </div>
    </main>
  );
}
