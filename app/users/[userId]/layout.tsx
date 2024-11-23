import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/discover-page/navbar/home-page-navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="mt-4 m-auto max-w-7xl relative">
      <AppSidebar
        collapsible="icon"
        className="border-r-[1px] mt-1 border-t-[1px] border-border/90 z-20 shadow-lg shadow-foreground/5 "
      />
      <main className="min-h-screen bg-background border-border/90 border-x-[1px] absolute top-0 left-0 w-full shrink-0">
        <Navbar />
        <SidebarTrigger className="mx-4 my-1 " />
        {children}
      </main>
    </SidebarProvider>
  );
}

