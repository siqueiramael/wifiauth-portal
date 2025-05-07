
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { WifiIcon, Loader2, UserIcon, Lock, Mail } from 'lucide-react';
import MicrosoftIcon from '@/components/icons/MicrosoftIcon';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createTemporaryUser } from '@/services/userService';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localUsername, setLocalUsername] = useState('');
  const [localPassword, setLocalPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [accessStatus, setAccessStatus] = useState<{
    isGranted: boolean;
    message: string;
    details?: string;
  } | null>(null);
  
  const { login, loginWithMicrosoft, isAuthenticated, isAwaitingTwoFactor, oauthConfig } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else if (isAwaitingTwoFactor) {
      navigate('/two-factor');
    }
  }, [isAuthenticated, isAwaitingTwoFactor, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, preencha email e senha');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const success = await login(email, password);
      if (success) {
        if (isAwaitingTwoFactor) {
          navigate('/two-factor');
        } else {
          navigate('/dashboard');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    if (!oauthConfig.microsoftEnabled) {
      toast.error('Login com Microsoft não está configurado');
      return;
    }
    
    setIsMicrosoftLoading(true);
    try {
      const success = await loginWithMicrosoft();
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsMicrosoftLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      // Em um app real, isso usaria Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1200));
      toast.error('Login com Google ainda não implementado');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleWifiMicrosoftLogin = async () => {
    if (!oauthConfig.microsoftEnabled) {
      toast.error('Login com Microsoft não está configurado');
      return;
    }
    
    setIsMicrosoftLoading(true);
    setAccessStatus(null);
    
    try {
      // Em um app real, isso usaria Microsoft OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Criar um usuário temporário com credenciais Microsoft
      const mockEmail = 'wifi.user@example.com';
      const mockUsername = 'wifi.user';
      
      try {
        const user = await createTemporaryUser({
          email: mockEmail,
          username: mockUsername,
          fullName: 'WiFi Test User',
          temporaryAccessDuration: 24, // 24 horas de acesso temporário
          authProvider: 'microsoft'
        });
        
        setAccessStatus({
          isGranted: true,
          message: 'Acesso temporário concedido!',
          details: 'Um administrador precisa aprovar seu acesso permanente.'
        });
      } catch (error) {
        if (error instanceof Error) {
          setAccessStatus({
            isGranted: false,
            message: 'Falha ao criar acesso temporário',
            details: error.message
          });
        } else {
          setAccessStatus({
            isGranted: false,
            message: 'Ocorreu um erro ao processar seu login',
          });
        }
      }
    } catch (error) {
      setAccessStatus({
        isGranted: false,
        message: 'Falha no login com Microsoft',
      });
    } finally {
      setIsMicrosoftLoading(false);
    }
  };
  
  const handleLocalWifiLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!localUsername || !localPassword) {
      toast.error('Por favor, preencha usuário e senha');
      return;
    }
    
    setIsLocalLoading(true);
    setAccessStatus(null);
    
    try {
      // Em um app real, isso verificaria credenciais locais
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Simulação de criação de usuário temporário
      try {
        const user = await createTemporaryUser({
          email: `${localUsername}@local.user`,
          username: localUsername,
          fullName: localUsername,
          temporaryAccessDuration: 8, // 8 horas de acesso temporário
          authProvider: 'microsoft' // Usamos microsoft por questão de simulação, mas seria 'local'
        });
        
        setAccessStatus({
          isGranted: true,
          message: 'Acesso temporário concedido!',
          details: 'Um administrador precisa aprovar seu acesso permanente.'
        });
      } catch (error) {
        if (error instanceof Error) {
          setAccessStatus({
            isGranted: false,
            message: 'Falha ao criar acesso temporário',
            details: error.message
          });
        } else {
          setAccessStatus({
            isGranted: false,
            message: 'Ocorreu um erro ao processar seu login',
          });
        }
      }
    } catch (error) {
      setAccessStatus({
        isGranted: false,
        message: 'Falha no login local',
      });
    } finally {
      setIsLocalLoading(false);
      setLocalUsername('');
      setLocalPassword('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Tabs defaultValue="wifi-user" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="wifi-user">Usuário WiFi</TabsTrigger>
            <TabsTrigger value="admin">Administrador</TabsTrigger>
          </TabsList>
          
          <TabsContent value="wifi-user">
            <Card className="glass-card">
              <CardHeader className="space-y-1 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10 mb-2">
                  <WifiIcon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">WiFi Login</CardTitle>
                <CardDescription>
                  Entre com sua conta corporativa para acessar a rede WiFi
                </CardDescription>
              </CardHeader>
              
              {accessStatus ? (
                <CardContent className="space-y-6">
                  <Alert className={accessStatus.isGranted ? "bg-green-100 border-green-200" : "bg-destructive/10 border-destructive/50"}>
                    <AlertDescription className="flex flex-col gap-2">
                      <span className="font-semibold">{accessStatus.message}</span>
                      {accessStatus.details && <span className="text-sm">{accessStatus.details}</span>}
                      
                      {accessStatus.isGranted && (
                        <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200">
                          <div className="text-sm font-medium">Informações de Acesso:</div>
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-muted-foreground">Rede:</span>
                            <span className="font-medium">WiFi Corporativo</span>
                          </div>
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-muted-foreground">Velocidade:</span>
                            <span className="font-medium">10 Mbps</span>
                          </div>
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-muted-foreground">Expiração:</span>
                            <span className="font-medium">24 horas</span>
                          </div>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="text-center">
                    <Button 
                      variant="outline" 
                      onClick={() => setAccessStatus(null)}
                      className="w-full"
                    >
                      Voltar
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Button 
                            type="button" 
                            className="w-full"
                            variant="default"
                            onClick={handleWifiMicrosoftLogin}
                            disabled={isMicrosoftLoading}
                          >
                            {isMicrosoftLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processando...
                              </>
                            ) : (
                              <>
                                <MicrosoftIcon className="mr-2 h-4 w-4" />
                                Entrar com Microsoft
                              </>
                            )}
                          </Button>
                        </div>
                        
                        <div>
                          <Button 
                            type="button" 
                            className="w-full"
                            variant="outline"
                            onClick={handleGoogleLogin}
                            disabled={isGoogleLoading}
                          >
                            {isGoogleLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processando...
                              </>
                            ) : (
                              <>
                                <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg">
                                  <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"></path>
                                  <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"></path>
                                  <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"></path>
                                  <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"></path>
                                </svg>
                                Entrar com Google
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">
                            ou continue com usuário local
                          </span>
                        </div>
                      </div>
                      
                      <form onSubmit={handleLocalWifiLogin} className="space-y-4">
                        <div className="grid gap-2">
                          <label htmlFor="username" className="text-sm font-medium">
                            Usuário
                          </label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="username"
                              placeholder="Digite seu nome de usuário"
                              className="pl-9"
                              value={localUsername}
                              onChange={(e) => setLocalUsername(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="password" className="text-sm font-medium">
                            Senha
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="password"
                              type="password"
                              placeholder="Digite sua senha"
                              className="pl-9"
                              value={localPassword}
                              onChange={(e) => setLocalPassword(e.target.value)}
                            />
                          </div>
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLocalLoading}
                        >
                          {isLocalLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Conectando...
                            </>
                          ) : (
                            'Entrar'
                          )}
                        </Button>
                      </form>
                    </div>
                    
                    <div className="text-center text-xs text-muted-foreground">
                      <p>Ao entrar, você terá acesso temporário à rede WiFi.</p>
                      <p>Um administrador precisará aprovar seu acesso permanente.</p>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="admin">
            <Card className="glass-card">
              <CardHeader className="space-y-1 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10 mb-2">
                  <UserIcon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
                <CardDescription>
                  Entre com suas credenciais para acessar o portal de administração
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9"
                        autoFocus
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium">
                        Senha
                      </label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-2">
                    <strong>Credenciais de demonstração:</strong><br />
                    Email: admin@example.com<br />
                    Senha: password
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full glass-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                  
                  {oauthConfig.microsoftEnabled && (
                    <>
                      <div className="relative w-full">
                        <Separator className="my-2" />
                        <div className="absolute inset-x-0 top-1/2 flex justify-center">
                          <span className="px-2 bg-card text-xs text-muted-foreground">ou</span>
                        </div>
                      </div>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full"
                        onClick={handleMicrosoftLogin}
                        disabled={isMicrosoftLoading}
                      >
                        {isMicrosoftLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <MicrosoftIcon className="mr-2 h-4 w-4" />
                        )}
                        Entrar com Microsoft
                      </Button>
                    </>
                  )}
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-4">
          <a 
            href="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
