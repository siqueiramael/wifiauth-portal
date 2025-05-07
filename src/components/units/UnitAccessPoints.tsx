
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAccessPointsForUnit } from '@/services/unitService';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/Spinner';
import { formatDate } from '@/lib/utils';
import { Wifi, WifiOff } from 'lucide-react';

interface UnitAccessPointsProps {
  unitId: string;
}

const UnitAccessPoints: React.FC<UnitAccessPointsProps> = ({ unitId }) => {
  const { data: accessPoints, isLoading, error } = useQuery({
    queryKey: ['accessPoints', unitId],
    queryFn: () => getAccessPointsForUnit(unitId)
  });

  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <CardDescription className="text-destructive flex items-center gap-2">
            <WifiOff className="h-4 w-4" />
            Erro ao carregar pontos de acesso
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  if (!accessPoints || accessPoints.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <CardDescription className="text-center py-8">
            Nenhum ponto de acesso encontrado para esta unidade.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>MAC</TableHead>
              <TableHead>Controladora</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último Visto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accessPoints.map((ap) => (
              <TableRow key={ap.id}>
                <TableCell className="font-medium">{ap.name}</TableCell>
                <TableCell>{ap.model}</TableCell>
                <TableCell>{ap.mac}</TableCell>
                <TableCell>{ap.controllerType === 'unifi' ? 'UniFi' : 'Omada'}</TableCell>
                <TableCell>
                  {ap.status === 'online' ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      <Wifi className="h-3 w-3 mr-1" /> Online
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                      <WifiOff className="h-3 w-3 mr-1" /> Offline
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{formatDate(ap.lastSeen)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UnitAccessPoints;
