import Navbar from "@/components/discover-page/navbar/home-page-navbar";
import ReduxStoreProvider from "@/components/providers/redux-store-provider";
// import { EdgeStoreProvider } from "@/lib/edge-store/edge-store";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxStoreProvider>
      {/* <EdgeStoreProvider> */}
      <main className="min-h-screen bg-background border-border/90 border-x-[1px] max-w-7xl m-auto">
        <Navbar />
        {children}
      </main>
      {/* </EdgeStoreProvider> */}
    </ReduxStoreProvider>
  );
};

export default Layout;
