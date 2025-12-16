'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { getNavigationForRole, type NavItem } from '@/config/navigation';
import { useSidebar } from '@/hooks/use-sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isCollapsed } = useSidebar();

  if (!user) return null;

  const navigation = getNavigationForRole(user.role);

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-background transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b px-4">
        {isCollapsed ? (
          <span className="text-2xl font-bold text-primary">S</span>
        ) : (
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">Sudaksha</span>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {navigation.map((item) => (
          <NavItemComponent
            key={item.href}
            item={item}
            pathname={pathname}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t p-2">
        <Separator className="mb-2" />
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            isCollapsed && 'justify-center px-2'
          )}
          onClick={() => logout()}
        >
          <LogOut className={cn('h-5 w-5', !isCollapsed && 'mr-2')} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}

interface NavItemComponentProps {
  item: NavItem;
  pathname: string;
  isCollapsed: boolean;
}

function NavItemComponent({
  item,
  pathname,
  isCollapsed,
}: NavItemComponentProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
            isActive && 'bg-accent text-accent-foreground',
            isCollapsed && 'justify-center px-2'
          )}
        >
          <item.icon className={cn('h-5 w-5', !isCollapsed && 'mr-3')} />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">{item.title}</span>
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform',
                  isOpen && 'rotate-90'
                )}
              />
            </>
          )}
        </button>
        {!isCollapsed && isOpen && (
          <div className="ml-8 mt-1 space-y-1">
            {item.children?.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  pathname === child.href && 'bg-accent text-accent-foreground'
                )}
              >
                <child.icon className="mr-3 h-4 w-4" />
                <span>{child.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-accent text-accent-foreground',
        isCollapsed && 'justify-center px-2'
      )}
    >
      <item.icon className={cn('h-5 w-5', !isCollapsed && 'mr-3')} />
      {!isCollapsed && <span>{item.title}</span>}
      {!isCollapsed && item.badge && (
        <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
