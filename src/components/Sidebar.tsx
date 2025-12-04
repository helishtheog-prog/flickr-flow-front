import { Home, TrendingUp, Music, Gamepad2, Cpu, GraduationCap, Plane, Trophy, Clock, ThumbsUp, ListVideo } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { categories } from '@/lib/api';

interface SidebarProps {
  isOpen: boolean;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  TrendingUp,
  Music,
  Gamepad2,
  Cpu,
  GraduationCap,
  Plane,
  Trophy,
};

export const Sidebar = ({ isOpen, activeCategory, onCategoryChange }: SidebarProps) => {
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border z-40 transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? "w-56" : "w-16"
      )}
    >
      <nav className="flex flex-col p-2 gap-1">
        {/* Categories */}
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Home;
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 shrink-0 transition-colors",
                isActive && "text-primary"
              )} />
              <span className={cn(
                "font-medium text-sm whitespace-nowrap transition-opacity",
                isOpen ? "opacity-100" : "opacity-0 w-0"
              )}>
                {category.name}
              </span>
            </button>
          );
        })}

        {/* Divider */}
        <div className={cn(
          "border-t border-sidebar-border my-2",
          !isOpen && "mx-2"
        )} />

        {/* User Section */}
        <Link
          to="/watch-later"
          className="flex items-center gap-4 px-3 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
        >
          <Clock className="h-5 w-5 shrink-0" />
          <span className={cn(
            "font-medium text-sm whitespace-nowrap transition-opacity",
            isOpen ? "opacity-100" : "opacity-0 w-0"
          )}>
            Watch Later
          </span>
        </Link>
        <button className="flex items-center gap-4 px-3 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200">
          <ThumbsUp className="h-5 w-5 shrink-0" />
          <span className={cn(
            "font-medium text-sm whitespace-nowrap transition-opacity",
            isOpen ? "opacity-100" : "opacity-0 w-0"
          )}>
            Liked Videos
          </span>
        </button>
        <button className="flex items-center gap-4 px-3 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200">
          <ListVideo className="h-5 w-5 shrink-0" />
          <span className={cn(
            "font-medium text-sm whitespace-nowrap transition-opacity",
            isOpen ? "opacity-100" : "opacity-0 w-0"
          )}>
            Playlists
          </span>
        </button>
      </nav>
    </aside>
  );
};
