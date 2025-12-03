import { Link } from 'react-router-dom';
import { Video } from '@/lib/api';
import { cn } from '@/lib/utils';

interface VideoCardProps {
  video: Video;
  index?: number;
}

const formatViews = (views: number): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(0)}K views`;
  }
  return `${views} views`;
};

export const VideoCard = ({ video, index = 0 }: VideoCardProps) => {
  return (
    <Link
      to={`/watch/${video.id}`}
      className={cn(
        "group block animate-slide-up",
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-card mb-3">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium text-foreground">
          {video.duration}
        </div>
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="flex gap-3">
        {/* Channel Avatar */}
        <img
          src={video.channel.avatar}
          alt={video.channel.name}
          className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-transparent group-hover:ring-primary/50 transition-all duration-300"
        />
        
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="font-medium text-foreground text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {video.title}
          </h3>
          
          {/* Channel Name */}
          <p className="text-muted-foreground text-xs mt-1 hover:text-foreground transition-colors">
            {video.channel.name}
          </p>
          
          {/* Stats */}
          <p className="text-muted-foreground text-xs">
            {formatViews(video.views)} • {video.uploadedAt}
          </p>
        </div>
      </div>
    </Link>
  );
};
