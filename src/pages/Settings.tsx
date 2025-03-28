
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RadiusSettings from '@/components/settings/RadiusSettings';
import ControllerSettings from '@/components/settings/ControllerSettings';
import NetworkSettings from '@/components/settings/NetworkSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>
          <p className="text-muted-foreground mt-2">
            Configure parâmetros do sistema para controladores, autenticação e notificações.
          </p>
        </div>
        
        <Tabs defaultValue="radius" className="space-y-4">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="radius">Radius</TabsTrigger>
            <TabsTrigger value="controllers">Controladores</TabsTrigger>
            <TabsTrigger value="network">Administradores</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="radius" className="space-y-4">
            <RadiusSettings />
          </TabsContent>
          
          <TabsContent value="controllers" className="space-y-4">
            <ControllerSettings />
          </TabsContent>
          
          <TabsContent value="network" className="space-y-4">
            <NetworkSettings />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <SecuritySettings />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
