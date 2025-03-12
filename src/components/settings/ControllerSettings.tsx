
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ControllerSettings: React.FC = () => {
  const { toast } = useToast();
  const [unifiConfig, setUnifiConfig] = useState({
    apiVersion: 'v5',
    autoDiscovery: true,
    refreshInterval: '30',
    sitePollingInterval: '300',
  });

  const [omadaConfig, setOmadaConfig] = useState({
    apiVersion: 'v2',
    autoDiscovery: true,
    refreshInterval: '30',
    sitePollingInterval: '300',
  });

  const handleUnifiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUnifiConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOmadaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOmadaConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUnifiSelectChange = (name: string, value: string) => {
    setUnifiConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOmadaSelectChange = (name: string, value: string) => {
    setOmadaConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (type: 'unifi' | 'omada') => {
    // This would save to a database in a real app
    console.log(`Saving ${type} configuration:`, type === 'unifi' ? unifiConfig : omadaConfig);
    toast({
      title: "Settings Saved",
      description: `${type === 'unifi' ? 'UniFi' : 'Omada'} controller configuration has been updated`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Controller Configuration</CardTitle>
        <CardDescription>
          Configure global settings for UniFi and Omada controllers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="unifi" className="space-y-4">
          <TabsList>
            <TabsTrigger value="unifi">UniFi Controllers</TabsTrigger>
            <TabsTrigger value="omada">Omada Controllers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="unifi">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('unifi'); }} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="apiVersion">API Version</Label>
                  <Select 
                    value={unifiConfig.apiVersion} 
                    onValueChange={(value) => handleUnifiSelectChange('apiVersion', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select API version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v4">v4 (Legacy)</SelectItem>
                      <SelectItem value="v5">v5 (Current)</SelectItem>
                      <SelectItem value="v6">v6 (Beta)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
                  <Input
                    id="refreshInterval"
                    name="refreshInterval"
                    type="number"
                    min="10"
                    max="3600"
                    value={unifiConfig.refreshInterval}
                    onChange={handleUnifiChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sitePollingInterval">Site Polling Interval (seconds)</Label>
                <Input
                  id="sitePollingInterval"
                  name="sitePollingInterval"
                  type="number"
                  min="60"
                  max="86400"
                  value={unifiConfig.sitePollingInterval}
                  onChange={handleUnifiChange}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  How often to poll for changes to sites and access points
                </p>
              </div>

              <Button type="submit" className="mt-4">Save UniFi Configuration</Button>
            </form>
          </TabsContent>
          
          <TabsContent value="omada">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('omada'); }} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="apiVersion">API Version</Label>
                  <Select 
                    value={omadaConfig.apiVersion} 
                    onValueChange={(value) => handleOmadaSelectChange('apiVersion', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select API version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v1">v1 (Legacy)</SelectItem>
                      <SelectItem value="v2">v2 (Current)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
                  <Input
                    id="refreshInterval"
                    name="refreshInterval"
                    type="number"
                    min="10"
                    max="3600"
                    value={omadaConfig.refreshInterval}
                    onChange={handleOmadaChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sitePollingInterval">Site Polling Interval (seconds)</Label>
                <Input
                  id="sitePollingInterval"
                  name="sitePollingInterval"
                  type="number"
                  min="60"
                  max="86400"
                  value={omadaConfig.sitePollingInterval}
                  onChange={handleOmadaChange}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  How often to poll for changes to sites and access points
                </p>
              </div>

              <Button type="submit" className="mt-4">Save Omada Configuration</Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ControllerSettings;
