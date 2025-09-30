
'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Database } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const usersCollectionRef = collection(Database, 'users');
        const querySnapshot = await getDocs(usersCollectionRef);
        setUserCount(querySnapshot.size);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user count. See console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Admin Dashboard
          </CardTitle>
          <CardDescription>Key metrics for your Bug Hunters application.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading user count...</span>
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Registered Agents</p>
              <p className="text-5xl font-bold text-accent">{userCount}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <Button variant="link" asChild className="mt-6">
        <Link href="/play">Back to the Game</Link>
      </Button>
    </main>
  );
}
