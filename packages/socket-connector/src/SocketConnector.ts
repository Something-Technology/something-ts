/*
 * Copyright (c) 2021. Something Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import express, { Express } from 'express';
import { logger, healthcheck } from '@something.technology/microservice-utilities';
import { createServer } from 'http';
import { HEALTHCHECK_ROUTE, PORT } from './config/server';
import SocketConnection from './services/SocketConnection';
import { SocketConnectorConfig } from './types/socketConnector';
import Configuration from './services/Configuration';

class SocketConnector {
  private socketServerPath: string;

  private serviceId: string;

  constructor({
    socketServerPath = '/socket',
    serviceId,
    responseMessageMocks,
  }: SocketConnectorConfig) {
    this.serviceId = serviceId;
    this.socketServerPath = socketServerPath;

    Configuration.getInstance().setMocks(responseMessageMocks);
  }

  public async start(): Promise<void> {
    logger.debug('Going to start %s ...', this.serviceId);
    const app: Express = express();
    const server = createServer(app);

    SocketConnection.getInstance().create(server, this.socketServerPath);

    app.get(HEALTHCHECK_ROUTE, healthcheck);

    server.listen(PORT, () => {
      logger.info(`app listening at http://localhost:${PORT}`);
    });
  }
}

export default SocketConnector;
