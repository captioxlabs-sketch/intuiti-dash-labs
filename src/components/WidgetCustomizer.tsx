import { Settings2, Eye, EyeOff, Maximize2, Minimize2, Move, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PersistenceIndicator } from "@/components/PersistenceIndicator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Widget {
  id: string;
  label: string;
  visible: boolean;
  size: "small" | "medium" | "large";
  order: number;
}

interface WidgetCustomizerProps {
  widgets: Widget[];
  onToggleVisibility: (id: string) => void;
  onSizeChange: (id: string, size: "small" | "medium" | "large") => void;
  onReset?: () => void;
  isDragEnabled?: boolean;
  onToggleDrag?: () => void;
  storageKey?: string;
}

export const WidgetCustomizer = ({
  widgets,
  onToggleVisibility,
  onSizeChange,
  onReset,
  isDragEnabled = false,
  onToggleDrag,
  storageKey = "dashboard-layout",
}: WidgetCustomizerProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          Customize
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Customize Dashboard</SheetTitle>
          <SheetDescription>
            Show, hide, and resize widgets to personalize your view
          </SheetDescription>
        </SheetHeader>
        
        <PersistenceIndicator 
          storageKey={storageKey}
          onReset={onReset}
        />

        {onToggleDrag && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Move className="h-4 w-4 text-primary" />
                <div>
                  <Label className="text-base font-medium">Drag & Drop</Label>
                  <p className="text-sm text-muted-foreground">
                    {isDragEnabled ? "Drag widgets to reorder them" : "Enable to reorder widgets"}
                  </p>
                </div>
              </div>
              <Switch
                checked={isDragEnabled}
                onCheckedChange={onToggleDrag}
              />
            </div>
          </div>
        )}

        <div className="mt-6 space-y-6">
          {widgets.map((widget) => (
            <div key={widget.id} className="space-y-3 pb-4 border-b border-border last:border-0">
              <div className="flex items-center justify-between">
                <Label htmlFor={`widget-${widget.id}`} className="text-base font-medium">
                  {widget.label}
                </Label>
                <Switch
                  id={`widget-${widget.id}`}
                  checked={widget.visible}
                  onCheckedChange={() => onToggleVisibility(widget.id)}
                />
              </div>
              
              {widget.visible && (
                <div className="flex items-center gap-2">
                  <Label htmlFor={`size-${widget.id}`} className="text-sm text-muted-foreground">
                    Size:
                  </Label>
                  <Select
                    value={widget.size}
                    onValueChange={(value: "small" | "medium" | "large") =>
                      onSizeChange(widget.id, value)
                    }
                  >
                    <SelectTrigger id={`size-${widget.id}`} className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">
                        <div className="flex items-center gap-2">
                          <Minimize2 className="h-3 w-3" />
                          Small
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <Eye className="h-3 w-3" />
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="large">
                        <div className="flex items-center gap-2">
                          <Maximize2 className="h-3 w-3" />
                          Large
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          ))}
        </div>

        {onReset && (
          <div className="mt-6 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={onReset}
              className="w-full"
            >
              Reset to Default
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
