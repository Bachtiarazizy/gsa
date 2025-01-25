import { useEffect, useState } from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";

interface VideoPlayerProps {
  videoUrl: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export function VideoPlayer({ videoUrl, onProgress, onComplete }: VideoPlayerProps) {
  const [player, setPlayer] = useState<Plyr | null>(null);

  useEffect(() => {
    if (player) {
      // Track progress
      player.on("timeupdate", () => {
        const progress = (player.currentTime / player.duration) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      });

      // Track completion
      player.on("ended", () => {
        if (onComplete) {
          onComplete();
        }
      });
    }
  }, [player, onProgress, onComplete]);

  return (
    <div className="aspect-video">
      <Plyr
        ref={(p) => setPlayer(p)}
        source={{
          type: "video",
          sources: [
            {
              src: videoUrl,
              type: "video/mp4",
            },
          ],
        }}
        options={{
          controls: ["play", "progress", "current-time", "mute", "volume", "settings", "fullscreen"],
          quality: {
            default: 576,
            options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240],
          },
        }}
      />
    </div>
  );
}
