# Redux Connector

Redux connector takes redux actions and transforms it to socket.io messages when criterias (can be passed in SocketConnection constructor) are met.
Default is to redirect messages where type starts with `@@socket/`.

This library is inspired by https://github.com/itaylor/redux-socket.io but is adding also strong TypeScript support.

## Setup

Example Setup with Redux Sagas:

_configureStore.ts_
```typescript
const socketConnection = new SocketConnection('http://localhost:3000', '/socket');

const configureStore = (): Store<ApplicationState> => {
  const sagaMiddleware = createSagaMiddleware();

  const middlewareToApply: Middleware[] = [
    sagaMiddleware,
    createSocketMiddleware(socketConnection),
  ];

  const store = createStore(rootReducer, applyMiddleware(...middlewareToApply));
  sagaMiddleware.run(rootSaga);
  return store;
};

export default configureStore;
```

_store/socketConnection/sagas.ts_
```typescript
import { put, StrictEffect } from 'redux-saga/effects';
import { actions } from '@something.technology/redux-connector';

export function* initConnection(): Generator<StrictEffect, void, undefined> {
  yield put(actions.openSocketConnection());
}

```

_rootSaga.ts_
```typescript
import { fork, all, StrictEffect } from 'redux-saga/effects';
import * as socketConnectionSagas from './socketConnection/sagas';

export default function* rootSaga(): Generator<StrictEffect, void, undefined> {
  yield all([
    fork(socketConnectionSagas.initConnection),
    // Add additional sagas here
  ]);
}
```
