import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import { Header } from "@/components/Header";
import { VideoCard } from "@/components/VideoCard";
import { api, Video, User } from "@/lib/api";

export default function Channel() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChannel = async () => {
      if (!id) return;
      setIsLoading(true);
      
      const data = await api.getUser(Number(id));
      if (data) {
        setUser(data.user);
        setVideos(data.videos);
      }
      setIsLoading(false);
    };

    loadChannel();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onMenuToggle={() => {}} />
        <div className="pt-20 px-4 animate-pulse">
          <div className="max-w-screen-xl mx-auto">
            <div className="h-48 bg-card rounded-xl mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-video bg-card rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header onMenuToggle={() => {}} />
        <div className="pt-20 px-4">
          <div className="max-w-screen-xl mx-auto text-center py-16">
            <h1 className="text-2xl font-bold text-foreground mb-2">Channel not found</h1>
            <p className="text-muted-foreground mb-4">This channel doesn't exist or has been removed.</p>
            <Link to="/" className="text-primary hover:underline">Go back home</Link>
          </div>
        </div>
      </div>
    );
  }

  const initial = user.username.charAt(0).toUpperCase();
  // Mock subscriber count - backend doesn't have this yet
  const subscriberCount = Math.floor(Math.random() * 10000) + 100;

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => {}} />
      <main className="pt-20 px-4 pb-8">
        <div className="max-w-screen-xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>

          {/* Channel Banner */}
          <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary rounded-xl overflow-hidden mb-6">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgNmg2djZoLTZ2LTZ6bTYgNmg2djZoLTZ2LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
          </div>

          {/* Channel Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 -mt-16 px-4 relative z-10">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/20 border-4 border-background flex items-center justify-center shadow-lg">
              <span className="text-primary font-bold text-4xl md:text-5xl">{initial}</span>
            </div>
            <div className="flex-1">
              <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">{user.username}</h1>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{subscriberCount.toLocaleString()} subscribers</span>
                </div>
                <span className="text-sm">{videos.length} videos</span>
              </div>
            </div>
          </div>

          {/* Videos */}
          <div className="mt-8">
            <h2 className="font-display font-semibold text-xl text-foreground mb-4">Videos</h2>
            {videos.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-xl">
                <p className="text-muted-foreground">This channel hasn't uploaded any videos yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videos.map((video, index) => (
                  <VideoCard key={video.id} video={video} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
