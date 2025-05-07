
import { useState } from 'react';
import { toast } from 'sonner';
import { Unit } from '@/models/user';
import DashboardLayout from '@/components/DashboardLayout';
import { Spinner } from '@/components/Spinner';
import { AlertTriangle } from 'lucide-react';

// Import our components
import UnitsTable from '@/components/units/UnitsTable';
import DeleteUnitDialog from '@/components/units/DeleteUnitDialog';
import EmptyState from '@/components/units/EmptyState';
import UnitDetails from '@/components/units/UnitDetails';
import UnitActions from '@/components/units/UnitActions';
import { useUnitsData } from '@/components/units/hooks/useUnitsData';

const Units = () => {
  const {
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
  } = useUnitsData();
  
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
  
  const handleUpdateUserAccess = (userIds: string[], hasAccess: boolean) => {
    if (selectedUnit) {
      updateUserAccessMutation.mutate({
        unitId: selectedUnit.id,
        userIds,
        hasAccess
      });
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
  
  const handleAddUnit = () => {
    resetForm();
    setUnitDialog({ open: true, isEditing: false });
  };
  
  const handleViewDetails = (unit: Unit) => {
    setSelectedUnit(unit);
  };

  if (selectedUnit) {
    return (
      <DashboardLayout>
        <UnitDetails 
          unit={selectedUnit}
          users={users}
          onBack={() => setSelectedUnit(null)}
          onUpdateUserAccess={handleUpdateUserAccess}
          isPending={updateUserAccessMutation.isPending}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <UnitActions
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddUnit={handleAddUnit}
        unitDialog={unitDialog}
        onUnitDialogChange={(open) => setUnitDialog({ ...unitDialog, open })}
        unitForm={unitForm}
        setUnitForm={setUnitForm}
        sites={sites}
        controllersLoading={controllersLoading}
        onSubmit={handleSubmit}
        onCancel={() => setUnitDialog({ open: false, isEditing: false })}
        handleSiteChange={handleSiteChange}
        isPending={createUnitMutation.isPending || updateUnitMutation.isPending}
      />

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
          onViewDetails={handleViewDetails}
        />
      )}
      
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
