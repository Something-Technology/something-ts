/*
 * Copyright (c) 2021. Something Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import { Kafka, logLevel, KafkaConfig } from 'kafkajs';
import { COMPATIBILITY } from '@kafkajs/confluent-schema-registry';
import tls from 'tls';
import { readFileSync } from 'fs';
import TopicRegistry from '../TopicRegistry';

type KafkaProviderConfig = {
  clientId: string;
};

enum EnvironmentVariable {
  SCHEMA_COMPATIBILITY = 'SCHEMA_COMPATIBILITY',
  SCHEMA_REGISTRY_HOST = 'SCHEMA_REGISTRY_HOST',
  KAFKA_BROKERS = 'KAFKA_BROKERS',
  KAFKA_SSL_CA = 'KAFKA_SSL_CA',
  KAFKA_SSL_KEY = 'KAFKA_SSL_KEY',
  KAFKA_SSL_CERT = 'KAFKA_SSL_CERT',
}

enum Encoding {
  UTF8 = 'utf-8',
}

const getEnvVariableForClient = <T extends string = string>(
  clientId: string,
  envVariable: EnvironmentVariable
): T | undefined => {
  const value = process.env[`${clientId}_${envVariable}`] || process.env[`${envVariable}`];
  return typeof value !== 'undefined' ? (value as T) : undefined;
};

const DEFAULT_KAFKA_BROKERS = `${process.env.IP || 'localhost'}:9092`;

class KafkaProvider {
  protected kafka: Kafka;

  private config: KafkaConfig;

  protected topicRegistry: TopicRegistry;

  protected constructor({ clientId }: KafkaProviderConfig) {
    // Config from ENV
    const compatibility = getEnvVariableForClient<COMPATIBILITY>(
      clientId,
      EnvironmentVariable.SCHEMA_COMPATIBILITY
    );
    const registryHost = getEnvVariableForClient(
      clientId,
      EnvironmentVariable.SCHEMA_REGISTRY_HOST
    );
    const kafkaBrokers: string =
      getEnvVariableForClient(clientId, EnvironmentVariable.KAFKA_BROKERS) || DEFAULT_KAFKA_BROKERS;
    const brokers = kafkaBrokers.split(';');

    const sslCa = getEnvVariableForClient(clientId, EnvironmentVariable.KAFKA_SSL_CA);
    const sslKey = getEnvVariableForClient(clientId, EnvironmentVariable.KAFKA_SSL_KEY);
    const sslCert = getEnvVariableForClient(clientId, EnvironmentVariable.KAFKA_SSL_CERT);
    const ssl: tls.ConnectionOptions | undefined =
      sslCa && sslKey && sslCert
        ? {
            rejectUnauthorized: false,
            ca: [readFileSync(sslCa, Encoding.UTF8)],
            key: readFileSync(sslKey, Encoding.UTF8),
            cert: readFileSync(sslCert, Encoding.UTF8),
          }
        : undefined;

    this.config = {
      clientId,
      brokers,
      ssl,
      requestTimeout: 30000, // 30 seconds
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
      logLevel: logLevel.ERROR,
    };
    this.kafka = new Kafka(this.config);

    this.topicRegistry = new TopicRegistry(registryHost, compatibility);
  }

  protected getNumberOfBrokers(): number {
    return this.config.brokers.length;
  }
}

export default KafkaProvider;
