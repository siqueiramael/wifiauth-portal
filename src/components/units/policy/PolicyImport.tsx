
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePolicy } from '@/services/policyService';
import { UsagePolicy } from '@/models/policy';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface PolicyImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availablePolicies: UsagePolicy[];
  unitId: string;
}

const PolicyImport: React.FC<PolicyImportProps> = ({ 
  open, 
  onOpenChange, 
  availablePolicies,
  unitId
}) => {
  const queryClient = useQueryClient();
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);

  const importMutation = useMutation({
    mutationFn: async (policyId: string) => {
      const policy = availablePolicies.find(p => p.id === policyId);
      if (!policy) throw new Error('Política não encontrada');
      
      // Add this unit to target IDs
      const updatedTargetIds = [...policy.targetIds];
      if (!updatedTargetIds.includes(unitId)) {
        updatedTargetIds.push(unitId);
      }
      
      return updatePolicy(policy.id, { targetIds: updatedTargetIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success('Política importada com sucesso');
    },
    onError: (error: Error) => {
      toast.error(`Falha ao importar política: ${error.message}`);
    }
  });

  const handleToggleSelect = (policyId: string) => {
    setSelectedPolicies(prev => 
      prev.includes(policyId) 
        ? prev.filter(id => id !== policyId)
        : [...prev, policyId]
    );
  };

  const handleImportSelected = async () => {
    if (selectedPolicies.length === 0) {
      toast.warning('Selecione pelo menos uma política para importar');
      return;
    }

    try {
      // Import each selected policy
      await Promise.all(selectedPolicies.map(policyId => importMutation.mutateAsync(policyId)));
      onOpenChange(false);
      setSelectedPolicies([]);
    } catch (error) {
      console.error('Erro ao importar políticas:', error);
    }
  };

  const isAlreadyAppliedToUnit = (policy: UsagePolicy) => {
    return policy.targetIds.includes(unitId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Importar Políticas Existentes</DialogTitle>
          <DialogDescription>
            Selecione políticas existentes para aplicar a esta unidade
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Selecionar</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Download/Upload</TableHead>
                <TableHead>Limites de Dados</TableHead>
                <TableHead>Aplicado a</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availablePolicies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Não há políticas disponíveis para importação
                  </TableCell>
                </TableRow>
              ) : (
                availablePolicies.map((policy) => {
                  const isApplied = isAlreadyAppliedToUnit(policy);
                  
                  return (
                    <TableRow key={policy.id}>
                      <TableCell>
                        <input 
                          type="checkbox" 
                          checked={selectedPolicies.includes(policy.id) || isApplied}
                          disabled={isApplied}
                          onChange={() => handleToggleSelect(policy.id)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {policy.name}
                        <p className="text-xs text-muted-foreground">{policy.description}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={policy.active ? "default" : "outline"}>
                          {policy.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>↓ {policy.downloadSpeed === null ? 'Ilimitado' : `${policy.downloadSpeed} Mbps`}</span>
                          <span>↑ {policy.uploadSpeed === null ? 'Ilimitado' : `${policy.uploadSpeed} Mbps`}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>Diário: {policy.dailyDataLimit === null ? 'Ilimitado' : `${policy.dailyDataLimit} GB`}</span>
                          <span>Mensal: {policy.monthlyDataLimit === null ? 'Ilimitado' : `${policy.monthlyDataLimit} GB`}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {isApplied ? 
                          <Badge variant="outline">Já aplicada nesta unidade</Badge> :
                          policy.targetType === 'unit' ? 
                            <span className="text-xs text-muted-foreground">{policy.targetIds.length} unidade(s)</span> :
                            <span className="text-xs text-muted-foreground">{policy.targetType === 'user' ? 'Usuários' : 'Grupos'}</span>
                        }
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button 
            onClick={handleImportSelected}
            disabled={selectedPolicies.length === 0 || importMutation.isPending}
          >
            {importMutation.isPending ? "Importando..." : "Importar Selecionadas"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyImport;
