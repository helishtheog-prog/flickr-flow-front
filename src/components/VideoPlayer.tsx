import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  videoUrl?: string;
  thumbnail: string;
  title: string;
}

export const VideoPlayer = ({ videoUrl, thumbnail, title }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div
      className="relative w-full aspect-video bg-background rounded-xl overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(!isPlaying)}
    >
      {/* Video/Thumbnail */}
      {videoUrl ? (
        <video
          src={videoUrl}
          poster={thumbnail}
          className="w-full h-full object-contain bg-background"
          muted={isMuted}
        />
      ) : (
        <div className="relative w-full h-full">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/40 flex items-center justify-center">
            <Button
              size="lg"
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
            >
              <Play className="w-10 h-10 ml-1" fill="currentColor" />
            </Button>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <h2 className="font-display font-semibold text-foreground text-lg line-clamp-1">
            {title}
          </h2>
        </div>

        {/* Center play button */}
        {!isPlaying && videoUrl && (
          <button
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground flex items-center justify-center transition-all hover:scale-110 shadow-glow"
          >
            <Play className="w-10 h-10 ml-1" fill="currentColor" />
          </button>
        )}

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          {/* Progress bar */}
          <Slider
            value={[progress]}
            onValueChange={(value) => setProgress(value[0])}
            max={100}
            step={0.1}
            className="cursor-pointer"
          />

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="text-foreground hover:bg-secondary/50"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:bg-secondary/50"
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:bg-secondary/50"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-foreground hover:bg-secondary/50"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
              <span className="text-sm text-foreground/80 ml-2">0:00 / 14:32</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:bg-secondary/50"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:bg-secondary/50"
              >
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
