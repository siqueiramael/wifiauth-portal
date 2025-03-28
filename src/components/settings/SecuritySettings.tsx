import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Shield, 
  Key, 
  QrCode, 
  Copy, 
  CheckCircle, 
  Loader2, 
  AlertTriangle,
  RefreshCcw
} from 'lucide-react';
import MicrosoftIcon from '@/components/icons/MicrosoftIcon';
import { toast } from 'sonner';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const SecuritySettings = () => {
  const { admin, oauthConfig, updateOAuthConfig, enableTwoFactor, disableTwoFactor } = useAuth();
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);
  const [setupStep, setSetupStep] = useState<'initial' | 'qrcode' | 'verify'>('initial');
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopiedSecret, setHasCopiedSecret] = useState(false);

  const oauthFormSchema = z.object({
    microsoftEnabled: z.boolean(),
    microsoftClientId: z.string().min(1, 'ID do Cliente é obrigatório quando habilitado').or(z.string().length(0)),
    microsoftTenantId: z.string().min(1, 'ID do Tenant é obrigatório quando habilitado').or(z.string().length(0)),
    microsoftRedirectUri: z.string(),
  }).refine((data) => {
    if (data.microsoftEnabled) {
      return !!data.microsoftClientId && !!data.microsoftTenantId;
    }
    return true;
  }, {
    message: "IDs de Cliente e Tenant são obrigatórios quando OAuth Microsoft está habilitado",
    path: ["microsoftEnabled"],
  });

  const form = useForm<z.infer<typeof oauthFormSchema>>({
    resolver: zodResolver(oauthFormSchema),
    defaultValues: {
      microsoftEnabled: oauthConfig.microsoftEnabled,
      microsoftClientId: oauthConfig.microsoftClientId,
      microsoftTenantId: oauthConfig.microsoftTenantId,
      microsoftRedirectUri: oauthConfig.microsoftRedirectUri,
    },
  });

  const handleOAuthSubmit = async (values: z.infer<typeof oauthFormSchema>) => {
    setIsLoading(true);
    try {
      await updateOAuthConfig(values);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnableTwoFactor = async () => {
    setIsLoading(true);
    try {
      const { secret, qrCode } = await enableTwoFactor();
      setTwoFactorSecret(secret);
      setQrCodeUrl(qrCode);
      setSetupStep('qrcode');
    } catch (error) {
      console.error('Failed to enable 2FA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableTwoFactor = async () => {
    setIsLoading(true);
    try {
      await disableTwoFactor();
      setIs2FADialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const copySecretToClipboard = () => {
    navigator.clipboard.writeText(twoFactorSecret);
    setHasCopiedSecret(true);
    toast.success('Código secreto copiado para a área de transferência');
    setTimeout(() => setHasCopiedSecret(false), 3000);
  };

  const verifyTwoFactorSetup = () => {
    if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
      toast.success('Autenticação em dois fatores ativada com sucesso');
      setIs2FADialogOpen(false);
      setSetupStep('initial');
      setVerificationCode('');
    } else {
      toast.error('Código inválido. Por favor, verifique e tente novamente.');
    }
  };

  const handleUpdateRedirectUri = () => {
    const origin = window.location.origin;
    form.setValue('microsoftRedirectUri', `${origin}/auth/microsoft/callback`);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="2fa" className="space-y-4">
        <TabsList>
          <TabsTrigger value="2fa">Autenticação em Dois Fatores</TabsTrigger>
          <TabsTrigger value="oauth">Integração com Microsoft</TabsTrigger>
        </TabsList>
        
        <TabsContent value="2fa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Autenticação em Dois Fatores
              </CardTitle>
              <CardDescription>
                A autenticação em dois fatores adiciona uma camada extra de segurança à sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Status</h4>
                    <p className="text-sm text-muted-foreground">
                      {admin?.twoFactorEnabled 
                        ? 'A autenticação em dois fatores está ativada' 
                        : 'A autenticação em dois fatores está desativada'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${admin?.twoFactorEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium">
                      {admin?.twoFactorEnabled ? 'Ativado' : 'Desativado'}
                    </span>
                  </div>
                </div>
                
                <div className="rounded-md bg-muted p-4">
                  <div className="flex flex-row items-start space-x-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Recomendação de segurança
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Recomendamos que todos os administradores utilizem a autenticação em dois fatores para maior segurança.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                <p className="text-xs text-muted-foreground">
                  Última atualização: {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>
              <Button 
                onClick={() => setIs2FADialogOpen(true)}
                variant={admin?.twoFactorEnabled ? "destructive" : "default"}
              >
                {admin?.twoFactorEnabled ? 'Desativar 2FA' : 'Ativar 2FA'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="oauth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MicrosoftIcon className="mr-2 h-5 w-5 text-primary" />
                Integração com Microsoft
              </CardTitle>
              <CardDescription>
                Configure a integração com Microsoft para permitir login com contas corporativas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOAuthSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="microsoftEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Habilitar login com Microsoft
                          </FormLabel>
                          <FormDescription>
                            Permite que administradores façam login com suas contas Microsoft
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("microsoftEnabled") && (
                    <>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="microsoftClientId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID do Cliente (Client ID)</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: 8a4d5f87-1e2b-3c4d-5e6f-7g8h9i0j1k2l" {...field} />
                              </FormControl>
                              <FormDescription>
                                O ID do cliente da sua aplicação registrada no Portal Azure
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="microsoftTenantId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID do Tenant (Tenant ID)</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: contoso.onmicrosoft.com ou GUID" {...field} />
                              </FormControl>
                              <FormDescription>
                                O ID do tenant Azure AD ou domínio
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="microsoftRedirectUri"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URI de Redirecionamento</FormLabel>
                              <div className="flex space-x-2">
                                <FormControl>
                                  <Input readOnly {...field} />
                                </FormControl>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="icon"
                                  onClick={handleUpdateRedirectUri}
                                >
                                  <RefreshCcw className="h-4 w-4" />
                                </Button>
                              </div>
                              <FormDescription>
                                Configure esta URL de redirecionamento no Portal Azure
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="rounded-md bg-blue-50 p-4 text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                          <div className="flex flex-row items-start space-x-3">
                            <div className="space-y-1">
                              <p className="text-sm font-medium">
                                Como configurar?
                              </p>
                              <p className="text-sm">
                                1. Registre um aplicativo no <a href="https://portal.azure.com" target="_blank" rel="noopener noreferrer" className="underline">Portal Azure</a><br />
                                2. Configure as permissões necessárias (OpenID, email, profile)<br />
                                3. Adicione o URI de redirecionamento acima nas configurações<br />
                                4. Copie o Client ID e Tenant ID para este formulário
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          'Salvar configurações'
                        )}
                      </Button>
                    </>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={is2FADialogOpen} onOpenChange={setIs2FADialogOpen}>
        <DialogContent className="sm:max-w-md">
          {admin?.twoFactorEnabled ? (
            <>
              <DialogHeader>
                <DialogTitle>Desativar autenticação em dois fatores</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja desativar a autenticação em dois fatores? Isso reduzirá a segurança da sua conta.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="rounded-md bg-amber-50 p-4 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                  <div className="flex flex-row items-start space-x-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Aviso de segurança
                      </p>
                      <p className="text-sm">
                        Desativar a autenticação em dois fatores tornará sua conta mais vulnerável a acesso não autorizado.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIs2FADialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={handleDisableTwoFactor}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Desativando...
                    </>
                  ) : (
                    'Desativar 2FA'
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Configurar autenticação em dois fatores</DialogTitle>
                <DialogDescription>
                  {setupStep === 'initial' && 'Aumente a segurança da sua conta com autenticação em dois fatores.'}
                  {setupStep === 'qrcode' && 'Escaneie o código QR com seu aplicativo autenticador.'}
                  {setupStep === 'verify' && 'Insira o código de 6 dígitos do seu aplicativo autenticador para verificar a configuração.'}
                </DialogDescription>
              </DialogHeader>
              
              {setupStep === 'initial' && (
                <>
                  <div className="py-6 space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Key className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Segurança Aprimorada</h4>
                        <p className="text-sm text-muted-foreground">
                          A autenticação em dois fatores adiciona uma camada extra de segurança exigindo um código único além da senha.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <QrCode className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Aplicativo Autenticador</h4>
                        <p className="text-sm text-muted-foreground">
                          Você precisará de um aplicativo autenticador como Google Authenticator, Authy ou Microsoft Authenticator.
                        </p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIs2FADialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="button"
                      onClick={handleEnableTwoFactor}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Configurando...
                        </>
                      ) : (
                        'Continuar'
                      )}
                    </Button>
                  </DialogFooter>
                </>
              )}
              
              {setupStep === 'qrcode' && (
                <>
                  <div className="py-6 space-y-4">
                    <div className="flex justify-center">
                      <div className="border rounded-md p-2 bg-white">
                        <img 
                          src={qrCodeUrl} 
                          alt="QR Code for 2FA" 
                          className="w-48 h-48"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Código secreto alternativo</p>
                      <div className="flex items-center space-x-2">
                        <Input 
                          value={twoFactorSecret} 
                          readOnly 
                          className="font-mono"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={copySecretToClipboard}
                        >
                          {hasCopiedSecret ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Se não conseguir escanear o QR code, você pode inserir este código secreto manualmente no seu aplicativo autenticador.
                      </p>
                    </div>
                  </div>
                  <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between">
                    <Button 
                      type="button" 
                      variant="ghost"
                      onClick={() => setSetupStep('initial')}
                    >
                      Voltar
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => setSetupStep('verify')}
                    >
                      Continuar
                    </Button>
                  </DialogFooter>
                </>
              )}
              
              {setupStep === 'verify' && (
                <>
                  <div className="py-6 space-y-4">
                    <p className="text-sm">
                      Abra seu aplicativo autenticador e insira o código de 6 dígitos gerado para WiFiAuth.
                    </p>
                    
                    <div className="space-y-2">
                      <label htmlFor="verification-code" className="text-sm font-medium">
                        Código de verificação
                      </label>
                      <Input 
                        id="verification-code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="000000"
                        className="text-center font-mono text-lg"
                        maxLength={6}
                        pattern="[0-9]*"
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                  <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between">
                    <Button 
                      type="button" 
                      variant="ghost"
                      onClick={() => setSetupStep('qrcode')}
                    >
                      Voltar
                    </Button>
                    <Button 
                      type="button"
                      onClick={verifyTwoFactorSetup}
                      disabled={verificationCode.length !== 6}
                    >
                      Verificar e ativar
                    </Button>
                  </DialogFooter>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecuritySettings;
