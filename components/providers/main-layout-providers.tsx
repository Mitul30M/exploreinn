"use client";
import React, { ReactNode } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ReactQueryProvider from "./react-query-client-provider";
import { Toaster } from "@/components/ui/toaster";

const MainLayoutProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReactQueryProvider>
        {children}
        <Toaster />
      </ReactQueryProvider>
    </ThemeProvider>
  );
};

export default MainLayoutProviders;
