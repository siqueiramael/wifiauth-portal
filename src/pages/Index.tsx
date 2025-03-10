
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { WifiIcon } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary">
      <div className="w-full max-w-md animate-fade-in">
        <div className="glass-card p-8 rounded-xl shadow-lg">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full flex items-center justify-center bg-primary/10 mb-4">
              <WifiIcon className="h-8 w-8 text-primary animate-float" />
            </div>
            <h1 className="text-2xl font-bold">WiFi Authentication Portal</h1>
            <p className="text-muted-foreground mt-2 mb-6">
              Manage wireless access for your network users
            </p>
            
            <Button 
              className="w-full glass-button"
              onClick={() => navigate('/login')}
              size="lg"
            >
              Admin Login
            </Button>
            
            <p className="text-xs text-muted-foreground mt-4">
              For Ubuntu 24.04 | WPA2 Enterprise | Unifi & Omada compatible
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
