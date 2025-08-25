
const { onCall } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { config } = require("dotenv");
config();

const { genkit, z } = require("genkit");
const { googleAI } = require("@genkit-ai/googleai");
const { PuzzleSchema, GenerateNewPuzzleInputSchema } = require("./schemas");

initializeApp();

const ai = genkit({
  plugins: [googleAI()],
  model: "googleai/gemini-2.0-flash",
});

// Hint Generation Flow
const RequestPuzzleHintInputSchema = z.object({
  puzzleDescription: z.string().describe('The description of the current puzzle.'),
  userProgress: z.string().describe('The current progress of the user in the puzzle.'),
});

const RequestPuzzleHintOutputSchema = z.object({
  hint: z.string().describe('A helpful hint for the current puzzle.'),
});

const requestPuzzleHintPrompt = ai.definePrompt({
  name: 'requestPuzzleHintPrompt',
  input: {schema: RequestPuzzleHintInputSchema},
  output: {schema: RequestPuzzleHintOutputSchema},
  prompt: `You are an expert cyber sleuth, skilled at giving helpful hints without giving away the answer.

  Provide a hint to help the user with the following puzzle, taking into account their current progress. The hint should not directly give away the answer but guide the user towards a solution.

Puzzle Description: {{{puzzleDescription}}}
User Progress: {{{userProgress}}}

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
    return output;
  }
);


// Puzzle Generation Flow
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
    return output;
  }
);

// Firebase Callable Functions
exports.getHint = onCall(async (request) => {
    try {
        const result = await requestPuzzleHintFlow(request.data);
        if (!result.hint) {
            return { error: 'Could not generate a hint at this time.'}
        }
        return { hint: result.hint };
    } catch (e) {
        console.error(e);
        return { error: "Failed to generate a hint. The AI model might be unavailable." };
    }
});

exports.generateNewPuzzle = onCall(async (request) => {
    try {
        const puzzle = await generateNewPuzzleFlow(request.data);
        if (!puzzle) {
            return { error: 'Could not generate a new puzzle at this time.'}
        }
        return { puzzle };
    } catch (e) {
        console.error(e);
        return { error: "Failed to generate a new puzzle. The AI model might be unavailable." };
    }
});
