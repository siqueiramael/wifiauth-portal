
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface RadiusConfig {
  serverAddress: string;
  port: string;
  sharedSecret: string;
  authTimeout: string;
  enabled: boolean;
}

const RadiusSettings: React.FC = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<RadiusConfig>({
    serverAddress: '127.0.0.1',
    port: '1812',
    sharedSecret: 'radiussecret',
    authTimeout: '5',
    enabled: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      enabled: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would save to a database in a real app
    console.log('Saving RADIUS configuration:', config);
    toast({
      title: "Settings Saved",
      description: "RADIUS server configuration has been updated",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>RADIUS Server Configuration</CardTitle>
        <CardDescription>
          Configure the RADIUS server settings for network authentication
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox 
              id="enabled" 
              checked={config.enabled}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="enabled">Enable RADIUS Authentication</Label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="serverAddress">Server Address</Label>
              <Input
                id="serverAddress"
                name="serverAddress"
                value={config.serverAddress}
                onChange={handleChange}
                disabled={!config.enabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                name="port"
                value={config.port}
                onChange={handleChange}
                disabled={!config.enabled}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sharedSecret">Shared Secret</Label>
            <Input
              id="sharedSecret"
              name="sharedSecret"
              type="password"
              value={config.sharedSecret}
              onChange={handleChange}
              disabled={!config.enabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="authTimeout">Authentication Timeout (seconds)</Label>
            <Input
              id="authTimeout"
              name="authTimeout"
              type="number"
              min="1"
              max="60"
              value={config.authTimeout}
              onChange={handleChange}
              disabled={!config.enabled}
            />
          </div>

          <Button type="submit" className="mt-4">Save Configuration</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RadiusSettings;
