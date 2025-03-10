
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchUnits, 
  createUnit, 
  updateUnit, 
  deleteUnit,
  Unit
} from '@/services/userService';
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Spinner } from '@/components/Spinner';
import { controllerService } from '@/services/controllerService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  PlusCircle, 
  MoreVertical, 
  AlertTriangle, 
  Building, 
  Trash2,
  Search,
  Edit,
  Loader2
} from 'lucide-react';

const Units = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [unitDialog, setUnitDialog] = useState<{
    open: boolean;
    isEditing: boolean;
    unitId?: string;
  }>({
    open: false,
    isEditing: false
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; unitId: string | null }>({
    open: false,
    unitId: null
  });
  
  // Form state for new/edit unit
  const [unitForm, setUnitForm] = useState({
    name: '',
    siteId: '',
    controllerName: '',
    siteName: ''
  });
  
  const queryClient = useQueryClient();
  
  const { data: units, isLoading: unitsLoading, error: unitsError } = useQuery({
    queryKey: ['units'],
    queryFn: fetchUnits
  });
  
  const { data: controllers = [], isLoading: controllersLoading } = useQuery({
    queryKey: ['controllers'],
    queryFn: controllerService.getControllers,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: "Failed to load controllers data",
          variant: "destructive",
        });
        console.error(error);
      }
    }
  });
  
  // Prepare sites list from controllers
  const sites = controllers.flatMap(controller => 
    controller.sites.map(site => ({
      id: site.id,
      name: site.name,
      controllerId: controller.id,
      controllerName: controller.name
    }))
  );
  
  const createUnitMutation = useMutation({
    mutationFn: createUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast.success('Unidade criada com sucesso');
      setUnitDialog({ open: false, isEditing: false });
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(`Falha ao criar unidade: ${error.message}`);
    }
  });
  
  const updateUnitMutation = useMutation({
    mutationFn: (data: { id: string; unit: Partial<Unit> }) => updateUnit(data.id, data.unit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast.success('Unidade atualizada com sucesso');
      setUnitDialog({ open: false, isEditing: false });
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(`Falha ao atualizar unidade: ${error.message}`);
    }
  });
  
  const deleteUnitMutation = useMutation({
    mutationFn: deleteUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Unidade excluída com sucesso');
      setDeleteDialog({ open: false, unitId: null });
    },
    onError: (error: Error) => {
      toast.error(`Falha ao excluir unidade: ${error.message}`);
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!unitForm.name || !unitForm.siteId) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    if (unitDialog.isEditing && unitDialog.unitId) {
      updateUnitMutation.mutate({
        id: unitDialog.unitId,
        unit: unitForm
      });
    } else {
      createUnitMutation.mutate(unitForm);
    }
  };
  
  const handleEdit = (unit: Unit) => {
    setUnitForm({
      name: unit.name,
      siteId: unit.siteId,
      controllerName: unit.controllerName,
      siteName: unit.siteName
    });
    setUnitDialog({
      open: true,
      isEditing: true,
      unitId: unit.id
    });
  };
  
  const handleDelete = () => {
    if (deleteDialog.unitId) {
      deleteUnitMutation.mutate(deleteDialog.unitId);
    }
  };
  
  const resetForm = () => {
    setUnitForm({
      name: '',
      siteId: '',
      controllerName: '',
      siteName: ''
    });
  };
  
  const handleSiteChange = (siteId: string) => {
    const selectedSite = sites.find(site => site.id === siteId);
    
    if (selectedSite) {
      setUnitForm({
        ...unitForm,
        siteId,
        controllerName: selectedSite.controllerName,
        siteName: selectedSite.name
      });
    }
  };
  
  const filteredUnits = units?.filter(unit => {
    const searchLower = searchTerm.toLowerCase();
    return (
      unit.name.toLowerCase().includes(searchLower) ||
      unit.controllerName.toLowerCase().includes(searchLower) ||
      unit.siteName.toLowerCase().includes(searchLower)
    );
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Unidades</h1>
          <Button onClick={() => {
            resetForm();
            setUnitDialog({ open: true, isEditing: false });
          }}>
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        {unitsLoading ? (
          <div className="flex justify-center my-12">
            <Spinner size="lg" />
          </div>
        ) : unitsError ? (
          <div className="bg-destructive/10 p-4 rounded-md flex items-center gap-2 text-destructive">
            <AlertTriangle size={16} />
            <p>Erro ao carregar unidades</p>
          </div>
        ) : filteredUnits?.length === 0 ? (
          <Card className="text-center py-12 bg-muted/10">
            <CardContent className="pt-12">
              <Building className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Nenhuma unidade encontrada</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Tente ajustar seus termos de pesquisa' : 'Comece adicionando uma nova unidade'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Unidade</TableHead>
                  <TableHead>Controladora</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits?.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">{unit.name}</TableCell>
                    <TableCell>{unit.controllerName}</TableCell>
                    <TableCell>{unit.siteName}</TableCell>
                    <TableCell>{formatDate(unit.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleEdit(unit)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteDialog({ open: true, unitId: unit.id })}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      {/* Adicionar/Editar Unidade Dialog */}
      <Dialog open={unitDialog.open} onOpenChange={(open) => setUnitDialog({ ...unitDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{unitDialog.isEditing ? 'Editar Unidade' : 'Adicionar Nova Unidade'}</DialogTitle>
            <DialogDescription>
              {unitDialog.isEditing 
                ? 'Atualize as informações da unidade abaixo.' 
                : 'Crie uma nova unidade correspondente a um site de controladora.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
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
                onClick={() => setUnitDialog({ open: false, isEditing: false })}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createUnitMutation.isPending || updateUnitMutation.isPending}
              >
                {(createUnitMutation.isPending || updateUnitMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {unitDialog.isEditing ? 'Salvando...' : 'Criando...'}
                  </>
                ) : (
                  unitDialog.isEditing ? 'Salvar Alterações' : 'Criar Unidade'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Delete Dialog */}
      <AlertDialog 
        open={deleteDialog.open} 
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá excluir permanentemente a unidade e remover o acesso de
              todos os usuários vinculados a ela.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteUnitMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir Unidade'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Units;
