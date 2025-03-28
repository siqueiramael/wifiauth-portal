
import React from 'react';
import { UsagePolicy } from '@/models/policy';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface PolicyListProps {
  policies: UsagePolicy[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onEditPolicy: (policy: UsagePolicy) => void;
  onDeletePolicy: (policyId: string) => void;
  onToggleStatus: (policyId: string) => void;
  isPendingStatusChange: boolean;
}

const PolicyList: React.FC<PolicyListProps> = ({
  policies,
  isLoading,
  error,
  onEditPolicy,
  onDeletePolicy,
  onToggleStatus,
  isPendingStatusChange,
}) => {
  if (error) {
    return (
      <div className="bg-destructive/15 p-4 rounded-md">
        <p className="text-destructive">Erro ao carregar políticas: {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!policies || policies.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md">
        <h3 className="text-lg font-semibold mb-2">Nenhuma política encontrada</h3>
        <p className="text-muted-foreground">
          Crie políticas para gerenciar o uso da rede de seus usuários.
        </p>
      </div>
    );
  }

  const formatSpeedLimit = (speed: number | null) => {
    if (speed === null) return 'Ilimitado';
    return `${speed} Mbps`;
  };

  const formatDataLimit = (data: number | null) => {
    if (data === null) return 'Ilimitado';
    return `${data} GB`;
  };

  const formatTargetType = (type: string) => {
    switch (type) {
      case 'user':
        return 'Usuários';
      case 'group':
        return 'Grupos';
      case 'unit':
        return 'Unidades';
      default:
        return type;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">Download/Upload</TableHead>
          <TableHead className="hidden md:table-cell">Limites de Dados</TableHead>
          <TableHead className="hidden md:table-cell">Aplicado a</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {policies.map((policy) => (
          <TableRow key={policy.id}>
            <TableCell className="font-medium">
              <div>
                {policy.name}
                <p className="text-xs text-muted-foreground">{policy.description}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Switch
                  checked={policy.active}
                  onCheckedChange={() => onToggleStatus(policy.id)}
                  disabled={isPendingStatusChange}
                />
                <Badge variant={policy.active ? "default" : "outline"}>
                  {policy.active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <div className="flex flex-col">
                <span>↓ {formatSpeedLimit(policy.downloadSpeed)}</span>
                <span>↑ {formatSpeedLimit(policy.uploadSpeed)}</span>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <div className="flex flex-col">
                <span>Diário: {formatDataLimit(policy.dailyDataLimit)}</span>
                <span>Mensal: {formatDataLimit(policy.monthlyDataLimit)}</span>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {formatTargetType(policy.targetType)}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEditPolicy(policy)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDeletePolicy(policy.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PolicyList;
