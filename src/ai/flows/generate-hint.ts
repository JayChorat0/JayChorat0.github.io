
'use server';

// This file houses the requestPuzzleHint flow, input and output types.
// requestPuzzleHint - A function that generates a hint for a given puzzle description.
// RequestPuzzleHintInput - The input type for the requestPuzzleHint function.
// RequestPuzzleHintOutput - The return type for the requestPuzzleHint function.

import { ai } from '@/ai/genkit';
import { z } from 'genkit/zod';
import { RequestPuzzleHintInput, RequestPuzzleHintOutput } from '@/lib/types';


const RequestPuzzleHintInputSchema = z.object({
  puzzleDescription: z.string().describe("A description of the puzzle the user needs a hint for."),
  existingHints: z.array(z.string()).describe("A list of hints already given to the user to avoid repetition.")
});

const RequestPuzzleHintOutputSchema = z.object({
  hint: z.string().describe("A helpful, single-sentence hint for the puzzle."),
});

export async function requestPuzzleHint(input: RequestPuzzleHintInput): Promise<RequestPuzzleHintOutput> {
  return requestPuzzleHintFlow(input);
}

const requestPuzzleHintPrompt = ai.definePrompt({
  name: 'requestPuzzleHintPrompt',
  input: { schema: z.object({
    puzzleDescription: z.string(),
    existingHints: z.string(), // We will pass the hints as a formatted string
  }) },
  output: { schema: RequestPuzzleHintOutputSchema },
  prompt: `You are a helpful and clever assistant for the "Bug Hunters" detective game. Your goal is to provide a single, concise hint to a player who is stuck on a puzzle.

The puzzle is described as: "{{puzzleDescription}}"

Rules for hints:
1.  **Do NOT give away the answer.**
2.  Your hint should guide the player in the right direction. For example, if the answer is in an HTML comment, a good hint would be "Sometimes the most important clues aren't visible on the page itself."
3.  Be creative and maintain the cyber-sleuth theme.
4.  The hint must be a single sentence.
5.  Do not repeat any of the following hints that have already been given:
{{existingHints}}

Generate a new hint for the player now.`,
});


const requestPuzzleHintFlow = ai.defineFlow(
  {
    name: 'requestPuzzleHintFlow',
    inputSchema: RequestPuzzleHintInputSchema,
    outputSchema: RequestPuzzleHintOutputSchema,
  },
  async input => {
    // Format the existing hints array into a simple string for the prompt.
    const existingHintsAsString = input.existingHints.length > 0
      ? input.existingHints.map(h => `- "${h}"`).join('\n')
      : 'None.';

    const { output } = await requestPuzzleHintPrompt({
        puzzleDescription: input.puzzleDescription,
        existingHints: existingHintsAsString,
    });
    return output!;
  }
);
