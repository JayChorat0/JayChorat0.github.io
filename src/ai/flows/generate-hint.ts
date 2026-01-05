
'use server';

// This file houses the requestPuzzleHint flow, input and output types.
// requestPuzzleHint - A function that generates a hint for the current puzzle.
// RequestPuzzleHintInput - The input type for the requestPuzzleHint function.
// RequestPuzzleHintOutput - The return type for the requestPuzzleHint function.

import {ai} from '@/ai/genkit';
import {z} from 'genkit/zod';

export const RequestPuzzleHintInputSchema = z.object({
    puzzleDescription: z.string().describe("A brief, clear description for an AI explaining what the user needs to do to solve a puzzle. Used for generating hints."),
});
export type RequestPuzzleHintInput = z.infer<typeof RequestPuzzleHintInputSchema>;

const RequestPuzzleHintOutputSchema = z.object({
  hint: z.string().describe('A helpful hint for the current puzzle.'),
});
export type RequestPuzzleHintOutput = z.infer<typeof RequestPuzzleHintOutputSchema>;

export async function requestPuzzleHint(input: RequestPuzzleHintInput): Promise<RequestPuzzleHintOutput> {
  return requestPuzzleHintFlow(input);
}

const requestPuzzleHintPrompt = ai.definePrompt({
  name: 'requestPuzzleHintPrompt',
  input: {schema: RequestPuzzleHintInputSchema},
  output: {schema: RequestPuzzleHintOutputSchema},
  prompt: `You are an expert cyber sleuth, skilled at giving helpful hints without giving away the answer.

  Provide a hint to help the user with the following puzzle. The hint should not directly give away the answer but guide the user towards a solution.

Puzzle Description: {{{puzzleDescription}}}

Hint: `,
});

const requestPuzzleHintFlow = ai.defineFlow(
  {
    name: 'requestPuzzleHintFlow',
    inputSchema: RequestPuzzleHintInputSchema,
    outputSchema: RequestPuzzleHintOutputSchema,
  },
  async input => {
    const {output} = await requestPuzzleHintPrompt(input);
    return output!;
  }
);
