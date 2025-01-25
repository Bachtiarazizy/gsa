"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Video } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { createChapter } from "@/lib/actions/chapter";

interface CreateChapterFormProps {
  courseId: string;
}

interface CreateChapterResponse {
  success: boolean;
  data?: {
    id: string;
    [key: string]: any;
  };
  error?: string;
}

export default function CreateChapterForm({ courseId }: CreateChapterFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");

  async function onSubmit(formData: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      // Add the videoUrl to the FormData
      formData.append("videoUrl", videoUrl);

      const result = (await createChapter(courseId, formData)) as CreateChapterResponse;

      if (!result.success || !result.data) {
        setError(result.error || "Something went wrong");
        return;
      }

      router.push(`/courses/${courseId}/chapters/${result.data.id}`);
      router.refresh();
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form action={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Chapter Title</Label>
          <Input id="title" name="title" required placeholder="Enter chapter title" disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" placeholder="Enter chapter description" disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label>Video Upload</Label>
          <div className={cn("rounded-lg border border-dashed p-4", videoUrl && "bg-muted")}>
            {!videoUrl && (
              <UploadDropzone
                endpoint="chapterVideo"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    setVideoUrl(res[0].url);
                  }
                }}
                onUploadError={(error: Error) => {
                  console.error(error);
                  setError("Error uploading video");
                }}
              />
            )}
            {videoUrl && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <Video className="h-4 w-4" />
                  <p className="text-sm text-muted-foreground">Video uploaded successfully</p>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => setVideoUrl("")}>
                  Change video
                </Button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isLoading || !videoUrl}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Chapter...
            </>
          ) : (
            "Create Chapter"
          )}
        </Button>
      </form>
    </div>
  );
}
