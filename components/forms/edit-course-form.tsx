"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, FileText, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadDropzone } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  categoryId: string;
  attachments: Array<{
    url: string;
    name: string;
  }>;
}

interface EditCourseFormProps {
  course: Course;
  categories: Category[];
}

interface Attachment {
  url: string;
  name: string;
}

export default function EditCourseForm({ course, categories }: EditCourseFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>(course.attachments);
  const [categoryId, setCategoryId] = useState<string>(course.categoryId);
  const [imageUrl, setImageUrl] = useState<string | null>(course.imageUrl);

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

      formData.append("attachments", JSON.stringify(attachments));
      formData.set("categoryId", categoryId);
      formData.set("imageUrl", imageUrl);
      formData.set("price", numericPrice.toString());

      // Update the course via API
      const response = await fetch(`/api/courses/${course.id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update course");
      }

      toast({
        title: "Success",
        description: "Course updated successfully",
      });

      router.push(`/admin/courses/${course.id}`);
      router.refresh();
    } catch (err) {
      const errorMessage = "Something went wrong";
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

  const removeAttachment = (attachmentUrl: string) => {
    setAttachments((current) => current.filter((attachment) => attachment.url !== attachmentUrl));
    toast({
      title: "Success",
      description: "Attachment removed successfully",
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form action={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Course Title</Label>
          <Input id="title" name="title" required placeholder="Enter course title" disabled={isLoading} defaultValue={course.title} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" placeholder="Enter course description" disabled={isLoading} defaultValue={course.description || ""} />
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
          <Label>Attachments</Label>
          <div className="space-y-4">
            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-x-2">
                      <FileText className="h-4 w-4" />
                      <p className="text-sm text-muted-foreground">{attachment.name}</p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(attachment.url)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <UploadDropzone
              endpoint="courseAttachment"
              onClientUploadComplete={(res) => {
                if (res?.[0]) {
                  setAttachments((current) => [
                    ...current,
                    {
                      name: res[0].name,
                      url: res[0].url,
                    },
                  ]);
                  toast({
                    title: "Success",
                    description: "Attachment uploaded successfully",
                  });
                }
              }}
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              onUploadError={(error: Error) => {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: "Error uploading attachment",
                });
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" min="0" step="0.01" placeholder="Enter course price" disabled={isLoading} required className="appearance-none" defaultValue={course.price} />
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
              Saving Changes...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  );
}
