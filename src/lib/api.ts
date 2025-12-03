const API_BASE_URL = 'http://172.105.182.143';

export interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  duration: string;
  views: number;
  uploadedAt: string;
  channel: {
    name: string;
    avatar: string;
  };
  videoUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

// API functions - these will connect to your backend
export const api = {
  // Fetch all videos
  async getVideos(): Promise<Video[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/videos`);
      if (!response.ok) throw new Error('Failed to fetch videos');
      return response.json();
    } catch (error) {
      console.error('Error fetching videos:', error);
      return mockVideos;
    }
  },

  // Fetch single video by ID
  async getVideo(id: string): Promise<Video | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/videos/${id}`);
      if (!response.ok) throw new Error('Failed to fetch video');
      return response.json();
    } catch (error) {
      console.error('Error fetching video:', error);
      return mockVideos.find(v => v.id === id) || null;
    }
  },

  // Search videos
  async searchVideos(query: string): Promise<Video[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/videos/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search videos');
      return response.json();
    } catch (error) {
      console.error('Error searching videos:', error);
      return mockVideos.filter(v => 
        v.title.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  // Get videos by category
  async getVideosByCategory(categoryId: string): Promise<Video[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/videos/category/${categoryId}`);
      if (!response.ok) throw new Error('Failed to fetch category videos');
      return response.json();
    } catch (error) {
      console.error('Error fetching category videos:', error);
      return mockVideos;
    }
  },
};

// Mock data for development/fallback
export const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Building Modern Web Apps with React',
    description: 'Learn how to build scalable web applications using React and modern tooling.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&h=360&fit=crop',
    duration: '14:32',
    views: 125000,
    uploadedAt: '2 days ago',
    channel: { name: 'TechMaster', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
  },
  {
    id: '2',
    title: 'The Art of Cinematic Photography',
    description: 'Explore the techniques used by professional cinematographers.',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=640&h=360&fit=crop',
    duration: '21:45',
    views: 89000,
    uploadedAt: '5 days ago',
    channel: { name: 'FilmCraft', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  },
  {
    id: '3',
    title: 'Music Production Masterclass',
    description: 'Create professional-quality music from your home studio.',
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=640&h=360&fit=crop',
    duration: '45:12',
    views: 234000,
    uploadedAt: '1 week ago',
    channel: { name: 'BeatLab', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  },
  {
    id: '4',
    title: 'Exploring the Mountains of Norway',
    description: 'A breathtaking journey through the Scandinavian wilderness.',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&h=360&fit=crop',
    duration: '18:20',
    views: 456000,
    uploadedAt: '3 days ago',
    channel: { name: 'Wanderlust', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  },
  {
    id: '5',
    title: 'Startup Success Stories',
    description: 'Interviews with founders who built billion-dollar companies.',
    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=640&h=360&fit=crop',
    duration: '32:15',
    views: 178000,
    uploadedAt: '1 day ago',
    channel: { name: 'Founders Hub', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop' },
  },
  {
    id: '6',
    title: 'Advanced Machine Learning Concepts',
    description: 'Deep dive into neural networks and AI architectures.',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=640&h=360&fit=crop',
    duration: '52:30',
    views: 312000,
    uploadedAt: '4 days ago',
    channel: { name: 'AI Academy', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop' },
  },
  {
    id: '7',
    title: 'Cooking Italian Cuisine at Home',
    description: 'Master authentic Italian recipes with simple ingredients.',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=640&h=360&fit=crop',
    duration: '28:45',
    views: 567000,
    uploadedAt: '6 days ago',
    channel: { name: 'Chef Marco', avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&h=100&fit=crop' },
  },
  {
    id: '8',
    title: 'Urban Street Photography Guide',
    description: 'Capture the energy of city life through your lens.',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=640&h=360&fit=crop',
    duration: '16:55',
    views: 98000,
    uploadedAt: '2 weeks ago',
    channel: { name: 'StreetShots', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  },
];

export const categories: Category[] = [
  { id: 'all', name: 'All', icon: 'Home' },
  { id: 'trending', name: 'Trending', icon: 'TrendingUp' },
  { id: 'music', name: 'Music', icon: 'Music' },
  { id: 'gaming', name: 'Gaming', icon: 'Gamepad2' },
  { id: 'tech', name: 'Technology', icon: 'Cpu' },
  { id: 'education', name: 'Education', icon: 'GraduationCap' },
  { id: 'travel', name: 'Travel', icon: 'Plane' },
  { id: 'sports', name: 'Sports', icon: 'Trophy' },
];
