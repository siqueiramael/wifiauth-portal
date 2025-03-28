import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import SidebarLink from './SidebarLink';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Settings, 
  LogOut,
  Router,
  Shield
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose, onLogout }) => {
  const { admin } = useAuth();

  const handleLinkClick = () => {
    onClose();
  };

  const handleLogout = () => {
    onClose();
    onLogout();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0 w-60">
        <div className="flex flex-col h-full">
          <div className="px-3 py-2 h-14 flex items-center border-b">
            <span className="font-bold text-lg">WiFiAuth</span>
          </div>

          <div className="flex-1 flex flex-col py-4 px-3 space-y-1">
            <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} onClick={handleLinkClick}>
              Dashboard
            </SidebarLink>
            <SidebarLink to="/users" icon={<Users size={20} />} onClick={handleLinkClick}>
              Usuários
            </SidebarLink>
            <SidebarLink to="/units" icon={<Building2 size={20} />} onClick={handleLinkClick}>
              Unidades
            </SidebarLink>
            <SidebarLink to="/controllers" icon={<Router size={20} />} onClick={handleLinkClick}>
              Controladores
            </SidebarLink>
            <SidebarLink to="/policies" icon={<Shield size={20} />} onClick={handleLinkClick}>
              Políticas de Uso
            </SidebarLink>
          </div>

          <div className="p-3 border-t">
            <div className="mb-2">
              <p className="text-sm font-medium truncate">{admin?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{admin?.email}</p>
            </div>
            <div className="space-y-1">
              <SidebarLink to="/settings" icon={<Settings size={20} />} onClick={handleLinkClick}>
                Configurações
              </SidebarLink>
              <SidebarLink to="#" icon={<LogOut size={20} />} onClick={handleLogout}>
                Sair
              </SidebarLink>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
