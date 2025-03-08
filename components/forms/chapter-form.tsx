/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { Editor } from "@/app/(dashboard)/admin/courses/_components/editor";

interface Attachment {
  id: string;
  name: string;
  url: string;
}

interface ChapterFormProps {
  courseId: string;
}

type ApiResponse = {
  message?: string;
  errors?: { message: string }[];
};

export default function ChapterForm({ courseId }: ChapterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [description, setDescription] = useState<string>(""); // State for rich text editor
  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit(formData: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      if (!videoUrl) {
        throw new Error("Video is required");
      }

      formData.set("videoUrl", videoUrl);
      formData.set("description", description); // Use the description from the rich text editor
      formData.append("attachments", JSON.stringify(attachments));
      formData.append("courseId", courseId);

      const response = await fetch(`/api/courses/${courseId}/chapters`, {
        method: "POST",
        body: formData,
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          const errorMessage = data.errors ? data.errors.map((e) => e.message).join(", ") : data.message;
          throw new Error(errorMessage || "Validation failed");
        }
        throw new Error(data.message || "Failed to create chapter");
      }

      toast({
        title: "Success",
        description: "Chapter created successfully",
      });

      router.push(`/admin/courses/${courseId}`);
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create chapter";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const removeAttachment = (attachmentId: string) => {
    setAttachments((current) => current.filter((attachment) => attachment.id !== attachmentId));
    toast({
      title: "Success",
      description: "Attachment removed successfully",
    });
  };

  return (
    <div className="space-y-6">
      <form action={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Chapter Title</Label>
          <Input id="title" name="title" required disabled={isLoading} placeholder="Enter chapter title" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          {/* Replace Textarea with the Editor component */}
          <div className="min-h-[200px]">
            <Editor value={description} onChange={setDescription} disabled={isLoading} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Chapter Video</Label>
          <div className="flex flex-col gap-4">
            {videoUrl ? (
              <>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <video src={videoUrl} controls className="w-full h-full object-cover" />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setVideoUrl(null);
                    toast({
                      title: "Success",
                      description: "Video removed successfully",
                    });
                  }}
                  disabled={isLoading}
                >
                  Remove Video
                </Button>
              </>
            ) : (
              <UploadDropzone
                endpoint="chapterVideo"
                onClientUploadComplete={(res) => {
                  setVideoUrl(res?.[0]?.url);
                  toast({
                    title: "Success",
                    description: "Video uploaded successfully",
                  });
                }}
                onUploadError={(error: Error) => {
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Error uploading video",
                  });
                }}
                appearance={{
                  container: "border-dashed",
                  label: "Drag and drop a video or click to browse (max 512MB)",
                }}
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Attachments (PDF only, max 3 files, 8MB each)</Label>
          <div className="space-y-4">
            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-x-2">
                      <FileText className="h-4 w-4" />
                      <p className="text-sm text-muted-foreground">{attachment.name}</p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(attachment.id)} disabled={isLoading}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {attachments.length < 3 && (
              <UploadDropzone
                endpoint="attachment"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    setAttachments((current) => [
                      ...current,
                      {
                        id: res[0].key,
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
                onUploadError={(error: Error) => {
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Error uploading attachment",
                  });
                }}
                appearance={{
                  container: "border-dashed",
                  label: "Drag and drop PDF files or click to browse",
                }}
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input id="position" name="position" type="number" min="1" required disabled={isLoading} placeholder="Enter chapter position" />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-x-2">
          <Button type="button" variant="ghost" onClick={() => router.push(`/admin/courses/${courseId}`)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Chapter"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
