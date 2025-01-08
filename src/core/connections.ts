import { StoreConnection, State } from './types';

export function connectStores<S extends State = State, T extends State = State>(
  connections: StoreConnection<S, T>[]
) {
  const unsubscribeFunctions: (() => void)[] = [];

  connections.forEach(({ source, target, when, then, immediate }) => {
    const handler = () => {
      if (when(source)) {
        then(target);
      }
    };

    if (immediate) {
      handler();
    }

    const unsubscribe = source.subscribe(handler);
    unsubscribeFunctions.push(unsubscribe);
  });

  return () => {
    unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
  };
}

export function connectStore<S extends State = State, T extends State = State>(
  connection: StoreConnection<S, T>
) {
  return connectStores([connection]);
}