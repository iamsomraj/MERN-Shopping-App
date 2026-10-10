import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/api';
import { TriangleAlert } from 'lucide-react';
import { EmptyState } from './EmptyState';

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <EmptyState
      icon={TriangleAlert}
      title='Something went wrong'
      description={getErrorMessage(error)}
      action={
        onRetry && (
          <Button
            variant='outline'
            onClick={onRetry}>
            Try again
          </Button>
        )
      }
    />
  );
}
