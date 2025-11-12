import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export type ExportFormat = "csv" | "json" | "pdf";

/**
 * Hook for exporting dashboard data to various formats
 */
export const useDataExport = () => {
  const { toast } = useToast();

  const exportToCSV = useCallback((data: any[], filename: string) => {
    if (!data || data.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no data available to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma
          const stringValue = String(value ?? "");
          return stringValue.includes(",")
            ? `"${stringValue.replace(/"/g, '""')}"`
            : stringValue;
        }).join(",")
      ),
    ].join("\n");

    downloadFile(csvContent, `${filename}.csv`, "text/csv");
    
    toast({
      title: "Export successful",
      description: `Data exported to ${filename}.csv`,
    });
  }, [toast]);

  const exportToJSON = useCallback((data: any, filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}.json`, "application/json");
    
    toast({
      title: "Export successful",
      description: `Data exported to ${filename}.json`,
    });
  }, [toast]);

  const exportToPDF = useCallback((filename: string) => {
    // Simulated PDF export - in a real app, use a library like jsPDF
    toast({
      title: "PDF Export",
      description: "PDF export functionality would be implemented with a library like jsPDF",
    });
  }, [toast]);

  const exportData = useCallback((
    data: any,
    format: ExportFormat,
    filename: string
  ) => {
    switch (format) {
      case "csv":
        exportToCSV(Array.isArray(data) ? data : [data], filename);
        break;
      case "json":
        exportToJSON(data, filename);
        break;
      case "pdf":
        exportToPDF(filename);
        break;
    }
  }, [exportToCSV, exportToJSON, exportToPDF]);

  return { exportData, exportToCSV, exportToJSON, exportToPDF };
};

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
