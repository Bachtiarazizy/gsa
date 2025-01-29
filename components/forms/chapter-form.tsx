import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Loader2, ImageIcon, FileText, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { createCourse } from "@/lib/actions/course";
import { useToast } from "@/hooks/use-toast";

interface CreateCourseFormProps {
  categories: {
    id: string;
    name: string;
  }[];
}

interface CreateCourseResponse {
  success: boolean;
  data?: {
    id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  error?: string;
}

interface Attachment {
  url: string;
  name: string;
}

export default function CreateCourseForm({ categories }: CreateCourseFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  async function onSubmit(formData: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      formData.append("imageUrl", imageUrl);
      formData.append("attachments", JSON.stringify(attachments));

      const result = (await createCourse(formData)) as CreateCourseResponse;

      if (!result.success || !result.data) {
        setError(result.error || "Failed to create course");
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to create course",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Course created successfully",
      });

      router.push(`/admin/courses/${result.data.id}`);
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Something went wrong");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create course",
      });
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
    <div className="max-w-2xl mx-auto p-6">
      <form action={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Course Title</Label>
          <Input id="title" name="title" required placeholder="Enter course title" disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" placeholder="Enter course description" disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label>Course Image</Label>
          <div className={cn("rounded-lg border border-dashed p-4", imageUrl && "bg-muted")}>
            {!imageUrl && (
              <UploadDropzone
                endpoint="courseImage"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    setImageUrl(res[0].url);
                    toast({
                      title: "Success",
                      description: "Image uploaded successfully",
                    });
                  }
                }}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onUploadError={(error: Error) => {
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Error uploading image",
                  });
                }}
              />
            )}
            {imageUrl && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <ImageIcon className="h-4 w-4" />
                  <p className="text-sm text-muted-foreground">Image uploaded successfully</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setImageUrl("");
                    toast({
                      title: "Success",
                      description: "Image removed successfully",
                    });
                  }}
                >
                  Change image
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Course Attachments</Label>
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
          <Label htmlFor="categoryId">Category</Label>
          <Select name="categoryId" required>
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
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" min="0" step="0.01" required placeholder="Enter course price" disabled={isLoading} />
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
