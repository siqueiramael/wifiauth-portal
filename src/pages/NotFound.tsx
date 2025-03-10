
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WifiOff } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="text-center animate-fade-in">
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <WifiOff className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          The page you're looking for can't be found
        </p>
        <Link to="/">
          <Button size="lg" className="glass-button">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
