
import React, { useState } from 'react';
import { Unit, WifiUser } from '@/models/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, Wifi, ShieldCheck, BarChart } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UnitUsersList from './UnitUsersList';
import UnitAccessPoints from './UnitAccessPoints';
import UnitPolicies from './UnitPolicies';
import UnitReports from './UnitReports';

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
  const [activeTab, setActiveTab] = useState('users');

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
      
      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="access-points">Pontos de Acesso</TabsTrigger>
          <TabsTrigger value="policies">Políticas</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <h2 className="text-xl font-semibold">Gerenciar Acesso de Usuários</h2>
          <UnitUsersList 
            users={users}
            unitId={unit.id}
            onSaveAccess={onUpdateUserAccess}
            isPending={isPending}
          />
        </TabsContent>
        
        <TabsContent value="access-points" className="space-y-4">
          <h2 className="text-xl font-semibold">Pontos de Acesso</h2>
          <UnitAccessPoints unitId={unit.id} />
        </TabsContent>
        
        <TabsContent value="policies" className="space-y-4">
          <h2 className="text-xl font-semibold">Políticas de Uso</h2>
          <UnitPolicies unitId={unit.id} />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <h2 className="text-xl font-semibold">Relatórios</h2>
          <UnitReports unitId={unit.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnitDetails;
