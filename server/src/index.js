import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { prisma } from './db.js';

const config = loadConfig();
const server = createApp(config).listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});

async function shutdown() {
  server.close();
  await prisma.$disconnect();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
