
'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Lightbulb } from 'lucide-react';
import { Puzzle } from '@/lib/cases';

interface HintButtonProps {
  puzzle: Puzzle;
}

export function HintButton({ puzzle }: HintButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Select one random hint and memoize it for the current puzzle
  const randomHint = useMemo(() => {
    if (!puzzle.hints || puzzle.hints.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * puzzle.hints.length);
    return puzzle.hints[randomIndex];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle.id]); // Rerun only when puzzle ID changes


  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  if (!randomHint) {
    return null; // Don't render the button if there are no hints
  }

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
            Here's a hint to get you on the right track.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 min-h-[6rem] flex items-center justify-center rounded-md border border-dashed p-4">
          <p className="text-accent animate-fade-in text-center text-lg">
            {randomHint}
          </p>
        </div>
      </DialogContent>
       <style jsx>{`
            @keyframes fade-in {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            .animate-fade-in {
                animation: fade-in 0.5s ease-in-out forwards;
            }
      `}</style>
    </Dialog>
  );
}
