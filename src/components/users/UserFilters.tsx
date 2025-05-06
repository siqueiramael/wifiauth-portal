
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Unit } from '@/models/user';
import { Separator } from '@/components/ui/separator';

interface UserFiltersProps {
  selectedStatus: string | null;
  setSelectedStatus: (status: string | null) => void;
  selectedProfile: string | null;
  setSelectedProfile: (profile: string | null) => void;
  selectedUnit: string | null;
  setSelectedUnit: (unit: string | null) => void;
  units: Unit[];
  onClearFilters: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  selectedStatus,
  setSelectedStatus,
  selectedProfile,
  setSelectedProfile,
  selectedUnit,
  setSelectedUnit,
  units,
  onClearFilters
}) => {
  return (
    <div className="flex flex-col gap-6 py-6">
      <div>
        <Label className="mb-3 block">Status</Label>
        <RadioGroup 
          value={selectedStatus || ''} 
          onValueChange={(value) => setSelectedStatus(value || null)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="status-all" />
            <Label htmlFor="status-all">Todos</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="active" id="status-active" />
            <Label htmlFor="status-active">Ativo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="blocked" id="status-blocked" />
            <Label htmlFor="status-blocked">Bloqueado</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Separator />
      
      <div>
        <Label className="mb-3 block">Perfil</Label>
        <RadioGroup 
          value={selectedProfile || ''} 
          onValueChange={(value) => setSelectedProfile(value || null)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="profile-all" />
            <Label htmlFor="profile-all">Todos</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="standard" id="profile-standard" />
            <Label htmlFor="profile-standard">Padrão</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="guest" id="profile-guest" />
            <Label htmlFor="profile-guest">Visitante</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Separator />
      
      <div className="space-y-3">
        <Label>Unidade</Label>
        <Select 
          value={selectedUnit || ''} 
          onValueChange={value => setSelectedUnit(value || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas as unidades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as unidades</SelectItem>
            {units.map(unit => (
              <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Separator />
      
      <Button 
        variant="outline" 
        onClick={onClearFilters}
        className="mt-2"
      >
        Limpar Filtros
      </Button>
    </div>
  );
};

export default UserFilters;
