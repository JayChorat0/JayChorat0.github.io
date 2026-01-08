
'use client';

import React, { useState, useEffect } from 'react';
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
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [revealedHints, setRevealedHints] = useState<string[]>([]);

  // Reset hints when the puzzle changes
  useEffect(() => {
    setCurrentHintIndex(0);
    setRevealedHints([]);
  }, [puzzle.id]);

  const handleShowHint = () => {
    if (puzzle.hints && puzzle.hints.length > 0) {
      if (currentHintIndex < puzzle.hints.length) {
        setRevealedHints(prev => [...prev, puzzle.hints[currentHintIndex]]);
        setCurrentHintIndex(prev => prev + 1);
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Optional: reset hints when dialog is closed, or let them persist
      // setCurrentHintIndex(0);
      // setRevealedHints([]);
    }
  };

  if (!puzzle.hints || puzzle.hints.length === 0) {
    return null; // Don't render the button if there are no hints
  }

  const noMoreHints = currentHintIndex >= puzzle.hints.length;

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
            Here are some hints to get you on the right track.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 min-h-[6rem] space-y-2 rounded-md border border-dashed p-4">
          {revealedHints.length > 0 ? (
            revealedHints.map((hint, index) => (
              <p key={index} className="text-accent-foreground animate-fade-in">
                <span className="font-semibold">Hint {index + 1}:</span> {hint}
              </p>
            ))
          ) : (
            <p className="text-muted-foreground text-center">Click the button below to reveal a hint.</p>
          )}
           {noMoreHints && revealedHints.length > 0 && (
             <p className="text-sm text-muted-foreground pt-2 border-t border-dashed text-center mt-2">No more hints available for this puzzle.</p>
           )}
        </div>

        <Button onClick={handleShowHint} disabled={noMoreHints} className="w-full">
          <Lightbulb className="mr-2 h-4 w-4" />
          {revealedHints.length > 0 ? 'Show Next Hint' : 'Show Hint'}
        </Button>
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
