/*
 * Copyright (c) 2021. Something Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import { getPasswordStrength, JWT_TOKEN, validateEmail, validateToken } from './authorization';

import type { MessageMocks } from '../../types/socketConnector';
import {
  ForgotPasswordResponse,
  LoginResponse,
  LogoutResponse,
  RegistrationResponse,
  UpdatePasswordResponse,
} from './types';

export const loginMock: MessageMocks = {
  RegistrationRequest: {
    createOutgoingMessage: ({ payload }): RegistrationResponse => {
      const { password } = payload

      if (getPasswordStrength(password) < 5) {
        return {
          type: 'RegistrationResponse',
          payload: {
            error: {
              status: 42001,
              message: 'Password does not match our criteria.',
            }
          }
        }
      }
      return {
        type: 'RegistrationResponse',
        payload: {
          data: {
            success: true,
          },
        }
      }
    },
    delay: 1000,
  },
  LoginRequest: {
    createOutgoingMessage: ({ payload }): LoginResponse => {
      const { email, password } = payload;
      const isValidMail = validateEmail(email)
      const isValidPassword = getPasswordStrength(password) < 5

      if (!isValidMail || !isValidPassword) {
        return {
          type: 'LoginResponse',
          payload: {
            error: {
              status: 401,
              message: 'Unauthorized!',
            },
          },
        };
      }

      return {
        type: 'LoginResponse',
        payload: {
          data: {
            token: JWT_TOKEN
          },
        },
      };
    },
    delay: 1000,
  },
  SilentLoginRequest: {
    createOutgoingMessage: ({ payload }): LoginResponse => {
      const { token } = payload;
      if (validateToken(token)) {
        return {
          type: "LoginResponse",
          payload: {
            error: {
              status: 401,
              message: 'Unauthorized!',
            }
          }
        }
      }

      return ({
        type: 'LoginResponse',
        payload: {
          data: {
            token: JWT_TOKEN
          }
        }
      })
    },
    delay: 300,
  },
  LogoutRequest: {
    createOutgoingMessage: (): LogoutResponse => ({
      type: 'LogoutResponse',
      payload: {
        data: { success: true }
      }
    })
  },
  ForgotPasswordRequest: {
    createOutgoingMessage: ({ payload }): ForgotPasswordResponse => {
      const { email } = payload;

      if (email.includes('@test.de')) {
        return {
          type: 'ForgotPasswordResponse',
          payload: {
            error: {
              status: 404,
              message: 'No user found!'
            }
          }
        }
      }
      return {
        type: 'ForgotPasswordResponse',
        payload: {
          data: {
            message: 'Confirmation link sent to the inbox.'
          }
        }
      }
    }
  },
  UpdatePasswordRequest: {
    createOutgoingMessage: ({ payload }): UpdatePasswordResponse => {
      const { password } = payload

      if (getPasswordStrength(password) < 5) {
        return {
          type: 'UpdatePasswordResponse',
          payload: {
            error: {
              status: 42001,
              message: 'Password does not match our criteria.',
            }
          }
        }
      }

      return {
        type: 'UpdatePasswordResponse',
        payload: {
          data: {
            message: "Password updated successfully"
          }
        }
      }
    },
    delay: 300,
  }
};

export const defaultMocks: MessageMocks = {
  ...loginMock,
};
