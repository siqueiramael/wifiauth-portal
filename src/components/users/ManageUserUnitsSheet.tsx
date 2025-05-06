
import React, { useState } from 'react';
import { WifiUser, Unit } from '@/models/user';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

interface ManageUserUnitsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: WifiUser | null;
  units: Unit[];
  onSaveUnits: (unitIds: string[]) => void;
  isPending: boolean;
}

const ManageUserUnitsSheet: React.FC<ManageUserUnitsSheetProps> = ({
  open,
  onOpenChange,
  user,
  units,
  onSaveUnits,
  isPending,
}) => {
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);

  // Initialize selectedUnitIds when the sheet opens with a user
  React.useEffect(() => {
    if (user) {
      setSelectedUnitIds(user.unitIds || []);
    }
  }, [user]);

  const handleToggleUnit = (unitId: string) => {
    setSelectedUnitIds((prev) =>
      prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId]
    );
  };

  const handleSave = () => {
    onSaveUnits(selectedUnitIds);
  };

  const toggleAllUnits = (checked: boolean) => {
    if (checked) {
      setSelectedUnitIds(units.map((unit) => unit.id));
    } else {
      setSelectedUnitIds([]);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Gerenciar Unidades</SheetTitle>
          <SheetDescription>
            {user
              ? `Atribua unidades para o usuário ${user.fullName || user.username}`
              : 'Selecione as unidades para o usuário'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedUnitIds.length === units.length}
              onCheckedChange={toggleAllUnits}
            />
            <Label htmlFor="select-all">Selecionar todas as unidades</Label>
          </div>

          <Separator className="my-2" />

          <div className="space-y-4">
            {units.map((unit) => (
              <div key={unit.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`unit-${unit.id}`}
                  checked={selectedUnitIds.includes(unit.id)}
                  onCheckedChange={() => handleToggleUnit(unit.id)}
                />
                <div>
                  <Label htmlFor={`unit-${unit.id}`} className="font-medium">
                    {unit.name}
                  </Label>
                  <p className="text-xs text-muted-foreground">{unit.siteName}</p>
                </div>
              </div>
            ))}

            {units.length === 0 && (
              <p className="text-center text-muted-foreground py-2">
                Nenhuma unidade disponível
              </p>
            )}
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
          </SheetClose>
          <Button onClick={handleSave} disabled={isPending}>
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
