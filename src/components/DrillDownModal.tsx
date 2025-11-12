import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from "lucide-react";

interface DrillDownData {
  title: string;
  value: string;
  trend?: number;
  period?: string;
  details: Array<{
    label: string;
    value: string;
    change?: string;
  }>;
  timeSeriesData?: Array<{
    date: string;
    value: number;
  }>;
}

interface DrillDownModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DrillDownData | null;
}

export const DrillDownModal = ({ open, onOpenChange, data }: DrillDownModalProps) => {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <BarChart3 className="h-6 w-6 text-chart-1" />
            {data.title}
          </DialogTitle>
          <DialogDescription>
            Detailed breakdown and trends
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Main Metric */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Value</p>
                <p className="text-4xl font-bold text-foreground">{data.value}</p>
              </div>
              {data.trend !== undefined && (
                <div className={`flex items-center gap-1 ${data.trend >= 0 ? 'text-chart-2' : 'text-chart-5'}`}>
                  {data.trend >= 0 ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <TrendingDown className="h-5 w-5" />
                  )}
                  <span className="text-lg font-semibold">
                    {data.trend >= 0 ? '+' : ''}{data.trend}%
                  </span>
                </div>
              )}
            </div>
            {data.period && (
              <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{data.period}</span>
              </div>
            )}
          </Card>

          {/* Detailed Breakdown */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Breakdown</h3>
            <div className="grid gap-3">
              {data.details.map((detail, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">{detail.label}</p>
                      <p className="text-xl font-semibold text-foreground">{detail.value}</p>
                    </div>
                    {detail.change && (
                      <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                        detail.change.startsWith('+') 
                          ? 'bg-chart-2/10 text-chart-2' 
                          : 'bg-chart-5/10 text-chart-5'
                      }`}>
                        {detail.change}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Time Series if available */}
          {data.timeSeriesData && data.timeSeriesData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Trend Over Time</h3>
              <Card className="p-4">
                <div className="space-y-2">
                  {data.timeSeriesData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.date}</span>
                      <span className="font-medium text-foreground">{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
