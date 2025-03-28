
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchPolicies, 
  createPolicy, 
  updatePolicy, 
  deletePolicy,
  togglePolicyStatus 
} from '@/services/policyService';
import { fetchUnits } from '@/services/unitService';
import { UsagePolicy, PolicyFormData, WeekdayRange } from '@/models/policy';
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';
import { Dialog } from '@/components/ui/dialog';
import PoliciesHeader from '@/components/policies/PoliciesHeader';
import PolicyList from '@/components/policies/PolicyList';
import PolicyForm from '@/components/policies/PolicyForm';
import DeletePolicyDialog from '@/components/policies/DeletePolicyDialog';

const Policies = () => {
  const [policyDialog, setPolicyDialog] = useState<{
    open: boolean;
    editMode: boolean;
    policy: PolicyFormData;
  }>({
    open: false,
    editMode: false,
    policy: {
      name: '',
      description: '',
      active: true,
      downloadSpeed: 10,
      uploadSpeed: 5,
      dailyDataLimit: 2,
      monthlyDataLimit: 50,
      allowedTimeRanges: [] as WeekdayRange[],
      targetType: 'group',
      targetIds: [],
    },
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    policyId: string | null;
  }>({
    open: false,
    policyId: null,
  });

  const queryClient = useQueryClient();

  const { data: policies, isLoading, error } = useQuery({
    queryKey: ['policies'],
    queryFn: fetchPolicies,
  });

  const { data: units = [] } = useQuery({
    queryKey: ['units'],
    queryFn: fetchUnits,
  });

  const createPolicyMutation = useMutation({
    mutationFn: createPolicy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success('Política criada com sucesso');
      closeDialog();
    },
    onError: (error: Error) => {
      toast.error(`Falha ao criar política: ${error.message}`);
    },
  });

  const updatePolicyMutation = useMutation({
    mutationFn: ({
      policyId,
      policyData,
    }: {
      policyId: string;
      policyData: Partial<PolicyFormData>;
    }) => updatePolicy(policyId, policyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success('Política atualizada com sucesso');
      closeDialog();
    },
    onError: (error: Error) => {
      toast.error(`Falha ao atualizar política: ${error.message}`);
    },
  });

  const deletePolicyMutation = useMutation({
    mutationFn: deletePolicy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success('Política excluída com sucesso');
      setDeleteDialog({ open: false, policyId: null });
    },
    onError: (error: Error) => {
      toast.error(`Falha ao excluir política: ${error.message}`);
    },
  });

  const togglePolicyStatusMutation = useMutation({
    mutationFn: togglePolicyStatus,
    onSuccess: (updatedPolicy) => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success(
        `Política ${updatedPolicy.active ? 'ativada' : 'desativada'} com sucesso`
      );
    },
    onError: (error: Error) => {
      toast.error(`Falha ao atualizar status: ${error.message}`);
    },
  });

  const handleCreatePolicy = () => {
    setPolicyDialog({
      open: true,
      editMode: false,
      policy: {
        name: '',
        description: '',
        active: true,
        downloadSpeed: 10,
        uploadSpeed: 5,
        dailyDataLimit: 2,
        monthlyDataLimit: 50,
        allowedTimeRanges: [],
        targetType: 'group',
        targetIds: [],
      },
    });
  };

  const handleEditPolicy = (policy: UsagePolicy) => {
    setPolicyDialog({
      open: true,
      editMode: true,
      policy: {
        name: policy.name,
        description: policy.description,
        active: policy.active,
        downloadSpeed: policy.downloadSpeed,
        uploadSpeed: policy.uploadSpeed,
        dailyDataLimit: policy.dailyDataLimit,
        monthlyDataLimit: policy.monthlyDataLimit,
        allowedTimeRanges: policy.allowedTimeRanges,
        targetType: policy.targetType,
        targetIds: policy.targetIds,
      },
    });
  };

  const handlePolicyChange = (policy: PolicyFormData) => {
    setPolicyDialog({ ...policyDialog, policy });
  };

  const handleSubmitPolicy = (e: React.FormEvent) => {
    e.preventDefault();

    if (!policyDialog.policy.name) {
      toast.error('Por favor, insira um nome para a política');
      return;
    }

    if (policyDialog.editMode && policies) {
      const policyToEdit = policies.find(
        (p) => p.name === policyDialog.policy.name && p.description === policyDialog.policy.description
      );
      if (policyToEdit) {
        updatePolicyMutation.mutate({
          policyId: policyToEdit.id,
          policyData: policyDialog.policy,
        });
      }
    } else {
      createPolicyMutation.mutate(policyDialog.policy);
    }
  };

  const handleDeletePolicy = (policyId: string) => {
    setDeleteDialog({ open: true, policyId });
  };

  const confirmDeletePolicy = () => {
    if (deleteDialog.policyId) {
      deletePolicyMutation.mutate(deleteDialog.policyId);
    }
  };

  const handleTogglePolicyStatus = (policyId: string) => {
    togglePolicyStatusMutation.mutate(policyId);
  };

  const closeDialog = () => {
    setPolicyDialog((prev) => ({ ...prev, open: false }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PoliciesHeader onCreatePolicy={handleCreatePolicy} />

        <PolicyList
          policies={policies}
          isLoading={isLoading}
          error={error}
          onEditPolicy={handleEditPolicy}
          onDeletePolicy={handleDeletePolicy}
          onToggleStatus={handleTogglePolicyStatus}
          isPendingStatusChange={togglePolicyStatusMutation.isPending}
        />
      </div>

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
    </DashboardLayout>
  );
};

export default Policies;
