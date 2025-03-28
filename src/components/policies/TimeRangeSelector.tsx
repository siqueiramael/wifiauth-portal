
import React from 'react';
import { WeekdayRange } from '@/models/policy';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TimeRangeSelectorProps {
  timeRanges: WeekdayRange[];
  onChange: (timeRanges: WeekdayRange[]) => void;
}

const WEEKDAYS = [
  { id: 'mon', label: 'Seg' },
  { id: 'tue', label: 'Ter' },
  { id: 'wed', label: 'Qua' },
  { id: 'thu', label: 'Qui' },
  { id: 'fri', label: 'Sex' },
  { id: 'sat', label: 'Sáb' },
  { id: 'sun', label: 'Dom' },
] as const;

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ timeRanges, onChange }) => {
  const handleAddRange = () => {
    onChange([
      ...timeRanges,
      {
        days: ['mon', 'tue', 'wed', 'thu', 'fri'],
        startTime: '08:00',
        endTime: '18:00',
      },
    ]);
  };

  const handleRemoveRange = (index: number) => {
    const newRanges = [...timeRanges];
    newRanges.splice(index, 1);
    onChange(newRanges);
  };

  const handleDayToggle = (index: number, day: string) => {
    const newRanges = [...timeRanges];
    const range = { ...newRanges[index] };
    
    if (range.days.includes(day as any)) {
      range.days = range.days.filter(d => d !== day);
    } else {
      range.days = [...range.days, day as any];
    }
    
    newRanges[index] = range;
    onChange(newRanges);
  };

  const handleTimeChange = (
    index: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    const newRanges = [...timeRanges];
    newRanges[index] = { ...newRanges[index], [field]: value };
    onChange(newRanges);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base">Horários Permitidos</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={handleAddRange}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Horário
        </Button>
      </div>
      
      {timeRanges.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum horário definido. Acesso permitido 24/7.
        </p>
      ) : (
        <div className="space-y-4">
          {timeRanges.map((range, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div className="flex flex-wrap gap-3">
                    {WEEKDAYS.map((day) => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day.id}-${index}`}
                          checked={range.days.includes(day.id as any)}
                          onCheckedChange={() => handleDayToggle(index, day.id)}
                        />
                        <Label
                          htmlFor={`day-${day.id}-${index}`}
                          className="text-sm font-normal"
                        >
                          {day.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`start-time-${index}`}>Hora Início</Label>
                      <Input
                        id={`start-time-${index}`}
                        type="time"
                        value={range.startTime}
                        onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`end-time-${index}`}>Hora Fim</Label>
                      <Input
                        id={`end-time-${index}`}
                        type="time"
                        value={range.endTime}
                        onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveRange(index)}
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover Horário
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeRangeSelector;
