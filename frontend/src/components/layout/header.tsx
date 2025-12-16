'use client';

import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useSidebar } from '@/hooks/use-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserProfileDropdown } from './user-profile-dropdown';

export function Header() {
  const { user } = useAuth();
  const { toggle } = useSidebar();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Toggle Sidebar */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="md:flex"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          {/* User Profile Dropdown */}
          <UserProfileDropdown user={user} />
        </div>
      </div>
    </header>
  );
}
