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
import { Editor } from "@/app/(dashboard)/admin/courses/_components/editor";
import { StatusBadge } from "@/app/(dashboard)/admin/courses/_components/status-badge";

interface ResearchPaperFormProps {
  paperId: string;
  userId: string;
  courseId: string;
  initialData: {
    title: string;
    abstract: string;
    content: string;
    status: string;
    fileUrl?: string | null;
    fileOriginalName?: string | null;
  };
  isEditable: boolean;
  submitAction: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
}

export default function ResearchPaperForm({ paperId, userId, courseId, initialData, isEditable, submitAction }: ResearchPaperFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(initialData.title);
  const [abstract, setAbstract] = useState(initialData.abstract);
  const [content, setContent] = useState(initialData.content);
  const [fileUrl, setFileUrl] = useState<string | null>(initialData.fileUrl || null);
  const [fileOriginalName, setFileOriginalName] = useState<string | null>(initialData.fileOriginalName || null);

  async function onSubmit(formData: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      if (!title.trim()) {
        setError("Research paper title is required");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Research paper title is required",
        });
        return;
      }

      if (!abstract.trim()) {
        setError("Abstract is required");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Abstract is required",
        });
        return;
      }

      if (!content.trim()) {
        setError("Content is required");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Content is required",
        });
        return;
      }

      // Minimum word count check for the content
      const wordCount = content.trim().split(/\s+/).length;
      if (wordCount < 100) {
        setError("Content should be at least 100 words");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Content should be at least 100 words",
        });
        return;
      }

      // Add all the data to the formData
      formData.append("paperId", paperId);
      formData.append("userId", userId);
      formData.append("courseId", courseId);
      formData.append("title", title);
      formData.append("abstract", abstract);
      formData.append("content", content);
      formData.append("fileUrl", fileUrl || "");
      formData.append("fileOriginalName", fileOriginalName || "");

      // Use the server action provided through props
      const result = await submitAction(formData);

      if (!result.success) {
        throw new Error(result.error || "Failed to submit research paper");
      }

      toast({
        title: "Success",
        description: "Research paper submitted successfully",
      });

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

  if (!isEditable) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 p-6 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold">{initialData.title}</h1>
              <p className="text-muted-foreground">Research Paper</p>
            </div>
            <StatusBadge status={initialData.status} />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Abstract</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line mt-2">{initialData.abstract}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Content</h3>
              <div className="mt-2 prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </div>

            {fileUrl && (
              <div>
                <h3 className="text-lg font-medium">Attached File</h3>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 mt-2 text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  {fileOriginalName || "Download Attachment"}
                </a>
              </div>
            )}
          </div>

          <div className="mt-6">
            <Button variant="outline" onClick={() => router.push(`/student/courses/${courseId}`)}>
              Back to Course
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form action={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Research Paper Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter the title of your research paper" disabled={isLoading} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="abstract">Abstract</Label>
          <div className="min-h-[200px]">
            <Editor value={abstract} onChange={setAbstract} placeholder="Write a brief abstract (150-200 words)" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">A concise summary of your research paper (150-200 words)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Research Paper Content</Label>
          <div className="min-h-[400px]">
            <Editor value={content} onChange={setContent} placeholder="Write your research paper content here..." />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Your paper should be well-structured with introduction, methodology, results, and conclusion sections</p>
        </div>

        <div className="space-y-2">
          <Label>Supporting Document (Optional)</Label>
          <div className="space-y-4">
            {fileUrl ? (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{fileOriginalName || "File uploaded"}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFileUrl(null);
                    setFileOriginalName(null);
                  }}
                  disabled={isLoading}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <UploadDropzone
                endpoint="researchPaperFile"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    setFileUrl(res[0].url);
                    setFileOriginalName(res[0].name);
                    toast({
                      title: "Success",
                      description: "File uploaded successfully",
                    });
                  }
                }}
                onUploadError={() => {
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Error uploading file",
                  });
                }}
                appearance={{
                  container: "border-dashed",
                  label: "Drag and drop a file or click to browse",
                }}
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Citations and References</Label>
          <p className="text-sm text-muted-foreground">Please follow APA or MLA citation style for any references used in your paper. List all references at the end of your paper content.</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push(`/student/courses/${courseId}`)} disabled={isLoading}>
            Back to Course
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData.status === "DRAFT" ? "Submitting..." : "Resubmitting..."}
              </>
            ) : initialData.status === "DRAFT" ? (
              "Submit Research Paper"
            ) : (
              "Submit Revised Paper"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
