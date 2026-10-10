import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { usePageMeta } from '@/hooks/use-page-meta';
import { Compass } from 'lucide-react';
import { Link } from 'react-router';

export default function NotFoundPage() {
  usePageMeta('Page not found', { noindex: true });
  return (
    <div className='container py-20'>
      <EmptyState
        icon={Compass}
        title='Page not found'
        description='The page you are looking for does not exist or has moved.'
        action={
          <div className='flex gap-2'>
            <Button asChild>
              <Link to='/'>Go home</Link>
            </Button>
            <Button
              asChild
              variant='outline'>
              <Link to='/shop'>Browse the shop</Link>
            </Button>
          </div>
        }
      />
    </div>
  );
}
