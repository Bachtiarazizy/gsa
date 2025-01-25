import { UploadButton } from "@uploadthing/react";
import { useState } from "react";

export function VideoUpload() {
  const [videoUrl, setVideoUrl] = useState<string>("");

  return (
    <div>
      <UploadButton
        endpoint="courseVideo"
        onClientUploadComplete={(res) => {
          if (res) {
            setVideoUrl(res[0].url);
            // Simpan URL ke database
          }
        }}
        onUploadError={(error: Error) => {
          console.error(`ERROR! ${error.message}`);
        }}
      />
      {videoUrl && <p>Video uploaded at: {videoUrl}</p>}
    </div>
  );
}
