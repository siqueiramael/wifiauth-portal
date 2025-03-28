import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
        ${isActive 
          ? 'bg-accent text-accent-foreground' 
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        }`}
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

export default SidebarLink;
