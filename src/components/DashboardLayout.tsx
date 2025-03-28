
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DesktopSidebar from './dashboard/DesktopSidebar';
import MobileSidebar from './dashboard/MobileSidebar';
import MobileHeader from './dashboard/MobileHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background w-full">
      {/* Desktop Sidebar */}
      <DesktopSidebar onLogout={handleLogout} />

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Mobile header */}
        <MobileHeader 
          adminName={admin?.name}
          adminEmail={admin?.email}
          onMenuToggle={toggleSidebar}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-4 pt-6 lg:p-8 w-full max-w-full">
          {/* Mobile spacing for header */}
          <div className="h-12 lg:hidden"></div>
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
