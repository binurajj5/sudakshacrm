'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login after 3 seconds
    const timer = setTimeout(() => {
      router.push('/auth/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Registration Disabled
          </CardTitle>
          <CardDescription className="text-center">
            Employee accounts are created by system administrators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted p-4">
            <h3 className="font-semibold mb-2">Internal Users Only</h3>
            <p className="text-sm text-muted-foreground">
              This is an internal CRM system for Sudaksha employees. 
              User accounts are created and managed by your system administrator.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">To get access:</h3>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
              <li>Contact your department manager</li>
              <li>Request system access with your official email</li>
              <li>Admin will create your account and send credentials</li>
            </ol>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-900">
              <strong>Already have an account?</strong><br />
              Use the login credentials sent to your email.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild className="w-full">
            <Link href="/auth/login">
              Go to Login
            </Link>
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Redirecting to login in 3 seconds...
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
