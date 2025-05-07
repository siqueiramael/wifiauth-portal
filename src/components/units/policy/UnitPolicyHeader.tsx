
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface UnitPolicyHeaderProps {
  onCreatePolicy: () => void;
}

const UnitPolicyHeader: React.FC<UnitPolicyHeaderProps> = ({ onCreatePolicy }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <p className="text-sm text-muted-foreground">
          Gerencie as políticas de uso específicas para esta unidade
        </p>
      </div>
      <Button onClick={onCreatePolicy}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Nova Política
      </Button>
    </div>
  );
};

export default UnitPolicyHeader;
