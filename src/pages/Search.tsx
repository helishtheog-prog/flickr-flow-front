import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { VideoGrid } from '@/components/VideoGrid';
import { api, Video } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const searchVideos = async () => {
      if (!query) {
        setVideos([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const data = await api.searchVideos(query);
      setVideos(data);
      setIsLoading(false);
    };
    searchVideos();
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar
        isOpen={sidebarOpen}
        activeCategory="all"
        onCategoryChange={() => {}}
      />

      <main
        className={cn(
          "pt-20 pb-8 px-4 transition-all duration-300",
          sidebarOpen ? "ml-56" : "ml-16"
        )}
      >
        {/* Search Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <SearchIcon className="w-6 h-6 text-muted-foreground" />
            <h1 className="font-display font-bold text-2xl text-foreground">
              Search Results
            </h1>
          </div>
          <p className="text-muted-foreground">
            {isLoading
              ? 'Searching...'
              : `${videos.length} results for "${query}"`}
          </p>
        </div>

        {/* Results */}
        <VideoGrid videos={videos} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default Search;
