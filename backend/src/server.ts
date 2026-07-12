import http from 'http';

import { env } from '@config/env';
import { initializeSocket } from '@config/socket';
import { seedAdmin } from './seed/admin.seed';

import { app } from './app';

const server = http.createServer(app);
const io = initializeSocket(server);

app.set('io', io);

const startServer = async () => {
  await seedAdmin();
  server.listen(env.PORT, () => {
    console.log(`AssetFlow backend is running on port ${env.PORT}`);
  });
};

startServer();
