import { useEffect, useRef, useState } from "react";
import { Play, Pause, Maximize, Minimize } from "lucide-react";

interface VideoPlayerProps {
  videoFilename: string;
  thumbnail: string | null;
  title: string;
}

export default function VideoPlayer({ videoFilename, thumbnail, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoUrl = `http://172.105.182.143:3000/uploads/${videoFilename}`;
  const thumbnailUrl = thumbnail ? `http://172.105.182.143:3000/uploads/${thumbnail}` : undefined;

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.paused) {
      vid.play();
      setIsPlaying(true);
    } else {
      vid.pause();
      setIsPlaying(false);
    }

    setShowButton(true);
    setTimeout(() => setShowButton(false), 100);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
      if (e.code === "KeyF") {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const handleLoaded = () => {
    const vid = videoRef.current;
    if (vid) vid.play().catch(() => {});
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden rounded-xl"
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        className="w-full h-full object-contain"
        autoPlay
        onLoadedMetadata={handleLoaded}
      />

      <button
        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
        className={`
          absolute top-1/2 left-1/2 
          -translate-x-1/2 -translate-y-1/2
          w-20 h-20 rounded-full 
          bg-white/20 backdrop-blur-md 
          flex items-center justify-center
          transition-opacity duration-200
          ${showButton ? "opacity-100" : "opacity-0"}
        `}
      >
        {isPlaying ? (
          <Pause className="w-10 h-10 text-white" />
        ) : (
          <Play className="w-10 h-10 text-white ml-1" />
        )}
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
        className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition"
      >
        {isFullscreen ? (
          <Minimize className="w-6 h-6 text-white" />
        ) : (
          <Maximize className="w-6 h-6 text-white" />
        )}
      </button>

      <div className="absolute bottom-4 left-4 text-white text-xl font-semibold drop-shadow-lg pointer-events-none">
        {title}
      </div>
    </div>
  );
}
