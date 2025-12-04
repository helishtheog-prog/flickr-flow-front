import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ThumbsUp, ThumbsDown, Share2, MoreHorizontal, Send, Clock, Copy, Check } from "lucide-react";
import { Header } from "@/components/Header";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api, Video, getThumbnailUrl, formatRelativeTime } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useWatchLater } from "@/hooks/useWatchLater";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const formatViews = (views: number) => {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${Math.floor(views / 1_000)}K views`;
  return `${views} views`;
};

export default function Watch() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [copied, setCopied] = useState(false);

  const { isAuthenticated } = useAuth();
  const { isInWatchLater, toggleWatchLater } = useWatchLater();
  const { toast } = useToast();

  const videoUrl = typeof window !== 'undefined' ? `${window.location.origin}/watch/${id}` : '';

  useEffect(() => {
    const loadVideo = async () => {
      if (!id) return;
      setIsLoading(true);
      const data = await api.getVideo(id);
      setVideo(data);

      const allVideos = await api.getVideos();
      setRelatedVideos(allVideos.filter(v => v.id !== Number(id)).slice(0, 8));
      setIsLoading(false);
    };

    loadVideo();
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated) return toast({ title: "Login required", description: "Please login to like videos.", variant: "destructive" });
    if (!video) return;

    const result = await api.likeVideo(video.id);
    if (result.success) {
      setIsLiked(true);
      setIsDisliked(false);
      toast({ title: "Video liked!" });
    } else {
      toast({ title: "Already liked", description: result.error });
    }
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  const handleWatchLater = () => {
    if (!video) return;
    const added = toggleWatchLater(video.id);
    toast({ title: added ? "Added to Watch Later" : "Removed from Watch Later" });
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(videoUrl);
    setCopied(true);
    toast({ title: "Link copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComment = async () => {
    if (!isAuthenticated) return toast({ title: "Login required", description: "Please login to comment.", variant: "destructive" });
    if (!comment.trim() || !video) return;

    setIsSubmittingComment(true);
    const result = await api.addComment(video.id, comment);
    setIsSubmittingComment(false);

    if (result.error) {
      toast({ title: "Failed to add comment", description: result.error, variant: "destructive" });
    } else {
      setComment("");
      toast({ title: "Comment added!" });
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

  const uploaderName = video.uploader?.username || "Unknown";
  const uploaderInitial = uploaderName.charAt(0).toUpperCase();
  const inWatchLater = isInWatchLater(video.id);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => {}} />
      <main className="pt-20 px-4 pb-8">
        <div className="max-w-screen-2xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <VideoPlayer
                videoFilename={video.filename}
                thumbnail={video.thumbnail}
                title={video.title}
              />

              <h1 className="font-display font-bold text-xl md:text-2xl text-foreground">{video.title}</h1>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Link to={`/channel/${video.userId}`} className="flex items-center gap-3 hover:opacity-80 transition">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-medium">{uploaderInitial}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{uploaderName}</h3>
                    <p className="text-muted-foreground text-xs">Channel</p>
                  </div>
                </Link>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center bg-secondary rounded-full overflow-hidden">
                    <Button variant="ghost" onClick={handleLike} className={cn("rounded-none rounded-l-full hover:bg-secondary/80 px-4", isLiked && "text-primary")}>
                      <ThumbsUp className={cn("w-4 h-4 mr-2", isLiked && "fill-current")} />
                      Like
                    </Button>
                    <div className="w-px h-6 bg-border" />
                    <Button variant="ghost" onClick={handleDislike} className={cn("rounded-none rounded-r-full hover:bg-secondary/80 px-4", isDisliked && "text-primary")}>
                      <ThumbsDown className={cn("w-4 h-4", isDisliked && "fill-current")} />
                    </Button>
                  </div>

                  <Button
                    variant="secondary"
                    onClick={handleWatchLater}
                    className={cn("rounded-full", inWatchLater && "text-primary")}
                  >
                    <Clock className={cn("w-4 h-4 mr-2", inWatchLater && "fill-current")} />
                    {inWatchLater ? "Saved" : "Watch Later"}
                  </Button>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="secondary" className="rounded-full">
                        <Share2 className="w-4 h-4 mr-2" /> Share
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4 bg-card border-border">
                      <h4 className="font-medium text-foreground mb-2">Share this video</h4>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={videoUrl}
                          className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                        />
                        <Button size="icon" onClick={handleCopyLink} className="shrink-0">
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Button variant="secondary" size="icon" className="rounded-full">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <span>{formatViews(video.views)}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(video.createdAt)}</span>
                </div>
                <p className={cn("text-sm text-foreground/90 whitespace-pre-wrap", !isDescriptionExpanded && "line-clamp-3")}>
                  {video.description || "No description available."}
                </p>
                <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className="text-sm font-medium text-foreground mt-2 hover:text-primary">
                  {isDescriptionExpanded ? "Show less" : "Show more"}
                </button>
              </div>

              <div className="space-y-4">
                <h2 className="font-display font-semibold text-lg text-foreground">Comments</h2>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <span className="text-muted-foreground text-sm">{isAuthenticated ? "U" : "?"}</span>
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
                        <Send className="w-4 h-4 mr-2" /> Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-display font-semibold text-lg text-foreground">Related Videos</h2>
              <div className="space-y-3">
                {relatedVideos.map((v, i) => (
                  <Link key={v.id} to={`/watch/${v.id}`} className="flex gap-3 group animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="relative w-40 shrink-0 aspect-video rounded-lg overflow-hidden bg-card">
                      <img src={getThumbnailUrl(v.thumbnail, v.id)} alt={v.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary">{v.title}</h3>
                      <p className="text-muted-foreground text-xs mt-1">{v.uploader?.username || "Unknown"}</p>
                      <p className="text-muted-foreground text-xs">{formatViews(v.views)} • {formatRelativeTime(v.createdAt)}</p>
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
}
