
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface PoliciesHeaderProps {
  onCreatePolicy: () => void;
}

const PoliciesHeader: React.FC<PoliciesHeaderProps> = ({ onCreatePolicy }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Políticas de Uso</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie limites de banda e horários permitidos para acesso à rede
        </p>
      </div>
      <Button onClick={onCreatePolicy} className="shrink-0">
        <PlusCircle className="mr-2 h-5 w-5" />
        Nova Política
      </Button>
    </div>
  );
};

export default PoliciesHeader;
