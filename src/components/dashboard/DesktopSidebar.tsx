import React from 'react';
import SidebarLink from './SidebarLink';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Settings, 
  LogOut,
  Router,
  Shield
} from 'lucide-react';

interface DesktopSidebarProps {
  onLogout: () => void;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ onLogout }) => {
  const { admin } = useAuth();

  return (
    <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 z-10">
      <div className="flex flex-col h-full w-56 bg-card border-r border-border">
        <div className="px-3 py-2 h-14 flex items-center border-b border-border">
          <span className="font-bold text-lg">WiFiAuth</span>
        </div>

        <div className="flex-1 flex flex-col py-4 px-3 space-y-1">
          <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />}>
            Dashboard
          </SidebarLink>
          <SidebarLink to="/users" icon={<Users size={20} />}>
            Usuários
          </SidebarLink>
          <SidebarLink to="/units" icon={<Building2 size={20} />}>
            Unidades
          </SidebarLink>
          <SidebarLink to="/controllers" icon={<Router size={20} />}>
            Controladores
          </SidebarLink>
          <SidebarLink to="/policies" icon={<Shield size={20} />}>
            Políticas de Uso
          </SidebarLink>
        </div>

        <div className="p-3 border-t border-border">
          <div className="mb-2">
            <p className="text-sm font-medium truncate">{admin?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{admin?.email}</p>
          </div>
          <div className="space-y-1">
            <SidebarLink to="/settings" icon={<Settings size={20} />}>
              Configurações
            </SidebarLink>
            <SidebarLink to="#" icon={<LogOut size={20} />} onClick={onLogout}>
              Sair
            </SidebarLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
