
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Unit } from '@/models/user';

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  unitFilter: string | null;
  setUnitFilter: (unit: string | null) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  handleClearFilters: () => void;
  units: Unit[];
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  unitFilter,
  setUnitFilter,
  statusFilter,
  setStatusFilter,
  filtersOpen,
  setFiltersOpen,
  handleClearFilters,
  units
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar por nome, email ou usuário..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {(unitFilter || statusFilter) && (
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {[unitFilter, statusFilter].filter(Boolean).length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Filtrar Usuários</h4>
            
            <div className="space-y-2">
              <label htmlFor="unit-filter" className="text-sm font-medium">
                Por Unidade
              </label>
              <Select 
                value={unitFilter || ""} 
                onValueChange={(value) => setUnitFilter(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as unidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as unidades</SelectItem>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="status-filter" className="text-sm font-medium">
                Por Status
              </label>
              <Select 
                value={statusFilter || ""} 
                onValueChange={(value) => setStatusFilter(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="blocked">Bloqueados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
              >
                Limpar Filtros
              </Button>
              <Button 
                size="sm"
                onClick={() => setFiltersOpen(false)}
              >
                Aplicar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserFilters;
