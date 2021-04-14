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
import type { SocketMessage } from '../../types/SocketMessage';
import Configuration from '../Configuration';
import ClientEmitter from '../ClientEmitter';

const sendMocked = (socket: Socket, message: SocketMessage): boolean => {
  const mocks = Configuration.getInstance().getMocks();
  if (mocks && mocks[message.type]) {
    const { createOutgoingMessage } = mocks[message.type];
    const outgoingMsg = createOutgoingMessage(message);
    if (outgoingMsg) {
      setTimeout(() => {
        ClientEmitter.emit(socket, outgoingMsg);
      }, 100);
      return true;
    }
  }
  return false;
};

// eslint-disable-next-line import/prefer-default-export
export const handleSocketMessage = (socket: Socket, incomingMessage: SocketMessage): void => {
  logger.info('Received message from socket %s with data: %o', socket.id, incomingMessage);

  if (!sendMocked(socket, incomingMessage)) {
    // TODO: add real implementation
  }
};
