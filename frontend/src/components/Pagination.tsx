import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import CustomSelect from "./CustomSelect";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
  className?: string;
}

export default function Pagination({ currentPage, totalPages, onPageChange, limit = 10, onLimitChange, className = "" }: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 border-t border-foreground/5 px-4 sm:px-6 py-3 sm:py-4 ${className}`}>
      <div className="flex items-center gap-4">
        {onLimitChange && (
          <div className="flex items-center gap-2 hidden sm:flex">
            <span className="text-xs text-foreground/50">Rows per page:</span>
            <div className="w-20">
              <CustomSelect
                value={limit.toString()}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                options={[
                  { value: "10", label: "10" },
                  { value: "20", label: "20" },
                  { value: "50", label: "50" },
                  { value: "100", label: "100" }
                ]}
                size="sm"
                allowClear={false}
              />
            </div>
          </div>
        )}
        <div className="hidden sm:block text-xs text-foreground/50">
          Page <span className="font-medium text-foreground">{currentPage}</span> of <span className="font-medium text-foreground">{totalPages || 1}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto sm:ml-0">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-foreground/10 text-foreground/50 hover:bg-foreground/5 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, i) => (
            <div key={i}>
              {page === "..." ? (
                <div className="flex h-8 w-6 items-center justify-center text-foreground/30">
                  <MoreHorizontal size={14} />
                </div>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${currentPage === page
                      ? "bg-foreground text-background shadow-sm"
                      : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                    }`}
                >
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-foreground/10 text-foreground/50 hover:bg-foreground/5 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
