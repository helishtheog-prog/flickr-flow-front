import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal, Send } from 'lucide-react';
import { Header } from '@/components/Header';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { api, Video, getVideoStreamUrl, getThumbnailUrl, formatRelativeTime } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
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
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;
      setIsLoading(true);
      const data = await api.getVideo(id);
      setVideo(data);
      
      // Get related videos (exclude current)
      const allVideos = await api.getVideos();
      setRelatedVideos(allVideos.filter(v => v.id !== Number(id)).slice(0, 8));
      setIsLoading(false);
    };
    fetchVideo();
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to like videos.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!video) return;
    
    const result = await api.likeVideo(video.id);
    if (result.success) {
      setIsLiked(true);
      setIsDisliked(false);
      toast({ title: 'Video liked!' });
    } else {
      toast({
        title: 'Already liked',
        description: result.error,
      });
    }
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  const handleComment = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to comment.',
        variant: 'destructive',
      });
      return;
    }

    if (!comment.trim() || !video) return;

    setIsSubmittingComment(true);
    const result = await api.addComment(video.id, comment);
    setIsSubmittingComment(false);

    if (result.error) {
      toast({
        title: 'Failed to add comment',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      setComment('');
      toast({ title: 'Comment added!' });
    }
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

  const uploaderName = video.uploader?.username || 'Unknown';
  const uploaderInitial = uploaderName.charAt(0).toUpperCase();
  const videoStreamUrl = getVideoStreamUrl(video.id);
  const thumbnailUrl = getThumbnailUrl(video.thumbnail, video.id);

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
                thumbnail={thumbnailUrl}
                title={video.title}
                videoUrl={videoStreamUrl}
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
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-medium">{uploaderInitial}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{uploaderName}</h3>
                      <p className="text-muted-foreground text-xs">Channel</p>
                    </div>
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
                        Like
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
                    <span>{formatRelativeTime(video.createdAt)}</span>
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

                {/* Comments Section */}
                <div className="space-y-4">
                  <h2 className="font-display font-semibold text-lg text-foreground">Comments</h2>
                  
                  {/* Add Comment */}
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <span className="text-muted-foreground text-sm">
                        {isAuthenticated ? 'U' : '?'}
                      </span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder={isAuthenticated ? "Add a comment..." : "Login to comment"}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        disabled={!isAuthenticated || isSubmittingComment}
                        className="bg-secondary border-border focus:border-primary resize-none min-h-[80px]"
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={handleComment}
                          disabled={!comment.trim() || !isAuthenticated || isSubmittingComment}
                          className="bg-gradient-primary text-primary-foreground"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
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
                        src={getThumbnailUrl(relatedVideo.thumbnail, relatedVideo.id)}
                        alt={relatedVideo.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=320&h=180&fit=crop';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedVideo.title}
                      </h3>
                      <p className="text-muted-foreground text-xs mt-1">
                        {relatedVideo.uploader?.username || 'Unknown'}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatViews(relatedVideo.views)} • {formatRelativeTime(relatedVideo.createdAt)}
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
