/*
 * Copyright (c) 2021. Something Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { io, Socket } from 'socket.io-client';
import { logger } from '@something.technology/microservice-utilities';
import { AnyAction, Dispatch } from 'redux';
import {
  DEFAULT_CRITERIA,
  DEFAULT_EVENT_NAME,
  DEFAULT_RESPONSE_ACTION_PREFIX,
  SIO_CONNECT_ERROR_EVENT,
  SIO_CONNECT_EVENT,
  SIO_DISCONNECT_EVENT,
  SIO_SERVER_DISCONNECT_REASON,
} from './constants';
import { Criteria } from './types';
import { onSocketConnect, onSocketConnectionError, onSocketDisconnect } from './actions';

const createSocketMessage = (criteriaPrefix: string, { type, payload }: AnyAction): AnyAction => {
  return {
    payload,
    type: type.replace(criteriaPrefix, ''),
  };
};

class SocketConnection {
  private ioClient: Socket | undefined;

  constructor(
    private url: string,
    private path: string,
    private eventName: string = DEFAULT_EVENT_NAME,
    private criteria: Criteria = DEFAULT_CRITERIA,
    private responseActionPrefix: string = DEFAULT_RESPONSE_ACTION_PREFIX
  ) {}

  public openConnection(dispatch: Dispatch): Socket {
    if (this.ioClient?.connected) {
      this.ioClient.disconnect();
    }

    const ioClient =
      this.ioClient ||
      io(this.url, {
        path: this.path,
        rejectUnauthorized: false,
      });

    ioClient.connect();
    this.ioClient = ioClient;

    // Listen on specified eventName to dispatch all actions from server to the application.
    this.ioClient.on(this.eventName, (data: AnyAction) => {
      dispatch({
        ...data,
        type: `${this.responseActionPrefix}${data.type}`,
      });
    });

    this.ioClient.on(SIO_CONNECT_EVENT, () => {
      if (this.ioClient?.connected) {
        dispatch(onSocketConnect(this.ioClient.id));
      }
    });

    this.ioClient.on(SIO_DISCONNECT_EVENT, (reason: string) => {
      if (reason === SIO_SERVER_DISCONNECT_REASON) {
        // We want to keep the connection alive so we need to reconnect to the server when the connection was not closed by the client
        this.ioClient?.connect();
      }
      // In all of the other cases reconnection should be done automatically by socket.io
      // Nevertheless we should forward the info to the application
      dispatch(
        onSocketDisconnect(reason, {
          serverUrl: this.url,
          serverPath: this.path,
          connected: this.ioClient?.connected,
        })
      );
    });

    this.ioClient.on(SIO_CONNECT_ERROR_EVENT, error => {
      dispatch(
        onSocketConnectionError(error, {
          serverUrl: this.url,
          serverPath: this.path,
          connected: this.ioClient?.connected,
        })
      );
    });

    return ioClient;
  }

  public disconnect(): void {
    if (this.ioClient?.connected) {
      this.ioClient.disconnect();
    }
  }

  /**
   *
   * @param action AnyAction from redux
   * @private
   *
   * Returns either the message which will be sent via socket.io or undefined if no message should be sent because criterias are not met.
   */
  private evaluate(action: AnyAction): AnyAction | undefined {
    if (!action || !action.type || !action.payload) {
      return undefined;
    }

    const { type } = action;

    let socketMessage: AnyAction | undefined;
    if (typeof this.criteria === 'function') {
      socketMessage = this.criteria(type, action);
    } else if (typeof this.criteria === 'string') {
      // check action type prefix
      if (type.indexOf(this.criteria) === 0) {
        socketMessage = createSocketMessage(this.criteria, action);
      }
    } else if (Array.isArray(this.criteria)) {
      // Array of types
      const matchedCriteria = this.criteria.find(item => type.indexOf(item) === 0);
      if (matchedCriteria) {
        socketMessage = createSocketMessage(matchedCriteria, action);
      }
    }
    return socketMessage;
  }

  public send<A extends AnyAction>(action: A, next: Dispatch<A>): A {
    const socketMessage = this.evaluate(action);

    if (socketMessage) {
      if (this.ioClient?.connected) {
        this.ioClient.emit(this.eventName, socketMessage);
      } else {
        logger.error('No socket connection established. Please create connection first.');
      }
    }

    return next(action);
  }
}

export default SocketConnection;
