import { Video } from '@/lib/api';
import { VideoCard } from './VideoCard';

interface VideoGridProps {
  videos: Video[];
  isLoading?: boolean;
}

export const VideoGrid = ({ videos, isLoading }: VideoGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video rounded-xl bg-card mb-3" />
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-card shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-card rounded w-full" />
                <div className="h-3 bg-card rounded w-2/3" />
                <div className="h-3 bg-card rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="font-display font-semibold text-lg text-foreground mb-2">No videos found</h3>
        <p className="text-muted-foreground text-sm">Try a different search or category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
      {videos.map((video, index) => (
        <VideoCard key={video.id} video={video} index={index} />
      ))}
    </div>
  );
};
