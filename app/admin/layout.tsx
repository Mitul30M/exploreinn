import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getUser } from "@/lib/actions/user/user";
import { isAdmin } from "@/lib/actions/user/admin/admin";
import { AppAdminSidebar } from "@/components/sidebars/admin-dashboard-sidebar/admin-dashboard-app-sidebar";
import Navbar from "@/components/discover-page/navbar/home-page-navbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const clerkUser = await currentUser();
  const userDbID = (clerkUser?.publicMetadata as PublicMetadataType).userDB_id;
  const user = await getUser(userDbID);
  if (!user || !userDbID || !clerkUser) {
    return notFound();
  }
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    return notFound();
  }
  console.log("Admin Dashboard access for user with ID: ", user.id);

  return (
    <SidebarProvider className="m-auto max-w-7xl relative">
      <AppAdminSidebar
        collapsible="offcanvas"
        className="border-r-[1px] mt-1 border-t-[1px] border-border/90 z-20 shadow-sm shadow-foreground/5 "
      />
      <main className="min-h-screen bg-background border-border/90 border-x-[1px] absolute top-0 left-0 w-full shrink-0">
        <Navbar />
        <p className="font-semibold text-sm py-[2px] text-white text-center bg-primary w-full">
          Admin Access
        </p>

        <SidebarTrigger className="mx-4 my-2" />
        {children}
      </main>
    </SidebarProvider>
  );
}
