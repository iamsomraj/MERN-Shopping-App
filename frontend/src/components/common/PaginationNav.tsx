import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationNavProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

/** Compact page list: first, last, current ±1, with ellipses between gaps. */
const pageList = (page: number, pages: number) => {
  const wanted = new Set([1, pages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pages));
  const sorted = [...wanted].sort((a, b) => a - b);
  return sorted.flatMap((p, index) => (index > 0 && p - sorted[index - 1]! > 1 ? (['gap', p] as const) : [p]));
};

export function PaginationNav({ page, pages, onPageChange }: PaginationNavProps) {
  if (pages <= 1) return null;
  return (
    <nav
      aria-label='Pagination'
      className='flex items-center justify-center gap-1'>
      <Button
        variant='ghost'
        size='sm'
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}>
        <ChevronLeft /> <span className='hidden sm:inline'>Previous</span>
      </Button>
      {pageList(page, pages).map((item, index) =>
        item === 'gap' ? (
          <span
            key={`gap-${index}`}
            className='px-2 text-muted-foreground'>
            …
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? 'outline' : 'ghost'}
            size='icon-sm'
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onPageChange(item)}>
            {item}
          </Button>
        )
      )}
      <Button
        variant='ghost'
        size='sm'
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}>
        <span className='hidden sm:inline'>Next</span> <ChevronRight />
      </Button>
    </nav>
  );
}
