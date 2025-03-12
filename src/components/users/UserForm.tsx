
import React from 'react';
import { Unit } from '@/models/user';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from 'lucide-react';
import { Spinner } from '@/components/Spinner';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UserFormProps {
  newUser: {
    email: string;
    username: string;
    password: string;
    unitIds: string[];
  };
  setNewUser: React.Dispatch<React.SetStateAction<{
    email: string;
    username: string;
    password: string;
    unitIds: string[];
  }>>;
  units: Unit[];
  unitsLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isPending: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  newUser,
  setNewUser,
  units,
  unitsLoading,
  onSubmit,
  onCancel,
  isPending
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar Novo Usuário WiFi</DialogTitle>
        <DialogDescription>
          Crie uma nova conta de usuário para autenticação WiFi.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit}>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
              placeholder="usuario@exemplo.com"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Nome de Usuário
            </label>
            <Input
              id="username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              required
              placeholder="joao.silva"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
              placeholder="••••••••"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Unidades de Acesso
            </label>
            <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto">
              <div className="flex items-center space-x-2 pb-2 mb-2 border-b">
                <Checkbox 
                  id="select-all-units"
                  checked={newUser.unitIds.length === units.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setNewUser({ ...newUser, unitIds: units.map(u => u.id) });
                    } else {
                      setNewUser({ ...newUser, unitIds: [] });
                    }
                  }}
                />
                <label htmlFor="select-all-units" className="text-sm font-medium">
                  Selecionar todas as unidades
                </label>
              </div>
              {unitsLoading ? (
                <div className="py-2 flex justify-center">
                  <Spinner size="sm" />
                </div>
              ) : units.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Nenhuma unidade disponível. Adicione unidades primeiro.
                </p>
              ) : (
                <div className="space-y-2">
                  {units.map((unit) => (
                    <div key={unit.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`unit-${unit.id}`} 
                        checked={newUser.unitIds.includes(unit.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewUser({ 
                              ...newUser, 
                              unitIds: [...newUser.unitIds, unit.id] 
                            });
                          } else {
                            setNewUser({ 
                              ...newUser, 
                              unitIds: newUser.unitIds.filter(id => id !== unit.id) 
                            });
                          }
                        }}
                      />
                      <label htmlFor={`unit-${unit.id}`} className="text-sm">
                        {unit.name} <span className="text-muted-foreground">({unit.controllerName} / {unit.siteName})</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                Criando...
              </>
            ) : (
              'Criar Usuário'
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default UserForm;
