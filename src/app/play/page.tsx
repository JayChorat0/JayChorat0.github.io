
"use client";

import React, { useState, useTransition } from "react";
import { GameLayout } from "@/components/game/GameLayout";
import { CaseDisplay } from "@/components/game/CaseDisplay";
import { HintButton } from "@/components/game/HintButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cases, type Case, type Puzzle } from "@/lib/cases";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type GameState = {
  currentCaseIndex: number;
  currentPuzzleIndex: number;
  score: number;
  solvedPuzzles: Set<string>;
};

export default function CyberSleuthPage() {
  const [gameState, setGameState] = useState<GameState>({
    currentCaseIndex: 0,
    currentPuzzleIndex: 0,
    score: 0,
    solvedPuzzles: new Set(),
  });
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<{ type: "correct" | "incorrect"; message: string } | null>(null);

  const currentCase: Case = cases[gameState.currentCaseIndex];
  const currentPuzzle: Puzzle = currentCase.puzzles[gameState.currentPuzzleIndex];
  const isPuzzleSolved = gameState.solvedPuzzles.has(currentPuzzle.id);

  const handleNext = () => {
    setFeedback(null);
    setUserInput("");

    if (gameState.currentPuzzleIndex < currentCase.puzzles.length - 1) {
      setGameState((prev) => ({
        ...prev,
        currentPuzzleIndex: prev.currentPuzzleIndex + 1,
      }));
    } else if (gameState.currentCaseIndex < cases.length - 1) {
      setGameState((prev) => ({
        ...prev,
        currentCaseIndex: prev.currentCaseIndex + 1,
        currentPuzzleIndex: 0,
      }));
    } else {
      // Game finished
      setFeedback({ type: 'correct', message: "Congratulations! You've solved all cases!" });
    }
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim() || isPuzzleSolved) return;

    if (userInput.trim().toLowerCase() === currentPuzzle.solution.toLowerCase()) {
      setFeedback({ type: "correct", message: `Correct! +${currentPuzzle.points} points` });
      setGameState((prev) => ({
        ...prev,
        score: prev.score + currentPuzzle.points,
        solvedPuzzles: new Set(prev.solvedPuzzles).add(currentPuzzle.id),
      }));
    } else {
      setFeedback({ type: "incorrect", message: "Incorrect. Try another approach." });
      setGameState(prev => ({ ...prev, score: Math.max(0, prev.score - 5) }));
    }
  };

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
            disabled={isPuzzleSolved}
            aria-label="Answer input"
          />
          <Button type="submit" disabled={isPuzzleSolved} className="w-full sm:w-auto">
            Submit
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
            
            {isPuzzleSolved && (
                 <Button onClick={handleNext} variant="outline" className="ml-auto">
                    {gameState.currentPuzzleIndex < currentCase.puzzles.length - 1 ? 'Next Puzzle' : 'Next Case'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
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
