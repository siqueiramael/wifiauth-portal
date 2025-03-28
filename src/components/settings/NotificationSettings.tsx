
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  SendHorizonal, 
  Server, 
  Settings, 
  Smartphone, 
  Loader2 
} from 'lucide-react';

const emailFormSchema = z.object({
  enabled: z.boolean(),
  smtpServer: z.string().min(1, "Campo obrigatório").or(z.string().length(0)),
  smtpPort: z.string().min(1, "Campo obrigatório").or(z.string().length(0)),
  smtpUsername: z.string().min(1, "Campo obrigatório").or(z.string().length(0)),
  smtpPassword: z.string().min(1, "Campo obrigatório").or(z.string().length(0)),
  senderEmail: z.string().email("Email inválido").or(z.string().length(0)),
  useTLS: z.boolean(),
}).refine(data => {
  if (data.enabled) {
    return !!data.smtpServer && !!data.smtpPort && !!data.senderEmail;
  }
  return true;
}, {
  message: "Campos obrigatórios quando notificações por email estão habilitadas",
  path: ['enabled']
});

const smsFormSchema = z.object({
  enabled: z.boolean(),
  provider: z.string().min(1, "Selecione um provedor").or(z.string().length(0)),
  apiKey: z.string().min(1, "Campo obrigatório").or(z.string().length(0)),
  senderId: z.string().min(1, "Campo obrigatório").or(z.string().length(0)),
}).refine(data => {
  if (data.enabled) {
    return !!data.provider && !!data.apiKey;
  }
  return true;
}, {
  message: "Campos obrigatórios quando notificações por SMS estão habilitadas",
  path: ['enabled']
});

const pushFormSchema = z.object({
  enabled: z.boolean(),
  timeToLive: z.number().min(1).max(72),
  webPushEnabled: z.boolean(),
  apnsEnabled: z.boolean(),
  fcmEnabled: z.boolean(),
  fcmServerKey: z.string().min(1, "Campo obrigatório quando FCM está habilitado").or(z.string().length(0)),
}).refine(data => {
  if (data.enabled && data.fcmEnabled) {
    return !!data.fcmServerKey;
  }
  return true;
}, {
  message: "Chave do Servidor FCM é obrigatória quando FCM está habilitado",
  path: ['fcmServerKey']
});

const webhookFormSchema = z.object({
  enabled: z.boolean(),
  url: z.string().url("URL inválida").or(z.string().length(0)),
  secret: z.string().min(1, "Campo obrigatório").or(z.string().length(0)),
  events: z.array(z.string()),
}).refine(data => {
  if (data.enabled) {
    return !!data.url;
  }
  return true;
}, {
  message: "URL é obrigatória quando webhooks estão habilitados",
  path: ['enabled']
});

