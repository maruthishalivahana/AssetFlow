import type { Server as HttpServer } from 'http';

import { Server, type ServerOptions } from 'socket.io';

import { env } from './env';

const socketOptions: Partial<ServerOptions> = {
  cors: {
    origin: env.CLIENT_URL,
    credentials: true,
  },
};

export const initializeSocket = (httpServer: HttpServer): Server => {
  return new Server(httpServer, socketOptions);
};
