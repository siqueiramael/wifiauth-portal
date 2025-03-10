
import { useState, useEffect } from "react";
import { Controller } from "@/types/controller";
import { ControllerCard } from "./ControllerCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ControllerForm } from "./ControllerForm";
import { DeleteControllerDialog } from "./DeleteControllerDialog";
import { controllerService } from "@/services/controllerService";
import { Spinner } from "@/components/Spinner";
import { useToast } from "@/hooks/use-toast";

export const ControllersList = () => {
  const { toast } = useToast();
  const [controllers, setControllers] = useState<Controller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedController, setSelectedController] = useState<Controller | null>(null);

  const fetchControllers = async () => {
    setIsLoading(true);
    try {
      const data = await controllerService.getControllers();
      setControllers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load controllers",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchControllers();
  }, []);

  const handleAddController = () => {
    setSelectedController(null);
    setIsFormOpen(true);
  };

  const handleEditController = (controller: Controller) => {
    setSelectedController(controller);
    setIsFormOpen(true);
  };

  const handleDeleteController = (controller: Controller) => {
    setSelectedController(controller);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveController = async (controllerData: Partial<Controller>) => {
    try {
      if (selectedController) {
        await controllerService.updateController({
          ...selectedController,
          ...controllerData,
        });
      } else {
        await controllerService.addController(controllerData as Controller);
      }
      fetchControllers();
    } catch (error) {
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedController) return;
    
    try {
      await controllerService.deleteController(selectedController.id);
      toast({
        title: "Success",
        description: "Controller deleted successfully",
      });
      fetchControllers();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete controller: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Controllers</h2>
        <Button onClick={handleAddController}>
          <Plus className="h-4 w-4 mr-2" />
          Add Controller
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Spinner size="lg" />
        </div>
      ) : controllers.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-card">
          <p className="text-muted-foreground">No controllers found. Add a controller to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {controllers.map((controller) => (
            <ControllerCard
              key={controller.id}
              controller={controller}
              onEdit={handleEditController}
              onDelete={handleDeleteController}
            />
          ))}
        </div>
      )}

      <ControllerForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveController}
        controller={selectedController || undefined}
      />

      <DeleteControllerDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        controller={selectedController}
      />
    </div>
  );
};