const NotificationSettings = () => {
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testSmsLoading, setTestSmsLoading] = useState(false);
  const [testPushLoading, setTestPushLoading] = useState(false);
  const [testWebhookLoading, setTestWebhookLoading] = useState(false);

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      enabled: false,
      smtpServer: '',
      smtpPort: '587',
      smtpUsername: '',
      smtpPassword: '',
      senderEmail: '',
      useTLS: true,
    },
  });

  const smsForm = useForm<z.infer<typeof smsFormSchema>>({
    resolver: zodResolver(smsFormSchema),
    defaultValues: {
      enabled: false,
      provider: '',
      apiKey: '',
      senderId: 'WiFiAuth',
    },
  });

  const pushForm = useForm<z.infer<typeof pushFormSchema>>({
    resolver: zodResolver(pushFormSchema),
    defaultValues: {
      enabled: false,
      timeToLive: 24,
      webPushEnabled: true,
      apnsEnabled: false,
      fcmEnabled: false,
      fcmServerKey: '',
    },
  });

  const webhookForm = useForm<z.infer<typeof webhookFormSchema>>({
    resolver: zodResolver(webhookFormSchema),
    defaultValues: {
      enabled: false,
      url: '',
      secret: '',
      events: ['user.created', 'user.login'],
    },
  });

  const sendTestEmail = async () => {
    setTestEmailLoading(true);
    try {
      // Simulação de envio de email de teste
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Email de teste enviado com sucesso');
    } catch (error) {
      toast.error('Falha ao enviar email de teste');
    } finally {
      setTestEmailLoading(false);
    }
  };

  const sendTestSms = async () => {
    setTestSmsLoading(true);
    try {
      // Simulação de envio de SMS de teste
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('SMS de teste enviado com sucesso');
    } catch (error) {
      toast.error('Falha ao enviar SMS de teste');
    } finally {
      setTestSmsLoading(false);
    }
  };

  const sendTestPush = async () => {
    setTestPushLoading(true);
    try {
      // Simulação de envio de notificação push de teste
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Notificação push de teste enviada com sucesso');
    } catch (error) {
      toast.error('Falha ao enviar notificação push de teste');
    } finally {
      setTestPushLoading(false);
    }
  };

  const testWebhook = async () => {
    setTestWebhookLoading(true);
    try {
      // Simulação de teste de webhook
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Webhook testado com sucesso');
    } catch (error) {
      toast.error('Falha ao testar webhook');
    } finally {
      setTestWebhookLoading(false);
    }
  };

  const onEmailSubmit = (data: z.infer<typeof emailFormSchema>) => {
    console.log('Email config submitted:', data);
    toast.success('Configurações de email salvas com sucesso');
  };

  const onSmsSubmit = (data: z.infer<typeof smsFormSchema>) => {
    console.log('SMS config submitted:', data);
    toast.success('Configurações de SMS salvas com sucesso');
  };

  const onPushSubmit = (data: z.infer<typeof pushFormSchema>) => {
    console.log('Push config submitted:', data);
    toast.success('Configurações de notificações push salvas com sucesso');
  };

  const onWebhookSubmit = (data: z.infer<typeof webhookFormSchema>) => {
    console.log('Webhook config submitted:', data);
    toast.success('Configurações de webhook salvas com sucesso');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="email" className="space-y-4">
        <TabsList>
          <TabsTrigger value="email" className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="push" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Push
          </TabsTrigger>
          <TabsTrigger value="webhook" className="flex items-center">
            <SendHorizonal className="h-4 w-4 mr-2" />
            Webhooks
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                Configurações de Email
              </CardTitle>
              <CardDescription>
                Configure o servidor SMTP para envio de notificações por email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                  <FormField
                    control={emailForm.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Habilitar notificações por email
                          </FormLabel>
                          <FormDescription>
                            Envie notificações por email para usuários e administradores
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
                  
                  {emailForm.watch("enabled") && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={emailForm.control}
                          name="smtpServer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Servidor SMTP</FormLabel>
                              <FormControl>
                                <Input placeholder="smtp.example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={emailForm.control}
                          name="smtpPort"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Porta SMTP</FormLabel>
                              <FormControl>
                                <Input placeholder="587" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={emailForm.control}
                          name="smtpUsername"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Usuário SMTP</FormLabel>
                              <FormControl>
                                <Input placeholder="user@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={emailForm.control}
                          name="smtpPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Senha SMTP</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={emailForm.control}
                        name="senderEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email de Remetente</FormLabel>
                            <FormControl>
                              <Input placeholder="noreply@seudominio.com" {...field} />
                            </FormControl>
                            <FormDescription>
                              Este email será exibido como remetente das notificações
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={emailForm.control}
                        name="useTLS"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel>
                                Usar TLS/SSL
                              </FormLabel>
                              <FormDescription>
                                Habilitar conexão segura com o servidor SMTP
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={sendTestEmail}
                          disabled={testEmailLoading}
                        >
                          {testEmailLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            'Enviar email de teste'
                          )}
                        </Button>
                        
                        <Button type="submit">
                          Salvar configurações
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                Configurações de SMS
              </CardTitle>
              <CardDescription>
                Configure o serviço de SMS para envio de notificações e códigos de autenticação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...smsForm}>
                <form onSubmit={smsForm.handleSubmit(onSmsSubmit)} className="space-y-6">
                  <FormField
                    control={smsForm.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Habilitar notificações por SMS
                          </FormLabel>
                          <FormDescription>
                            Envie notificações e códigos de autenticação por SMS
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
                  
                  {smsForm.watch("enabled") && (
                    <div className="space-y-4">
                      <FormField
                        control={smsForm.control}
                        name="provider"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Provedor de SMS</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um provedor" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="twilio">Twilio</SelectItem>
                                <SelectItem value="aws_sns">AWS SNS</SelectItem>
                                <SelectItem value="zenvia">Zenvia</SelectItem>
                                <SelectItem value="infobip">Infobip</SelectItem>
                                <SelectItem value="custom">API Personalizada</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={smsForm.control}
                        name="apiKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chave da API</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormDescription>
                              Chave de API do seu provedor de SMS
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={smsForm.control}
                        name="senderId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID do Remetente</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Nome que aparecerá como remetente das mensagens (quando suportado pelo provedor)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={sendTestSms}
                          disabled={testSmsLoading}
                        >
                          {testSmsLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            'Enviar SMS de teste'
                          )}
                        </Button>
                        
                        <Button type="submit">
                          Salvar configurações
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="push">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary" />
                Notificações Push
              </CardTitle>
              <CardDescription>
                Configure notificações push para aplicativos móveis e web
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...pushForm}>
                <form onSubmit={pushForm.handleSubmit(onPushSubmit)} className="space-y-6">
                  <FormField
                    control={pushForm.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Habilitar notificações push
                          </FormLabel>
                          <FormDescription>
                            Envie notificações push para dispositivos móveis e navegadores
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
                  
                  {pushForm.watch("enabled") && (
                    <div className="space-y-4">
                      <FormField
                        control={pushForm.control}
                        name="timeToLive"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tempo de vida das notificações (horas)</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <Slider
                                  min={1}
                                  max={72}
                                  step={1}
                                  defaultValue={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>1h</span>
                                  <span>{field.value}h</span>
                                  <span>72h</span>
                                </div>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Tempo máximo que o servidor tentará entregar a notificação se o dispositivo estiver offline
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Plataformas habilitadas</h4>
                        
                        <FormField
                          control={pushForm.control}
                          name="webPushEnabled"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1">
                                <FormLabel className="flex items-center">
                                  <Settings className="h-4 w-4 mr-2" />
                                  Web Push (navegadores)
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={pushForm.control}
                          name="fcmEnabled"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1">
                                <FormLabel className="flex items-center">
                                  <Smartphone className="h-4 w-4 mr-2" />
                                  Firebase Cloud Messaging (Android)
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={pushForm.control}
                          name="apnsEnabled"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1">
                                <FormLabel className="flex items-center">
                                  <Smartphone className="h-4 w-4 mr-2" />
                                  Apple Push Notification Service (iOS)
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {pushForm.watch("fcmEnabled") && (
                        <FormField
                          control={pushForm.control}
                          name="fcmServerKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chave do Servidor FCM</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" />
                              </FormControl>
                              <FormDescription>
                                Chave do servidor Firebase Cloud Messaging obtida no console Firebase
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={sendTestPush}
                          disabled={testPushLoading}
                        >
                          {testPushLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            'Enviar notificação de teste'
                          )}
                        </Button>
                        
                        <Button type="submit">
                          Salvar configurações
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="webhook">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SendHorizonal className="h-5 w-5 mr-2 text-primary" />
                Configurações de Webhooks
              </CardTitle>
              <CardDescription>
                Configure webhooks para integrar o sistema com outras aplicações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...webhookForm}>
                <form onSubmit={webhookForm.handleSubmit(onWebhookSubmit)} className="space-y-6">
                  <FormField
                    control={webhookForm.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Habilitar webhooks
                          </FormLabel>
                          <FormDescription>
                            Envie notificações via webhook quando ocorrerem eventos no sistema
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
                  
                  {webhookForm.watch("enabled") && (
                    <div className="space-y-4">
                      <FormField
                        control={webhookForm.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL do Webhook</FormLabel>
                            <FormControl>
                              <Input placeholder="https://api.seudominio.com/webhook" {...field} />
                            </FormControl>
                            <FormDescription>
                              URL que receberá as requisições de webhook
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={webhookForm.control}
                        name="secret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chave Secreta</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>
                              Chave usada para verificar a autenticidade dos webhooks
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-2">
                        <FormLabel>Eventos</FormLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              id="user-created" 
                              checked 
                              className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800" 
                            />
                            <label htmlFor="user-created" className="text-sm">Usuário criado</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              id="user-login" 
                              checked 
                              className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800" 
                            />
                            <label htmlFor="user-login" className="text-sm">Login de usuário</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              id="user-blocked" 
                              className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800" 
                            />
                            <label htmlFor="user-blocked" className="text-sm">Usuário bloqueado</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              id="policy-updated" 
                              className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800" 
                            />
                            <label htmlFor="policy-updated" className="text-sm">Política atualizada</label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={testWebhook}
                          disabled={testWebhookLoading}
                        >
                          {testWebhookLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Testando...
                            </>
                          ) : (
                            'Testar webhook'
                          )}
                        </Button>
                        
                        <Button type="submit">
                          Salvar configurações
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationSettings;
