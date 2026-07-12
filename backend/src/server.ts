import http from 'http';

import { env } from '@config/env';
import { initializeSocket } from '@config/socket';

import { app } from './app';

const server = http.createServer(app);
const io = initializeSocket(server);

app.set('io', io);

server.listen(env.PORT, () => {
  console.log(`AssetFlow backend is running on port ${env.PORT}`);
});