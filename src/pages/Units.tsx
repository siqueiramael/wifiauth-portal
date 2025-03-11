
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchUnits, 
  createUnit, 
  updateUnit, 
  deleteUnit,
} from '@/services/unitService';
import { Unit } from '@/models/user';
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { Spinner } from '@/components/Spinner';
import { controllerService } from '@/services/controllerService';
import { 
  PlusCircle, 
  AlertTriangle, 
  Search
} from 'lucide-react';

// Import our components
import UnitsTable from '@/components/units/UnitsTable';
import UnitForm from '@/components/units/UnitForm';
import DeleteUnitDialog from '@/components/units/DeleteUnitDialog';
import EmptyState from '@/components/units/EmptyState';

const Units = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [unitDialog, setUnitDialog] = useState<{
    open: boolean;
    isEditing: boolean;
    unitId?: string;
  }>({
    open: false,
    isEditing: false
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; unitId: string | null }>({
    open: false,
    unitId: null
  });
  
  const [unitForm, setUnitForm] = useState({
    name: '',
    siteId: '',
    controllerName: '',
    siteName: ''
  });
  
  const queryClient = useQueryClient();
  
  const { data: units, isLoading: unitsLoading, error: unitsError } = useQuery({
    queryKey: ['units'],
    queryFn: fetchUnits
  });
  
  const { data: controllers = [], isLoading: controllersLoading } = useQuery({
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
    mutationFn: (data: { id: string; unit: Partial<Unit> }) => updateUnit(data.id, data.unit),
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!unitForm.name || !unitForm.siteId) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    if (unitDialog.isEditing && unitDialog.unitId) {
      updateUnitMutation.mutate({
        id: unitDialog.unitId,
        unit: unitForm
      });
    } else {
      createUnitMutation.mutate(unitForm);
    }
  };
  
  const handleEdit = (unit: Unit) => {
    setUnitForm({
      name: unit.name,
      siteId: unit.siteId,
      controllerName: unit.controllerName,
      siteName: unit.siteName
    });
    setUnitDialog({
      open: true,
      isEditing: true,
      unitId: unit.id
    });
  };
  
  const handleDelete = () => {
    if (deleteDialog.unitId) {
      deleteUnitMutation.mutate(deleteDialog.unitId);
    }
  };
  
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Unidades</h1>
          <Button onClick={() => {
            resetForm();
            setUnitDialog({ open: true, isEditing: false });
          }}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Unidade
          </Button>
        </div>
        
        <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome, controladora ou site..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        {unitsLoading ? (
          <div className="flex justify-center my-12">
            <Spinner size="lg" />
          </div>
        ) : unitsError ? (
          <div className="bg-destructive/10 p-4 rounded-md flex items-center gap-2 text-destructive">
            <AlertTriangle size={16} />
            <p>Erro ao carregar unidades</p>
          </div>
        ) : filteredUnits?.length === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          <UnitsTable 
            units={filteredUnits || []} 
            onEdit={handleEdit} 
            onDelete={(unitId) => setDeleteDialog({ open: true, unitId })}
          />
        )}
      </div>
      
      <Dialog open={unitDialog.open} onOpenChange={(open) => setUnitDialog({ ...unitDialog, open })}>
        <UnitForm
          isEditing={unitDialog.isEditing}
          isPending={createUnitMutation.isPending || updateUnitMutation.isPending}
          unitForm={unitForm}
          setUnitForm={setUnitForm}
          sites={sites}
          controllersLoading={controllersLoading}
          onSubmit={handleSubmit}
          onCancel={() => setUnitDialog({ open: false, isEditing: false })}
          handleSiteChange={handleSiteChange}
        />
      </Dialog>
      
      <DeleteUnitDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={handleDelete}
        isPending={deleteUnitMutation.isPending}
      />
    </DashboardLayout>
  );
};

export default Units;
