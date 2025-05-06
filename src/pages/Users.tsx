import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, createUser, updateUser, deleteUser, toggleUserStatus, updateUserUnits } from '@/services/userService';
import { fetchUnits } from '@/services/unitService';
import { toast } from 'sonner';
import { 
  PlusCircle, 
  Search, 
  Filter 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import DashboardLayout from '@/components/DashboardLayout';
import UsersList from '@/components/users/UsersList';
import UserForm from '@/components/users/UserForm';
import DeleteUserDialog from '@/components/users/DeleteUserDialog';
import UsersHeader from '@/components/users/UsersHeader';
import UserFilters from '@/components/users/UserFilters';
import ManageUserUnitsSheet from '@/components/users/ManageUserUnitsSheet';
import { WifiUser } from '@/models/user';
import PendingApprovalUsers from '@/components/users/PendingApprovalUsers';

const Users = () => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isManageUnitsOpen, setIsManageUnitsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<WifiUser | null>(null);
  const [newUserData, setNewUserData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'wifi_user',
    unitIds: [] as string[],
    fullName: '',
    cpf: '',
    userType: 'wifi_user',
    phone: '',
    registrationNumber: '',
    grantWifiAccess: true,
    profile: 'standard',
    status: 'active',
    expirationDate: null as Date | null
  });
  
  const queryClient = useQueryClient();
  
  // Fetch users data
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });
  
  // Fetch units data
  const { data: units = [], isLoading: unitsLoading } = useQuery({
    queryKey: ['units'],
    queryFn: fetchUnits
  });
  
  // Group pending approval users separately
  const pendingApprovalUsers = users.filter(user => user.status === 'pending_approval');
  const regularUsers = users.filter(user => user.status !== 'pending_approval');
  
  // Filter users
  const filteredUsers = regularUsers.filter(user => {
    const matchesSearch = search 
      ? user.username.toLowerCase().includes(search.toLowerCase()) || 
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        (user.fullName && user.fullName.toLowerCase().includes(search.toLowerCase()))
      : true;
    
    const matchesStatus = selectedStatus ? user.status === selectedStatus : true;
    const matchesProfile = selectedProfile ? user.profile === selectedProfile : true;
    const matchesUnit = selectedUnit ? user.unitIds.includes(selectedUnit) : true;
    
    return matchesSearch && matchesStatus && matchesProfile && matchesUnit;
  });
  
  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsAddUserOpen(false);
      resetForm();
      toast.success('Usuário criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar usuário: ${error.message}`);
    }
  });
  
  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: (params: { userId: string; userData: Partial<WifiUser> & { password?: string; expirationDate?: Date | string | null } }) => 
      updateUser({ userId: params.userId, userData: params.userData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditUserOpen(false);
      setCurrentUser(null);
      toast.success('Usuário atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar usuário: ${error.message}`);
    }
  });
  
  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsDeleteDialogOpen(false);
      setCurrentUser(null);
      toast.success('Usuário excluído com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir usuário: ${error.message}`);
    }
  });
  
  // Toggle user status mutation
  const toggleUserStatusMutation = useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(`Usuário ${updatedUser.status === 'active' ? 'ativado' : 'bloqueado'} com sucesso!`);
    },
    onError: (error: Error) => {
      toast.error(`Erro ao alterar status do usuário: ${error.message}`);
    }
  });
  
  // Update user units mutation
  const updateUserUnitsMutation = useMutation({
    mutationFn: (params: { userId: string; unitIds: string[] }) => 
      updateUserUnits(params.userId, params.unitIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsManageUnitsOpen(false);
      toast.success('Unidades do usuário atualizadas com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar unidades do usuário: ${error.message}`);
    }
  });
  
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserData.username || !newUserData.email) {
      toast.error('Por favor, preencha os campos obrigatórios');
      return;
    }
    
    createUserMutation.mutate({
      username: newUserData.username,
      email: newUserData.email,
      password: newUserData.password,
      fullName: newUserData.fullName,
      unitIds: newUserData.unitIds,
      expirationDate: newUserData.expirationDate,
      userType: newUserData.userType,
      cpf: newUserData.cpf,
      phone: newUserData.phone,
      registrationNumber: newUserData.registrationNumber,
      profile: newUserData.profile,
      status: newUserData.status as 'active' | 'blocked' | 'pending_approval'
    });
  };
  
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    updateUserMutation.mutate({
      userId: currentUser.id,
      userData: {
        email: newUserData.email,
        fullName: newUserData.fullName,
        expirationDate: newUserData.expirationDate,
        cpf: newUserData.cpf,
        phone: newUserData.phone,
        userType: newUserData.userType,
        profile: newUserData.profile,
        status: newUserData.status as 'active' | 'blocked' | 'pending_approval'
      }
    });
  };
  
  const handleDeleteUser = () => {
    if (currentUser) {
      deleteUserMutation.mutate(currentUser.id);
    }
  };
  
  const handleToggleStatus = (userId: string) => {
    toggleUserStatusMutation.mutate(userId);
  };
  
  const handleEditUser = (user: WifiUser) => {
    setCurrentUser(user);
    setNewUserData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.userType || 'wifi_user',
      unitIds: user.unitIds,
      fullName: user.fullName || '',
      cpf: user.cpf || '',
      userType: user.userType || 'wifi_user',
      phone: user.phone || '',
      registrationNumber: user.registrationNumber || '',
      grantWifiAccess: true,
      profile: user.profile || 'standard',
      status: user.status || 'active',
      expirationDate: user.expirationDate ? new Date(user.expirationDate) : null
    });
    setIsEditUserOpen(true);
  };
  
  const handleManageUnits = (user: WifiUser) => {
    setCurrentUser(user);
    setIsManageUnitsOpen(true);
  };
  
  const handleSaveUserUnits = (unitIds: string[]) => {
    if (currentUser) {
      updateUserUnitsMutation.mutate({
        userId: currentUser.id,
        unitIds
      });
    }
  };
  
  const resetForm = () => {
    setNewUserData({
      username: '',
      email: '',
      password: '',
      role: 'wifi_user',
      unitIds: [],
      fullName: '',
      cpf: '',
      userType: 'wifi_user',
      phone: '',
      registrationNumber: '',
      grantWifiAccess: true,
      profile: 'standard',
      status: 'active',
      expirationDate: null
    });
  };
  
  const clearFilters = () => {
    setSearch('');
    setSelectedStatus(null);
    setSelectedProfile(null);
    setSelectedUnit(null);
  };
  
  // Effect to reset form when dialog closes
  useEffect(() => {
    if (!isAddUserOpen) {
      resetForm();
    }
  }, [isAddUserOpen]);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <UsersHeader
          userCount={regularUsers.length}
          onAddUser={() => setIsAddUserOpen(true)}
        />
        
        {/* Pending Approval Users */}
        {pendingApprovalUsers.length > 0 && (
          <PendingApprovalUsers 
            pendingUsers={pendingApprovalUsers}
            units={units}
            onUserApproved={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
          />
        )}
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuários..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(true)} className="sm:w-auto w-full">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {(selectedStatus || selectedProfile || selectedUnit) && (
              <span className="ml-2 rounded-full bg-primary w-5 h-5 flex items-center justify-center text-xs text-white">
                {[selectedStatus, selectedProfile, selectedUnit].filter(Boolean).length}
              </span>
            )}
          </Button>
        </div>
        
        {/* Users List */}
        <UsersList
          users={filteredUsers}
          isLoading={usersLoading}
          onEditUser={handleEditUser}
          onDeleteUser={(user) => {
            setCurrentUser(user);
            setIsDeleteDialogOpen(true);
          }}
          onToggleStatus={handleToggleStatus}
          onManageUnits={handleManageUnits}
        />
      </div>
      
      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar um novo usuário WiFi
            </DialogDescription>
          </DialogHeader>
          
          <UserForm
            userData={newUserData}
            onChange={setNewUserData}
            onSubmit={handleCreateUser}
            isPending={createUserMutation.isPending}
            units={units}
            isEditMode={false}
            unitsLoading={unitsLoading}
            onCancel={() => setIsAddUserOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize os dados do usuário
            </DialogDescription>
          </DialogHeader>
          
          <UserForm
            userData={newUserData}
            onChange={setNewUserData}
            onSubmit={handleUpdateUser}
            isPending={updateUserMutation.isPending}
            units={units}
            isEditMode={true}
            unitsLoading={unitsLoading}
            onCancel={() => setIsEditUserOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteUser}
        isPending={deleteUserMutation.isPending}
        username={currentUser?.username || ''}
      />
      
      {/* Filter Sidebar */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent className="sm:max-w-[400px]">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription>
              Filtre os usuários por status, perfil e unidade
            </SheetDescription>
          </SheetHeader>
          
          <UserFilters
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedProfile={selectedProfile}
            setSelectedProfile={setSelectedProfile}
            selectedUnit={selectedUnit}
            setSelectedUnit={setSelectedUnit}
            units={units}
            onClearFilters={clearFilters}
          />
        </SheetContent>
      </Sheet>
      
      {/* Manage Units Sheet */}
      <ManageUserUnitsSheet
        open={isManageUnitsOpen}
        onOpenChange={setIsManageUnitsOpen}
        user={currentUser}
        units={units}
        onSaveUnits={handleSaveUserUnits}
        isPending={updateUserUnitsMutation.isPending}
      />
    </DashboardLayout>
  );
};

export default Users;
