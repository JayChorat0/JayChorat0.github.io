import { config } from 'dotenv';
config();

// This file is used for local development of Genkit flows.
// It imports the flows so they can be discovered by the Genkit CLI.
import './flows/generate-puzzle';
import './flows/generate-hint';
