import { createServer } from 'vite';

async function start() {
  try {
    const server = await createServer({
      configFile: './vite.config.js',
      server: {
        port: 5173,
        host: '0.0.0.0',
      },
    });
    await server.listen();
    server.printUrls();
    console.log('✅ Dev server is running on http://localhost:5173/');
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
