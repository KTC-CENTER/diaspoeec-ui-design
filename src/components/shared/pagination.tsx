'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];

  // Always show first page
  pages.push(1);

  if (current > 3) {
    pages.push('ellipsis');
  }

  // Pages around current
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('ellipsis');
  }

  // Always show last page
  if (total > 1) {
    pages.push(total);
  }

  return pages;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      className="flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-all',
          currentPage <= 1
            ? 'cursor-not-allowed text-ink-300'
            : 'text-ink-600 hover:bg-ink-100 hover:text-ink-800'
        )}
        aria-label="Page precedente"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex h-9 w-9 items-center justify-center text-sm text-ink-400"
            >
              ...
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all',
              isActive
                ? 'bg-forest-900 text-white shadow-sm'
                : 'text-ink-600 hover:bg-ink-100 hover:text-ink-800'
            )}
            aria-label={`Page ${page}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-all',
          currentPage >= totalPages
            ? 'cursor-not-allowed text-ink-300'
            : 'text-ink-600 hover:bg-ink-100 hover:text-ink-800'
        )}
        aria-label="Page suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
