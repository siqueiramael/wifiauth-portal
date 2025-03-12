
import React, { useState } from 'react';
import { WifiUser } from '@/models/user';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface UnitUsersListProps {
  users: WifiUser[];
  unitId: string;
  onSaveAccess: (userIds: string[], hasAccess: boolean) => void;
  isPending: boolean;
}

const UnitUsersList: React.FC<UnitUsersListProps> = ({ 
  users, 
  unitId, 
  onSaveAccess,
  isPending 
}) => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  
  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };
  
  const toggleAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(users.map(user => user.id));
    } else {
      setSelectedUserIds([]);
    }
  };
  
  const handleGrantAccess = () => {
    if (selectedUserIds.length > 0) {
      onSaveAccess(selectedUserIds, true);
      setSelectedUserIds([]);
    }
  };
  
  const handleRevokeAccess = () => {
    if (selectedUserIds.length > 0) {
      onSaveAccess(selectedUserIds, false);
      setSelectedUserIds([]);
    }
  };
  
  const usersWithAccess = users.filter(user => user.unitIds.includes(unitId));
  const usersWithoutAccess = users.filter(user => !user.unitIds.includes(unitId));
  
  const allUsers = [...usersWithAccess, ...usersWithoutAccess];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="select-all-users"
            checked={selectedUserIds.length === users.length}
            onCheckedChange={(checked) => toggleAllUsers(!!checked)}
          />
          <label 
            htmlFor="select-all-users" 
            className="text-sm font-medium"
          >
            Selecionar todos os usuários
          </label>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGrantAccess}
            disabled={isPending || selectedUserIds.length === 0}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Permitir Acesso
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRevokeAccess}
            disabled={isPending || selectedUserIds.length === 0}
            className="text-destructive border-destructive hover:bg-destructive/10"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Revogar Acesso
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Nome de Usuário</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Acesso nesta Unidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  Nenhum usuário cadastrado no sistema
                </TableCell>
              </TableRow>
            ) : (
              allUsers.map((user) => {
                const hasAccess = user.unitIds.includes(unitId);
                
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedUserIds.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {user.status === 'active' ? 'Ativo' : 'Bloqueado'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        hasAccess 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400'
                      }`}>
                        {hasAccess ? 'Permitido' : 'Sem Acesso'}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UnitUsersList;
