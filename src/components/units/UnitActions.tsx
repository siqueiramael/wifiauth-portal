
import React from 'react';
import { Unit } from '@/models/user';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import UnitForm from './UnitForm';

interface UnitActionsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddUnit: () => void;
  unitDialog: {
    open: boolean;
    isEditing: boolean;
    unitId?: string;
  };
  onUnitDialogChange: (open: boolean) => void;
  unitForm: {
    name: string;
    siteId: string;
    controllerName: string;
    siteName: string;
  };
  setUnitForm: React.Dispatch<React.SetStateAction<{
    name: string;
    siteId: string;
    controllerName: string;
    siteName: string;
  }>>;
  sites: {
    id: string;
    name: string;
    controllerId: string;
    controllerName: string;
  }[];
  controllersLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  handleSiteChange: (siteId: string) => void;
  isPending: boolean;
}

const UnitActions: React.FC<UnitActionsProps> = ({
  searchTerm,
  onSearchChange,
  onAddUnit,
  unitDialog,
  onUnitDialogChange,
  unitForm,
  setUnitForm,
  sites,
  controllersLoading,
  onSubmit,
  onCancel,
  handleSiteChange,
  isPending
}) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Unidades</h1>
        <Button onClick={onAddUnit}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Adicionar Unidade
        </Button>
      </div>
      
      <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome, controladora ou site..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <Dialog open={unitDialog.open} onOpenChange={onUnitDialogChange}>
        <UnitForm
          isEditing={unitDialog.isEditing}
          isPending={isPending}
          unitForm={unitForm}
          setUnitForm={setUnitForm}
          sites={sites}
          controllersLoading={controllersLoading}
          onSubmit={onSubmit}
          onCancel={onCancel}
          handleSiteChange={handleSiteChange}
        />
      </Dialog>
    </div>
  );
};

export default UnitActions;
