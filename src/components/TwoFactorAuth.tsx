
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { WifiIcon, Loader2 } from 'lucide-react';
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot 
} from "@/components/ui/input-otp";
import { toast } from 'sonner';

const TwoFactorAuth = () => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { verifyTwoFactor } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error('Por favor, insira o código completo de 6 dígitos');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const success = await verifyTwoFactor(otp);
      if (success) {
        toast.success('Autenticação bem-sucedida');
        navigate('/dashboard');
      } else {
        toast.error('Código inválido, tente novamente');
      }
    } catch (error) {
      toast.error('Falha na autenticação');
    } finally {
      setIsSubmitting(false);
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
            <CardTitle className="text-2xl font-bold">Autenticação em Dois Fatores</CardTitle>
            <CardDescription>
              Insira o código de 6 dígitos gerado pelo seu aplicativo autenticador
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="flex justify-center py-4">
                <InputOTP 
                  value={otp} 
                  onChange={setOtp} 
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="text-sm text-center text-muted-foreground">
                Abra seu aplicativo autenticador (como Google Authenticator, Authy ou Microsoft Authenticator) e insira o código exibido
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button 
                type="submit" 
                className="w-full glass-button"
                disabled={isSubmitting || otp.length !== 6}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Verificar'
                )}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full"
                onClick={() => navigate('/login')}
              >
                Voltar ao login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
