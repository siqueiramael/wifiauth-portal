
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchUnits, 
  createUnit, 
  updateUnit, 
  deleteUnit,
  updateUserAccessToUnit
} from '@/services/unitService';
import { fetchUsers } from '@/services/userService';
import { Unit } from '@/models/user';
import { toast } from 'sonner';
import { controllerService } from '@/services/controllerService';

export function useUnitsData() {
  const [searchTerm, setSearchTerm] = useState('');
  const [unitDialog, setUnitDialog] = useState<{
    open: boolean;
    isEditing: boolean;
    unitId?: string;
  }>({
    open: false,
    isEditing: false
  });

  const [deleteDialog, setDeleteDialog] = useState<{ 
    open: boolean; 
    unitId: string | null 
  }>({
    open: false,
    unitId: null
  });
  
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  
  const [unitForm, setUnitForm] = useState({
    name: '',
    siteId: '',
    controllerName: '',
    siteName: ''
  });
  
  const queryClient = useQueryClient();
  
  const { 
    data: units, 
    isLoading: unitsLoading, 
    error: unitsError 
  } = useQuery({
    queryKey: ['units'],
    queryFn: fetchUnits
  });
  
  const { 
    data: users = [], 
    isLoading: usersLoading 
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });
  
  const { 
    data: controllers = [], 
    isLoading: controllersLoading 
  } = useQuery({
    queryKey: ['controllers'],
    queryFn: controllerService.getControllers,
    meta: {
      onError: (error: Error) => {
        toast.error("Failed to load controllers data", {
          description: error.message
        });
        console.error(error);
      }
    }
  });
  
  const sites = controllers.flatMap(controller => 
    controller.sites.map(site => ({
      id: site.id,
      name: site.name,
      controllerId: controller.id,
      controllerName: controller.name
    }))
  );
  
  const createUnitMutation = useMutation({
    mutationFn: createUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast.success('Unidade criada com sucesso');
      setUnitDialog({ open: false, isEditing: false });
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(`Falha ao criar unidade: ${error.message}`);
    }
  });
  
  const updateUnitMutation = useMutation({
    mutationFn: (data: { id: string; unit: Partial<Unit> }) => 
      updateUnit(data.id, data.unit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast.success('Unidade atualizada com sucesso');
      setUnitDialog({ open: false, isEditing: false });
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(`Falha ao atualizar unidade: ${error.message}`);
    }
  });
  
  const deleteUnitMutation = useMutation({
    mutationFn: deleteUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Unidade excluída com sucesso');
      setDeleteDialog({ open: false, unitId: null });
    },
    onError: (error: Error) => {
      toast.error(`Falha ao excluir unidade: ${error.message}`);
    }
  });
  
  const updateUserAccessMutation = useMutation({
    mutationFn: (data: { unitId: string; userIds: string[]; hasAccess: boolean }) => 
      updateUserAccessToUnit(data.unitId, data.userIds, data.hasAccess),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Acesso dos usuários atualizado com sucesso');
    },
    onError: (error: Error) => {
      toast.error(`Falha ao atualizar acesso dos usuários: ${error.message}`);
    }
  });

  const resetForm = () => {
    setUnitForm({
      name: '',
      siteId: '',
      controllerName: '',
      siteName: ''
    });
  };
  
  const handleSiteChange = (siteId: string) => {
    const selectedSite = sites.find(site => site.id === siteId);
    
    if (selectedSite) {
      setUnitForm({
        ...unitForm,
        siteId,
        controllerName: selectedSite.controllerName,
        siteName: selectedSite.name
      });
    }
  };

  const filteredUnits = units?.filter(unit => {
    const searchLower = searchTerm.toLowerCase();
    return (
      unit.name.toLowerCase().includes(searchLower) ||
      unit.controllerName.toLowerCase().includes(searchLower) ||
      unit.siteName.toLowerCase().includes(searchLower)
    );
  });

  return {
    searchTerm,
    setSearchTerm,
    unitDialog,
    setUnitDialog,
    deleteDialog,
    setDeleteDialog,
    selectedUnit,
    setSelectedUnit,
    unitForm,
    setUnitForm,
    units,
    unitsLoading,
    unitsError,
    users,
    usersLoading,
    controllers,
    controllersLoading,
    sites,
    createUnitMutation,
    updateUnitMutation,
    deleteUnitMutation,
    updateUserAccessMutation,
    resetForm,
    handleSiteChange,
    filteredUnits
  };
}
