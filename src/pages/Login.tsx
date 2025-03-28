
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
import { WifiIcon, Loader2, UserIcon } from 'lucide-react';
import MicrosoftIcon from '@/components/icons/MicrosoftIcon';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createTemporaryUser } from '@/services/userService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);
  const [isWifiMicrosoftLoading, setIsWifiMicrosoftLoading] = useState(false);
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

  const handleWifiMicrosoftLogin = async () => {
    if (!oauthConfig.microsoftEnabled) {
      toast.error('Login com Microsoft não está configurado');
      return;
    }
    
    setIsWifiMicrosoftLoading(true);
    try {
      // In a real app, this would use Microsoft OAuth
      // For demo, simulate a Microsoft login for a WiFi user
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a temporary user with Microsoft credentials
      const mockEmail = 'wifi.user@example.com';
      const mockUsername = 'wifi.user';
      
      try {
        const user = await createTemporaryUser({
          email: mockEmail,
          username: mockUsername,
          fullName: 'WiFi Test User',
          temporaryAccessDuration: 24, // 24 hours temporary access
          authProvider: 'microsoft'
        });
        
        toast.success('Login realizado com sucesso! Seu acesso temporário foi criado.');
        toast.info('Um administrador precisa aprovar seu acesso permanente.');
        
        // In a real app, this would redirect to a special WiFi portal or temporary access page
        // For now, just show a message and stay on login page
        setIsWifiMicrosoftLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Falha ao criar acesso temporário: ${error.message}`);
        } else {
          toast.error('Ocorreu um erro ao processar seu login');
        }
        setIsWifiMicrosoftLoading(false);
      }
    } catch (error) {
      toast.error('Falha no login com Microsoft');
      setIsWifiMicrosoftLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="admin">Administrador</TabsTrigger>
            <TabsTrigger value="wifi-user">Usuário WiFi</TabsTrigger>
          </TabsList>
          
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
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="glass-input"
                      autoFocus
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium">
                        Senha
                      </label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="glass-input"
                      required
                    />
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
              <CardContent className="space-y-6">
                <div className="text-center text-sm text-muted-foreground">
                  Acesse utilizando sua conta do Microsoft Office 365
                </div>
                
                <Button 
                  type="button" 
                  className="w-full"
                  variant="default"
                  onClick={handleWifiMicrosoftLogin}
                  disabled={isWifiMicrosoftLoading}
                >
                  {isWifiMicrosoftLoading ? (
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
                
                <div className="text-center text-xs text-muted-foreground">
                  <p>Ao entrar, você terá acesso temporário à rede WiFi.</p>
                  <p>Um administrador precisará aprovar seu acesso permanente.</p>
                </div>
              </CardContent>
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
