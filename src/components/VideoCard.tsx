import { Link } from 'react-router-dom';
import { Video, getThumbnailUrl, formatRelativeTime } from '@/lib/api';
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
  const thumbnailUrl = getThumbnailUrl(video.thumbnail, video.id);
  const uploaderName = video.uploader?.username || 'Unknown';
  const uploaderInitial = uploaderName.charAt(0).toUpperCase();
  const uploadedAt = formatRelativeTime(video.createdAt);

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
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            // Fallback to placeholder if thumbnail fails
            e.currentTarget.src = 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=640&h=360&fit=crop';
          }}
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="flex gap-3">
        {/* Channel Avatar */}
        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0 ring-2 ring-transparent group-hover:ring-primary/50 transition-all duration-300">
          <span className="text-primary font-medium text-sm">{uploaderInitial}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="font-medium text-foreground text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {video.title}
          </h3>
          
          {/* Channel Name */}
          <p className="text-muted-foreground text-xs mt-1 hover:text-foreground transition-colors">
            {uploaderName}
          </p>
          
          {/* Stats */}
          <p className="text-muted-foreground text-xs">
            {formatViews(video.views)} • {uploadedAt}
          </p>
        </div>
      </div>
    </Link>
  );
};
