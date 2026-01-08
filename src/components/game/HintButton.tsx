
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
  const [shownHints, setShownHints] = useState<string[]>([]);
  const [currentHint, setCurrentHint] = useState<string | null>(null);

  // Reset hints when the puzzle changes
  useEffect(() => {
    setShownHints([]);
    setCurrentHint(null);
  }, [puzzle.id]);

  const getNewHint = () => {
    const availableHints = puzzle.hints.filter(h => !shownHints.includes(h));
    
    if (availableHints.length > 0) {
      const newHint = availableHints[Math.floor(Math.random() * availableHints.length)];
      setShownHints(prev => [...prev, newHint]);
      setCurrentHint(newHint);
    } else {
      setCurrentHint("No more hints available for this puzzle.");
    }
    setIsOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
        setCurrentHint(null); // Clear hint when dialog closes
    }
    setIsOpen(open);
  };
  
  if (!puzzle.hints || puzzle.hints.length === 0) {
    return null; // Don't render the button if there are no hints
  }

  const buttonText = shownHints.length > 0 ? "Get Another Hint" : "Need a Hint?";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
            variant="ghost" 
            className="text-accent hover:text-accent-foreground"
            onClick={getNewHint}
        >
          <Lightbulb className="mr-2 h-4 w-4" />
          {buttonText}
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
            {currentHint}
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
