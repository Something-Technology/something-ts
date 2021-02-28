/*
 * Copyright (c) 2021. Something Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { SchemaRegistry, COMPATIBILITY } from '@kafkajs/confluent-schema-registry';
import { schema as avroSchema } from 'avsc';
import { logger } from '../../logger';
import { SchemaConfig } from '../types';
import { RegisteredTopicSchema } from './types';
import RecordType = avroSchema.RecordType;

const DEFAULT_REGISTRY_HOST = 'http://localhost:8081';

class TopicRegistry {
  private registry: SchemaRegistry;

  private registeredSchemas = new Map<string, RegisteredTopicSchema>();

  private isInitialized = false;

  constructor(
    host = DEFAULT_REGISTRY_HOST,
    private compatibility: COMPATIBILITY = COMPATIBILITY.FULL
  ) {
    this.registry = new SchemaRegistry({
      host,
      retry: {
        maxRetryTimeInSecs: 5,
        initialRetryTimeInSecs: 0.1,
        factor: 0.2, // randomization factor
        multiplier: 2, // exponential factor
        retries: 3, // max retries
      },
    });
  }

  private async initRegisteredSchema({ topicName, schema }: SchemaConfig) {
    try {
      const registryId = await this.getSchemaId(schema);

      if (!registryId) {
        logger.error('No schema found for topic %s with schema: %o', topicName, schema);
        return;
      }

      this.registeredSchemas.set(topicName, { registryId, schema, topicName });
    } catch (e) {
      logger.error(e);
    }
  }

  public async init(schemaConfigs: SchemaConfig[]): Promise<void> {
    const promises: Promise<void>[] = [];
    schemaConfigs.forEach(schemaConfig => {
      promises.push(this.initRegisteredSchema(schemaConfig));
    });
    await Promise.all(promises);

    this.isInitialized = true;
  }

  // TODO: put this to seperate instacne to split registration fro reading?
  async registerSchema(schema: RecordType): Promise<number> {
    // There is an issue with schema typings: https://github.com/kafkajs/confluent-schema-registry/issues/35
    // => use any type until this issue is fixed for typescript implementations
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const registeredSchema = await this.registry.register(schema as any, {
      compatibility: this.compatibility,
    });

    const { id } = registeredSchema;
    logger.info(`Registered schema with ID: ${id}`);

    return id;
  }

  async getSchemaId(schema: RecordType): Promise<number | undefined> {
    try {
      const subject = `${schema.namespace}.${schema.name}`;
      // There is an issue with schema typings: https://github.com/kafkajs/confluent-schema-registry/issues/35
      // => use any type until this issue is fixed for typescript implementations
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const id = await this.registry.getRegistryIdBySchema(subject, schema as any);
      logger.info(`Got schema with ID: ${id}`);
      return id;
      // this.registry.
    } catch (e) {
      logger.error(e);
      return undefined;
    }
  }

  // need to return any because registry method returns any object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async decodeMessageValue(value: Buffer): Promise<any> {
    return this.registry.decode(value);
  }

  async encodeMessageValue<P>(topicName: string, payload: P): Promise<Buffer | undefined> {
    if (!this.isInitialized) {
      logger.error('Topics are not initialized yet. Please run init() first!');
      return undefined;
    }

    const topic = this.registeredSchemas.get(topicName);
    if (!topic) {
      logger.error('No topic %s found in registry');
      return undefined;
    }

    return this.registry.encode(topic.registryId, payload);
  }
}

export default TopicRegistry;
