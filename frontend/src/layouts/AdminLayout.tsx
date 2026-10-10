import { NavigationProgress } from '@/components/layout/NavigationProgress';
import { ModeToggle } from '@/components/layout/ModeToggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initials } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';
import { LayoutDashboard, Package, ShoppingBag, Store, Users } from 'lucide-react';
import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/users', label: 'Customers', icon: Users },
];

function AppSidebar() {
  const user = useAuthStore((state) => state.user);
  const { pathname } = useLocation();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size='lg'>
              <Link to='/admin'>
                <span className='flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
                  <ShoppingBag className='size-4' />
                </span>
                <span className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='font-semibold'>One Stop EShop</span>
                  <span className='text-xs text-muted-foreground'>Admin</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map(({ to, label, icon: Icon, end }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton
                    asChild
                    tooltip={label}
                    isActive={end ? pathname === to : pathname.startsWith(to)}>
                    <NavLink
                      to={to}
                      end={end}
                      onClick={() => setOpenMobile(false)}>
                      <Icon />
                      <span>{label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Storefront</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip='View store'>
                  <Link to='/'>
                    <Store />
                    <span>View store</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <div className='flex items-center gap-2 p-1'>
            <Avatar className='size-8'>
              <AvatarFallback className='bg-primary/10 text-xs font-semibold text-primary'>
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className='grid min-w-0 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden'>
              <span className='truncate font-medium'>{user.name}</span>
              <span className='truncate text-xs text-muted-foreground'>{user.email}</span>
            </div>
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default function AdminLayout() {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <NavigationProgress />
        <AppSidebar />
        <SidebarInset>
          <header className='sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur'>
            <SidebarTrigger className='-ml-1' />
            <Separator
              orientation='vertical'
              className='mr-2 data-[orientation=vertical]:h-4'
            />
            <span className='text-sm text-muted-foreground'>Admin</span>
            <div className='ml-auto'>
              <ModeToggle />
            </div>
          </header>
          <div className='flex-1 p-4 md:p-8'>
            <Outlet />
          </div>
        </SidebarInset>
        <ScrollRestoration />
      </SidebarProvider>
    </TooltipProvider>
  );
}
