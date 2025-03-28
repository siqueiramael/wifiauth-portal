
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
import { WifiUser } from '@/models/user';
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';
import { Dialog } from '@/components/ui/dialog';

// Import our new components
import UsersList from '@/components/users/UsersList';
import UserFilters from '@/components/users/UserFilters';
import UsersHeader from '@/components/users/UsersHeader';
import DeleteUserDialog from '@/components/users/DeleteUserDialog';
import ManageUserUnitsSheet from '@/components/users/ManageUserUnitsSheet';
import UserForm from '@/components/users/UserForm';

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
    status: 'active' as 'active' | 'blocked',
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
        <UsersHeader onNewUser={() => setNewUserDialog(true)} />
        
        <UserFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          unitFilter={unitFilter}
          setUnitFilter={setUnitFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          handleClearFilters={handleClearFilters}
          units={units}
        />
        
        <UsersList 
          users={filteredUsers}
          units={units}
          isLoading={isLoading}
          error={error}
          searchTerm={searchTerm}
          handleEditUser={handleEditUser}
          handleToggleStatus={handleToggleStatus}
          setManageUnitsSheet={setManageUnitsSheet}
          setDeleteDialog={setDeleteDialog}
          toggleStatusMutation={toggleStatusMutation}
          formatDate={formatDate}
          getUserUnits={getUserUnits}
        />
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
      
      <DeleteUserDialog 
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onDelete={handleDeleteUser}
        isPending={deleteUserMutation.isPending}
      />
    </DashboardLayout>
  );
};

export default Users;
