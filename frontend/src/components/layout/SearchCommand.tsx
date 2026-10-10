import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { lazy, Suspense, useEffect, useState } from 'react';

const SearchDialog = lazy(() => import('./SearchDialog'));

/** One instance per page: it owns the global ⌘K shortcut. Icon-only below md. */
export function SearchCommand() {
  const [open, setOpen] = useState(false);
  // Mount the dialog on first use, then keep it mounted so it can animate closed.
  const [requested, setRequested] = useState(false);

  const toggle = (next: boolean) => {
    if (next) setRequested(true);
    setOpen(next);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setRequested(true);
        setOpen((value) => !value);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <Button
        variant='outline'
        onClick={() => toggle(true)}
        onMouseEnter={() => void import('./SearchDialog')}
        aria-label='Search products'
        className={cn(
          'relative size-9 rounded-full bg-muted/40 font-normal text-muted-foreground shadow-none hover:bg-muted/70',
          'md:w-56 md:justify-start md:gap-2 md:pr-12 xl:w-72'
        )}>
        <Search />
        <span className='hidden truncate md:inline'>Search products…</span>
        <kbd className='pointer-events-none absolute top-1/2 right-2 hidden h-5 -translate-y-1/2 items-center gap-0.5 rounded border bg-background px-1.5 font-mono text-[10px] font-medium select-none md:flex'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      </Button>
      {requested && (
        <Suspense>
          <SearchDialog
            open={open}
            onOpenChange={toggle}
          />
        </Suspense>
      )}
    </>
  );
}
