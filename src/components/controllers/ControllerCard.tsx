
import { Controller } from "@/types/controller";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Router, SignalIcon } from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/components/Spinner";

interface ControllerCardProps {
  controller: Controller;
  onEdit: (controller: Controller) => void;
  onDelete: (controller: Controller) => void;
}

export const ControllerCard = ({ controller, onEdit, onDelete }: ControllerCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusCheck = async () => {
    setIsLoading(true);
    // This would be replaced with actual status check logic
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {controller.type === "unifi" ? (
              <Router className="h-5 w-5 text-blue-500" />
            ) : (
              <Router className="h-5 w-5 text-green-500" />
            )}
            <CardTitle className="text-xl">{controller.name}</CardTitle>
          </div>
          <Badge variant={controller.status === "online" ? "success" : "destructive"}>
            {controller.status === "online" ? "Online" : "Offline"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium">{controller.type === "unifi" ? "UniFi" : "Omada"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">URL:</span>
            <span className="font-medium">{controller.url}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sites:</span>
            <span className="font-medium">{controller.sites.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Access Points:</span>
            <span className="font-medium">
              {controller.sites.reduce((acc, site) => acc + site.accessPoints.length, 0)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(controller)}>
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => onDelete(controller)}>
            <Trash className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={handleStatusCheck} disabled={isLoading}>
          {isLoading ? (
            <Spinner size="sm" className="mr-1" />
          ) : (
            <SignalIcon className="h-4 w-4 mr-1" />
          )}
          Check Status
        </Button>
      </CardFooter>
    </Card>
  );
};
