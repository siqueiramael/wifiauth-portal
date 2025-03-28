
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import TwoFactorAuth from '@/components/TwoFactorAuth';
import { AlertCircle } from 'lucide-react';
import MicrosoftIcon from '@/components/icons/MicrosoftIcon';
import { Slider } from '@/components/ui/slider';

const SecuritySettings = () => {
  const { admin, oauthConfig, updateOAuthConfig } = useAuth();
  
  const [microsoftConfig, setMicrosoftConfig] = useState({
    microsoftEnabled: oauthConfig.microsoftEnabled,
    microsoftClientId: oauthConfig.microsoftClientId,
    microsoftTenantId: oauthConfig.microsoftTenantId,
    microsoftRedirectUri: oauthConfig.microsoftRedirectUri,
  });
  
  const [temporaryAccessConfig, setTemporaryAccessConfig] = useState({
    enabled: true,
    defaultDuration: 24, // in hours
    maxDuration: 72, // in hours
  });
  
  const handleMicrosoftConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMicrosoftConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleMicrosoftEnabledChange = (checked: boolean) => {
    setMicrosoftConfig(prev => ({
      ...prev,
      microsoftEnabled: checked
    }));
  };
  
  const handleTemporaryAccessEnabledChange = (checked: boolean) => {
    setTemporaryAccessConfig(prev => ({
      ...prev,
      enabled: checked
    }));
  };
  
  const handleSaveMicrosoftConfig = async () => {
    const success = await updateOAuthConfig(microsoftConfig);
    if (success) {
      toast.success('Configurações de Microsoft OAuth atualizadas com sucesso');
    }
  };
  
  const handleSaveTemporaryAccessConfig = () => {
    // In a real app, this would save to a backend
    toast.success('Configurações de acesso temporário salvas com sucesso');
  };
  
  return (
    <div className="space-y-6">
      <TwoFactorAuth />
      
      {/* Microsoft OAuth Config */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MicrosoftIcon className="h-5 w-5" /> Integração com Microsoft
          </CardTitle>
          <CardDescription>
            Configure a integração com Microsoft Azure AD para autenticação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="microsoftEnabled" 
              checked={microsoftConfig.microsoftEnabled}
              onCheckedChange={handleMicrosoftEnabledChange}
            />
            <Label htmlFor="microsoftEnabled">Habilitar autenticação via Microsoft Office 365</Label>
          </div>
          
          {microsoftConfig.microsoftEnabled && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="microsoftClientId">Client ID</Label>
                <Input 
                  id="microsoftClientId"
                  name="microsoftClientId"
                  value={microsoftConfig.microsoftClientId}
                  onChange={handleMicrosoftConfigChange}
                  placeholder="ID do cliente do aplicativo Azure AD"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="microsoftTenantId">Tenant ID</Label>
                <Input 
                  id="microsoftTenantId"
                  name="microsoftTenantId"
                  value={microsoftConfig.microsoftTenantId}
                  onChange={handleMicrosoftConfigChange}
                  placeholder="ID do tenant Azure AD"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="microsoftRedirectUri">URI de Redirecionamento</Label>
                <Input 
                  id="microsoftRedirectUri"
                  name="microsoftRedirectUri"
                  value={microsoftConfig.microsoftRedirectUri}
                  onChange={handleMicrosoftConfigChange}
                  placeholder="https://seusite.com/auth/microsoft/callback"
                />
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-300">
                  <p>Você deve configurar o mesmo URI de redirecionamento no portal do Azure AD.</p>
                  <p className="mt-1">Permissões necessárias: <code>User.Read</code></p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {microsoftConfig.microsoftEnabled && (
          <CardFooter>
            <Button onClick={handleSaveMicrosoftConfig}>
              Salvar Configurações
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {/* Temporary Access Config */}
      <Card>
        <CardHeader>
          <CardTitle>Acesso Temporário</CardTitle>
          <CardDescription>
            Configure as políticas de acesso temporário para novos usuários
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="temporaryAccessEnabled" 
              checked={temporaryAccessConfig.enabled}
              onCheckedChange={handleTemporaryAccessEnabledChange}
            />
            <Label htmlFor="temporaryAccessEnabled">Habilitar acesso temporário para novos usuários</Label>
          </div>
          
          {temporaryAccessConfig.enabled && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="defaultDuration">Duração padrão do acesso temporário</Label>
                  <span className="text-sm text-muted-foreground">{temporaryAccessConfig.defaultDuration} horas</span>
                </div>
                <Slider
                  id="defaultDuration"
                  min={1}
                  max={72}
                  step={1}
                  value={[temporaryAccessConfig.defaultDuration]}
                  onValueChange={(value) => setTemporaryAccessConfig(prev => ({ ...prev, defaultDuration: value[0] }))}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="maxDuration">Duração máxima permitida</Label>
                  <span className="text-sm text-muted-foreground">{temporaryAccessConfig.maxDuration} horas</span>
                </div>
                <Slider
                  id="maxDuration"
                  min={1}
                  max={168} // 7 days
                  step={1}
                  value={[temporaryAccessConfig.maxDuration]}
                  onValueChange={(value) => setTemporaryAccessConfig(prev => ({ ...prev, maxDuration: value[0] }))}
                />
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-3 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  <p>Novos usuários que entrarem com o Microsoft Office 365 receberão acesso temporário à rede WiFi por {temporaryAccessConfig.defaultDuration} horas, enquanto aguardam aprovação do administrador.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {temporaryAccessConfig.enabled && (
          <CardFooter>
            <Button onClick={handleSaveTemporaryAccessConfig}>
              Salvar Configurações
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default SecuritySettings;
