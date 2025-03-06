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
        <Link href="/discover" className="text-primary hover:text-foreground">
          /discover
        </Link>
        {/* <Link
          href="/listings/67adfe9a1ba2f00891c216c8/overview"
          className="text-primary hover:text-foreground"
        >
          /listings/:listingId/overview
        </Link> */}
        <Link
          href="/listings/new"
          className="text-primary hover:text-foreground"
        >
          /listings/new
        </Link>

        <p className="text-center text-primary p-4 w-max border-border/90 border-[1px] rounded">
          &apos;exploreinn&apos; is a platform that allows users to book
          listings seamlessly whilst providing a smooth and hassle-free
          experience to both the listing and the guests. This Web App is built
          by Mitul Mungase from Mumbai, India.
        </p>
      </div>
    </main>
  );
}
