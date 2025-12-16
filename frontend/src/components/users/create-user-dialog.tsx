'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Role } from '@/types/auth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, User, Briefcase, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: Role.USER,
    reportsTo: '',
    department: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Call API to create user
      // const response = await createUser(formData);
      
      toast({
        title: 'User Created Successfully',
        description: `Welcome email sent to ${formData.email}`,
      });

      // Reset form
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: Role.USER,
        reportsTo: '',
        department: '',
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new employee to the system. They will receive login credentials via email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">
                <Mail className="inline h-4 w-4 mr-2" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="employee@sudaksha.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Official company email address
              </p>
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">
                  <User className="inline h-4 w-4 mr-2" />
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Role */}
            <div className="grid gap-2">
              <Label htmlFor="role">
                <Shield className="inline h-4 w-4 mr-2" />
                Role
              </Label>
              <select
                id="role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                disabled={loading}
              >
                <option value={Role.USER}>User - Standard Employee</option>
                <option value={Role.MANAGER}>Manager - Department Lead</option>
                {user?.role === Role.ADMIN && (
                  <option value={Role.ADMIN}>Admin - System Administrator</option>
                )}
                <option value={Role.SUPPORT}>Support - Customer Service</option>
              </select>
            </div>

            {/* Department */}
            <div className="grid gap-2">
              <Label htmlFor="department">
                <Briefcase className="inline h-4 w-4 mr-2" />
                Department
              </Label>
              <select
                id="department"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                disabled={loading}
              >
                <option value="">Select Department</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
                <option value="training">Training & Development</option>
                <option value="finance">Finance</option>
                <option value="operations">Operations</option>
                <option value="support">Customer Support</option>
                <option value="hr">Human Resources</option>
                <option value="it">IT & Technology</option>
              </select>
            </div>

            {/* Reporting Manager */}
            <div className="grid gap-2">
              <Label htmlFor="reportsTo">Reports To (Manager)</Label>
              <Input
                id="reportsTo"
                placeholder="Select reporting manager..."
                value={formData.reportsTo}
                onChange={(e) => setFormData({ ...formData, reportsTo: e.target.value })}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Select this employee's direct manager for reporting hierarchy
              </p>
            </div>

            {/* Info Box */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-900">
                <strong>Email Notification:</strong><br />
                A welcome email with temporary login credentials will be sent to the user's email address.
                They will be prompted to change their password on first login.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create User & Send Email'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
