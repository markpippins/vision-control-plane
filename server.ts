import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '4208', 10);
  const VISION_SRV_URL = process.env.VISION_SRV_URL || 'http://localhost:8006';

  app.use(express.json());

  // Proxy API endpoints to the LOSM host (FastAPI on port 8006)
  app.use('/api', async (req, res, next) => {
    try {
      const targetUrl = `${VISION_SRV_URL}/api${req.url}`;
      const response = await fetch(targetUrl, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {})
        },
        body: ['POST', 'PATCH', 'PUT'].includes(req.method) ? JSON.stringify(req.body) : undefined
      });

      if (!response.ok) {
        return res.status(response.status).json({
          error: true,
          status: response.status,
          message: `vision-srv upstream returned ${response.status}`
        });
      }

      const data = await response.json();
      return res.json(data);
    } catch (err: any) {
      // In dev or mock fallback, pass to next so front end mock engine can handle smoothly
      return res.status(503).json({
        error: true,
        message: `Could not connect to vision-srv at ${VISION_SRV_URL}. Enable Mock Mode in UI.`,
        details: err.message
      });
    }
  });

  app.get('/health', async (req, res) => {
    try {
      const upstream = await fetch(`${VISION_SRV_URL}/health`);
      if (upstream.ok) {
        const data = await upstream.json();
        return res.json({ status: 'ok', upstream: data });
      }
    } catch {}
    res.json({ status: 'ok', mode: 'express-proxy-ready' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LOSM Vision Control Plane Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
