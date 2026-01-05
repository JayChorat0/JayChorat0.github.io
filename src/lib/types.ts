'use client';

import { Puzzle } from "./cases";

export type GenerateNewPuzzleInput = {
  lastCaseDescription: string;
  existingSolutions: string[];
};

export type GenerateNewPuzzleOutput = Puzzle;


export type RequestPuzzleHintInput = {
    puzzleDescription: string;
    existingHints: string[];
};

export type RequestPuzzleHintOutput = {
    hint: string;
};
