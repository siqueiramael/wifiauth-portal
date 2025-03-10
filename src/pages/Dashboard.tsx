
import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/services/userService';
import { controllerService } from '@/services/controllerService';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/Spinner';
import { Users, UserX, UserCheck, UserPlus, WifiOff, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Controller, AccessPoint } from '@/types/controller';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  description 
}: { 
  title: string;
  value: number | string;
  icon: JSX.Element;
  description?: string;
}) => (
  <Card className="animate-scale-in">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { toast } = useToast();
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getStats
  });

  const { data: controllers = [], isLoading: controllersLoading, error: controllersError } = useQuery({
    queryKey: ['controllers'],
    queryFn: controllerService.getControllers,
    onSettled: (data, error) => {
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load controllers data",
          variant: "destructive",
        });
        console.error(error);
      }
    }
  });
  
  // Find all offline access points across all controllers and sites
  const offlineAccessPoints: Array<{
    accessPoint: AccessPoint;
    controller: Controller;
    siteName: string;
  }> = [];
  
  controllers.forEach(controller => {
    controller.sites.forEach(site => {
      const offlineAPs = site.accessPoints.filter(ap => ap.status === 'offline');
      offlineAPs.forEach(ap => {
        offlineAccessPoints.push({
          accessPoint: ap,
          controller: controller,
          siteName: site.name
        });
      });
    });
  });

  const isLoading = statsLoading || controllersLoading;
  const error = statsError || controllersError;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <Card className="p-6">
            <p className="text-center text-destructive">Error loading dashboard data</p>
          </Card>
        ) : (
          <>
            {offlineAccessPoints.length > 0 && (
              <Card className="border-destructive bg-destructive/5 animate-pulse">
                <CardHeader>
                  <CardTitle className="flex items-center text-destructive">
                    <WifiOff className="h-5 w-5 mr-2" />
                    Offline Access Points ({offlineAccessPoints.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {offlineAccessPoints.map(({ accessPoint, controller, siteName }) => (
                      <Link 
                        key={accessPoint.id}
                        to={`/controllers`}
                        className="flex items-center justify-between p-3 bg-background rounded-md border hover:border-destructive hover:bg-destructive/10 transition-colors group"
                      >
                        <div>
                          <p className="font-medium">{accessPoint.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {controller.name} / {siteName} • Last seen: {new Date(accessPoint.lastSeen).toLocaleString()}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Users"
                value={stats?.totalUsers || 0}
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
              />
              <StatsCard
                title="Active Users"
                value={stats?.activeUsers || 0}
                icon={<UserCheck className="h-4 w-4 text-green-500" />}
              />
              <StatsCard
                title="Blocked Users"
                value={stats?.blockedUsers || 0}
                icon={<UserX className="h-4 w-4 text-destructive" />}
              />
              <StatsCard
                title="New Users Today"
                value={stats?.newUsersToday || 0}
                icon={<UserPlus className="h-4 w-4 text-primary" />}
              />
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <Card className="animate-slide-in">
                <CardHeader>
                  <CardTitle>Server Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Server</p>
                        <p>Ubuntu 24.04 LTS</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">RADIUS Status</p>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          <span>Running</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Authentication Protocol</p>
                        <p>WPA2 Enterprise</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Network Controllers</p>
                        <p>Unifi, Omada</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-slide-in [animation-delay:200ms]">
                <CardHeader>
                  <CardTitle>Quick Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">
                      This WiFi Authentication Portal allows you to manage user access to your WPA2 Enterprise
                      network. You can add users, block/unblock their access, and monitor network usage.
                    </p>
                    <div className="text-sm space-y-2">
                      <p className="font-medium">Getting Started:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Go to the "WiFi Users" tab to manage user accounts</li>
                        <li>Add new users with email and password credentials</li>
                        <li>Block or unblock users as needed</li>
                        <li>Monitor user activities and login status</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
