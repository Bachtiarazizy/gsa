"use client";

import React from "react";

interface RichTextContentProps {
  content: string | null;
  className?: string;
}

/**
 * A component that safely renders HTML content created by the RichTextEditor
 *
 * @param content The HTML content from the RichTextEditor
 * @param className Optional additional CSS classes
 */
const RichTextContent = ({ content, className = "" }: RichTextContentProps) => {
  if (!content) {
    return null;
  }

  return <div className={`prose max-w-none ${className}`} dangerouslySetInnerHTML={{ __html: content }} />;
};

export default RichTextContent;
