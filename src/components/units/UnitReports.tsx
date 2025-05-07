
import React from 'react';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { BarChart } from 'lucide-react';

interface UnitReportsProps {
  unitId: string;
}

const UnitReports: React.FC<UnitReportsProps> = ({ unitId }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center py-8 flex-col gap-4">
          <BarChart className="h-10 w-10 text-muted-foreground" />
          <CardDescription className="text-center">
            Relatórios serão implementados em breve.
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitReports;
