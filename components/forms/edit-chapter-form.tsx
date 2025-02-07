"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadDropzone } from "@/lib/uploadthing";
import { updateChapterStatus } from "@/lib/actions/chapter";
import { useToast } from "@/hooks/use-toast";

interface EditChapterFormProps {
  initialData: {
    id: string;
    title: string;
    description: string | null;
    videoUrl: string;
    position: number;
    isPublished: boolean;
    courseId: string;
    attachmentUrl: string | null;
    attachmentOriginalName: string | null;
    course: {
      title: string;
    };
  };
}

type ApiResponse = {
  message?: string;
  errors?: { message: string }[];
};

export default function EditChapterForm({ initialData }: EditChapterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(initialData.videoUrl);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(initialData.attachmentUrl);
  const [attachmentName, setAttachmentName] = useState<string | null>(initialData.attachmentOriginalName);
  const router = useRouter();
  const { toast } = useToast();

  async function updateChapter(formData: FormData, togglePublish?: boolean) {
    try {
      setIsLoading(true);
      setError(null);

      if (togglePublish !== undefined) {
        formData.append("isPublished", togglePublish.toString());
      }

      if (videoUrl) {
        formData.set("videoUrl", videoUrl);
      }

      if (attachmentUrl) {
        formData.set("attachmentUrl", attachmentUrl);
        formData.set("attachmentOriginalName", attachmentName || "");
      }

      const response = await fetch(`/api/courses/${initialData.courseId}/chapters/${initialData.id}`, {
        method: "PATCH",
        body: formData,
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          const errorMessage = data.errors ? data.errors.map((e) => e.message).join(", ") : data.message;
          throw new Error(errorMessage || "Validation failed");
        }
        throw new Error(data.message || "Failed to update chapter");
      }

      toast({
        title: "Success",
        description: "Chapter updated successfully",
      });

      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update chapter";
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

  async function onSubmit(formData: FormData) {
    await updateChapter(formData);
  }

  async function onPublish() {
    await updateChapterStatus(initialData.id, initialData.courseId, true);
    toast({
      title: "Success",
      description: "Chapter published successfully",
    });
    router.refresh();
  }

  async function onUnpublish() {
    await updateChapterStatus(initialData.id, initialData.courseId, false);
    toast({
      title: "Success",
      description: "Chapter unpublished successfully",
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-100">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm">
              Chapter status: <span className="font-medium">{initialData.isPublished ? "Published" : "Draft"}</span>
            </p>
            <Button onClick={initialData.isPublished ? onUnpublish : onPublish} variant={initialData.isPublished ? "outline" : "default"} disabled={isLoading}>
              {initialData.isPublished ? "Unpublish" : "Publish"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <form action={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Chapter Title</Label>
          <Input id="title" name="title" defaultValue={initialData.title} required disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" defaultValue={initialData.description || ""} disabled={isLoading} />
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
                  Change Video
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
                  label: "Drag and drop a video or click to browse",
                }}
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Attachment</Label>
          <div className="space-y-4">
            {attachmentUrl && attachmentName && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-x-2">
                  <FileText className="h-4 w-4" />
                  <p className="text-sm text-muted-foreground">{attachmentName}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAttachmentUrl(null);
                    setAttachmentName(null);
                    toast({
                      title: "Success",
                      description: "Attachment removed successfully",
                    });
                  }}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {!attachmentUrl && (
              <UploadDropzone
                endpoint="attachment"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    setAttachmentUrl(res[0].url);
                    setAttachmentName(res[0].name);
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
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input id="position" name="position" type="number" min="1" defaultValue={initialData.position} required disabled={isLoading} />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={isLoading}>
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
