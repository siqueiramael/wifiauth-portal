
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface UsersHeaderProps {
  onNewUser: () => void;
}

const UsersHeader: React.FC<UsersHeaderProps> = ({ onNewUser }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Usuários WiFi</h1>
      <Button onClick={onNewUser}>
        <UserPlus className="h-4 w-4 mr-2" />
        Adicionar Novo Usuário
      </Button>
    </div>
  );
};

export default UsersHeader;
