"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadDropzone } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { CreateCourseInput } from "@/lib/zod-schema/zodSchema";
import { Editor } from "@/app/(dashboard)/admin/courses/_components/editor";

interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateCourseFormProps {
  categories: Category[];
}

export default function CreateCourseForm({ categories }: CreateCourseFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryId, setCategoryId] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [attachmentOriginalName, setAttachmentOriginalName] = useState<string | null>(null);
  const [duration, setDuration] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  async function onSubmit(formData: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      if (!imageUrl) {
        setError("Course image is required");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Course image is required",
        });
        return;
      }

      if (!categoryId) {
        setError("Category is required");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Category is required",
        });
        return;
      }

      const price = formData.get("price");
      if (price === null || price === "") {
        setError("Price is required");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Price is required",
        });
        return;
      }

      const numericPrice = Number(price);
      if (isNaN(numericPrice) || numericPrice < 0) {
        setError("Please enter a valid price");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter a valid price",
        });
        return;
      }

      const courseData: Partial<CreateCourseInput> = {
        title: formData.get("title") as string,
        description: description || null,
        duration: duration || null,
        price: numericPrice,
        categoryId,
        imageUrl,
        attachmentUrl: attachmentUrl || null,
        attachmentOriginalName: attachmentOriginalName || null,
        isPublished: false,
      };

      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error("Failed to create course");
      }

      const course = await response.json();

      toast({
        title: "Success",
        description: "Course created successfully",
      });

      router.push(`/admin/courses/${course.id}`);
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
          <Label htmlFor="title">Course Title</Label>
          <Input id="title" name="title" required placeholder="Enter course title" disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          {/* Using the TipTap Editor component */}
          <div className="min-h-[200px]">
            <Editor value={description} onChange={setDescription} placeholder="Enter a detailed course description..." />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 2 weeks, 10 hours" disabled={isLoading} />
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
                  if (res?.[0]) {
                    setImageUrl(res[0].url);
                  }
                }}
                onUploadError={(error: Error) => {
                  setError(error.message);
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Error uploading image",
                  });
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
          <Label>Course Attachment</Label>
          <div className="space-y-4">
            {attachmentUrl ? (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{attachmentOriginalName || "Attachment uploaded"}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAttachmentUrl(null);
                    setAttachmentOriginalName(null);
                  }}
                  disabled={isLoading}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <UploadDropzone
                endpoint="attachment"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    setAttachmentUrl(res[0].url);
                    setAttachmentOriginalName(res[0].name);
                    toast({
                      title: "Success",
                      description: "Attachment uploaded successfully",
                    });
                  }
                }}
                onUploadError={() => {
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Error uploading attachment",
                  });
                }}
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" min="0" step="0.01" placeholder="Enter course price" disabled={isLoading} required className="appearance-none" />
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
              Creating Course...
            </>
          ) : (
            "Create Course"
          )}
        </Button>
      </form>
    </div>
  );
}
