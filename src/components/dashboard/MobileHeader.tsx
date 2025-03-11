
import React from 'react';
import { Menu, WifiIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface MobileHeaderProps {
  adminName?: string;
  adminEmail?: string;
  onMenuToggle: () => void;
  onLogout: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  adminName, 
  adminEmail, 
  onMenuToggle, 
  onLogout 
}) => {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-md border-b p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2" 
          onClick={onMenuToggle}
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
            <AvatarFallback>{adminName?.charAt(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{adminName}</DropdownMenuLabel>
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            {adminEmail}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout} className="text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default MobileHeader;
