/*
 * Copyright (c) 2021. Something Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

export const isAuthorized = (authorizedIP?: string, forwardedForHeader?: string): boolean => {
  if (!forwardedForHeader || !authorizedIP) {
    return true;
  }

  const forwardedIPs = forwardedForHeader.split(',').map(ip => ip.trim());
  if (forwardedIPs.length > 0) {
    // Last IP appears as the remote address of the request: https://en.wikipedia.org/wiki/X-Forwarded-For
    // It should be checked if this IP is allowed to do the request
    return forwardedIPs[forwardedIPs.length - 1] === authorizedIP;
  }

  return false;
};

export default { isAuthorized };
