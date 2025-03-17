"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";

const StickyThemeToggler = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    toast({
      title: "Theme Changed",
      description: `Theme set to ${newTheme} mode`,
    });
  };

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed right-6 top-24 z-50">
      <div className="bg-background rounded-full p-2 shadow-lg border border-border flex flex-col items-center gap-3">
        <Sun className={`h-5 w-5 ${theme === "light" ? "text-primary" : "text-muted-foreground"}`} />
        <div className="transform rotate-90">
          <Switch id="sticky-theme-toggle" checked={theme === "dark"} onCheckedChange={toggleTheme} className="my-1 data-[state=checked]:bg-primary" />
        </div>
        <Moon className={`h-5 w-5 ${theme === "dark" ? "text-primary" : "text-muted-foreground"}`} />
      </div>
    </div>
  );
};

export default StickyThemeToggler;
