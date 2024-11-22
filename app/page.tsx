import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/discover-page/navbar/home-page-navbar";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background border-border/90 border-x-[1px] max-w-7xl m-auto">
      <Navbar />

      <h1 className="text-center mt-4">
        Home Page 'https://exploreinn.mitul30m.in/'
      </h1>

      <div className="p-4 text-center flex flex-col items-center justify-center gap-4">
        <Link href="/discover" className="text-primary hover:text-foreground">
          /discover
        </Link>
        <Link
          href="/users/:userID"
          className="text-primary hover:text-foreground"
        >
          /users/:userID
        </Link>
      </div>
    </main>
  );
}
