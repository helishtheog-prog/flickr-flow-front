import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal, Bell } from 'lucide-react';
import { Header } from '@/components/Header';
import { VideoPlayer } from '@/components/VideoPlayer';
import { VideoCard } from '@/components/VideoCard';
import { Button } from '@/components/ui/button';
import { api, Video, mockVideos } from '@/lib/api';
import { cn } from '@/lib/utils';

const formatViews = (views: number): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  }
  if (views >= 1000) {
    return `${Math.floor(views / 1000)}K views`;
  }
  return `${views} views`;
};

const Watch = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;
      setIsLoading(true);
      const data = await api.getVideo(id);
      setVideo(data);
      
      // Get related videos (exclude current)
      const allVideos = await api.getVideos();
      setRelatedVideos(allVideos.filter(v => v.id !== id).slice(0, 8));
      setIsLoading(false);
    };
    fetchVideo();
  }, [id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  if (isLoading || !video) {
    return (
      <div className="min-h-screen bg-background">
        <Header onMenuToggle={() => {}} />
        <div className="pt-20 px-4 animate-pulse">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-video bg-card rounded-xl" />
              <div className="h-8 bg-card rounded w-3/4" />
              <div className="h-4 bg-card rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => {}} />

      <main className="pt-20 px-4 pb-8">
        <div className="max-w-screen-2xl mx-auto">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              {/* Video Player */}
              <VideoPlayer
                thumbnail={video.thumbnail}
                title={video.title}
                videoUrl={video.videoUrl}
              />

              {/* Video Info */}
              <div className="space-y-4">
                <h1 className="font-display font-bold text-xl md:text-2xl text-foreground">
                  {video.title}
                </h1>

                {/* Channel & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Channel Info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={video.channel.avatar}
                      alt={video.channel.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-foreground">{video.channel.name}</h3>
                      <p className="text-muted-foreground text-xs">1.2M subscribers</p>
                    </div>
                    <Button
                      onClick={() => setIsSubscribed(!isSubscribed)}
                      className={cn(
                        "ml-4 rounded-full",
                        isSubscribed
                          ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      {isSubscribed ? (
                        <>
                          <Bell className="w-4 h-4 mr-2" />
                          Subscribed
                        </>
                      ) : (
                        "Subscribe"
                      )}
                    </Button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center bg-secondary rounded-full overflow-hidden">
                      <Button
                        variant="ghost"
                        onClick={handleLike}
                        className={cn(
                          "rounded-none rounded-l-full hover:bg-secondary/80 px-4",
                          isLiked && "text-primary"
                        )}
                      >
                        <ThumbsUp className={cn("w-4 h-4 mr-2", isLiked && "fill-current")} />
                        12K
                      </Button>
                      <div className="w-px h-6 bg-border" />
                      <Button
                        variant="ghost"
                        onClick={handleDislike}
                        className={cn(
                          "rounded-none rounded-r-full hover:bg-secondary/80 px-4",
                          isDisliked && "text-primary"
                        )}
                      >
                        <ThumbsDown className={cn("w-4 h-4", isDisliked && "fill-current")} />
                      </Button>
                    </div>
                    <Button variant="secondary" className="rounded-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="secondary" className="rounded-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-full">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-card rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <span>{formatViews(video.views)}</span>
                    <span>•</span>
                    <span>{video.uploadedAt}</span>
                  </div>
                  <p
                    className={cn(
                      "text-sm text-foreground/90 whitespace-pre-wrap",
                      !isDescriptionExpanded && "line-clamp-3"
                    )}
                  >
                    {video.description || "No description available for this video."}
                  </p>
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-sm font-medium text-foreground mt-2 hover:text-primary transition-colors"
                  >
                    {isDescriptionExpanded ? "Show less" : "Show more"}
                  </button>
                </div>
              </div>
            </div>

            {/* Related Videos */}
            <div className="space-y-4">
              <h2 className="font-display font-semibold text-lg text-foreground">
                Related Videos
              </h2>
              <div className="space-y-3">
                {relatedVideos.map((relatedVideo, index) => (
                  <Link
                    key={relatedVideo.id}
                    to={`/watch/${relatedVideo.id}`}
                    className="flex gap-3 group animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative w-40 shrink-0 aspect-video rounded-lg overflow-hidden bg-card">
                      <img
                        src={relatedVideo.thumbnail}
                        alt={relatedVideo.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-1 right-1 bg-background/90 px-1.5 py-0.5 rounded text-xs font-medium text-foreground">
                        {relatedVideo.duration}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedVideo.title}
                      </h3>
                      <p className="text-muted-foreground text-xs mt-1">
                        {relatedVideo.channel.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatViews(relatedVideo.views)} • {relatedVideo.uploadedAt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Watch;
