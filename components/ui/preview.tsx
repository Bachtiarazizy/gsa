import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface PreviewProps {
  value: string;
  className?: string;
}

export const Preview = ({ value, className }: PreviewProps) => {
  return (
    <div className={cn("prose prose-stone max-w-none dark:prose-invert prose-pre:bg-secondary", className)}>
      <ReactMarkdown>{value}</ReactMarkdown>
    </div>
  );
};
