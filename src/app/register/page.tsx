
'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';
import { registerAction } from '../actions';
import { Loader2, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await registerAction(formData);
      if (result.success) {
        router.push('/play');
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 animated-grid-background">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0" />
      <Card className="w-full max-w-sm z-10 animate-fade-in-up border-primary/20 bg-card/80 shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-headline tracking-widest text-accent">Create Account</CardTitle>
          <CardDescription>Register as a new agent to start your missions.</CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="agent@agency.com"
                required
                className="font-code"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passkey</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Choose a strong passkey..."
                required
                minLength={6}
                className="font-code"
                disabled={isPending}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register
                </>
              )}
            </Button>
            <Button variant="link" asChild className="mt-4">
                <Link href="/">Already have an account? Login</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
      <style jsx>{`
          @keyframes fade-in-up {
              from {
                  opacity: 0;
                  transform: translateY(20px);
              }
              to {
                  opacity: 1;
                  transform: translateY(0);
              }
          }
          .animate-fade-in-up {
              animation: fade-in-up 0.7s ease-out forwards;
          }
      `}</style>
    </main>
  );
}
