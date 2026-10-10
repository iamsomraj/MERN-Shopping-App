import { useAdminUsers, useDeleteUser, useUpdateUserRole } from '@/api/users';
import { ErrorState } from '@/components/common/ErrorState';
import { PageHeader } from '@/components/common/PageHeader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePageMeta } from '@/hooks/use-page-meta';
import { getErrorMessage } from '@/lib/api';
import { formatDate, initials } from '@/lib/utils';
import type { IUser } from '@/types';
import { MoreHorizontal, Search, ShieldCheck, ShieldOff, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  usePageMeta('Customers · Admin', { noindex: true });
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState<IUser | null>(null);
  const { data: users, isPending, error, refetch } = useAdminUsers();
  const { mutate: updateRole } = useUpdateUserRole();
  const { mutate: deleteUser } = useDeleteUser();

  const term = search.trim().toLowerCase();
  const filtered = users?.filter(
    (user) => !term || user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
  );

  const setRole = (user: IUser, isAdmin: boolean) =>
    updateRole(
      { id: user._id, isAdmin },
      {
        onSuccess: () => toast.success(`${user.name} is ${isAdmin ? 'now an admin' : 'no longer an admin'}`),
        onError: (err) => toast.error(getErrorMessage(err)),
      }
    );

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Customers'
        description={users ? `${users.length} other accounts` : 'Manage accounts and admin access.'}
      />
      <div className='relative max-w-sm'>
        <Search className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder='Search by name or email'
          className='pl-9'
          aria-label='Search customers'
        />
      </div>
      {error ? (
        <ErrorState
          error={error}
          onRetry={() => refetch()}
        />
      ) : (
        <div className='rounded-xl border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className='hidden md:table-cell'>Joined</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className='w-12'>
                  <span className='sr-only'>Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending
                ? Array.from({ length: 4 }, (_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={4}>
                        <Skeleton className='h-10' />
                      </TableCell>
                    </TableRow>
                  ))
                : filtered?.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          <Avatar className='size-9'>
                            <AvatarFallback className='text-xs'>{initials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div className='min-w-0'>
                            <p className='truncate font-medium'>{user.name}</p>
                            <p className='truncate text-xs text-muted-foreground'>{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='hidden text-muted-foreground md:table-cell'>
                        {user.createdAt ? formatDate(user.createdAt) : '—'}
                      </TableCell>
                      <TableCell>
                        {user.isAdmin ? <Badge>Admin</Badge> : <Badge variant='secondary'>Customer</Badge>}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon-sm'
                              aria-label={`Actions for ${user.name}`}>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem onSelect={() => setRole(user, !user.isAdmin)}>
                              {user.isAdmin ? <ShieldOff /> : <ShieldCheck />}
                              {user.isAdmin ? 'Remove admin access' : 'Make admin'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant='destructive'
                              onSelect={() => setToDelete(user)}>
                              <Trash2 /> Delete account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      )}
      <AlertDialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {toDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the account. Their past orders are kept for your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-destructive text-white hover:bg-destructive/90'
              onClick={() =>
                toDelete &&
                deleteUser(toDelete._id, {
                  onSuccess: () => toast.success('Account deleted'),
                  onError: (err) => toast.error(getErrorMessage(err)),
                })
              }>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
