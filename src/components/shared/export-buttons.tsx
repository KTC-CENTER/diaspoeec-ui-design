import { Download, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ExportButtonsProps {
  onExportCSV: () => void;
  onExportExcel: () => void;
  className?: string;
}

export function ExportButtons({ onExportCSV, onExportExcel, className }: ExportButtonsProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        onClick={onExportCSV}
        className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-600 transition-all hover:border-ink-300 hover:bg-ink-100/50 hover:text-ink-800"
        aria-label="Exporter en CSV"
      >
        <Download className="h-3.5 w-3.5" />
        CSV
      </button>
      <button
        onClick={onExportExcel}
        className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-600 transition-all hover:border-forest-700/30 hover:bg-forest-900/5 hover:text-forest-700"
        aria-label="Exporter en Excel"
      >
        <FileSpreadsheet className="h-3.5 w-3.5" />
        Excel
      </button>
    </div>
  );
}
