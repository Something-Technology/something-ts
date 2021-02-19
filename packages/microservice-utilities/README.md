# @something.technology/microservice-utilities

Utilities, e.g. when working with express microservices.

## Express

**Environment variables:**

Name | default value | description
--- | --- | ---
PORT | 3000 | Port on which the express server will run
HEALTHCHECK_IP | - | IP address which is allowed to perform the healthcheck

### Healthcheck

We provide a helper function to make it easy to add a healthcheck to your express application.
You need to provide the `HEALTHCHECK_IP` env variable. If the env variable is not set, every client is allowed to perform the healthcheck.

Usage:

```ts
import express from 'express'
import { logger, healthcheck } from '@something.technology/microservice-utilities';

const PORT = process.env.PORT || 3000
const HEALTHCHECK_ROUTE = process.env.HEALTHCHECK_ROUTE || '/health'

const run = async (): Promise<void> => {
  try {
    const app = express()

    app.get('/', (_, res) => {
      res.send('Hello Something!')
    })

    app.get(HEALTHCHECK_ROUTE, healthcheck);

    app.listen(PORT, () => {
      logger.info(`Example app listening at http://localhost:${PORT}`)
    })

  } catch (e) {
    logger.error(e);
  }
};

run().then(() => {});
```

When running the core init script `npx @something.technology/core init .` this boilerplate code will be created automatically for you.