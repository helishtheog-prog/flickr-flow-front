import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WatchLaterContextType {
  watchLaterIds: number[];
  addToWatchLater: (videoId: number) => void;
  removeFromWatchLater: (videoId: number) => void;
  isInWatchLater: (videoId: number) => boolean;
  toggleWatchLater: (videoId: number) => boolean;
}

const WatchLaterContext = createContext<WatchLaterContextType | null>(null);

export const WatchLaterProvider = ({ children }: { children: ReactNode }) => {
  const [watchLaterIds, setWatchLaterIds] = useState<number[]>(() => {
    const stored = localStorage.getItem('watchLater');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('watchLater', JSON.stringify(watchLaterIds));
  }, [watchLaterIds]);

  const addToWatchLater = (videoId: number) => {
    setWatchLaterIds(prev => prev.includes(videoId) ? prev : [...prev, videoId]);
  };

  const removeFromWatchLater = (videoId: number) => {
    setWatchLaterIds(prev => prev.filter(id => id !== videoId));
  };

  const isInWatchLater = (videoId: number) => watchLaterIds.includes(videoId);

  const toggleWatchLater = (videoId: number) => {
    if (isInWatchLater(videoId)) {
      removeFromWatchLater(videoId);
      return false;
    } else {
      addToWatchLater(videoId);
      return true;
    }
  };

  return (
    <WatchLaterContext.Provider value={{ watchLaterIds, addToWatchLater, removeFromWatchLater, isInWatchLater, toggleWatchLater }}>
      {children}
    </WatchLaterContext.Provider>
  );
};

export const useWatchLater = () => {
  const context = useContext(WatchLaterContext);
  if (!context) throw new Error('useWatchLater must be used within WatchLaterProvider');
  return context;
};
