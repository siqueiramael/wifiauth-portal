
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RadiusSettings from '@/components/settings/RadiusSettings';
import ControllerSettings from '@/components/settings/ControllerSettings';
import NetworkSettings from '@/components/settings/NetworkSettings';

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure system parameters for controllers and network authentication.
          </p>
        </div>
        
        <Tabs defaultValue="radius" className="space-y-4">
          <TabsList>
            <TabsTrigger value="radius">Radius Configuration</TabsTrigger>
            <TabsTrigger value="controllers">Controllers</TabsTrigger>
            <TabsTrigger value="network">Network Settings</TabsTrigger>
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
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
