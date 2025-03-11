
import React from 'react';
import { Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  searchTerm: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchTerm }) => {
  return (
    <Card className="text-center py-12 bg-muted/10">
      <CardContent className="pt-12">
        <Building className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Nenhuma unidade encontrada</h3>
        <p className="text-muted-foreground">
          {searchTerm ? 'Tente ajustar seus termos de pesquisa' : 'Comece adicionando uma nova unidade'}
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
