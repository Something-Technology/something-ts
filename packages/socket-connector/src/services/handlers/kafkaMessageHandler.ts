import { logger } from '@something.technology/microservice-utilities';
import type { ConsumeCallbackMessage } from '@something.technology/microservice-utilities';

// eslint-disable-next-line import/prefer-default-export
export const handleKafkaMessage = async ({
  topic,
  message,
  headers,
  timestamp,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
ConsumeCallbackMessage<any>): Promise<void> => {
  logger.info(
    `Received %s message from kafka with data: %o and headers: %o at %s`,
    topic,
    message,
    headers,
    timestamp
  );
  // TODO: send messages via socket
};
