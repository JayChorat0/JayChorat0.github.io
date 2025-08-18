
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';
import { loginAction } from './actions';
import { Loader2, KeyRound } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    startTransition(async () => {
      // First, check if user exists with the server action
      const serverResult = await loginAction(formData);

      if (serverResult.success) {
        // If user exists, try to sign in on the client
        try {
          await signInWithEmailAndPassword(auth, email, password);
          toast({ title: "Login Successful", description: "Redirecting to the game..." });
          router.push('/play');
        } catch (clientError: any) {
          if(clientError.code === 'auth/wrong-password' || clientError.code === 'auth/invalid-credential') {
             setError('Incorrect password. Please try again.');
          } else {
             setError('An error occurred during login.');
          }
        }
      } else {
        setError(serverResult.message);
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
          <CardTitle className="text-2xl font-headline tracking-widest text-accent">Agent Login</CardTitle>
          <CardDescription>Enter the network to begin your mission.</CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Your agent email..."
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
                placeholder="Your secret passkey..."
                required
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
                  Accessing...
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Initiate Connection
                </>
              )}
            </Button>
             <Button variant="link" asChild className="mt-4">
                <Link href="/register">Create a new agent account</Link>
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
