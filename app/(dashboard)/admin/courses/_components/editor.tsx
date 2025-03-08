// editor.tsx

"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill/dist/quill.snow.css";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
  disabled?: boolean; // Add the disabled prop as optional
}

export const Editor = ({ onChange, value, disabled = false }: EditorProps) => {
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

  return (
    <div className="bg-secondary">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        readOnly={disabled} // Use the disabled prop to set readOnly
      />
    </div>
  );
};
