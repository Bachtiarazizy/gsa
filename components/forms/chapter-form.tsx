"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Video, FileText, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { createChapter } from "@/lib/actions/chapter";
import { useToast } from "@/hooks/use-toast";

interface CreateChapterFormProps {
  courseId: string;
}

interface CreateChapterResponse {
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

export default function CreateChapterForm({ courseId }: CreateChapterFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  async function onSubmit(formData: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      formData.append("videoUrl", videoUrl);
      // Add attachments to formData
      formData.append("attachments", JSON.stringify(attachments));

      const result = (await createChapter(courseId, formData)) as CreateChapterResponse;

      if (!result.success || !result.data) {
        setError(result.error || "Something went wrong");
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Something went wrong creating the chapter",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Chapter created successfully",
      });

      router.push(`/admin/courses/${courseId}/chapters/${result.data.id}`);
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Something went wrong");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create chapter",
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
                    toast({
                      title: "Success",
                      description: "Video uploaded successfully",
                    });
                  }
                }}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onUploadError={(error: Error) => {
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Error uploading video",
                  });
                }}
              />
            )}
            {videoUrl && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <Video className="h-4 w-4" />
                  <p className="text-sm text-muted-foreground">Video uploaded successfully</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setVideoUrl("");
                    toast({
                      title: "Success",
                      description: "Video removed successfully",
                    });
                  }}
                >
                  Change video
                </Button>
              </div>
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
