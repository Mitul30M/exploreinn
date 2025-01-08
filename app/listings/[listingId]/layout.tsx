import Navbar from "@/components/discover-page/navbar/home-page-navbar";
import ReduxStoreProvider from "@/components/providers/redux-store-provider";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxStoreProvider>
      <main className="min-h-screen bg-background border-border/90 border-x-[1px] max-w-7xl m-auto">
        <Navbar />
        {children}
      </main>
    </ReduxStoreProvider>
  );
};

export default Layout;
