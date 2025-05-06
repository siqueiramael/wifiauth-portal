import React, { useState, useEffect } from 'react';
import { Unit, UserFormData } from '@/models/user';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CalendarIcon, Search } from 'lucide-react';
import { Spinner } from '@/components/Spinner';
import { format } from 'date-fns';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { addDays } from "date-fns";
import {
  DialogFooter,
} from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

interface UserFormProps {
  userData: UserFormData;
  onChange: React.Dispatch<React.SetStateAction<UserFormData>>;
  units: Unit[];
  unitsLoading?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isPending: boolean;
  isEditMode?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  userData,
  onChange,
  units,
  unitsLoading = false,
  onSubmit,
  onCancel,
  isPending,
  isEditMode = false
}) => {
  const [unitSearchOpen, setUnitSearchOpen] = useState(false);
  const [unitSearch, setUnitSearch] = useState("");
  
  const userTypes = [
    { value: 'wifi_user', label: 'Usuário WiFi' },
    { value: 'server', label: 'Servidor' },
    { value: 'student', label: 'Aluno' },
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'technician', label: 'Técnico' },
  ];
  
  const profiles = [
    { value: 'standard', label: 'Padrão' },
    { value: 'guest', label: 'Visitante' },
    { value: 'employee', label: 'Funcionário' },
    { value: 'student', label: 'Estudante' },
    { value: 'guest_limited', label: 'Visitante Limitado' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Ativo' },
    { value: 'blocked', label: 'Bloqueado' },
  ];
  
  // Format CPF with mask: 000.000.000-00
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };
  
  // Format phone with mask: (00) 00000-0000
  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };
  
  // Registration number - only numbers
  const formatRegistrationNumber = (value: string) => {
    return value.replace(/\D/g, '');
  };

  // Helper para lidar com a seleção de data
  const handleDateSelect = (date: Date | undefined) => {
    onChange({
      ...userData, 
      expirationDate: date ? date.toISOString() : null
    });
  };
  
  // Create default expiration date on mount (365 days from now)
  useEffect(() => {
    if (!isEditMode && !userData.expirationDate) {
      const defaultDate = addDays(new Date(), 365);
      onChange({
        ...userData,
        expirationDate: defaultDate.toISOString(),
        grantWifiAccess: true,
      });
    }
  }, []);
  
  // Auto generate password based on registration number when grant WiFi access is checked
  useEffect(() => {
    if (userData.grantWifiAccess && userData.registrationNumber && !isEditMode) {
      onChange({
        ...userData,
        password: userData.registrationNumber
      });
    }
  }, [userData.registrationNumber, userData.grantWifiAccess]);
  
  const filteredUnits = units.filter(unit => 
    unit.name.toLowerCase().includes(unitSearch.toLowerCase()) ||
    unit.siteName.toLowerCase().includes(unitSearch.toLowerCase()) ||
    unit.controllerName.toLowerCase().includes(unitSearch.toLowerCase())
  );

  // Converte string ISO para objeto Date para exibição no calendário
  const getSelectedDate = (): Date | undefined => {
    if (!userData.expirationDate) return undefined;
    try {
      return new Date(userData.expirationDate);
    } catch (error) {
      console.error('Erro ao converter data:', error);
      return undefined;
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium">
              Nome Completo
            </label>
            <Input
              id="fullName"
              value={userData.fullName}
              onChange={(e) => onChange({ ...userData, fullName: e.target.value })}
              required
              placeholder="João da Silva"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={userData.email}
              onChange={(e) => onChange({ ...userData, email: e.target.value })}
              required
              placeholder="usuario@exemplo.com"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="cpf" className="text-sm font-medium">
              CPF
            </label>
            <Input
              id="cpf"
              value={userData.cpf}
              onChange={(e) => onChange({ ...userData, cpf: formatCPF(e.target.value) })}
              placeholder="000.000.000-00"
              maxLength={14}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="userType" className="text-sm font-medium">
              Tipo de Usuário
            </label>
            <Select 
              value={userData.userType} 
              onValueChange={(value) => onChange({ ...userData, userType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {userTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="unit" className="text-sm font-medium">
              Unidade
            </label>
            <Popover open={unitSearchOpen} onOpenChange={setUnitSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={unitSearchOpen}
                  className="w-full justify-between"
                >
                  {userData.unitIds.length > 0
                    ? userData.unitIds.length === 1
                      ? units.find(unit => unit.id === userData.unitIds[0])?.name || "Selecione"
                      : `${userData.unitIds.length} unidades selecionadas`
                    : "Selecione uma unidade"}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Buscar unidade..." 
                    value={unitSearch}
                    onValueChange={setUnitSearch}
                  />
                  <CommandEmpty>Nenhuma unidade encontrada.</CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-auto">
                    <div className="border-b px-2 py-1.5">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="select-all-units"
                          checked={units.length > 0 && userData.unitIds.length === units.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              onChange({ ...userData, unitIds: units.map(u => u.id) });
                            } else {
                              onChange({ ...userData, unitIds: [] });
                            }
                          }}
                        />
                        <label htmlFor="select-all-units" className="text-sm font-medium">
                          Selecionar todas
                        </label>
                      </div>
                    </div>
                    {filteredUnits.map((unit) => (
                      <CommandItem 
                        key={unit.id}
                        onSelect={() => {
                          onChange({ 
                            ...userData, 
                            unitIds: userData.unitIds.includes(unit.id)
                              ? userData.unitIds.filter(id => id !== unit.id)
                              : [...userData.unitIds, unit.id]
                          });
                        }}
                        className="flex items-center gap-2"
                      >
                        <Checkbox 
                          checked={userData.unitIds.includes(unit.id)}
                          className="mr-2"
                        />
                        <span>{unit.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {unit.controllerName} / {unit.siteName}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Telefone
            </label>
            <Input
              id="phone"
              value={userData.phone}
              onChange={(e) => onChange({ ...userData, phone: formatPhone(e.target.value) })}
              placeholder="(00) 00000-0000"
              maxLength={15}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="registrationNumber" className="text-sm font-medium">
              Matrícula
            </label>
            <Input
              id="registrationNumber"
              value={userData.registrationNumber}
              onChange={(e) => onChange({ ...userData, registrationNumber: formatRegistrationNumber(e.target.value) })}
              placeholder="Digite apenas números"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Nome de Usuário
            </label>
            <Input
              id="username"
              value={userData.username}
              onChange={(e) => onChange({ ...userData, username: e.target.value })}
              required
              placeholder="joao.silva"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 py-2">
          <Checkbox 
            id="grantWifiAccess"
            checked={userData.grantWifiAccess}
            onCheckedChange={(checked) => {
              onChange({ ...userData, grantWifiAccess: checked as boolean });
            }}
          />
          <label 
            htmlFor="grantWifiAccess"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Conceder acesso WiFi
          </label>
        </div>
        
        {userData.grantWifiAccess && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Senha WiFi
              </label>
              <Input
                id="password"
                type="password"
                value={userData.password}
                onChange={(e) => onChange({ ...userData, password: e.target.value })}
                required={userData.grantWifiAccess}
                placeholder="••••••••"
              />
              <p className="text-xs text-muted-foreground">
                Senha padrão: número de matrícula
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="profile" className="text-sm font-medium">
                Perfil
              </label>
              <Select 
                value={userData.profile} 
                onValueChange={(value) => onChange({ ...userData, profile: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.value} value={profile.value}>
                      {profile.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select 
              value={userData.status} 
              onValueChange={(value) => onChange({ ...userData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="expirationDate" className="text-sm font-medium">
              Data de Expiração (opcional)
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !userData.expirationDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {userData.expirationDate ? (
                    format(new Date(userData.expirationDate), "dd/MM/yyyy")
                  ) : (
                    "Sem data de expiração"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={getSelectedDate()}
                  onSelect={handleDateSelect}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
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
              {isEditMode ? 'Salvando...' : 'Criando...'}
            </>
          ) : (
            isEditMode ? 'Salvar Alterações' : 'Adicionar Usuário'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default UserForm;
