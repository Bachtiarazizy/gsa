"use client";

import { useRef, useState } from "react";
import { updateChapterProgress } from "@/lib/actions/chapter";

interface VideoPlayerProps {
  videoUrl: string;
  chapterId: string;
  userId: string;
  isCompleted: boolean;
  hasAssessment: boolean;
}

export const VideoPlayer = ({ videoUrl, chapterId, userId, isCompleted, hasAssessment }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);

  const handleVideoEnd = async () => {
    setIsVideoCompleted(true);
    if (!hasAssessment) {
      await updateChapterProgress({
        userId,
        chapterId,
        isCompleted: true,
      });
      window.location.reload();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      // Optional: Save progress periodically
    }
  };

  return (
    <div className="aspect-video mb-4">
      <video ref={videoRef} src={videoUrl} controls className="w-full h-full rounded-md" onEnded={handleVideoEnd} onTimeUpdate={handleTimeUpdate} />
    </div>
  );
};
