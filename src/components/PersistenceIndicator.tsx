import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Save, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PersistenceIndicatorProps {
  storageKey: string;
  onExport?: () => void;
  onImport?: () => void;
  onReset?: () => void;
}

export const PersistenceIndicator = ({ 
  storageKey, 
  onExport, 
  onImport,
  onReset 
}: PersistenceIndicatorProps) => {
  const { toast } = useToast();

  const handleExportLayout = () => {
    try {
      const layout = localStorage.getItem(storageKey);
      if (layout) {
        const blob = new Blob([layout], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${storageKey}-backup.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Layout exported",
          description: "Your dashboard layout has been saved to a file.",
        });
      }
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export dashboard layout.",
        variant: "destructive",
      });
    }
  };

  const handleImportLayout = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const content = event.target?.result as string;
            localStorage.setItem(storageKey, content);
            window.location.reload();
            
            toast({
              title: "Layout imported",
              description: "Dashboard layout restored successfully.",
            });
          } catch (error) {
            toast({
              title: "Import failed",
              description: "Invalid layout file.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Save className="h-4 w-4 text-primary" />
          Layout Persistence
        </CardTitle>
        <CardDescription className="text-xs">
          Your customizations are automatically saved
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportLayout}
          className="flex-1 min-w-[120px]"
        >
          <Download className="h-3 w-3 mr-2" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleImportLayout}
          className="flex-1 min-w-[120px]"
        >
          <Upload className="h-3 w-3 mr-2" />
          Import
        </Button>
        {onReset && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="flex-1 min-w-[120px]"
          >
            <RotateCcw className="h-3 w-3 mr-2" />
            Reset
          </Button>
        )}
        <Badge variant="secondary" className="ml-auto text-xs">
          Auto-saved
        </Badge>
      </CardContent>
    </Card>
  );
};
