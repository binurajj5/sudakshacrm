'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FolderKanban, CheckCircle2, Clock, AlertCircle, Building2 } from 'lucide-react';
import Link from 'next/link';
import { AppHeader } from '@/components/layout/app-header';

function DashboardContent() {
  const { user } = useAuth();

  const quickActions = [
    { icon: Building2, label: 'Companies', description: 'Manage B2B accounts', color: 'text-blue-500', href: '/companies' },
    { icon: Users, label: 'Contacts', description: 'Manage your contacts', color: 'text-green-500', href: '/contacts' },
    { icon: FolderKanban, label: 'Deals', description: 'Track your deals', color: 'text-purple-500', href: '/deals' },
  ];

  const developmentProgress = [
    { label: 'Authentication System', status: 'completed', icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Protected Routes', status: 'completed', icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Dashboard UI', status: 'completed', icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Contacts Module', status: 'pending', icon: Clock, color: 'text-yellow-500' },
    { label: 'Deals Module', status: 'pending', icon: Clock, color: 'text-yellow-500' },
    { label: 'Analytics', status: 'pending', icon: AlertCircle, color: 'text-gray-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <AppHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName}! 👋
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your CRM today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <action.icon className={`h-8 w-8 ${action.color}`} />
                      <div>
                        <CardTitle>{action.label}</CardTitle>
                        <CardDescription>{action.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">System Status</h3>
          <Card>
            <CardHeader>
              <CardTitle>Frontend Status</CardTitle>
              <CardDescription>Next.js 14 application is running</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Connection:</span>
                  <span className="text-sm font-medium text-green-500">Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Authentication:</span>
                  <span className="text-sm font-medium text-green-500">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Session:</span>
                  <span className="text-sm font-medium text-green-500">Valid</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Development Progress */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Development Progress</h3>
          <Card>
            <CardHeader>
              <CardTitle>Implementation Status</CardTitle>
              <CardDescription>Next.js 14 Frontend Setup - Day 1 & Day 2</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {developmentProgress.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className={`text-xs font-medium ${item.color}`}>
                      {item.status === 'completed' ? 'Completed' : item.status === 'pending' ? 'Pending' : 'Not Started'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Information */}
        <div>
          <h3 className="text-xl font-semibold mb-4">User Information</h3>
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">User ID:</span>
                  <span className="text-sm font-mono">{user?.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Full Name:</span>
                  <span className="text-sm">{user?.firstName} {user?.lastName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Role:</span>
                  <span className="text-sm font-medium text-primary">{user?.role}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Member Since:</span>
                  <span className="text-sm">{user?.createdAt && new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Sudaksha CRM. All rights reserved.</p>
          <p className="mt-1">Version 1.0.0 - Next.js 14 Frontend</p>
        </div>
      </footer>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
