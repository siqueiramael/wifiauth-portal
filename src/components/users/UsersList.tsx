
import React from 'react';
import { WifiUser } from '@/models/user';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Building, WifiOff, MoreVertical, UserPlus, Lock, Unlock, Trash2 } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/Spinner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UsersListProps {
  users: WifiUser[];
  isLoading: boolean;
  onEditUser: (user: WifiUser) => void;
  onDeleteUser: (user: WifiUser) => void;
  onToggleStatus: (userId: string) => void;
  onManageUnits: (user: WifiUser) => void;
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  isLoading,
  onEditUser,
  onDeleteUser,
  onToggleStatus,
  onManageUnits
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Data inválida';
    }
  };

  const getUserUnits = (user: WifiUser) => {
    return user.unitIds.length === 0 ? 'Nenhuma' : `${user.unitIds.length} unidade(s)`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/50 rounded-lg">
        <WifiOff className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Nenhum usuário encontrado</h3>
        <p className="text-muted-foreground">
          Tente ajustar seus termos de pesquisa ou filtros
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Nome/Email</TableHead>
            <TableHead>Nome de Usuário</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Criado</TableHead>
            <TableHead>Último Login</TableHead>
            <TableHead>Unidades</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell 
                className="font-medium cursor-pointer hover:text-primary"
                onClick={() => onEditUser(user)}
              >
                <div className="flex flex-col">
                  <span>{user.fullName || user.email}</span>
                  {user.fullName && <span className="text-sm text-muted-foreground">{user.email}</span>}
                </div>
              </TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.userType ? user.userType.replace('_', ' ') : 'Usuário WiFi'}</TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
              <TableCell>{formatDate(user.lastLogin)}</TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-muted"
                  onClick={() => onManageUnits(user)}
                >
                  <Building className="h-3.5 w-3.5 mr-1" />
                  {getUserUnits(user)}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full text-xs font-medium ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                  onClick={() => onToggleStatus(user.id)}
                >
                  {user.status === 'active' ? (
                    <>
                      <span>Ativo</span>
                      <Lock className="ml-1 h-3 w-3" />
                    </>
                  ) : (
                    <>
                      <span>Bloqueado</span>
                      <Unlock className="ml-1 h-3 w-3" />
                    </>
                  )}
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onEditUser(user)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Editar Usuário
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onManageUnits(user)}
                    >
                      <Building className="h-4 w-4 mr-2" />
                      Gerenciar Unidades
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onToggleStatus(user.id)}
                    >
                      {user.status === 'active' ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Bloquear Acesso
                        </>
                      ) : (
                        <>
                          <Unlock className="h-4 w-4 mr-2" />
                          Desbloquear Acesso
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteUser(user)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir Usuário
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersList;
