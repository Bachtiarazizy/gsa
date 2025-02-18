"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun, UserPlus, UserCog, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const SettingPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  interface ProfileData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    university: string;
  }

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch student profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/studentProfiles", {
          method: "GET",
        });

        if (response.status === 200) {
          const data = await response.json();
          setProfileData(data);
        } else if (response.status !== 404) {
          // 404 means profile doesn't exist, which is fine
          throw new Error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your profile data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  // Toggle theme function (just for UI, not actually changing theme yet)
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    toast({
      title: "Theme Changed",
      description: `Theme set to ${newTheme} mode`,
    });
    // Here you would typically update the theme in localStorage or context
  };

  // Navigate to profile creation or edit page
  const handleProfileAction = () => {
    if (profileData) {
      router.push(`/student/settings/studentProfiles/${profileData.id}/edit`);
    } else {
      router.push("/student/settings/studentProfiles/create");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex-1 space-y-6 p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Theme Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the application looks on your device.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="theme-mode" className="font-medium">
                Dark Mode
              </Label>
              <span className="text-sm text-muted-foreground">{theme === "dark" ? "Currently using dark theme" : "Switch to dark theme"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch id="theme-mode" checked={theme === "dark"} onCheckedChange={toggleTheme} />
              <Moon className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Student Profile</CardTitle>
          <CardDescription>Manage your student profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <div>
                {profileData ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Profile: {profileData.firstName} {profileData.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">Email: {profileData.email}</p>
                    <p className="text-sm text-muted-foreground">University: {profileData.university}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">You haven&apos;t created a student profile yet.</p>
                )}
              </div>
              <Button onClick={handleProfileAction} variant="outline" className="flex items-center">
                {profileData ? (
                  <>
                    <UserCog className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Profile
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingPage;
