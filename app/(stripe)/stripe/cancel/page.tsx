import Navbar from "@/components/discover-page/navbar/home-page-navbar";
import { HeartCrack } from "lucide-react";

const CancelPage = () => {
  return (
    <main className="min-h-screen bg-background border-border/90 border-x-[1px] max-w-7xl m-auto">
      <Navbar />

      <h1 className=" mt-20 font-semibold text-primary w-max mx-auto text-center flex items-center gap-2">
        <HeartCrack />
        Payment Unsuccessful!
      </h1>
    </main>
  );
};

export default CancelPage;
