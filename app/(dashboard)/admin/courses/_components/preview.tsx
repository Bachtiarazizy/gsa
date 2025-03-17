"use client";

import React from "react";
import parse from "html-react-parser";
import { cn } from "@/lib/utils";

interface RichTextPreviewProps {
  content: string;
  className?: string;
  compact?: boolean;
}

export const RichTextPreview: React.FC<RichTextPreviewProps> = ({ content, className, compact = false }) => {
  return (
    <div className={cn("rich-text-container", compact ? "line-clamp-2" : "", className)}>
      <div className={cn("prose prose-sm max-w-none", compact && "prose-compact")}>{parse(content)}</div>
    </div>
  );
};

// This component should be used for cards where you need a compact preview
export const CompactRichTextPreview: React.FC<Omit<RichTextPreviewProps, "compact">> = (props) => {
  return <RichTextPreview {...props} compact={true} />;
};

export default RichTextPreview;
