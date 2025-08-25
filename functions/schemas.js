
const { z } = require("genkit");

const GenerateNewPuzzleInputSchema = z.object({
  lastCaseDescription: z.string().describe("The description of the last case the user successfully completed. This provides context for the new puzzle."),
  existingSolutions: z.array(z.string()).describe("A list of all existing puzzle solutions to avoid creating duplicate puzzles.")
});

const PuzzleSchema = z.object({
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

module.exports = {
    GenerateNewPuzzleInputSchema,
    PuzzleSchema
}
