
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  WifiIcon,
  Router
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={cn(
      'flex items-center gap-3 px-3 py-2 rounded-md transition-all-200',
      active 
        ? 'bg-primary text-primary-foreground shadow-sm' 
        : 'text-foreground/70 hover:text-foreground hover:bg-secondary'
    )}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-grid">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-md border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} />
          </Button>
          <div className="flex items-center">
            <WifiIcon className="h-6 w-6 text-primary mr-2" />
            <span className="font-semibold text-xl">WiFiAuth</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback>{admin?.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{admin?.name}</DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {admin?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Sidebar - Mobile */}
      <div 
        className={cn(
          "lg:hidden fixed inset-0 z-20 bg-background/80 backdrop-blur-sm transition-all-300",
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeSidebar}
      >
        <div 
          className={cn(
            "absolute top-0 left-0 h-full w-64 bg-card border-r p-4 shadow-lg transition-all-300",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <WifiIcon className="h-6 w-6 text-primary mr-2" />
              <span className="font-semibold text-xl">WiFiAuth</span>
            </div>
            <Button variant="ghost" size="icon" onClick={closeSidebar}>
              <X size={18} />
            </Button>
          </div>

          <nav className="space-y-1 mt-6">
            <SidebarLink 
              to="/dashboard" 
              icon={<LayoutDashboard size={18} />} 
              label="Dashboard" 
              active={location.pathname === '/dashboard'} 
            />
            <SidebarLink 
              to="/users" 
              icon={<Users size={18} />} 
              label="WiFi Users" 
              active={location.pathname === '/users'} 
            />
            <SidebarLink 
              to="/controllers" 
              icon={<Router size={18} />} 
              label="Controllers" 
              active={location.pathname === '/controllers'} 
            />
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Button 
              variant="outline" 
              className="w-full justify-start text-destructive" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block bg-card border-r p-4">
        <div className="flex items-center mb-6">
          <WifiIcon className="h-6 w-6 text-primary mr-2" />
          <span className="font-semibold text-xl">WiFiAuth</span>
        </div>

        <nav className="space-y-1 mt-6">
          <SidebarLink 
            to="/dashboard" 
            icon={<LayoutDashboard size={18} />} 
            label="Dashboard" 
            active={location.pathname === '/dashboard'} 
          />
          <SidebarLink 
            to="/users" 
            icon={<Users size={18} />} 
            label="WiFi Users" 
            active={location.pathname === '/users'} 
          />
          <SidebarLink 
            to="/controllers" 
            icon={<Router size={18} />} 
            label="Controllers" 
            active={location.pathname === '/controllers'} 
          />
        </nav>

        <div className="absolute bottom-4 left-4 right-4 w-[228px]">
          <Button 
            variant="outline" 
            className="w-full justify-start text-destructive" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="bg-background min-h-screen">
        <div className="container mx-auto p-4 pt-6 lg:p-8 max-w-7xl">
          {/* Mobile spacing */}
          <div className="h-12 lg:hidden"></div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
