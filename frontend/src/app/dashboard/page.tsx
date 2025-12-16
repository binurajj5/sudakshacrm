'use client';

import { useAuth } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, UserCircle, Target, TrendingUp, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Users',
      value: '0',
      description: 'Active users',
      icon: Users,
      trend: '+0%',
    },
    {
      title: 'Companies',
      value: '0',
      description: 'Registered companies',
      icon: Building2,
      trend: '+0%',
    },
    {
      title: 'Contacts',
      value: '0',
      description: 'Total contacts',
      icon: UserCircle,
      trend: '+0%',
    },
    {
      title: 'Active Deals',
      value: '0',
      description: 'In progress',
      icon: Target,
      trend: '+0%',
    },
    {
      title: 'Revenue',
      value: '₹0',
      description: 'This month',
      icon: TrendingUp,
      trend: '+0%',
    },
    {
      title: 'Activities',
      value: '0',
      description: 'This week',
      icon: Calendar,
      trend: '+0%',
    },
  ];

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your CRM today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {stat.trend} from last period
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks you can perform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <button className="flex flex-col items-center justify-center rounded-lg border p-4 hover:bg-accent transition-colors">
                  <Building2 className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium">Add Company</span>
                </button>
                <button className="flex flex-col items-center justify-center rounded-lg border p-4 hover:bg-accent transition-colors">
                  <UserCircle className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium">Add Contact</span>
                </button>
                <button className="flex flex-col items-center justify-center rounded-lg border p-4 hover:bg-accent transition-colors">
                  <Target className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium">Create Deal</span>
                </button>
                <button className="flex flex-col items-center justify-center rounded-lg border p-4 hover:bg-accent transition-colors">
                  <Calendar className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium">Schedule Activity</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates from your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center py-8">
                  No recent activity to display. Start by adding companies and contacts.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
