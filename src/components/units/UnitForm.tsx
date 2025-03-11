
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from '@/components/Spinner';

interface UnitFormProps {
  isEditing: boolean;
  isPending: boolean;
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
  sites: Array<{
    id: string;
    name: string;
    controllerId: string;
    controllerName: string;
  }>;
  controllersLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  handleSiteChange: (siteId: string) => void;
}

const UnitForm: React.FC<UnitFormProps> = ({
  isEditing,
  isPending,
  unitForm,
  setUnitForm,
  sites,
  controllersLoading,
  onSubmit,
  onCancel,
  handleSiteChange
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Editar Unidade' : 'Adicionar Nova Unidade'}</DialogTitle>
        <DialogDescription>
          {isEditing 
            ? 'Atualize as informações da unidade abaixo.' 
            : 'Crie uma nova unidade correspondente a um site de controladora.'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit}>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome da Unidade*
            </label>
            <Input
              id="name"
              value={unitForm.name}
              onChange={(e) => setUnitForm({ ...unitForm, name: e.target.value })}
              required
              placeholder="Ex: Matriz, Filial Norte, etc"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="site" className="text-sm font-medium">
              Site da Controladora*
            </label>
            <Select 
              value={unitForm.siteId} 
              onValueChange={handleSiteChange}
              disabled={controllersLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um site" />
              </SelectTrigger>
              <SelectContent>
                {controllersLoading ? (
                  <div className="flex items-center justify-center p-2">
                    <Spinner size="sm" />
                  </div>
                ) : sites.length === 0 ? (
                  <div className="p-2 text-sm text-center text-muted-foreground">
                    Nenhum site disponível
                  </div>
                ) : (
                  sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.controllerName} / {site.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Salvando...' : 'Criando...'}
              </>
            ) : (
              isEditing ? 'Salvar Alterações' : 'Criar Unidade'
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default UnitForm;
