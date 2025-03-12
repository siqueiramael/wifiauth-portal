
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchAdmins, 
  createAdmin, 
  toggleAdminStatus, 
  deleteAdmin,
  AdminUser
} from '@/services/adminService';
import { AdminRole, useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Spinner } from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  UserPlus, 
  MoreVertical, 
  AlertTriangle, 
  UserX,
  Trash2,
  Loader2,
  UserCheck
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const ROLE_LABELS = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  technician: 'Técnico'
};

const ROLE_DESCRIPTIONS = {
  super_admin: 'Acesso completo a todas as funcionalidades',
  admin: 'Gerencia usuários e unidades, mas não administradores',
  technician: 'Visualização de dashboard, usuários e unidades'
};

const NetworkSettings = () => {
  const { admin: currentAdmin, hasPermission } = useAuth();
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    name: '',
    password: '',
    role: 'admin' as AdminRole
  });
  
  const [openNewAdminDialog, setOpenNewAdminDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; adminId: string | null }>({
    open: false,
    adminId: null
  });
  
  const queryClient = useQueryClient();
  
  const { data: admins, isLoading, error } = useQuery({
    queryKey: ['admins'],
    queryFn: fetchAdmins
  });
  
  const createAdminMutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      toast.success('Administrador criado com sucesso');
      setOpenNewAdminDialog(false);
      setNewAdmin({ email: '', name: '', password: '', role: 'admin' });
    },
    onError: (error: Error) => {
      toast.error(`Falha ao criar administrador: ${error.message}`);
    }
  });
  
  const toggleStatusMutation = useMutation({
    mutationFn: toggleAdminStatus,
    onSuccess: (updatedAdmin) => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      toast.success(
        `Administrador ${updatedAdmin.active ? 'ativado' : 'desativado'} com sucesso`
      );
    },
    onError: (error: Error) => {
      toast.error(`Falha ao atualizar status: ${error.message}`);
    }
  });
  
  const deleteAdminMutation = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      toast.success('Administrador excluído com sucesso');
      setDeleteDialog({ open: false, adminId: null });
    },
    onError: (error: Error) => {
      toast.error(`Falha ao excluir administrador: ${error.message}`);
    }
  });
  
  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAdmin.email || !newAdmin.name || !newAdmin.password || !newAdmin.role) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    if (newAdmin.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    createAdminMutation.mutate(newAdmin);
  };
  
  const handleToggleStatus = (adminId: string) => {
    toggleStatusMutation.mutate(adminId);
  };
  
  const handleDeleteAdmin = () => {
    if (deleteDialog.adminId) {
      deleteAdminMutation.mutate(deleteDialog.adminId);
    }
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
  
  const canManageAdmins = hasPermission('manage_admins');

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-medium">Gerenciamento de Administradores</h3>
            <p className="text-muted-foreground">Gerencie contas de administradores com diferentes níveis de acesso</p>
          </div>
          
          {canManageAdmins && (
            <Button onClick={() => setOpenNewAdminDialog(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Administrador
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center my-8">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-destructive/10 p-4 rounded-md flex items-center gap-2 text-destructive">
            <AlertTriangle size={16} />
            <p>Erro ao carregar administradores</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead>Status</TableHead>
                  {canManageAdmins && <TableHead className="text-right">Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins?.map((admin) => (
                  <TableRow key={admin.id} className={admin.id === currentAdmin?.id ? 'bg-muted/50' : ''}>
                    <TableCell className="font-medium">{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{ROLE_LABELS[admin.role]}</span>
                        <span className="text-xs text-muted-foreground">{ROLE_DESCRIPTIONS[admin.role]}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(admin.createdAt)}</TableCell>
                    <TableCell>{formatDate(admin.lastLogin)}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        admin.active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {admin.active ? 'Ativo' : 'Inativo'}
                      </div>
                    </TableCell>
                    {canManageAdmins && (
                      <TableCell className="text-right">
                        {admin.id !== currentAdmin?.id && (
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
                                onClick={() => handleToggleStatus(admin.id)}
                                disabled={toggleStatusMutation.isPending}
                              >
                                {admin.active ? (
                                  <>
                                    <UserX className="h-4 w-4 mr-2" />
                                    Desativar Acesso
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Ativar Acesso
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteDialog({ open: true, adminId: admin.id })}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir Administrador
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      <Dialog open={openNewAdminDialog} onOpenChange={setOpenNewAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Administrador</DialogTitle>
            <DialogDescription>
              Crie uma nova conta de administrador com permissões específicas.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAdmin}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nome
                </label>
                <Input
                  id="name"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  required
                  placeholder="Nome completo"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  required
                  placeholder="admin@exemplo.com"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  required
                  placeholder="••••••••"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Nível de Acesso
                </label>
                <Select 
                  value={newAdmin.role} 
                  onValueChange={(value: AdminRole) => setNewAdmin({ ...newAdmin, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível de acesso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin - Acesso completo</SelectItem>
                    <SelectItem value="admin">Admin - Gerencia usuários e unidades</SelectItem>
                    <SelectItem value="technician">Técnico - Apenas visualização</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="mt-2 text-sm text-muted-foreground">
                  {newAdmin.role && ROLE_DESCRIPTIONS[newAdmin.role]}
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpenNewAdminDialog(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createAdminMutation.isPending}
              >
                {createAdminMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Administrador'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog 
        open={deleteDialog.open} 
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá excluir permanentemente a conta do administrador.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAdmin}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteAdminMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir Administrador'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NetworkSettings;
