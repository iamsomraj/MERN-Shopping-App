import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import '@/styles/globals.css';
import '@/stores/theme';

import { Toaster } from '@/components/ui/sonner';
import { router } from '@/router';
import { queryClient } from '@/lib/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position='bottom-right'
        richColors
        closeButton
      />
    </QueryClientProvider>
  </StrictMode>
);
