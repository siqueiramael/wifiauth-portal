
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchUsers, 
  createUser, 
  toggleUserStatus, 
  deleteUser,
  updateUserUnits,
  fetchUnits,
  WifiUser,
  Unit
} from '@/services/userService';
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
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
import {
  Checkbox
} from "@/components/ui/checkbox";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  Building
} from 'lucide-react';

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
  
  // Form state for new user
  const [newUser, setNewUser] = useState({
    email: '',
    username: '',
    password: '',
    unitIds: [] as string[]
  });
  
  const queryClient = useQueryClient();
  
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });
  
  const { data: units = [], isLoading: unitsLoading } = useQuery({
    queryKey: ['units'],
    queryFn: fetchUnits
  });
  
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Usuário criado com sucesso');
      setNewUserDialog(false);
      setNewUser({ email: '', username: '', password: '', unitIds: [] });
    },
    onError: (error: Error) => {
      toast.error(`Falha ao criar usuário: ${error.message}`);
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
    
    // Simple validation
    if (!newUser.email || !newUser.username || !newUser.password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    if (newUser.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    createUserMutation.mutate(newUser);
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
  
  const toggleUnitSelection = (unitId: string) => {
    setSelectedUnitIds(prev => 
      prev.includes(unitId)
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };
  
  const toggleAllUnits = (checked: boolean) => {
    if (checked) {
      setSelectedUnitIds(units.map(unit => unit.id));
    } else {
      setSelectedUnitIds([]);
    }
  };
  
  const filteredUsers = users?.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower)
    );
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
        
        <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por email ou nome de usuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
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
              {searchTerm ? 'Tente ajustar seus termos de pesquisa' : 'Comece adicionando um novo usuário'}
            </p>
          </div>
        ) : (
          <div className="rounded-md border animate-fade-in">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Email</TableHead>
                  <TableHead>Nome de Usuário</TableHead>
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
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.username}</TableCell>
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
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {user.status === 'active' ? 'Ativo' : 'Bloqueado'}
                      </div>
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
      
      {/* Add New User Dialog */}
      <Dialog open={newUserDialog} onOpenChange={setNewUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário WiFi</DialogTitle>
            <DialogDescription>
              Crie uma nova conta de usuário para autenticação WiFi.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                  placeholder="usuario@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Nome de Usuário
                </label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  required
                  placeholder="joao.silva"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  placeholder="••••••••"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Unidades de Acesso
                </label>
                <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto">
                  <div className="flex items-center space-x-2 pb-2 mb-2 border-b">
                    <Checkbox 
                      id="select-all-units"
                      checked={newUser.unitIds.length === units.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewUser({ ...newUser, unitIds: units.map(u => u.id) });
                        } else {
                          setNewUser({ ...newUser, unitIds: [] });
                        }
                      }}
                    />
                    <label htmlFor="select-all-units" className="text-sm font-medium">
                      Selecionar todas as unidades
                    </label>
                  </div>
                  {unitsLoading ? (
                    <div className="py-2 flex justify-center">
                      <Spinner size="sm" />
                    </div>
                  ) : units.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      Nenhuma unidade disponível. Adicione unidades primeiro.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {units.map((unit) => (
                        <div key={unit.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`unit-${unit.id}`} 
                            checked={newUser.unitIds.includes(unit.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewUser({ 
                                  ...newUser, 
                                  unitIds: [...newUser.unitIds, unit.id] 
                                });
                              } else {
                                setNewUser({ 
                                  ...newUser, 
                                  unitIds: newUser.unitIds.filter(id => id !== unit.id) 
                                });
                              }
                            }}
                          />
                          <label htmlFor={`unit-${unit.id}`} className="text-sm">
                            {unit.name} <span className="text-muted-foreground">({unit.controllerName} / {unit.siteName})</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setNewUserDialog(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Usuário'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Manage Units Sheet */}
      <Sheet 
        open={manageUnitsSheet.open} 
        onOpenChange={(open) => {
          if (!open) {
            setManageUnitsSheet({ open: false, user: null });
          }
        }}
      >
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Gerenciar Unidades de Acesso</SheetTitle>
            <SheetDescription>
              {manageUnitsSheet.user && (
                <span>
                  Selecione as unidades que <strong>{manageUnitsSheet.user.username}</strong> pode acessar.
                </span>
              )}
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            {unitsLoading ? (
              <div className="py-4 flex justify-center">
                <Spinner size="md" />
              </div>
            ) : units.length === 0 ? (
              <div className="text-center py-4">
                <Building className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Nenhuma unidade disponível. Adicione unidades primeiro.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b">
                  <Checkbox 
                    id="select-all"
                    checked={selectedUnitIds.length === units.length}
                    onCheckedChange={(checked) => toggleAllUnits(!!checked)}
                  />
                  <label 
                    htmlFor="select-all" 
                    className="text-sm font-medium"
                  >
                    Selecionar todas as unidades
                  </label>
                </div>
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                  {units.map((unit) => (
                    <div key={unit.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                      <Checkbox 
                        id={`manage-unit-${unit.id}`}
                        checked={selectedUnitIds.includes(unit.id)}
                        onCheckedChange={() => toggleUnitSelection(unit.id)}
                      />
                      <div className="flex flex-col">
                        <label 
                          htmlFor={`manage-unit-${unit.id}`}
                          className="font-medium text-sm cursor-pointer"
                        >
                          {unit.name}
                        </label>
                        <span className="text-xs text-muted-foreground">
                          {unit.controllerName} / {unit.siteName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancelar</Button>
            </SheetClose>
            <Button 
              onClick={handleSaveUserUnits}
              disabled={updateUserUnitsMutation.isPending || unitsLoading}
            >
              {updateUserUnitsMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Confirm Delete Dialog */}
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
