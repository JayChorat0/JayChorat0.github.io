
// This file houses the generateNewPuzzle flow, input and output types.
// generateNewPuzzle - A function that generates a new, unique puzzle for the game.
// GenerateNewPuzzleInput - The input type for the generateNewPuzzle function.
// GenerateNewPuzzleOutput - The return type for the generateNewPuzzle function.

import {ai} from '@/ai/genkit';
import {z} from 'genkit/zod';
import { Puzzle } from '@/lib/cases';

const GenerateNewPuzzleInputSchema = z.object({
  lastCaseDescription: z.string().describe("The description of the last case the user successfully completed. This provides context for the new puzzle."),
  existingSolutions: z.array(z.string()).describe("A list of all existing puzzle solutions to avoid creating duplicate puzzles.")
});
export type GenerateNewPuzzleInput = z.infer<typeof GenerateNewPuzzleInputSchema>;

export type GenerateNewPuzzleOutput = Puzzle;
const PuzzleSchema: z.ZodType<Puzzle> = z.object({
    id: z.string().describe("A unique identifier for the puzzle, e.g., 'gen-puzzle-1'."),
    type: z.enum(["email", "website", "terminal"]).describe("The type of puzzle interface to display."),
    title: z.string().describe("A creative and engaging title for the puzzle."),
    description: z.string().describe("A short description of the puzzle scenario, which can be used as a header or context for the player."),
    content: z.string().describe("The main content of the puzzle as HTML. This is what the user will analyze. For 'terminal' type, this will be rendered as pre-formatted text. For 'email' or 'website', this can include HTML tags like <p>, <a>, <h1>, and even HTML comments <!-- --> to hide clues."),
    prompt: z.string().describe("The question or prompt for the user, asking them what they need to find or do."),
    solution: z.string().describe("The exact, case-sensitive string the user must enter to solve the puzzle. This should not be guessable from the prompt alone and must be discoverable within the 'content'."),
    points: z.number().describe("The number of points awarded for solving the puzzle, typically between 50 and 200."),
    aiPuzzleDescription: z.string().describe("A brief, clear description for another AI explaining what the user needs to do to solve this puzzle. Used for generating hints.")
});


export async function generateNewPuzzle(input: GenerateNewPuzzleInput): Promise<GenerateNewPuzzleOutput> {
  return generateNewPuzzleFlow(input);
}

const generateNewPuzzlePrompt = ai.definePrompt({
  name: 'generateNewPuzzlePrompt',
  input: {schema: GenerateNewPuzzleInputSchema},
  output: {schema: PuzzleSchema},
  prompt: `You are a creative cybersecurity expert and game designer. Your task is to generate a new, unique, and solvable puzzle for the "Bug Hunters" detective game.

The puzzle must fit the cyber-sleuth theme of the game. It should be challenging but fair. The solution MUST be discoverable within the puzzle's content. Do not create puzzles that require external knowledge or guessing.

Here are the requirements for the puzzle you create:
1.  **Originality**: The puzzle, especially the solution, must be unique. Avoid using any of the following existing solutions: {{{jsonStringify existingSolutions}}}
2.  **Context**: The last case the user played was about: "{{lastCaseDescription}}". You can use this for inspiration, but it's not a strict requirement.
3.  **Content is Key**: The answer must be findable within the 'content' field. For example, hide it in an HTML comment, a fake URL, a base64 encoded string, a log file, or a code snippet.
4.  **Clarity**: The 'prompt' should clearly state what the user needs to find, without giving away the answer.
5.  **Difficulty**: Assign points based on the perceived difficulty (50 for easy, 100 for medium, 150-200 for hard).

Please generate a new puzzle now.`,
});

const generateNewPuzzleFlow = ai.defineFlow(
  {
    name: 'generateNewPuzzleFlow',
    inputSchema: GenerateNewPuzzleInputSchema,
    outputSchema: PuzzleSchema,
  },
  async input => {
    const {output} = await generateNewPuzzlePrompt(input);
    return output!;
  }
);
