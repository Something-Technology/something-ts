/*
 * Copyright (c) 2021. Something Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import jwtDecode from 'jwt-decode';

import { TokenData } from './types';

export const getPasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.match(/[a-z]+/)) {
    strength += 1;
  }
  if (password.match(/[A-Z]+/)) {
    strength += 1;
  }
  if (password.match(/[0-9]+/)) {
    strength += 1;
  }
  if (password.match(/[$@#&!]+/)) {
    strength += 1;
  }

  if (password.length >= 8) {
    strength += 1;
  }
  return strength;
};

export const validateEmail = (email: string): boolean => {
  // eslint-disable-next-line max-len
  const re =
    // eslint-disable-next-line max-len
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const validateToken = (token: string): boolean => {
  const { exp } = jwtDecode<TokenData>(token);
  return exp - Date.now() / 1000 <= 0;
};

export const JWT_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJRdWFudGVjdHVtIiwiaWF0IjoxNjE5NTIyNTExLCJleHAiOjE2NTEwNTg1MTEsImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6InRlc3RAaWtvb2tvLmlvIiwiZW1haWwiOiJ0ZXN0QGlrb29rby5pbyIsInJvbGUiOlsiQmFzaWNVc2VyIiwiUHJlbWl1bVVzZXIiXSwiZW1haWxfdmVyaWZpZWQiOiJ0cnVlIn0.8upGIyhvbA1UgQyTXxU1H49k0ttxeaeUswKlfECe2dE';
export const UNVERIFIED_MAIL_JWT_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJRdWFudGVjdHVtIiwiaWF0IjoxNjE5NTIyNTExLCJleHAiOjE2NTEwNTg1MTEsImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6InRlc3RAaWtvb2tvLmlvIiwiZW1haWwiOiJ0ZXN0QGlrb29rby5pbyIsInJvbGUiOlsiQmFzaWNVc2VyIiwiUHJlbWl1bVVzZXIiXSwiZW1haWxfdmVyaWZpZWQiOiJmYWxzZSJ9.BtVrO-e2mgU0xjOGQ7uiw07Hogd4oCg3z1kOlLpwcC8';
