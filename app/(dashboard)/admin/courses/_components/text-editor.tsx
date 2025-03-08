import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Heading, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder = "Start typing..." }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleHeading = (level: 1 | 2 | 3) => editor.chain().focus().toggleHeading({ level }).run();

  const setLink = () => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
  };

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap gap-2 p-2 border-b bg-muted/20">
        <Button type="button" variant="ghost" size="sm" onClick={toggleBold} className={`p-2 ${editor.isActive("bold") ? "bg-accent" : ""}`}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={toggleItalic} className={`p-2 ${editor.isActive("italic") ? "bg-accent" : ""}`}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => toggleHeading(1)} className={`p-2 ${editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""}`}>
          <Heading className="h-4 w-4" />
          <span className="ml-1 text-xs">1</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => toggleHeading(2)} className={`p-2 ${editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""}`}>
          <Heading className="h-4 w-4" />
          <span className="ml-1 text-xs">2</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={toggleBulletList} className={`p-2 ${editor.isActive("bulletList") ? "bg-accent" : ""}`}>
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={toggleOrderedList} className={`p-2 ${editor.isActive("orderedList") ? "bg-accent" : ""}`}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={setLink} className={`p-2 ${editor.isActive("link") ? "bg-accent" : ""}`}>
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} className="p-4 min-h-[200px] prose max-w-none" />
    </div>
  );
};

export default RichTextEditor;
