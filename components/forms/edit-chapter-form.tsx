"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadDropzone } from "@/lib/uploadthing";
import { updateChapterStatus } from "@/lib/actions/chapter";

interface EditChapterFormProps {
  initialData: {
    id: string;
    title: string;
    description: string | null;
    videoUrl: string;
    position: number;
    isPublished: boolean;
    courseId: string;
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
  const router = useRouter();

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

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update chapter");
      console.error("Form submission error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(formData: FormData) {
    await updateChapter(formData);
  }

  async function onPublish() {
    await updateChapterStatus(initialData.id, initialData.courseId, true);
    router.refresh();
  }

  async function onUnpublish() {
    await updateChapterStatus(initialData.id, initialData.courseId, false);
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
                <Button type="button" variant="outline" size="sm" onClick={() => setVideoUrl(null)} disabled={isLoading}>
                  Change Video
                </Button>
              </>
            ) : (
              <UploadDropzone
                endpoint="chapterVideo"
                onClientUploadComplete={(res) => {
                  setVideoUrl(res?.[0]?.url);
                }}
                onUploadError={(error: Error) => {
                  setError(error.message);
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
