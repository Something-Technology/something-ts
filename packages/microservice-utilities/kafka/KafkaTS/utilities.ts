/*
 * Copyright (c) 2021. Something Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * we need to remove null values from our consumed objects (avroEntity) since typescript interfaces won't contain null values
 *
 * @param avroEntity
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const avroToTypescript = (avroEntity: any): any => {
  return JSON.parse(JSON.stringify(avroEntity), (_, value) => {
    if (value == null) {
      return undefined;
    }
    return value;
  });
};

type BufferedObject = {
  [key: string]: Buffer | string | undefined | BufferedObject;
};

/**
 * Data which is sent via Kafka will most likely be buffered.
 * Therefore we want to provide this utility function in order to handle Buffer to string convertion at one central place
 *
 * @param buffered
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stringifyBuffered = (buffered: BufferedObject): any => {
  return JSON.parse(JSON.stringify(buffered), (_, value) => {
    if (Buffer.isBuffer(value)) {
      return value.toString();
    }

    return value;
  });
};
