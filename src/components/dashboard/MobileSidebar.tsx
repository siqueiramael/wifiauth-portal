
import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { X, LogOut, LayoutDashboard, Users, Router, WifiIcon, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SidebarLink from './SidebarLink';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose, onLogout }) => {
  const location = useLocation();

  return (
    <div 
      className={cn(
        "lg:hidden fixed inset-0 z-20 bg-background/80 backdrop-blur-sm transition-all-300",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
      onClick={onClose}
    >
      <div 
        className={cn(
          "absolute top-0 left-0 h-full w-64 bg-card border-r p-4 shadow-lg transition-all-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <WifiIcon className="h-6 w-6 text-primary mr-2" />
            <span className="font-semibold text-xl">WiFiAuth</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
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
            to="/units" 
            icon={<Building size={18} />} 
            label="Unidades" 
            active={location.pathname === '/units'} 
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
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
