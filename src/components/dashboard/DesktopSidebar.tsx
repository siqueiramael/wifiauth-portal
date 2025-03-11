
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Router, WifiIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SidebarLink from './SidebarLink';

interface DesktopSidebarProps {
  onLogout: () => void;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ onLogout }) => {
  const location = useLocation();
  
  return (
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
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
