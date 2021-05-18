/*
 * Copyright (c) 2021. Something Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { createAction } from 'typesafe-actions';
import {
  DISCONNECT_SOCKET_CONNECTION,
  ON_SOCKET_CONNECT,
  ON_SOCKET_CONNECTION_ERROR,
  ON_SOCKET_DISCONNECT,
  OPEN_SOCKET_CONNECTION,
} from './constants';
import { OnSocketDisconnectPayload, AdditionalInfo, OnSocketConnectionErrorPayload } from './types';

export const openSocketConnection = createAction(
  OPEN_SOCKET_CONNECTION,
  () => undefined
)<undefined>();

export const disconnectSocketConnection = createAction(
  DISCONNECT_SOCKET_CONNECTION,
  () => undefined
)<undefined>();

export const onSocketConnect = createAction(ON_SOCKET_CONNECT, (socketId: string) => ({
  socketId,
}))<{
  socketId: string;
}>();

export const onSocketDisconnect = createAction(
  ON_SOCKET_DISCONNECT,
  (error: string, additionalInfo: AdditionalInfo) => ({
    error,
    additionalInfo,
  })
)<OnSocketDisconnectPayload>();

export const onSocketConnectionError = createAction(
  ON_SOCKET_CONNECTION_ERROR,
  (error: Error, additionalInfo: AdditionalInfo) => ({ error, additionalInfo })
)<OnSocketConnectionErrorPayload>();
