import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebars/user-page-sidebar/user-dashboard-app-sidebar";
import Navbar from "@/components/discover-page/navbar/home-page-navbar";
import { currentUser } from "@clerk/nextjs/server";
import { getUser } from "@/lib/actions/user/user";
import { notFound } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkUser = await currentUser();
  const userDbID = (clerkUser?.publicMetadata as PublicMetadataType).userDB_id;
  if (!userDbID || !clerkUser) {
    return notFound();
  }
  const user = await getUser(userDbID);
  if (!user) {
    return notFound();
  }
  return (
    <SidebarProvider className="m-auto max-w-7xl relative">
      <AppSidebar
        collapsible="offcanvas"
        className="border-r-[1px] mt-1 border-t-[1px] border-border/90 z-20 shadow-sm shadow-foreground/5 "
      />
      <main className="min-h-screen bg-background border-border/90 border-x-[1px] absolute top-0 left-0 w-full shrink-0">
        <Navbar />
        <SidebarTrigger className="mx-4 my-2" />
        {children}
      </main>
    </SidebarProvider>
  );
}
