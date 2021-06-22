/*
 * Copyright (c) 2021. Something Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import { Socket } from 'socket.io';
import { logger } from '@something.technology/microservice-utilities';
import type { SocketClientsMap } from './types';
import { SocketClient } from './types';

class ClientManager {
  private static instance: ClientManager;

  private connectedClients: SocketClientsMap = {};

  public static getInstance(): ClientManager {
    if (!this.instance) {
      this.instance = new ClientManager();
    }
    return this.instance;
  }

  public addClient(socket: Socket): void {
    const { id } = socket;
    if (!this.connectedClients[id]) {
      logger.debug('Added client %s', id);
      this.connectedClients[id] = { id, socket };
    }
  }

  public getClient(id: string): SocketClient | undefined {
    return this.connectedClients[id];
  }

  public deleteClient(id: string): void {
    if (this.connectedClients[id]) {
      logger.debug('Removed client %s', id);
      delete this.connectedClients[id];
    }
  }
}

export default ClientManager;
