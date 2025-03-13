
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchUsers, 
  createUser, 
  toggleUserStatus, 
  deleteUser,
  updateUserUnits,
  updateUser,
} from '@/services/userService';
import { fetchUnits } from '@/services/unitService';
import { WifiUser, Unit } from '@/models/user';
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Spinner } from '@/components/Spinner';
import { 
  UserPlus, 
  MoreVertical, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  Trash2,
  Search,
  WifiOff,
  Loader2,
  Building,
  Filter,
  SlidersHorizontal,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Importando nossos componentes
import UserForm from '@/components/users/UserForm';
import ManageUserUnitsSheet from '@/components/users/ManageUserUnitsSheet';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newUserDialog, setNewUserDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; userId: string | null }>({
    open: false,
    userId: null
  });
  const [manageUnitsSheet, setManageUnitsSheet] = useState<{ open: boolean; user: WifiUser | null }>({
    open: false,
    user: null
  });
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
  const [editUserDialog, setEditUserDialog] = useState<{ open: boolean; user: WifiUser | null }>({
    open: false,
    user: null
  });
  
  // Filtering states
  const [unitFilter, setUnitFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const defaultNewUser = {
    email: '',
    username: '',
    password: '',
    unitIds: [] as string[],
    fullName: '',
    cpf: '',
    userType: 'wifi_user',
    phone: '',
    registrationNumber: '',
    grantWifiAccess: true,
    profile: 'standard',
    status: 'active',
    expirationDate: null as Date | null,
  };
  
  const [newUser, setNewUser] = useState(defaultNewUser);
  
  const queryClient = useQueryClient();
  
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });
  
  const { data: units = [], isLoading: unitsLoading } = useQuery({
    queryKey: ['units'],
    queryFn: fetchUnits
  });
  
  // Set up the edit user form when a user is selected for editing
  useEffect(() => {
    if (editUserDialog.user) {
      setNewUser({
        ...editUserDialog.user,
        password: '',  // Don't expose the password
        grantWifiAccess: true,  // Assume they have WiFi access if they're being edited
        fullName: editUserDialog.user.fullName || '',
        cpf: editUserDialog.user.cpf || '',
        userType: editUserDialog.user.userType || 'wifi_user',
        phone: editUserDialog.user.phone || '',
        registrationNumber: editUserDialog.user.registrationNumber || '',
        profile: editUserDialog.user.profile || 'standard',
        expirationDate: editUserDialog.user.expirationDate ? new Date(editUserDialog.user.expirationDate) : null,
      });
    }
  }, [editUserDialog.user]);
  
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Usuário criado com sucesso');
      setNewUserDialog(false);
      setNewUser(defaultNewUser);
    },
    onError: (error: Error) => {
      toast.error(`Falha ao criar usuário: ${error.message}`);
    }
  });
  
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuário atualizado com sucesso');
      setEditUserDialog({ open: false, user: null });
    },
    onError: (error: Error) => {
      toast.error(`Falha ao atualizar usuário: ${error.message}`);
    }
  });
  
  const toggleStatusMutation = useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success(
        `Usuário ${updatedUser.status === 'active' ? 'ativado' : 'bloqueado'} com sucesso`
      );
    },
    onError: () => {
      toast.error('Falha ao atualizar status do usuário');
    }
  });
  
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Usuário excluído com sucesso');
      setDeleteDialog({ open: false, userId: null });
    },
    onError: () => {
      toast.error('Falha ao excluir usuário');
    }
  });
  
  const updateUserUnitsMutation = useMutation({
    mutationFn: (data: { userId: string, unitIds: string[] }) => 
      updateUserUnits(data.userId, data.unitIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Unidades do usuário atualizadas com sucesso');
      setManageUnitsSheet({ open: false, user: null });
    },
    onError: () => {
      toast.error('Falha ao atualizar unidades do usuário');
    }
  });
  
  useEffect(() => {
    if (manageUnitsSheet.user) {
      setSelectedUnitIds(manageUnitsSheet.user.unitIds);
    }
  }, [manageUnitsSheet.user]);
  
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.email || !newUser.username) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    if (newUser.grantWifiAccess && !newUser.password) {
      toast.error('A senha é obrigatória para acesso WiFi');
      return;
    }
    
    if (newUser.password && newUser.password.length < 4) {
      toast.error('A senha deve ter pelo menos 4 caracteres');
      return;
    }
    
    createUserMutation.mutate(newUser);
  };
  
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editUserDialog.user || !newUser.email || !newUser.username) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    // Don't update password if it's empty (means no change)
    const userToUpdate = newUser.password 
      ? newUser 
      : { ...newUser, password: undefined };
    
    updateUserMutation.mutate({
      userId: editUserDialog.user.id,
      userData: userToUpdate
    });
  };
  
  const handleToggleStatus = (userId: string) => {
    toggleStatusMutation.mutate(userId);
  };
  
  const handleDeleteUser = () => {
    if (deleteDialog.userId) {
      deleteUserMutation.mutate(deleteDialog.userId);
    }
  };
  
  const handleSaveUserUnits = () => {
    if (manageUnitsSheet.user) {
      updateUserUnitsMutation.mutate({
        userId: manageUnitsSheet.user.id,
        unitIds: selectedUnitIds
      });
    }
  };
  
  const handleEditUser = (user: WifiUser) => {
    setEditUserDialog({ open: true, user });
  };
  
  const handleClearFilters = () => {
    setUnitFilter(null);
    setStatusFilter(null);
    setFiltersOpen(false);
  };
  
  const filteredUsers = users?.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesUnitFilter = !unitFilter || user.unitIds.includes(unitFilter);
    const matchesStatusFilter = !statusFilter || user.status === statusFilter;
    
    return matchesSearch && matchesUnitFilter && matchesStatusFilter;
  });
  
  const getUserUnits = (user: WifiUser) => {
    const userUnits = units.filter(unit => user.unitIds.includes(unit.id));
    return userUnits.map(unit => unit.name).join(', ') || 'Nenhuma';
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Usuários WiFi</h1>
          <Button onClick={() => setNewUserDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar Novo Usuário
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome, email ou usuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
                {(unitFilter || statusFilter) && (
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {[unitFilter, statusFilter].filter(Boolean).length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filtrar Usuários</h4>
                
                <div className="space-y-2">
                  <label htmlFor="unit-filter" className="text-sm font-medium">
                    Por Unidade
                  </label>
                  <Select 
                    value={unitFilter || ""} 
                    onValueChange={(value) => setUnitFilter(value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as unidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as unidades</SelectItem>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="status-filter" className="text-sm font-medium">
                    Por Status
                  </label>
                  <Select 
                    value={statusFilter || ""} 
                    onValueChange={(value) => setStatusFilter(value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os status</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="blocked">Bloqueados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                  >
                    Limpar Filtros
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setFiltersOpen(false)}
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center my-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-destructive/10 p-4 rounded-md flex items-center gap-2 text-destructive">
            <AlertTriangle size={16} />
            <p>Erro ao carregar usuários</p>
          </div>
        ) : filteredUsers?.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <WifiOff className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Nenhum usuário encontrado</h3>
            <p className="text-muted-foreground">
              {searchTerm || unitFilter || statusFilter 
                ? 'Tente ajustar seus termos de pesquisa ou filtros' 
                : 'Comece adicionando um novo usuário'}
            </p>
          </div>
        ) : (
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
                {filteredUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell 
                      className="font-medium cursor-pointer hover:text-primary"
                      onClick={() => handleEditUser(user)}
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
                        onClick={() => setManageUnitsSheet({ open: true, user })}
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
                        onClick={() => handleToggleStatus(user.id)}
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
                            onClick={() => handleEditUser(user)}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Editar Usuário
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setManageUnitsSheet({ open: true, user })}
                          >
                            <Building className="h-4 w-4 mr-2" />
                            Gerenciar Unidades
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(user.id)}
                            disabled={toggleStatusMutation.isPending}
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
                            onClick={() => setDeleteDialog({ open: true, userId: user.id })}
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
        )}
      </div>
      
      <Dialog open={newUserDialog} onOpenChange={setNewUserDialog}>
        <UserForm 
          newUser={newUser}
          setNewUser={setNewUser}
          units={units}
          unitsLoading={unitsLoading}
          onSubmit={handleCreateUser}
          onCancel={() => setNewUserDialog(false)}
          isPending={createUserMutation.isPending}
        />
      </Dialog>
      
      <Dialog open={editUserDialog.open} onOpenChange={(open) => {
        if (!open) setEditUserDialog({ open: false, user: null });
      }}>
        <UserForm 
          newUser={newUser}
          setNewUser={setNewUser}
          units={units}
          unitsLoading={unitsLoading}
          onSubmit={handleUpdateUser}
          onCancel={() => setEditUserDialog({ open: false, user: null })}
          isPending={updateUserMutation.isPending}
          isEditMode={true}
        />
      </Dialog>
      
      <ManageUserUnitsSheet 
        open={manageUnitsSheet.open}
        onOpenChange={(open) => {
          if (!open) {
            setManageUnitsSheet({ open: false, user: null });
          }
        }}
        user={manageUnitsSheet.user}
        units={units}
        unitsLoading={unitsLoading}
        selectedUnitIds={selectedUnitIds}
        setSelectedUnitIds={setSelectedUnitIds}
        onSave={handleSaveUserUnits}
        isPending={updateUserUnitsMutation.isPending}
      />
      
      <AlertDialog 
        open={deleteDialog.open} 
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá excluir permanentemente a conta do usuário e revogar seu acesso WiFi.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteUserMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir Usuário'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Users;
