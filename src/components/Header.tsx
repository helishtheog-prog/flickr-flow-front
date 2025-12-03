import { useState } from 'react';
import { Search, Menu, Upload, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle: () => void;
  onSearch?: (query: string) => void;
}

export const Header = ({ onMenuToggle, onSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border h-16 flex items-center px-4">
      <div className="flex items-center gap-4 flex-1">
        {/* Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="text-foreground hover:bg-secondary"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
            <span className="text-primary-foreground font-display font-bold text-lg">V</span>
          </div>
          <span className="font-display font-bold text-xl text-foreground hidden sm:block">
            Video<span className="text-gradient">Hub</span>
          </span>
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary border-border focus:border-primary focus:ring-primary/20 rounded-full pl-4 pr-12 h-10 text-foreground placeholder:text-muted-foreground"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 bg-transparent hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-full h-8 w-8"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Right Actions */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground hover:bg-secondary hidden sm:flex"
        >
          <Upload className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground hover:bg-secondary hidden sm:flex"
        >
          <Bell className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground hover:bg-secondary rounded-full"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
