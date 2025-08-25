"use client";

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Puzzle } from '@/lib/cases';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { RequestPuzzleHintInput } from '@/ai/flows/generate-hint';

interface HintButtonProps {
    puzzle: Puzzle;
    userProgress: string;
}

const getHintFunction = httpsCallable<RequestPuzzleHintInput, { hint: string } | { error: string }>(getFunctions(), 'getHint');

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
        setIsOpen(true);
        startTransition(async () => {
            try {
                const result = await getHintFunction({
                    puzzleDescription: puzzle.aiPuzzleDescription,
                    userProgress: userProgress || "The user has not tried anything yet.",
                });

                const data = result.data as any;

                if (data.error) {
                    setError(data.error);
                    toast({
                        variant: 'destructive',
                        title: 'Hint Error',
                        description: data.error,
                    });
                } else if (data.hint) {
                    setHint(data.hint);
                }
            } catch(e) {
                console.error(e);
                const errorMessage = "Failed to generate hint. Please try again later.";
                setError(errorMessage);
                 toast({
                    variant: 'destructive',
                    title: 'Hint Error',
                    description: errorMessage,
                });
            }
        });
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
                        <p className="text-muted-foreground">Requesting hint...</p>
                    )}
                </div>
                 <DialogFooter>
                    <Button onClick={() => setIsOpen(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
