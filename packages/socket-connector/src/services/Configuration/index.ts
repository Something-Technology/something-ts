/*
 * Copyright (c) 2021. Something Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { KafkaController } from '@something.technology/microservice-utilities';
import { MessageMocks } from '../../types/socketConnector';

class Configuration {
  private static instance: Configuration;

  private messageMocks: MessageMocks | undefined;

  private kafkaController: KafkaController | undefined;

  public static getInstance(): Configuration {
    if (!this.instance) {
      this.instance = new Configuration();
    }
    return this.instance;
  }

  public setKafkaController(kafkaController: KafkaController): void {
    this.kafkaController = kafkaController;
  }

  public getKafkaController(): KafkaController {
    if (!this.kafkaController) {
      throw new Error('setKafkaController needs to be called first!');
    }

    return this.kafkaController;
  }

  public setMocks(messageMocks?: MessageMocks): void {
    this.messageMocks = messageMocks;
  }

  public getMocks(): MessageMocks | undefined {
    return this.messageMocks;
  }
}

export default Configuration;
