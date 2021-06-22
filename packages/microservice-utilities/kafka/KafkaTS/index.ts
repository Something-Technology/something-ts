/*
 * Copyright (c) 2021. Something Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { CompressionTypes, Consumer, Producer } from 'kafkajs';
import { logger } from '../../logger';
import { Headers, KafkaTSConfig, SchemaConfig, SubscriptionCallback } from '../types';
import { avroToTypescript, stringifyBuffered } from './utilities';
import KafkaProvider from '../KafkaProvider';
import { checkAllowedToConsume, checkAllowedToProduce } from '../utils';

class KafkaTS extends KafkaProvider {
  private schemaConfigs: SchemaConfig[];

  private consumer: Consumer;

  private producer: Producer;

  private topicSubscriptions = new Map<string, SubscriptionCallback[]>();

  constructor({ schemaConfigs, clientId }: KafkaTSConfig) {
    super({ clientId });

    this.schemaConfigs = schemaConfigs;

    this.consumer = this.kafka.consumer({
      groupId: clientId, // for now we can set the groupId to the clientId since we have just one partition
      allowAutoTopicCreation: false, // topics should be created by TopicUpdater only
      sessionTimeout: 15000, // we should detect failures within 15 seconds
      maxWaitTimeInMs: 150,
      heartbeatInterval: 2000,
    });

    this.producer = this.kafka.producer();
  }

  public async init(): Promise<void> {
    await this.topicRegistry.init(this.schemaConfigs);

    await this.connect();
  }

  async connect(): Promise<void> {
    await this.consumer.connect();
    await this.producer.connect();
  }

  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
    await this.producer.disconnect();
  }

  async subscribeTopic(name: string, callback: SubscriptionCallback): Promise<void> {
    logger.info('Subscribe to %s', name);
    checkAllowedToConsume(name, this.schemaConfigs);

    await this.consumer.subscribe({ topic: name, fromBeginning: false });

    const subscriptions = this.topicSubscriptions.get(name) || [];
    subscriptions.push(callback);
    this.topicSubscriptions.set(name, subscriptions);
  }

  async runConsumer(): Promise<void> {
    await this.consumer.run({
      /**
       * We recommend it 0.1s because :
       *
       * Consider that, by default, automatic commits occur every five seconds.
       * Suppose that we are three seconds after the most recent commit and a rebalance is triggered.
       * After the rebalancing, all consumers will start consuming from the last offset committed.
       * In this case, the offset is three seconds old, so all the events that arrived in those three seconds will be processed twice.
       * It is possible to configure the commit interval to commit more frequently and reduce the window in which records will be duplicated, but it is impossible to completely eliminate them.
       */
      autoCommitInterval: 100,
      eachMessage: async ({ topic, partition, message }) => {
        try {
          logger.info('topic %s, partition %d', topic, partition);

          const subscriptions = this.topicSubscriptions.get(topic);
          if (!subscriptions?.length) {
            // eachMessage should be just called when a subsciption exists
            logger.error('No topic subscription found for %s', topic);
            return;
          }

          if (!message.value) {
            logger.error('Invalid message consumed: value needs to be set!');
            return;
          }

          const decodedValue = await this.topicRegistry.decodeMessageValue(message.value);
          const tsValue = avroToTypescript(decodedValue);

          // trigger callbacks for all subscribers
          const subscriptionPromises: Promise<void>[] = [];
          subscriptions.forEach(callback => {
            subscriptionPromises.push(
              callback({
                topic,
                message: tsValue,
                headers: message.headers ? stringifyBuffered(message.headers) : undefined,
                timestamp: message.timestamp,
              })
            );
          });
          await Promise.all(subscriptionPromises);
        } catch (e) {
          logger.error(e);
        }
      },
    });
  }

  async produceMessage<M>(topic: string, value: M, headers?: Headers): Promise<void> {
    try {
      checkAllowedToProduce(topic, this.schemaConfigs);

      // This will throw an error when value does not match the registerd schema
      // Additional parameters which are not in schema will be lost due to the encoding
      const encodedMessageValue = await this.topicRegistry.encodeMessageValue(topic, value);

      if (encodedMessageValue) {
        await this.producer.send({
          topic,
          compression: CompressionTypes.GZIP,
          messages: [{ value: encodedMessageValue, headers }],
        });

        logger.debug('Produced %s message.', topic);
      }
    } catch (e) {
      logger.error('Error on produce %s: %o', topic, e);
    }
  }
}

export default KafkaTS;
