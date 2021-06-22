/*
 * Copyright (c) 2021. Something Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { Response, Request } from 'express';
import { isAuthorized } from './utils';
import HTTPStatusCode from './types/HTTPStatusCode';
import RequestHeaders from './types/RequestHeaders';

/**
 * Utility function to do healthchecks for typescript based services with ExpressJS
 *
 * Usage:
 *
 * const express = require('express')
 *
 * const app = express()
 *
 * const PORT = 3000
 *
 * app.get('/', (req, res) => {
 *     res.send('Hello World!')
 * })
 *
 * app.get(path, healthcheck);
 *
 * app.listen(PORT, () => {
 *     console.log(`Example app listening at http://localhost:${PORT}`)
 * })
 *
 * @param request ExpressJS Request object
 * @param response ExpressJS Response object
 */
export const healthcheck = (request: Request, response: Response): void => {
  const header = request.headers[RequestHeaders.X_FORWARDED_FOR] as string;
  // IP address which is allowed to perform the healthcheck request
  const allowedHealthcheckIP = process.env.HEALTHCHECK_IP;

  const body = isAuthorized(allowedHealthcheckIP, header)
    ? { status: HTTPStatusCode.OK }
    : { status: HTTPStatusCode.FORBIDDEN };

  response.json(JSON.stringify(body));
};

export default { healthcheck };
