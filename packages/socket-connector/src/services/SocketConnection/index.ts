/*
 * Copyright (c) 2021. Something Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { Server as SIOServer, Socket } from 'socket.io';
import { logger } from '@something.technology/microservice-utilities';
import { Server as HTTPServer } from 'http';
import { DISCONNECT_EVENT_NAME, MESSAGE_EVENT_NAME } from '../../config/constants';
import { SocketMessage } from '../../types/SocketMessage';
import ClientManager from '../ClientManager';
import { handleSocketMessage } from '../handlers/socketMessageHandler';

const startListening = (socket: Socket): void => {
  socket.on(MESSAGE_EVENT_NAME, async (message: SocketMessage) => {
    handleSocketMessage(socket, message);
  });

  socket.on(DISCONNECT_EVENT_NAME, async (disconnectMessage: string) => {
    logger.info('Going to disconnect socket with id %s... data: %o', socket.id, disconnectMessage);
  });
};

class SocketConnection {
  private static instance: SocketConnection;

  private clientManager = ClientManager.getInstance();

  public static getInstance(): SocketConnection {
    if (!this.instance) {
      this.instance = new SocketConnection();
    }
    return this.instance;
  }

  public create(server: HTTPServer, path: string): void {
    const socketServer = new SIOServer(server, {
      path,
    });

    socketServer.on('connection', async socket => {
      logger.info('connected %s', socket.id);

      this.clientManager.addClient(socket);
      startListening(socket);
    });
  }
}

export default SocketConnection;
