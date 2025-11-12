import { Settings, Eye, EyeOff, GripVertical, Maximize2, Minimize2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { WidgetConfig, WidgetSize } from "@/hooks/useDashboardLayout";
import { cn } from "@/lib/utils";

interface CustomizationPanelProps {
  widgets: WidgetConfig[];
  onToggleVisibility: (id: string) => void;
  onSetSize: (id: string, size: WidgetSize) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onReset: () => void;
}

const WIDGET_LABELS: Record<string, string> = {
  users: "Total Users",
  revenue: "Revenue",
  growth: "Growth Rate",
  sessions: "Active Sessions",
};

const SIZE_OPTIONS: { value: WidgetSize; label: string; icon: typeof Minimize2 }[] = [
  { value: "small", label: "Small", icon: Minimize2 },
  { value: "medium", label: "Medium", icon: Maximize2 },
  { value: "large", label: "Large", icon: Maximize2 },
];

export const CustomizationPanel = ({
  widgets,
  onToggleVisibility,
  onSetSize,
  onReorder,
  onReset,
}: CustomizationPanelProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorder(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all">
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Customize Dashboard</SheetTitle>
          <SheetDescription>
            Personalize your dashboard by reordering, resizing, or hiding widgets
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Widget Order & Visibility</h3>
              <p className="text-sm text-muted-foreground">Drag to reorder, toggle to show/hide</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            {widgets.map((widget, index) => (
              <div
                key={widget.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "border border-border rounded-lg p-4 bg-card transition-all",
                  draggedIndex === index && "opacity-50 scale-95",
                  "hover:shadow-md cursor-move"
                )}
              >
                <div className="flex items-start gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`widget-${widget.id}`} className="font-medium cursor-pointer">
                          {WIDGET_LABELS[widget.id] || widget.id}
                        </Label>
                        {widget.visible ? (
                          <Eye className="h-4 w-4 text-accent" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <Switch
                        id={`widget-${widget.id}`}
                        checked={widget.visible}
                        onCheckedChange={() => onToggleVisibility(widget.id)}
                      />
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Size</Label>
                      <div className="flex gap-2">
                        {SIZE_OPTIONS.map((option) => (
                          <Button
                            key={option.value}
                            variant={widget.size === option.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => onSetSize(widget.id, option.value)}
                            className="flex-1 gap-1"
                          >
                            <option.icon className="h-3 w-3" />
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium text-sm text-foreground">Tips</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <Badge variant="outline" className="h-5 w-5 flex items-center justify-center p-0">1</Badge>
                <span>Drag widgets to reorder them on the dashboard</span>
              </li>
              <li className="flex gap-2">
                <Badge variant="outline" className="h-5 w-5 flex items-center justify-center p-0">2</Badge>
                <span>Toggle visibility to show or hide widgets</span>
              </li>
              <li className="flex gap-2">
                <Badge variant="outline" className="h-5 w-5 flex items-center justify-center p-0">3</Badge>
                <span>Choose size: Small (1 col), Medium (default), Large (2 cols)</span>
              </li>
              <li className="flex gap-2">
                <Badge variant="outline" className="h-5 w-5 flex items-center justify-center p-0">4</Badge>
                <span>Your preferences are saved automatically</span>
              </li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

import { useState } from "react";
