
import React, { useEffect, useState } from 'react';
import { WifiUser, Unit } from '@/models/user';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2, Building } from 'lucide-react';
import { Spinner } from '@/components/Spinner';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface ManageUserUnitsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: WifiUser | null;
  units: Unit[];
  unitsLoading: boolean;
  selectedUnitIds: string[];
  setSelectedUnitIds: React.Dispatch<React.SetStateAction<string[]>>;
  onSave: () => void;
  isPending: boolean;
}

const ManageUserUnitsSheet: React.FC<ManageUserUnitsSheetProps> = ({
  open,
  onOpenChange,
  user,
  units,
  unitsLoading,
  selectedUnitIds,
  setSelectedUnitIds,
  onSave,
  isPending
}) => {
  const toggleUnitSelection = (unitId: string) => {
    setSelectedUnitIds(prev => 
      prev.includes(unitId)
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  const toggleAllUnits = (checked: boolean) => {
    if (checked) {
      setSelectedUnitIds(units.map(unit => unit.id));
    } else {
      setSelectedUnitIds([]);
    }
  };

  return (
    <Sheet 
      open={open} 
      onOpenChange={(open) => {
        if (!open) {
          onOpenChange(false);
        }
      }}
    >
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Gerenciar Unidades de Acesso</SheetTitle>
          <SheetDescription>
            {user && (
              <span>
                Selecione as unidades que <strong>{user.username}</strong> pode acessar.
              </span>
            )}
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          {unitsLoading ? (
            <div className="py-4 flex justify-center">
              <Spinner size="md" />
            </div>
          ) : units.length === 0 ? (
            <div className="text-center py-4">
              <Building className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                Nenhuma unidade disponível. Adicione unidades primeiro.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <Checkbox 
                  id="select-all"
                  checked={selectedUnitIds.length === units.length}
                  onCheckedChange={(checked) => toggleAllUnits(!!checked)}
                />
                <label 
                  htmlFor="select-all" 
                  className="text-sm font-medium"
                >
                  Selecionar todas as unidades
                </label>
              </div>
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                {units.map((unit) => (
                  <div key={unit.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                    <Checkbox 
                      id={`manage-unit-${unit.id}`}
                      checked={selectedUnitIds.includes(unit.id)}
                      onCheckedChange={() => toggleUnitSelection(unit.id)}
                    />
                    <div className="flex flex-col">
                      <label 
                        htmlFor={`manage-unit-${unit.id}`}
                        className="font-medium text-sm cursor-pointer"
                      >
                        {unit.name}
                      </label>
                      <span className="text-xs text-muted-foreground">
                        {unit.controllerName} / {unit.siteName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
          </SheetClose>
          <Button 
            onClick={onSave}
            disabled={isPending || unitsLoading}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ManageUserUnitsSheet;
