
import React, { useState } from 'react';
import { WifiUser, Unit } from '@/models/user';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { approveUser, updateUser, deleteUser } from '@/services/userService';
import { toast } from 'sonner';

interface PendingApprovalUsersProps {
  pendingUsers: WifiUser[];
  units: Unit[];
  onUserApproved: () => void;
}

const PendingApprovalUsers: React.FC<PendingApprovalUsersProps> = ({ 
  pendingUsers, 
  units,
  onUserApproved
}) => {
  const [selectedUnitIds, setSelectedUnitIds] = useState<Record<string, string[]>>({});
  const [processingUsers, setProcessingUsers] = useState<Record<string, boolean>>({});
  
  const handleUnitChange = (userId: string, unitId: string) => {
    setSelectedUnitIds(prev => ({
      ...prev,
      [userId]: unitId ? [unitId] : []
    }));
  };
  
  const handleApproveUser = async (userId: string) => {
    const unitIds = selectedUnitIds[userId] || [];
    if (unitIds.length === 0) {
      toast.error('Selecione pelo menos uma unidade para o usuário');
      return;
    }
    
    setProcessingUsers(prev => ({ ...prev, [userId]: true }));
    
    try {
      await approveUser(userId, unitIds);
      toast.success('Usuário aprovado com sucesso');
      onUserApproved();
    } catch (error) {
      console.error('Error approving user:', error);
      if (error instanceof Error) {
        toast.error(`Erro ao aprovar usuário: ${error.message}`);
      } else {
        toast.error('Erro ao aprovar usuário');
      }
    } finally {
      setProcessingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  const handleRejectUser = async (userId: string) => {
    setProcessingUsers(prev => ({ ...prev, [userId]: true }));
    
    try {
      await deleteUser(userId);
      toast.success('Solicitação de acesso rejeitada');
      onUserApproved();
    } catch (error) {
      console.error('Error rejecting user:', error);
      if (error instanceof Error) {
        toast.error(`Erro ao rejeitar usuário: ${error.message}`);
      } else {
        toast.error('Erro ao rejeitar usuário');
      }
    } finally {
      setProcessingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  const handleExtendAccess = async (userId: string) => {
    setProcessingUsers(prev => ({ ...prev, [userId]: true }));
    
    try {
      // Extend temporary access by 24 more hours
      const user = pendingUsers.find(u => u.id === userId);
      if (!user) throw new Error('Usuário não encontrado');
      
      const currentExpirationDate = user.expirationDate ? new Date(user.expirationDate) : new Date();
      const newExpirationDate = new Date(currentExpirationDate);
      newExpirationDate.setHours(newExpirationDate.getHours() + 24);
      
      await updateUser({
        userId,
        userData: {
          expirationDate: newExpirationDate
        }
      });
      
      toast.success('Acesso temporário estendido por mais 24 horas');
      onUserApproved();
    } catch (error) {
      console.error('Error extending access:', error);
      if (error instanceof Error) {
        toast.error(`Erro ao estender acesso: ${error.message}`);
      } else {
        toast.error('Erro ao estender acesso');
      }
    } finally {
      setProcessingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  if (pendingUsers.length === 0) {
    return null; // Don't show the component if there are no pending users
  }
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-500" />
          Aprovações Pendentes
        </CardTitle>
        <CardDescription>
          Usuários aguardando aprovação para acesso WiFi permanente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Acesso expira em</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingUsers.map(user => {
              const expirationDate = user.expirationDate ? new Date(user.expirationDate) : null;
              const timeRemaining = expirationDate 
                ? formatDistanceToNow(expirationDate, { locale: ptBR, addSuffix: true })
                : 'N/A';
              
              const isProcessing = processingUsers[user.id] || false;
              
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.fullName || user.username}</TableCell>
                  <TableCell>{timeRemaining}</TableCell>
                  <TableCell>
                    <Select
                      onValueChange={(value) => handleUnitChange(user.id, value)}
                      value={selectedUnitIds[user.id]?.[0] || ''}
                      disabled={isProcessing}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione uma unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map(unit => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 bg-green-500/10 hover:bg-green-500/20 text-green-600"
                        onClick={() => handleApproveUser(user.id)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <CheckCircle className="h-4 w-4" />}
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600"
                        onClick={() => handleExtendAccess(user.id)}
                        disabled={isProcessing}
                      >
                        <Clock className="h-4 w-4" />
                        +24h
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-600"
                        onClick={() => handleRejectUser(user.id)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <XCircle className="h-4 w-4" />}
                        Rejeitar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PendingApprovalUsers;
