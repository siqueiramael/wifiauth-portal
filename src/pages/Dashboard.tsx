
import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/services/statsService';
import { controllerService } from '@/services/controllerService';
import { fetchUsers } from '@/services/userService';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/Spinner';
import { 
  Users, Wifi, WifiOff, Building, LayoutGrid, 
  Bell, ArrowRight, Search, UserPlus, Lock, Check, Server
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Controller, AccessPoint } from '@/types/controller';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { WifiUser } from '@/models/user';
import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { toggleUserStatus } from '@/services/userService';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';

// Simple stats card component
const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color = "bg-blue-100 text-blue-700"
}: { 
  title: string;
  value: number | string;
  icon: JSX.Element;
  color?: string;
}) => (
  <Card className="animate-scale-in shadow-sm">
    <CardContent className="p-4 flex flex-row items-center gap-4">
      <div className={`${color} p-3 rounded-md`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { hasPermission } = useAuth();
  
  // Get stats data
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getStats
  });

  // Get controllers data
  const { data: controllers = [], isLoading: controllersLoading } = useQuery({
    queryKey: ['controllers'],
    queryFn: controllerService.getControllers,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: "Failed to load controllers data",
          variant: "destructive",
        });
        console.error(error);
      }
    }
  });
  
  // Get users data
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: "Failed to load users data",
          variant: "destructive",
        });
        console.error(error);
      }
    }
  });
  
  // Count total sites, APs, and clients
  const totalSites = controllers.reduce((acc, controller) => acc + controller.sites.length, 0);
  const totalAPs = controllers.reduce((acc, controller) => 
    acc + controller.sites.reduce((sum, site) => sum + site.accessPoints.length, 0), 0);
  
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
  
  // Create data for AP distribution chart
  const apDistributionData = controllers.flatMap(controller => 
    controller.sites.map(site => ({
      name: site.name,
      value: site.accessPoints.length,
      color: getRandomColor(site.name)
    }))
  );
  
  // Calculate online AP percentage
  const onlineAPs = totalAPs - offlineAccessPoints.length;
  const onlinePercentage = totalAPs > 0 ? Math.round((onlineAPs / totalAPs) * 100) : 0;
  
  // Filter users based on search term
  const filteredUsers = users
    .filter(user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 5); // Only show first 5 users
  
  const isLoading = statsLoading || controllersLoading || usersLoading;

  // Generate random color based on string
  function getRandomColor(str: string) {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#F15BB5'
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }
  
  // Handle toggle user status
  const handleToggleUserStatus = async (userId: string) => {
    try {
      await toggleUserStatus(userId);
      toast({
        title: "Success",
        description: "User status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            WPA2 Enterprise - WiFi Authentication System
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* Stats cards */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
              <StatsCard 
                title="Controladoras" 
                value={controllers.length} 
                icon={<LayoutGrid size={20} />}
                color="bg-blue-100 text-blue-700" 
              />
              <StatsCard 
                title="Sites" 
                value={totalSites} 
                icon={<Building size={20} />}
                color="bg-indigo-100 text-indigo-700" 
              />
              <StatsCard 
                title="APs Total" 
                value={totalAPs} 
                icon={<Wifi size={20} />}
                color="bg-purple-100 text-purple-700" 
              />
              <StatsCard 
                title="Clientes" 
                value={stats?.totalUsers || 182} 
                icon={<Users size={20} />}
                color="bg-pink-100 text-pink-700" 
              />
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              {/* Left column */}
              <div className="col-span-3 lg:col-span-2 space-y-6">
                {/* Offline APs table */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <WifiOff className="h-5 w-5 text-amber-500" />
                      APs Offline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {offlineAccessPoints.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-24 text-muted-foreground">
                        <Check className="h-8 w-8 text-green-500 mb-2" />
                        <p>Todos os APs estão online</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Site</TableHead>
                            <TableHead>Controladora</TableHead>
                            <TableHead>Última Conexão</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {offlineAccessPoints.map(({ accessPoint, controller, siteName }) => (
                            <TableRow key={accessPoint.id}>
                              <TableCell className="font-medium">{accessPoint.name}</TableCell>
                              <TableCell>{siteName}</TableCell>
                              <TableCell>
                                <Badge variant={controller.type === 'unifi' ? 'default' : 'secondary'}>
                                  {controller.name}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(accessPoint.lastSeen).toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>

                {/* User management */}
                <Card>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Gerenciamento de Usuários</CardTitle>
                    <Button size="sm" onClick={() => navigate('/users')}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Novo Usuário
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="flex mb-4">
                      <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar por email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Último Acesso</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                              Nenhum usuário encontrado
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((user: WifiUser) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">
                                <Link to={`/users`} className="hover:underline">
                                  {user.email}
                                </Link>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={user.status === 'active' ? 'success' : 'destructive'}
                                  className="capitalize"
                                >
                                  {user.status === 'active' ? 'Ativo' : 'Bloqueado'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {user.lastLogin 
                                  ? formatDate(user.lastLogin) 
                                  : 'Nunca'}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => hasPermission('manage_users') && handleToggleUserStatus(user.id)}
                                  disabled={!hasPermission('manage_users')}
                                >
                                  {user.status === 'active' ? (
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <Lock className="h-4 w-4 text-destructive" />
                                  )}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => navigate('/users')}
                                >
                                  <Bell className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                    {users.length > 5 && (
                      <div className="flex justify-center mt-4">
                        <Button variant="outline" size="sm" onClick={() => navigate('/users')}>
                          Ver todos os usuários
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right column */}
              <div className="col-span-3 lg:col-span-1 space-y-6">
                {/* AP Status */}
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Status dos APs</CardTitle>
                    <Button variant="ghost" size="icon">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex flex-col items-center bg-green-50 p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">APs Online</p>
                        <p className="text-2xl font-bold text-green-600">{onlineAPs}</p>
                      </div>
                      <div className="flex flex-col items-center bg-red-50 p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">APs Offline</p>
                        <p className="text-2xl font-bold text-red-600">{offlineAccessPoints.length}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Disponibilidade</span>
                        <span className="font-medium">{onlinePercentage}%</span>
                      </div>
                      <Progress value={onlinePercentage} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* AP Distribution */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Distribuição de APs por Site</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[240px] w-full">
                      {apDistributionData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={apDistributionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              {apDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          Nenhum dado disponível
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* RADIUS Configuration */}
                <Card>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      Configuração RADIUS
                    </CardTitle>
                    <Badge variant="success" className="h-5 px-2 flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-white mr-1"></span>
                      Online
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status do Servidor</span>
                        <span className="text-sm font-medium">Ativo</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Endereço IP</span>
                        <span className="text-sm font-medium">192.168.1.10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Porta Autenticação</span>
                        <span className="text-sm font-medium">1812</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Porta Accounting</span>
                        <span className="text-sm font-medium">1813</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Protocolo</span>
                        <span className="text-sm font-medium">PEAP/MSCHAPv2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Última sincronização</span>
                        <span className="text-sm font-medium">5 minutos atrás</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => navigate('/settings')}
                      >
                        Configurações avançadas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
