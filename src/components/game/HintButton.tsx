
'use client';

import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Puzzle } from '@/lib/cases';
import { RequestPuzzleHintInput, RequestPuzzleHintOutput } from '@/lib/types';

interface HintButtonProps {
  puzzle: Puzzle;
}

const functions = getFunctions(app, 'us-central1');
const requestPuzzleHintFunction = httpsCallable<
  RequestPuzzleHintInput,
  RequestPuzzleHintOutput
>(functions, 'requestPuzzleHint');

export function HintButton({ puzzle }: HintButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [existingHints, setExistingHints] = useState<string[]>([]);

  const handleGenerateHint = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await requestPuzzleHintFunction({
        puzzleDescription: puzzle.aiPuzzleDescription,
        existingHints,
      });
      const newHint = result.data.hint;
      setHint(newHint);
      setExistingHints((prev) => [...prev, newHint]);
    } catch (e: any) {
      console.error(e);
      setError('Failed to generate hint. The AI may be offline. Please try again later.');
      // Keep previous hint if available
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when dialog is closed
      setHint(null);
      setError(null);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-accent hover:text-accent-foreground">
          <Lightbulb className="mr-2 h-4 w-4" />
          Need a Hint?
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb />
            Mission Hint
          </DialogTitle>
          <DialogDescription>
            Requesting a hint from Agency command. This may take a moment.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 min-h-[6rem] flex items-center justify-center rounded-md border border-dashed p-4 text-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Generating hint...</p>
            </div>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : hint ? (
            <p className="text-lg font-semibold text-accent-foreground">{hint}</p>
          ) : (
             <p className="text-muted-foreground">Click the button below to generate a hint.</p>
          )}
        </div>

        <Button onClick={handleGenerateHint} disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="mr-2 h-4 w-4" />
          )}
          {hint ? 'Generate a different hint' : 'Generate Hint'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
