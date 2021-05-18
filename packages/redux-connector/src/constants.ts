/*
 * Copyright (c) 2021. Something Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

export const DEFAULT_EVENT_NAME = 'message';
export const DEFAULT_CRITERIA = '@@socket/';
export const DEFAULT_RESPONSE_ACTION_PREFIX = '@@socket/';

// Socket.io
export const SIO_CONNECT_EVENT = 'connect';
export const SIO_DISCONNECT_EVENT = 'disconnect';
export const SIO_CONNECT_ERROR_EVENT = 'connect_error';
export const SIO_SERVER_DISCONNECT_REASON = 'io server disconnect';

// Incoming Redux Actions
export const OPEN_SOCKET_CONNECTION = '@@reduxConnector/OPEN_SOCKET_CONNECTION';
export const DISCONNECT_SOCKET_CONNECTION = '@@reduxConnector/DISCONNECT_SOCKET_CONNECTION';

// Outgoing Redux Actions
export const ON_SOCKET_CONNECT = '@@reduxConnector/ON_SOCKET_CONNECT';
export const ON_SOCKET_DISCONNECT = '@@reduxConnector/ON_SOCKET_DISCONNECT';
export const ON_SOCKET_CONNECTION_ERROR = '@@reduxConnector/ON_SOCKET_CONNECTION_ERROR';
