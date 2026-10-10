import { Button } from '@/components/ui/button';
import { TriangleAlert } from 'lucide-react';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router';

/** Last-resort error screen (e.g. a page chunk failed to load after a deploy). */
export function RouteError() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <div className='flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center'>
      <div className='flex size-12 items-center justify-center rounded-full bg-muted'>
        <TriangleAlert className='size-6 text-muted-foreground' />
      </div>
      <h1 className='text-xl font-semibold'>{notFound ? 'Page not found' : 'Something went wrong'}</h1>
      <p className='max-w-sm text-sm text-muted-foreground'>
        {notFound ? 'The page you are looking for does not exist.' : 'Please reload the page and try again.'}
      </p>
      <div className='flex gap-2'>
        <Button onClick={() => window.location.reload()}>Reload</Button>
        <Button
          asChild
          variant='outline'>
          <Link to='/'>Go home</Link>
        </Button>
      </div>
    </div>
  );
}
