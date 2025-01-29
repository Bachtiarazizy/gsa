import { File } from "lucide-react";

interface AttachmentsProps {
  attachments: Array<{
    id: string;
    name: string;
    url: string;
  }>;
}

export const Attachments = ({ attachments }: AttachmentsProps) => {
  if (!attachments?.length) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Attachments</h3>
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <a key={attachment.id} href={attachment.url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 w-full bg-sky-100 border rounded-md hover:bg-sky-200 transition">
            <File className="h-4 w-4 mr-2 flex-shrink-0" />
            <p className="text-sm line-clamp-1">{attachment.name}</p>
          </a>
        ))}
      </div>
    </div>
  );
};
