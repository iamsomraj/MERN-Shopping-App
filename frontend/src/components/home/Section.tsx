import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

interface SectionProps {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ title, description, href, linkLabel = 'View all', children, className }: SectionProps) {
  return (
    <section className={cn('container space-y-6', className)}>
      <div className='flex items-end justify-between gap-4'>
        <div className='space-y-1'>
          <h2 className='text-xl font-semibold tracking-tight sm:text-2xl'>{title}</h2>
          {description && <p className='text-sm text-muted-foreground'>{description}</p>}
        </div>
        {href && (
          <Button
            asChild
            variant='ghost'
            size='sm'
            className='shrink-0'>
            <Link to={href}>
              {linkLabel} <ArrowRight />
            </Link>
          </Button>
        )}
      </div>
      {children}
    </section>
  );
}
