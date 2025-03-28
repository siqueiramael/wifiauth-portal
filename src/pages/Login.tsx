
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
import { WifiIcon, Loader2, Microsoft } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="glass-card">
          <CardHeader className="space-y-1 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10 mb-2">
              <WifiIcon className="h-6 w-6 text-primary" />
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
                      <Microsoft className="mr-2 h-4 w-4" />
                    )}
                    Entrar com Microsoft
                  </Button>
                </>
              )}
            </CardFooter>
          </form>
        </Card>
        
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
