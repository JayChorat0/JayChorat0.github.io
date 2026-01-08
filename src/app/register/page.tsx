
'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';
import { Loader2, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, Database } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';


export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    if (!email || !password) {
        setError("Email and password are required.");
        return;
    }
     if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }

    startTransition(async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create the user document in Firestore
        const userDocRef = doc(Database, "users", user.uid);
        await setDoc(userDocRef, {
            email: email,
            score: 0,
            solvedPuzzles: [],
            endlessPuzzles: [],
            hintedPuzzles: [],
            currentCaseIndex: 0,
            currentPuzzleIndex: 0,
        });

        toast({
          title: "Registration Successful",
          description: "Redirecting to the game...",
        });
        router.push('/play');
        router.refresh();

      } catch (clientError: any) {
        let message = clientError.message || "An error occurred during registration.";
        if (clientError.code === 'auth/email-already-in-use') {
            message = "An account with this email already exists.";
        } else if (clientError.code === 'auth/weak-password') {
            message = "The password is too weak.";
        }
        setError(message);
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
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
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
                autoComplete="new-password"
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
