/*
 * Copyright (c) 2021. Something Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { getType } from 'typesafe-actions';
import SocketConnection from './SocketConnection';
import { disconnectSocketConnection, openSocketConnection } from './actions';

const createSocketMiddleware = <A extends AnyAction, S>(
  socketConection: SocketConnection
): Middleware => {
  return ({ dispatch }: MiddlewareAPI<Dispatch, S>) => (next: Dispatch<A>) => (action: A): A => {
    if (action.type === getType(openSocketConnection)) {
      socketConection.openConnection(dispatch);
      return next(action);
    }

    if (action.type === getType(disconnectSocketConnection)) {
      socketConection.disconnect();
      return next(action);
    }

    return socketConection.send(action, next);
  };
};

export default createSocketMiddleware;
