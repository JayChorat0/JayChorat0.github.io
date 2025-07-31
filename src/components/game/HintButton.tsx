"use client";

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getHintAction } from '@/app/actions';
import { Puzzle } from '@/lib/cases';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface HintButtonProps {
    puzzle: Puzzle;
    userProgress: string;
}

export function HintButton({ puzzle, userProgress }: HintButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [hint, setHint] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const handleGetHint = () => {
        if (isOpen) return;
    
        setError(null);
        setHint(null);
        startTransition(async () => {
            const result = await getHintAction({
                puzzleDescription: puzzle.aiPuzzleDescription,
                userProgress: userProgress,
            });

            if (result.error) {
                setError(result.error);
                toast({
                    variant: 'destructive',
                    title: 'Hint Error',
                    description: result.error,
                });
            } else if (result.hint) {
                setHint(result.hint);
            }
        });
        setIsOpen(true);
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="text-accent hover:text-accent-foreground" onClick={handleGetHint}>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Need a Hint?
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>AI-Generated Hint</DialogTitle>
                    <DialogDescription>
                        Here's a hint to help you solve the puzzle.
                    </DialogDescription>
                </DialogHeader>
                <div className="min-h-[100px] flex items-center justify-center">
                    {isPending ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Generating hint...</p>
                        </div>
                    ) : error ? (
                         <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : hint ? (
                        <p className="text-lg text-center font-medium">{hint}</p>
                    ) : (
                        // This case should ideally not be reached if the dialog is only opened after a hint is fetched
                        <p className="text-muted-foreground">No hint available yet.</p>
                    )}
                </div>
                 <DialogFooter>
                    <Button onClick={() => setIsOpen(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
