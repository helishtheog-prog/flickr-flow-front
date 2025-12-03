const API_BASE_URL = 'http://172.105.182.143:3000';

// Token management
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Auth headers helper
const authHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Types matching your backend models
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: number;
  title: string;
  description: string | null;
  filename: string;
  thumbnail: string | null;
  views: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  uploader?: {
    id: number;
    username: string;
    email: string;
  };
}

export interface Comment {
  id: number;
  content: string;
  VideoId: number;
  UserId: number;
  createdAt: string;
  User?: User;
}

export interface Like {
  id: number;
  VideoId: number;
  UserId: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

// Helper to get video URLs
export const getVideoStreamUrl = (videoId: number): string => {
  return `${API_BASE_URL}/api/videos/${videoId}/stream`;
};

export const getThumbnailUrl = (thumbnail: string | null, videoId: number): string => {
  if (thumbnail) {
    return `${API_BASE_URL}/uploads/thumbnails/${thumbnail}`;
  }
  return `${API_BASE_URL}/uploads/thumbnails/${videoId}.png`;
};

// Format relative time
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  if (diffWeeks > 0) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  return 'Just now';
};

// API functions
export const api = {
  // Auth
  async signup(username: string, email: string, password: string): Promise<{ token?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Signup failed');
      if (data.token) setToken(data.token);
      return { token: data.token };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Signup failed' };
    }
  },

  async login(email: string, password: string): Promise<{ token?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Login failed');
      if (data.token) setToken(data.token);
      return { token: data.token };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Login failed' };
    }
  },

  logout(): void {
    removeToken();
  },

  isAuthenticated(): boolean {
    return !!getToken();
  },

  // Videos
  async getVideos(): Promise<Video[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/videos`);
      if (!response.ok) throw new Error('Failed to fetch videos');
      return response.json();
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  },

  async getVideo(id: string | number): Promise<Video | null> {
    try {
      const videos = await this.getVideos();
      return videos.find(v => v.id === Number(id)) || null;
    } catch (error) {
      console.error('Error fetching video:', error);
      return null;
    }
  },

  async searchVideos(query: string): Promise<Video[]> {
    try {
      const videos = await this.getVideos();
      const lowerQuery = query.toLowerCase();
      return videos.filter(v => 
        v.title.toLowerCase().includes(lowerQuery) ||
        v.description?.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Error searching videos:', error);
      return [];
    }
  },

  async uploadVideo(formData: FormData): Promise<{ video?: Video; error?: string }> {
    try {
      const token = getToken();
      if (!token) throw new Error('Please login to upload videos');
      
      const response = await fetch(`${API_BASE_URL}/api/videos/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Upload failed');
      return { video: data.video };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Upload failed' };
    }
  },

  // Comments
  async getComments(videoId: number): Promise<Comment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${videoId}`);
      if (!response.ok) return [];
      return response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  async addComment(videoId: number, content: string): Promise<{ comment?: Comment; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${videoId}`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Failed to add comment');
      return { comment: data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to add comment' };
    }
  },

  // Likes
  async likeVideo(videoId: number): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/likes/${videoId}`, {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Failed to like video');
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to like video' };
    }
  },

  // Users/Channels
  async getUser(id: number): Promise<{ user: User; videos: Video[] } | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`);
      if (!response.ok) throw new Error('User not found');
      return response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },
};

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
