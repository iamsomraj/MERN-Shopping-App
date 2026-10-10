import { Logo } from '@/components/layout/Logo';
import type { ReactNode } from 'react';

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className='container flex flex-1 items-center justify-center py-12 sm:py-20'>
      <div className='w-full max-w-sm space-y-8'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <Logo />
          <div className='space-y-1'>
            <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
            <p className='text-sm text-muted-foreground'>{description}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
