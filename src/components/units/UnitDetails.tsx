
import React from 'react';
import { Unit, WifiUser } from '@/models/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import UnitUsersList from './UnitUsersList';

interface UnitDetailsProps {
  unit: Unit;
  users: WifiUser[];
  onBack: () => void;
  onUpdateUserAccess: (userIds: string[], hasAccess: boolean) => void;
  isPending: boolean;
}

const UnitDetails: React.FC<UnitDetailsProps> = ({
  unit,
  users,
  onBack,
  onUpdateUserAccess,
  isPending
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Detalhes da Unidade</h1>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {unit.name}
          </CardTitle>
          <CardDescription>
            Controladora: {unit.controllerName} | Site: {unit.siteName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            Criado em: {formatDate(unit.createdAt)}
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-semibold mt-8 mb-4">Gerenciar Acesso de Usuários</h2>
      
      <UnitUsersList 
        users={users}
        unitId={unit.id}
        onSaveAccess={onUpdateUserAccess}
        isPending={isPending}
      />
    </div>
  );
};

export default UnitDetails;
