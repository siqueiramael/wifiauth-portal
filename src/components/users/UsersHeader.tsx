
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users } from 'lucide-react';

interface UsersHeaderProps {
  userCount: number;
  onAddUser: () => void;
}

const UsersHeader: React.FC<UsersHeaderProps> = ({ userCount, onAddUser }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-6 w-6" />
          Usuários WiFi
        </h1>
        <p className="text-muted-foreground">
          Gerencie o acesso dos usuários à rede sem fio
          {userCount > 0 && (
            <> • <span>{userCount} usuários ativos</span></>
          )}
        </p>
      </div>
      
      <Button onClick={onAddUser}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Adicionar Usuário
      </Button>
    </div>
  );
};

export default UsersHeader;
