'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { getNavigationForRole } from '@/config/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  if (!user) return null;

  const navigation = getNavigationForRole(user.role);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="border-b p-4">
            <SheetTitle>
              <Link href="/dashboard" className="text-2xl font-bold text-primary">
                Sudaksha
              </Link>
            </SheetTitle>
          </SheetHeader>
          <nav className="space-y-1 p-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  pathname === item.href && 'bg-accent text-accent-foreground'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
