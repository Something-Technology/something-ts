import { MessageDirection, SchemaConfig } from './types';

export const INCOMING_DIRECTIONS = [MessageDirection.BIDIRECTIONAL, MessageDirection.INCOMING];
const OUTGOING_DIRECTIONS = [MessageDirection.BIDIRECTIONAL, MessageDirection.OUTGOING];

export const checkAllowedToConsume = (
  topic: string,
  schemaConfigs: SchemaConfig[],
  shouldThrowError = true
): boolean => {
  if (
    !schemaConfigs.find(schemaConfig => {
      return (
        schemaConfig.topicName === topic && INCOMING_DIRECTIONS.includes(schemaConfig.direction)
      );
    })
  ) {
    if (shouldThrowError) {
      throw new Error(
        `According to the configuration it is not allowed to consume ${topic} messages`
      );
    }
    return false;
  }

  return true;
};

export const checkAllowedToProduce = (
  topic: string,
  schemaConfigs: SchemaConfig[],
  shouldThrowError = true
): boolean => {
  if (
    !schemaConfigs.find(({ topicName, direction }) => {
      return topicName === topic && OUTGOING_DIRECTIONS.includes(direction);
    })
  ) {
    if (shouldThrowError) {
      throw new Error(
        `According to the configuration it is not allowed to produce ${topic} messages`
      );
    }

    return false;
  }

  return true;
};
