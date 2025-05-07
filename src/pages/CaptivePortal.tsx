
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { WifiIcon, AlertTriangle, Clock, Download, Upload, Check, Lock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const CaptivePortal = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'active' | 'expired' | 'pending'>('pending');
  const [user, setUser] = useState<{
    username: string;
    email: string;
    expiresAt: string;
    temporaryAccess: boolean;
  }>({
    username: '',
    email: '',
    expiresAt: '',
    temporaryAccess: true,
  });
  
  const [usage, setUsage] = useState({
    dailyUsage: 0,
    dailyLimit: 2,
    monthlyUsage: 1.2,
    monthlyLimit: 50,
    downloadSpeed: 10,
    uploadSpeed: 5
  });

  useEffect(() => {
    const fetchUserStatus = async () => {
      // Em um app real, isto verificaria o token e buscaria informações do usuário
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulação de resposta
      setUser({
        username: 'usuario.teste',
        email: 'usuario.teste@example.com',
        expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(), // +20 horas
        temporaryAccess: true,
      });
      
      setStatus('active');
      setLoading(false);
    };
    
    fetchUserStatus();
    
    // Simulação de atualização de uso
    const usageInterval = setInterval(() => {
      setUsage(prev => ({
        ...prev,
        dailyUsage: Math.min(prev.dailyUsage + 0.01, prev.dailyLimit),
        monthlyUsage: Math.min(prev.monthlyUsage + 0.05, prev.monthlyLimit)
      }));
    }, 3000);
    
    return () => clearInterval(usageInterval);
  }, [token]);

  const formatTimeRemaining = () => {
    const expiresAt = new Date(user.expiresAt);
    const now = new Date();
    
    if (expiresAt <= now) {
      return '0 minutos';
    }
    
    const diffMs = expiresAt.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs > 0) {
      return `${diffHrs}h ${diffMins}m`;
    }
    return `${diffMins} minutos`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <WifiIcon className="h-10 w-10 mb-2 animate-pulse text-muted-foreground" />
              <CardTitle>Carregando...</CardTitle>
              <CardDescription>Verificando seu status de acesso</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="glass-card">
          <CardHeader className="space-y-1 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full flex items-center justify-center bg-primary/10 mb-2">
              {status === 'active' ? (
                <WifiIcon className="h-8 w-8 text-primary" />
              ) : status === 'expired' ? (
                <AlertTriangle className="h-8 w-8 text-destructive" />
              ) : (
                <Clock className="h-8 w-8 text-amber-500" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {status === 'active' 
                ? 'Conectado à WiFi' 
                : status === 'expired'
                ? 'Acesso Expirado'
                : 'Acesso Pendente'}
            </CardTitle>
            <CardDescription>
              {status === 'active' 
                ? 'Você está conectado à rede WiFi Corporativa' 
                : status === 'expired'
                ? 'Seu acesso à rede WiFi expirou'
                : 'Aguardando aprovação do administrador'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {status === 'active' && (
              <>
                {user.temporaryAccess && (
                  <Alert className="bg-amber-50 border-amber-200">
                    <Info className="h-4 w-4 text-amber-500" />
                    <AlertTitle className="text-amber-700">Acesso Temporário</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      Tempo restante: <span className="font-medium">{formatTimeRemaining()}</span>
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Uso Diário</span>
                      <span className="text-sm text-muted-foreground">{usage.dailyUsage.toFixed(2)} / {usage.dailyLimit} GB</span>
                    </div>
                    <Progress 
                      value={(usage.dailyUsage / usage.dailyLimit) * 100} 
                      className={usage.dailyUsage > usage.dailyLimit * 0.9 ? "text-destructive" : ""}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Uso Mensal</span>
                      <span className="text-sm text-muted-foreground">{usage.monthlyUsage.toFixed(1)} / {usage.monthlyLimit} GB</span>
                    </div>
                    <Progress value={(usage.monthlyUsage / usage.monthlyLimit) * 100} />
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col items-center">
                        <Download className="h-4 w-4 mb-1 text-primary" />
                        <div className="text-sm font-medium">{usage.downloadSpeed} Mbps</div>
                        <div className="text-xs text-muted-foreground">Download</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <Upload className="h-4 w-4 mb-1 text-primary" />
                        <div className="text-sm font-medium">{usage.uploadSpeed} Mbps</div>
                        <div className="text-xs text-muted-foreground">Upload</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-sm">
                    <div className="grid grid-cols-[100px_1fr] gap-1">
                      <span className="text-muted-foreground">Usuário:</span>
                      <span className="font-medium">{user.username}</span>
                      
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{user.email}</span>
                      
                      <span className="text-muted-foreground">Expira em:</span>
                      <span className="font-medium">{new Date(user.expiresAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {status === 'expired' && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Acesso Expirado</AlertTitle>
                <AlertDescription>
                  Seu acesso temporário expirou. Por favor, entre em contato com o administrador da rede.
                </AlertDescription>
              </Alert>
            )}
            
            {status === 'pending' && (
              <Alert variant="default" className="bg-amber-50 border-amber-200">
                <Clock className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Pendente de Aprovação</AlertTitle>
                <AlertDescription className="text-amber-700">
                  Sua solicitação de acesso está sendo analisada. Você receberá uma notificação quando for aprovada.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-3">
            {status === 'active' && (
              <>
                <Button variant="default" className="w-full">
                  <Check className="h-4 w-4 mr-2" />
                  Continuar Navegando
                </Button>
                <Button variant="outline" className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  Desconectar
                </Button>
              </>
            )}
            
            {status === 'expired' && (
              <Button variant="default" className="w-full" asChild>
                <Link to="/login">Fazer Login Novamente</Link>
              </Button>
            )}
            
            {status === 'pending' && (
              <Button variant="outline" className="w-full" asChild>
                <Link to="/">Voltar ao Início</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Entrar com outra conta
          </Link>
          <Separator className="my-2" />
          <p className="text-xs text-muted-foreground">
            Em caso de problemas, contate o suporte técnico.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptivePortal;
