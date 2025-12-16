import { Role } from '@/types/auth';
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCircle,
  Target,
  Calendar,
  BookOpen,
  UserCog,
  FileText,
  CreditCard,
  MessageSquare,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: Role[]; // Which roles can see this item
  badge?: string; // Optional badge text
  children?: NavItem[]; // Submenu items
}

export const navigationConfig: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: [Role.ADMIN, Role.MANAGER, Role.USER, Role.SUPPORT],
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
    roles: [Role.ADMIN, Role.MANAGER],
  },
  {
    title: 'Companies',
    href: '/companies',
    icon: Building2,
    roles: [Role.ADMIN, Role.MANAGER, Role.USER],
  },
  {
    title: 'Contacts',
    href: '/contacts',
    icon: UserCircle,
    roles: [Role.ADMIN, Role.MANAGER, Role.USER],
  },
  {
    title: 'CRM',
    href: '/crm',
    icon: Target,
    roles: [Role.ADMIN, Role.MANAGER, Role.USER],
    children: [
      {
        title: 'Leads',
        href: '/crm/leads',
        icon: Target,
        roles: [Role.ADMIN, Role.MANAGER, Role.USER],
      },
      {
        title: 'Opportunities',
        href: '/crm/opportunities',
        icon: Target,
        roles: [Role.ADMIN, Role.MANAGER, Role.USER],
      },
      {
        title: 'Deals',
        href: '/crm/deals',
        icon: Target,
        roles: [Role.ADMIN, Role.MANAGER, Role.USER],
      },
    ],
  },
  {
    title: 'Activities',
    href: '/activities',
    icon: Calendar,
    roles: [Role.ADMIN, Role.MANAGER, Role.USER],
  },
  {
    title: 'Courses',
    href: '/courses',
    icon: BookOpen,
    roles: [Role.ADMIN, Role.MANAGER],
  },
  {
    title: 'Trainers',
    href: '/trainers',
    icon: UserCog,
    roles: [Role.ADMIN, Role.MANAGER],
  },
  {
    title: 'Documents',
    href: '/documents',
    icon: FileText,
    roles: [Role.ADMIN, Role.MANAGER, Role.USER],
  },
  {
    title: 'Financial',
    href: '/financial',
    icon: CreditCard,
    roles: [Role.ADMIN, Role.MANAGER],
    children: [
      {
        title: 'Invoices',
        href: '/financial/invoices',
        icon: FileText,
        roles: [Role.ADMIN, Role.MANAGER],
      },
      {
        title: 'Payments',
        href: '/financial/payments',
        icon: CreditCard,
        roles: [Role.ADMIN, Role.MANAGER],
      },
    ],
  },
  {
    title: 'Messaging',
    href: '/messaging',
    icon: MessageSquare,
    roles: [Role.ADMIN, Role.MANAGER],
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: [Role.ADMIN, Role.MANAGER],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: [Role.ADMIN],
  },
];

/**
 * Filter navigation items based on user role
 */
export function getNavigationForRole(role: Role): NavItem[] {
  return navigationConfig.filter((item) => {
    if (!item.roles.includes(role)) return false;
    
    // Filter children if they exist
    if (item.children) {
      item.children = item.children.filter((child) =>
        child.roles.includes(role)
      );
    }
    
    return true;
  });
}
