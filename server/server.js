import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import aiRouter from './routes/aiRoutes.js';
import certificateRouter from './routes/certificateRoutes.js';
import { initDb } from './utils/storage.js';

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables — resolve from project root regardless of CWD
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize JSON database
initDb();

// Middlewares
app.use(cors());
// Set limits high enough to handle Base64 image payloads for custom logo and signatures
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes
app.use('/api/ai', aiRouter);
app.use('/api', certificateRouter);

// Serve Client assets in production
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuildPath));

// Fallback to React index.html for Router URLs
app.get('*', (req, res) => {
  // If request starts with /api, don't return index.html, return 404
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
    if (err) {
      // In development or if client isn't built yet, return a simple status message
      res.status(200).send('CertifyAI Backend is Running. Build the client app using "npm run build" to serve the frontend.');
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 CertifyAI Full-Stack Server Running On Port ${PORT}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`🤖 Google Gemini 2.5 Flash endpoint active at /api/ai/generate`);
  console.log(`==================================================`);
});
