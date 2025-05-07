
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUnits } from '@/services/unitService';
import PolicyList from '@/components/policies/PolicyList';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { PlusCircle, Import } from 'lucide-react';
import PolicyForm from '@/components/policies/PolicyForm';
import DeletePolicyDialog from '@/components/policies/DeletePolicyDialog';
import UnitPolicyHeader from './policy/UnitPolicyHeader';
import { usePolicies } from './policy/usePolicies';
import PolicyImport from './policy/PolicyImport';

interface UnitPoliciesProps {
  unitId: string;
}

const UnitPolicies: React.FC<UnitPoliciesProps> = ({ unitId }) => {
  const {
    policies,
    allPolicies,
    isLoading,
    error,
    policyDialog,
    deleteDialog,
    setPolicyDialog,
    setDeleteDialog,
    handleCreatePolicy,
    handleEditPolicy,
    handlePolicyChange,
    handleSubmitPolicy,
    handleDeletePolicy,
    confirmDeletePolicy,
    handleTogglePolicyStatus,
    togglePolicyStatusMutation,
    createPolicyMutation,
    updatePolicyMutation,
    closeDialog
  } = usePolicies(unitId);
  
  const [importDialog, setImportDialog] = useState(false);
  
  const { data: units = [] } = useQuery({
    queryKey: ['units'],
    queryFn: fetchUnits,
  });

  // Filter out policies already applied to this unit for importing
  const availablePolicies = allPolicies.filter(policy => 
    !policy.targetIds.includes(unitId) || 
    (policy.targetType === 'unit' && policy.targetIds.includes(unitId))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Gerencie as políticas de uso específicas para esta unidade
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setImportDialog(true)}
            disabled={availablePolicies.length === 0}
          >
            <Import className="h-4 w-4 mr-2" />
            Importar Política
          </Button>
          <Button onClick={handleCreatePolicy}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nova Política
          </Button>
        </div>
      </div>

      <PolicyList
        policies={policies}
        isLoading={isLoading}
        error={error}
        onEditPolicy={handleEditPolicy}
        onDeletePolicy={handleDeletePolicy}
        onToggleStatus={handleTogglePolicyStatus}
        isPendingStatusChange={togglePolicyStatusMutation.isPending}
        emptyMessage="Nenhuma política definida para esta unidade"
      />

      <Dialog open={policyDialog.open} onOpenChange={(open) => {
        if (!open) closeDialog();
      }}>
        <PolicyForm
          policy={policyDialog.policy}
          onPolicyChange={handlePolicyChange}
          onSubmit={handleSubmitPolicy}
          onCancel={closeDialog}
          isSubmitting={createPolicyMutation.isPending || updatePolicyMutation.isPending}
          isEditMode={policyDialog.editMode}
          units={units}
        />
      </Dialog>

      <DeletePolicyDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onDelete={confirmDeletePolicy}
        isPending={deletePolicyMutation.isPending}
      />
      
      <PolicyImport
        open={importDialog}
        onOpenChange={setImportDialog}
        availablePolicies={availablePolicies}
        unitId={unitId}
      />
    </div>
  );
};

export default UnitPolicies;
