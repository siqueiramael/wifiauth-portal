
import React, { useState, useEffect } from 'react';
import { UsagePolicy, PolicyFormData, PolicyTarget } from '@/models/policy';
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TimeRangeSelector from './TimeRangeSelector';
import { Loader2 } from 'lucide-react';
import { Unit } from '@/models/user';

interface PolicyFormProps {
  policy: PolicyFormData;
  onPolicyChange: (policy: PolicyFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEditMode?: boolean;
  units: Unit[];
}

const PolicyForm: React.FC<PolicyFormProps> = ({
  policy,
  onPolicyChange,
  onSubmit,
  onCancel,
  isSubmitting,
  isEditMode = false,
  units,
}) => {
  const handleChange = (
    field: keyof PolicyFormData,
    value: string | boolean | number | null
  ) => {
    onPolicyChange({ ...policy, [field]: value });
  };

  const handleTimeRangeChange = (allowedTimeRanges: PolicyFormData['allowedTimeRanges']) => {
    onPolicyChange({ ...policy, allowedTimeRanges });
  };

  const handleTargetTypeChange = (targetType: PolicyTarget) => {
    onPolicyChange({ ...policy, targetType, targetIds: [] });
  };

  const handleTargetIdChange = (targetId: string) => {
    let newTargetIds: string[];
    
    if (policy.targetIds.includes(targetId)) {
      newTargetIds = policy.targetIds.filter(id => id !== targetId);
    } else {
      newTargetIds = [...policy.targetIds, targetId];
    }
    
    onPolicyChange({ ...policy, targetIds: newTargetIds });
  };

  // Format bandwidth values for display
  const formatBandwidth = (value: number | null) => {
    if (value === null) return 'Ilimitado';
    return `${value} Mbps`;
  };

  // Format data limit values for display
  const formatDataLimit = (value: number | null) => {
    if (value === null) return 'Ilimitado';
    return `${value} GB`;
  };

  return (
    <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
      <form onSubmit={onSubmit}>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Editar Política' : 'Nova Política de Uso'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label htmlFor="name">Nome da Política</Label>
              <Input
                id="name"
                value={policy.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Política Padrão"
                required
              />
            </div>

            <div className="space-y-2 col-span-2 sm:col-span-1 flex items-center justify-start mt-8">
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={policy.active}
                  onCheckedChange={(checked) => handleChange('active', checked)}
                />
                <Label htmlFor="active">
                  {policy.active ? 'Ativa' : 'Inativa'}
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={policy.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descreva o propósito desta política"
              rows={3}
            />
          </div>

          <Tabs defaultValue="bandwidth" className="mt-2">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="bandwidth">Banda</TabsTrigger>
              <TabsTrigger value="data">Dados</TabsTrigger>
              <TabsTrigger value="schedule">Horários</TabsTrigger>
            </TabsList>

            <TabsContent value="bandwidth" className="space-y-4 pt-4">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label htmlFor="downloadSpeed">Velocidade de Download</Label>
                    <span className="text-sm font-medium">
                      {formatBandwidth(policy.downloadSpeed)}
                    </span>
                  </div>
                  <Slider
                    id="downloadSpeed"
                    value={policy.downloadSpeed !== null ? [policy.downloadSpeed] : [0]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleChange('downloadSpeed', value[0] === 0 ? null : value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Ilimitado</span>
                    <span>100 Mbps</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label htmlFor="uploadSpeed">Velocidade de Upload</Label>
                    <span className="text-sm font-medium">
                      {formatBandwidth(policy.uploadSpeed)}
                    </span>
                  </div>
                  <Slider
                    id="uploadSpeed"
                    value={policy.uploadSpeed !== null ? [policy.uploadSpeed] : [0]}
                    min={0}
                    max={50}
                    step={1}
                    onValueChange={(value) => handleChange('uploadSpeed', value[0] === 0 ? null : value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Ilimitado</span>
                    <span>50 Mbps</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-4 pt-4">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label htmlFor="dailyDataLimit">Limite Diário de Dados</Label>
                    <span className="text-sm font-medium">
                      {formatDataLimit(policy.dailyDataLimit)}
                    </span>
                  </div>
                  <Slider
                    id="dailyDataLimit"
                    value={policy.dailyDataLimit !== null ? [policy.dailyDataLimit] : [0]}
                    min={0}
                    max={10}
                    step={0.5}
                    onValueChange={(value) => handleChange('dailyDataLimit', value[0] === 0 ? null : value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Ilimitado</span>
                    <span>10 GB</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label htmlFor="monthlyDataLimit">Limite Mensal de Dados</Label>
                    <span className="text-sm font-medium">
                      {formatDataLimit(policy.monthlyDataLimit)}
                    </span>
                  </div>
                  <Slider
                    id="monthlyDataLimit"
                    value={policy.monthlyDataLimit !== null ? [policy.monthlyDataLimit] : [0]}
                    min={0}
                    max={500}
                    step={10}
                    onValueChange={(value) => handleChange('monthlyDataLimit', value[0] === 0 ? null : value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Ilimitado</span>
                    <span>500 GB</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="pt-4">
              <TimeRangeSelector 
                timeRanges={policy.allowedTimeRanges} 
                onChange={handleTimeRangeChange} 
              />
            </TabsContent>
          </Tabs>

          <div className="space-y-4 mt-2">
            <Label>Aplicar política a:</Label>
            <Select 
              value={policy.targetType} 
              onValueChange={(value: PolicyTarget) => handleTargetTypeChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de alvo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Usuários específicos</SelectItem>
                <SelectItem value="group">Grupos de usuários</SelectItem>
                <SelectItem value="unit">Unidades</SelectItem>
              </SelectContent>
            </Select>

            {policy.targetType === 'group' && (
              <div className="space-y-2 border p-4 rounded-md">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="group-standard"
                    checked={policy.targetIds.includes('standard')}
                    onChange={() => handleTargetIdChange('standard')}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="group-standard">Padrão</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="group-visitor"
                    checked={policy.targetIds.includes('visitor')}
                    onChange={() => handleTargetIdChange('visitor')}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="group-visitor">Visitante</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="group-staff"
                    checked={policy.targetIds.includes('staff')}
                    onChange={() => handleTargetIdChange('staff')}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="group-staff">Funcionário</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="group-student"
                    checked={policy.targetIds.includes('student')}
                    onChange={() => handleTargetIdChange('student')}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="group-student">Estudante</label>
                </div>
              </div>
            )}

            {policy.targetType === 'unit' && (
              <div className="space-y-2 border p-4 rounded-md max-h-40 overflow-y-auto">
                {units.map((unit) => (
                  <div key={unit.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`unit-${unit.id}`}
                      checked={policy.targetIds.includes(unit.id)}
                      onChange={() => handleTargetIdChange(unit.id)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={`unit-${unit.id}`}>{unit.name}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? 'Atualizar' : 'Criar'} Política
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default PolicyForm;
