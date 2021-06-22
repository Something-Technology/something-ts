/*
 * Copyright (c) 2021. Something Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import KafkaTS from './KafkaTS';
import { KafkaMessageValue, SubscriptionCallback, Headers, KafkaControllerConfig } from './types';
import { checkAllowedToConsume, INCOMING_DIRECTIONS } from './utils';

class KafkaController {
  private kafkaInstances = new Map<string, KafkaTS>();

  constructor(private config: KafkaControllerConfig) {
    config.kafkaConfigs.forEach(({ id, messages }) => {
      this.kafkaInstances.set(
        id,
        new KafkaTS({ clientId: `${config.clientId}_${id}`, schemaConfigs: messages })
      );
    });
  }

  public async init(): Promise<void[]> {
    const promises: Promise<void>[] = [];
    this.kafkaInstances.forEach(kafkaInstance => {
      promises.push(kafkaInstance.init());
    });

    return Promise.all(promises);
  }

  private findKafkaInstanceForTopic(topic: string): KafkaTS | undefined {
    let kafka: KafkaTS | undefined;

    for (let i = 0; i < this.config.kafkaConfigs.length; i += 1) {
      const { messages, id } = this.config.kafkaConfigs[i];
      const allowed = checkAllowedToConsume(topic, messages);
      if (allowed) {
        kafka = this.kafkaInstances.get(id);
        break;
      }
    }
    return kafka;
  }

  public async addTopicSubscription<M>(
    topicName: string,
    callback: SubscriptionCallback<M>
  ): Promise<void> {
    const kafka = this.findKafkaInstanceForTopic(topicName);

    if (kafka) {
      return kafka.subscribeTopic(topicName, callback);
    }
    throw new Error(`No applicable KafkaInstance found to consume ${topicName}`);
  }

  public async subscribeToAll(callback: SubscriptionCallback): Promise<void[]> {
    const promises: Promise<void>[] = [];

    this.config.kafkaConfigs.forEach(({ messages }) => {
      messages.forEach(({ topicName, direction }) => {
        if (INCOMING_DIRECTIONS.includes(direction)) {
          promises.push(this.addTopicSubscription(topicName, callback));
        }
      });
    });

    return Promise.all(promises);
  }

  public async run(): Promise<void[]> {
    const promises: Promise<void>[] = [];
    this.kafkaInstances.forEach(kafkaInstance => {
      promises.push(kafkaInstance.runConsumer());
    });

    return Promise.all(promises);
  }

  public async produce<M = KafkaMessageValue>(
    topicName: string,
    value: M,
    headers?: Headers
    // onError?: OnProducerError<M>
  ): Promise<void> {
    const kafka = this.findKafkaInstanceForTopic(topicName);

    if (kafka) {
      return kafka.produceMessage(topicName, value, headers);
    }
    throw new Error(`No applicable KafkaInstance found to produce ${topicName}`);
  }
}

export default KafkaController;
