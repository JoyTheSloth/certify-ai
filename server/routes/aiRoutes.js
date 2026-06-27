import express from 'express';
import { generateText } from '../controllers/aiController.js';

const router = express.Router();

// Route for Gemini AI text generation
router.post('/generate', generateText);

export default router;
