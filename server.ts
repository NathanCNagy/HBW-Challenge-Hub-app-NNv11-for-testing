import express from 'express';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

async function startServer() {
  const app = express();

  // Environment determination:
  const isCloudRun = Boolean(process.env.K_SERVICE);
  const isCloudRunPreview = Boolean(process.env.K_SERVICE && process.env.K_SERVICE.startsWith('ais-pre'));
  const isExplicitDevScript = process.env.npm_lifecycle_event === 'dev' && !isCloudRunPreview;

  // Primary dist directory resolution
  const rootDir = process.cwd();
  const baseDir = import.meta.dirname || rootDir;
  const candidateDistDirs = [
    path.resolve(baseDir, 'dist'),
    path.resolve(rootDir, 'dist'),
    path.resolve(rootDir, 'applet', 'dist'),
    '/app/applet/dist'
  ];
  let distPath = candidateDistDirs.find(p => fs.existsSync(path.join(p, 'index.html'))) || path.resolve(baseDir, 'dist');
  let hasDistBundle = fs.existsSync(path.join(distPath, 'index.html'));

  const isProduction =
    isCloudRunPreview ||
    process.env.NODE_ENV === 'production' ||
    process.env.npm_lifecycle_event === 'start' ||
    (!isExplicitDevScript && hasDistBundle);

  const isDevMode = !isProduction;

  // Setup body parsers
  app.use(express.json());

  // Health check endpoints for Cloud Run container probes & load balancers
  app.get(['/healthz', '/health', '/_health', '/api/health', '/readyz', '/ping'], (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Initialize server-side Gemini client safely
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
      });
      console.log('Gemini API client initialized successfully in backend.');
    } catch (err) {
      console.error('Error initializing Gemini client:', err);
    }
  } else {
    console.warn('GEMINI_API_KEY environment variable is not defined or empty. Falling back to high-fidelity static algorithm.');
  }

  // API to generate personalized suggestions
  app.post('/api/generate-goal', async (req, res) => {
    const { age, gender, category, currentHabitLevel, timeCommitment, motivation, friction, livingArrangement, primaryConstraint } = req.body;

    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    if (!ai) {
      // If API key is not configured, send a log and succeed silently with fallback
      console.log('No Gemini API client key or initialization failed. Serving rich response from local database.');
      return res.json({ hasAI: false, message: "Served by Habits for a Better World scientific local algorithm." });
    }

    try {
      const systemInstruction = 
        `You are a senior behavioral scientist and change-management specialist representing "Habits for a Better World" (https://www.habitsforabetterworld.org/).
Your specialty is designing highly customized, extremely high-leverage micro-habits that fit seamlessly into people's actual daily routines while generating massive global and personal benefits.
Your writing style is highly authentic, professional, persuasive, warm, and intellectually sound. Avoid generic fluff or clinical medical jargon. Under no circumstances include self-praising words or marketing slop. Use precise behavioral cues.

You will recommend 1 primary TOP goal and 3 alternative options for the chosen area of action: ${category}.
Take the user profile and their living constraints into absolute focus:
- Age: ${age} years old
- Self-Reported Gender Identity: ${gender}
- Current Habit Level in this category: ${currentHabitLevel}
- Daily Time Commitment limit: ${timeCommitment}
- Core Motivation: ${motivation}
- Primary Friction Barrier: ${friction}
- Household/Living Arrangement: ${livingArrangement}
- Pressing Lifestyle Focus / Constraint: ${primaryConstraint}

Ensure the top recommended goal's action is tailored directly to their constraints:
- If they live with family/children, make the habit cooperative and child-friendly, or easy to do without interrupting family routines.
- If they live alone or with roommates, style it to suit that space privacy level.
- If they have a tight budget/cost constraint, make it free or show how it actively saves them money (like utility offsets or cheap food swaps).
- If they are extremely busy/low energy, ensure it takes less than 3-5 minutes with zero setup friction.
- If they are trying to keep in shape, design the action to contain or support physical fitness or body movement.

The action should be extremely simple and tangible (e.g. "Replacing a portion of your meat with high-protein legumes/beans", "A cold shower finish", "Placing the device in another room").
The impact stated MUST BE designed to specifically SELL this target individual (based on their exact age, gender, motivation, friction, living arrangement, and constraints) on committing to the 3-month challenge. Synthesize and quantify their personal, health, budget, social, or systemic impact over 3 months using scientifically grounded metrics.

Output your exact recommendation following the structured JSON schema.`;

      const promptMsg = `Create 1 Top recommended goal and 3 alternative option goals in the category "${category}" for a user profile:
Gender: ${gender}
Age: ${age}
Motivation: ${motivation}
Limit: ${timeCommitment}
Friction: ${friction}
Living Arrangement: ${livingArrangement}
Pressing Constraint: ${primaryConstraint}

The topGoal must have a unique ID like "ai-top", the alternatives should have IDs like "ai-alt-1", "ai-alt-2", "ai-alt-3".`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptMsg,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              topGoal: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  action: { type: Type.STRING, description: "A simple, highly specific, tangible habit action to do daily." },
                  impact: { type: Type.STRING, description: "The tailored, persuasive 3-month impact story designed specifically to sell/inspires a person of this age, gender, and motivation." },
                  category: { type: Type.STRING }
                },
                required: ["id", "title", "action", "impact", "category"]
              },
              alternatives: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    action: { type: Type.STRING, description: "Alternative action in same field." },
                    impact: { type: Type.STRING, description: "Persuasive 3-month impact statement fit for their routine." },
                    category: { type: Type.STRING }
                  },
                  required: ["id", "title", "action", "impact", "category"]
                },
                description: "Exactly 3 alternative action options."
              }
            },
            required: ["topGoal", "alternatives"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empty response from Gemini API');
      }

      const generatedData = JSON.parse(responseText.trim());
      return res.json({ hasAI: true, data: generatedData });

    } catch (error: any) {
      console.error('Failed to run server-side Gemini API generate-goal:', error);
      return res.json({ 
        hasAI: false, 
        error: error.message || 'Error occurred during AI generation.',
        message: "Falling back to scientific local templates due to temporary api gateway delay."
      });
    }
  });

  // Mount frontend: dev server middleware in development, static build in production
  if (isDevMode) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development server mounted as Express middleware.');
  } else {
    // If in production mode but dist/index.html is missing, build it on-demand
    if (!hasDistBundle) {
      try {
        console.log('Production assets not pre-built. Compiling via vite build now...');
        const { execSync } = await import('child_process');
        execSync('npx vite build', { stdio: 'inherit', cwd: baseDir });
        distPath = candidateDistDirs.find(p => fs.existsSync(path.join(p, 'index.html'))) || distPath;
        hasDistBundle = fs.existsSync(path.join(distPath, 'index.html'));
      } catch (err) {
        console.error('On-demand production asset compilation failed:', err);
      }
    }

    if (hasDistBundle) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
      console.log('Serving production static distribution from:', distPath);
    } else {
      // Graceful fallback to Vite middleware if static bundle cannot be prepared
      console.warn('Falling back to Vite middleware because dist bundle could not be found or built.');
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    }
  }

  // Start server listener(s):
  // Inside the AI Studio container, NGINX listens on NGINX_PORT (8080) and proxies requests to DEFAULT_APP_PORT (3000).
  // In standalone Cloud Run container runtime, Cloud Run sends traffic directly to PORT (defaults to 8080).
  // We attempt to bind both 3000 and PORT gracefully, handling EADDRINUSE so there are zero crashes or port conflicts.
  const appPort = parseInt(process.env.DEFAULT_APP_PORT || '3000', 10);
  const cloudRunPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

  function bindPort(port: number, label: string): Promise<http.Server | null> {
    return new Promise((resolve) => {
      const s = http.createServer(app);
      s.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} (${label}) is already in use (e.g. by reverse proxy), skipping.`);
        } else {
          console.warn(`Could not bind port ${port} (${label}):`, err.message);
        }
        resolve(null);
      });
      s.listen(port, '0.0.0.0', () => {
        console.log(`Habits for a Better World server listening on http://0.0.0.0:${port} (${label})`);
        resolve(s);
      });
    });
  }

  const activeServers: http.Server[] = [];

  // Bind appPort (3000)
  const serverApp = await bindPort(appPort, 'app-port');
  if (serverApp) activeServers.push(serverApp);

  // Bind cloudRunPort (8080) if different from appPort
  if (cloudRunPort !== appPort) {
    const serverIngress = await bindPort(cloudRunPort, 'ingress-port');
    if (serverIngress) activeServers.push(serverIngress);
  }

  if (activeServers.length === 0) {
    console.error('Fatal: Failed to bind any port.');
    process.exit(1);
  }

  // Graceful shutdown on Cloud Run container termination
  const handleShutdown = (signal: string) => {
    console.log(`${signal} signal received: closing HTTP server(s)`);
    for (const s of activeServers) {
      s.close();
    }
    process.exit(0);
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
