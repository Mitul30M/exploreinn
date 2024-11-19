import FindListingsInput from "@/components/discover-page/find-listings/find-listing";
import Navbar from "@/components/discover-page/navbar/home-page-navbar";

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-background border-border/90 border-x-[1px] max-w-7xl m-auto">
      <Navbar />
      <FindListingsInput />
    </main>
  );
}
