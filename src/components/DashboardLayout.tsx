
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
    <div className="admin-grid">
      {/* Mobile header */}
      <MobileHeader 
        adminName={admin?.name}
        adminEmail={admin?.email}
        onMenuToggle={toggleSidebar}
        onLogout={handleLogout}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        onLogout={handleLogout}
      />

      {/* Desktop Sidebar */}
      <DesktopSidebar onLogout={handleLogout} />

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
