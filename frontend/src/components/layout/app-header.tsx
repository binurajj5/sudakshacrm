'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut, UserCircle, Building2 } from 'lucide-react';
import Link from 'next/link';

export function AppHeader() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
          <div>
            <h1 className="text-2xl font-bold">Sudaksha CRM</h1>
            <p className="text-sm text-muted-foreground">Customer Relationship Management</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/users">
            <Button variant="ghost" size="sm">
              <UserCircle className="mr-2 h-4 w-4" />
              Users
            </Button>
          </Link>
          <Link href="/companies">
            <Button variant="ghost" size="sm">
              <Building2 className="mr-2 h-4 w-4" />
              Companies
            </Button>
          </Link>
          <div className="text-right">
            <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <p className="text-xs text-primary font-medium">{user?.role}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
