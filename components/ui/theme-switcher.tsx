"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Computer } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure the component is only rendered on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center gap-4 scale-90">
      <div className="bg-card rounded-full p-[2px] border-[1px] border-border/75">
        <div className="flex items-center">
          <ThemeButton
            theme="system"
            icon={<Computer className="w-1 h-1" />}
            isActive={resolvedTheme === "system"}
            onClick={() => setTheme("system")}
          />
          <ThemeButton
            theme="light"
            icon={<Sun className="w-1 h-1" />}
            isActive={resolvedTheme === "light"}
            onClick={() => setTheme("light")}
          />
          <ThemeButton
            theme="dark"
            icon={<Moon className="w-1 h-1" />}
            isActive={resolvedTheme === "dark"}
            onClick={() => setTheme("dark")}
          />
        </div>
      </div>
    </div>
  );
}

function ThemeButton({
  theme,
  icon,
  isActive,
  onClick,
}: {
  theme: "system" | "light" | "dark";
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`rounded-full px-[10px] transition-colors ${
        isActive ? "bg-secondary/90 text-primary" : "hover:bg-muted border-0"
      }`}
      onClick={onClick}
      aria-label={`Switch to ${theme} theme`}
    >
      {icon}
    </Button>
  );
}
