'use client'
import React, { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";

const MainLayoutProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

export default MainLayoutProviders;
