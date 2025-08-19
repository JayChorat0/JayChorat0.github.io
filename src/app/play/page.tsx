
"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";


import { GameLayout } from "@/components/game/GameLayout";
import { CaseDisplay } from "@/components/game/CaseDisplay";
import { HintButton } from "@/components/game/HintButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cases, type Case, type Puzzle } from "@/lib/cases";
import { cn } from "@/lib/utils";
import { ArrowRight, Loader2 } from "lucide-react";

type GameState = {
  currentCaseIndex: number;
  currentPuzzleIndex: number;
  score: number;
  solvedPuzzles: string[];
};

export default function CyberSleuthPage() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<{ type: "correct" | "incorrect"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      
      const unsubscribe = onSnapshot(userDocRef, (userDoc) => {
        if (userDoc.exists()) {
           const data = userDoc.data();
           setGameState({
              currentCaseIndex: data.currentCaseIndex ?? 0,
              currentPuzzleIndex: data.currentPuzzleIndex ?? 0,
              score: data.score ?? 0,
              solvedPuzzles: data.solvedPuzzles ?? [],
          });
        } else {
            // This can happen if the doc creation failed during registration.
            // Let's create it here if it doesn't exist.
            console.log("User document not found, creating one.");
            const initialState: GameState & { email: string | null } = { 
                email: user.email,
                score: 0,
                solvedPuzzles: [],
                currentCaseIndex: 0,
                currentPuzzleIndex: 0,
            };
            setDoc(userDocRef, initialState).then(() => {
                 setGameState(initialState);
            });
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  const updateServerGameState = async (newState: Partial<GameState>) => {
      if (!user) return;
      startTransition(async () => {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, newState, { merge: true });
      });
  }

  if (loading || !gameState || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  const currentCase: Case = cases[gameState.currentCaseIndex];
  const currentPuzzle: Puzzle = currentCase.puzzles[gameState.currentPuzzleIndex];
  const isPuzzleSolved = gameState.solvedPuzzles.includes(currentPuzzle.id);

  const handleNext = () => {
    setFeedback(null);
    setUserInput("");
    
    let newGameState: Partial<GameState>;

    if (gameState.currentPuzzleIndex < currentCase.puzzles.length - 1) {
        newGameState = { currentPuzzleIndex: gameState.currentPuzzleIndex + 1 };
    } else if (gameState.currentCaseIndex < cases.length - 1) {
       newGameState = { currentCaseIndex: gameState.currentCaseIndex + 1, currentPuzzleIndex: 0 };
    } else {
      // Game finished
      setFeedback({ type: 'correct', message: "Congratulations! You've solved all cases!" });
      return; // Don't update state further
    }
    
    updateServerGameState(newGameState);
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim() || isPuzzleSolved || isPending) return;

    if (userInput.trim().toLowerCase() === currentPuzzle.solution.toLowerCase()) {
      setFeedback({ type: "correct", message: `Correct! +${currentPuzzle.points} points` });
      
      const newGameState: Partial<GameState> = {
        score: gameState.score + currentPuzzle.points,
        solvedPuzzles: [...gameState.solvedPuzzles, currentPuzzle.id],
      };
      
      updateServerGameState(newGameState);

    } else {
      setFeedback({ type: "incorrect", message: "Incorrect. Try another approach." });
      // Only penalize if score is positive
      const newScore = Math.max(0, gameState.score - 5);
      if (newScore !== gameState.score) {
          updateServerGameState({ score: newScore });
      }
    }
  };

  const isGameFinished = gameState.currentCaseIndex >= cases.length -1 && gameState.currentPuzzleIndex >= cases[cases.length-1].puzzles.length -1 && isPuzzleSolved;

  return (
    <GameLayout
      caseTitle={currentCase.title}
      caseDescription={currentCase.description}
      score={gameState.score}
    >
      <CaseDisplay puzzle={currentPuzzle} />

      <div className="mt-6">
        <p className="text-muted-foreground font-code mb-2">{currentPuzzle.prompt}</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2">
          <Input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter your answer..."
            className="font-code flex-grow"
            disabled={isPuzzleSolved || isPending}
            aria-label="Answer input"
          />
          <Button type="submit" disabled={isPuzzleSolved || isPending} className="w-full sm:w-auto">
            {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
          </Button>
        </form>

        <div className="mt-4 h-12 flex items-center justify-between">
            {feedback && (
                <p className={cn(
                    "text-sm font-semibold transition-all duration-300",
                    feedback.type === 'correct' ? 'text-green-400' : 'text-red-400',
                )}>
                    {feedback.message}
                </p>
            )}
            
            {isPuzzleSolved && !isGameFinished && (
                 <Button onClick={handleNext} variant="outline" className="ml-auto" disabled={isPending}>
                     {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {gameState.currentPuzzleIndex < currentCase.puzzles.length - 1 ? 'Next Puzzle' : 'Next Case'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            )}
            
            {isGameFinished && (
                <p className="text-lg font-bold text-green-400">Congratulations! You've solved all cases!</p>
            )}
        </div>
        
        {!isPuzzleSolved && (
            <div className="mt-4 border-t border-dashed pt-4">
                 <HintButton puzzle={currentPuzzle} userProgress={userInput} />
            </div>
        )}
      </div>
    </GameLayout>
  );
}
