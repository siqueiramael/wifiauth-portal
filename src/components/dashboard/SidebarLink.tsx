
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

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

export default SidebarLink;
