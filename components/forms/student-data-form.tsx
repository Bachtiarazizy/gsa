"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function StudentProfileForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      const email = formData.get("email") as string;
      if (!email || !email.includes("@")) {
        setError("Please enter a valid email address");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter a valid email address",
        });
        return;
      }

      const studentData = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        university: formData.get("university"),
        major: formData.get("major"),
      };

      const response = await fetch("/api/student-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error("Failed to create student profile");
      }

      const profile = await response.json();

      toast({
        title: "Success",
        description: "Student profile created successfully",
      });

      router.push(`/dashboard`); // or wherever you want to redirect after success
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form action={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" required placeholder="Enter your first name" disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" required placeholder="Enter your last name" disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="Enter your email address" disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="university">University/Campus</Label>
          <Input id="university" name="university" required placeholder="Enter your university name" disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="major">Major</Label>
          <Input id="major" name="major" required placeholder="Enter your major" disabled={isLoading} />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Profile...
            </>
          ) : (
            "Create Profile"
          )}
        </Button>
      </form>
    </div>
  );
}
