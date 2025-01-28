"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  isPublished: boolean;
  categoryId: string;
}

interface EditCourseFormProps {
  initialData: Course;
  categories: Category[];
}

type ApiResponse = {
  message?: string;
  errors?: { message: string }[];
};

export default function EditCourseForm({ initialData, categories }: EditCourseFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(initialData.imageUrl);
  const [categoryId, setCategoryId] = useState<string>(initialData.categoryId);
  const router = useRouter();

  async function updateCourse(formData: FormData, togglePublish?: boolean) {
    try {
      setIsLoading(true);
      setError(null);

      if (togglePublish !== undefined) {
        formData.append("isPublished", togglePublish.toString());
      }

      if (imageUrl) {
        formData.set("imageUrl", imageUrl);
      }

      formData.set("categoryId", categoryId);

      const response = await fetch(`/api/courses/${initialData.id}`, {
        method: "PATCH",
        body: formData,
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          const errorMessage = data.errors ? data.errors.map((e) => e.message).join(", ") : data.message;
          throw new Error(errorMessage || "Validation failed");
        }
        throw new Error(data.message || "Failed to update course");
      }

      toast({
        title: "Success",
        description: togglePublish !== undefined ? `Course ${togglePublish ? "published" : "unpublished"} successfully` : "Course updated successfully",
      });

      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update course";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      console.error("Form submission error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(formData: FormData) {
    await updateCourse(formData);
  }

  async function onPublish() {
    await updateCourse(new FormData(), true);
  }

  async function onUnpublish() {
    await updateCourse(new FormData(), false);
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-100">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm">
              Course status: <span className="font-medium">{initialData.isPublished ? "Published" : "Draft"}</span>
            </p>
            <Button onClick={initialData.isPublished ? onUnpublish : onPublish} variant={initialData.isPublished ? "outline" : "default"} disabled={isLoading}>
              {initialData.isPublished ? "Unpublish" : "Publish"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <form action={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Course Title</Label>
          <Input id="title" name="title" defaultValue={initialData.title} required disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name="categoryId" value={categoryId} onValueChange={setCategoryId} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" defaultValue={initialData.description || ""} disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label>Course Image</Label>
          <div className="flex flex-col gap-4">
            {imageUrl ? (
              <>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image src={imageUrl} alt="Course thumbnail" fill className="object-cover" />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setImageUrl(null)} disabled={isLoading}>
                  Change Image
                </Button>
              </>
            ) : (
              <UploadDropzone
                endpoint="courseImage"
                onClientUploadComplete={(res) => {
                  setImageUrl(res?.[0]?.url);
                }}
                onUploadError={(error: Error) => {
                  setError(error.message);
                }}
                appearance={{
                  container: "border-dashed",
                  label: "Drag and drop an image or click to browse",
                }}
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" min="0" step="0.01" defaultValue={initialData.price} disabled={isLoading} />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={isLoading || !categoryId}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  );
}
