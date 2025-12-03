import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { VideoGrid } from '@/components/VideoGrid';
import { api, Video, categories } from '@/lib/api';
import { cn } from '@/lib/utils';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      const data = await api.getVideos();
      setVideos(data);
      setIsLoading(false);
    };
    fetchVideos();
  }, [activeCategory]);

  const activeCategoryName = categories.find(c => c.id === activeCategory)?.name || 'All';

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar
        isOpen={sidebarOpen}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <main
        className={cn(
          "pt-20 pb-8 px-4 transition-all duration-300",
          sidebarOpen ? "ml-56" : "ml-16"
        )}
      >
        {/* Category Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200",
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Section Title */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-foreground">
            {activeCategoryName === 'All' ? 'All Videos' : activeCategoryName}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isLoading ? 'Loading videos...' : `${videos.length} videos`}
          </p>
        </div>

        {/* Video Grid */}
        <VideoGrid videos={videos} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default Index;
