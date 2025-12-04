import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { Header } from "@/components/Header";
import { VideoCard } from "@/components/VideoCard";
import { api, Video } from "@/lib/api";
import { useWatchLater } from "@/hooks/useWatchLater";

export default function WatchLater() {
  const { watchLaterIds } = useWatchLater();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      setIsLoading(true);
      const allVideos = await api.getVideos();
      const filtered = allVideos.filter(v => watchLaterIds.includes(v.id));
      setVideos(filtered);
      setIsLoading(false);
    };

    loadVideos();
  }, [watchLaterIds]);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => {}} />
      <main className="pt-20 px-4 pb-8">
        <div className="max-w-screen-xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground">Watch Later</h1>
              <p className="text-muted-foreground text-sm">{videos.length} videos</p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-video bg-card rounded-xl" />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-xl">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-medium text-foreground mb-2">No videos saved</h2>
              <p className="text-muted-foreground">Videos you save to Watch Later will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map((video, index) => (
                <VideoCard key={video.id} video={video} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
