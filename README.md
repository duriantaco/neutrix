# 🌀 neutrix

A powerful and hopefully simple state management library for React.

## Docs!
Docs can be found here: [https://duriantaco.github.io/neutrix](https://duriantaco.github.io/neutrix)

## Installation

`npm install neutrix`
# or
`yarn add neutrix`

## Features at a glance

- 📦 **Lightweight Core**
- 🎯 **Simple API**: Just `get()` and `set()` for most use cases
- 🔄 **Flexible Store Design**: Support for both single and multiple store patterns
- ⚡ **High Performance**: Automatic dependency tracking and LRU caching
- 🛠 **Developer Tools**: Redux DevTools integration out of the box
- 🎨 **TypeScript-First**: Built with full type safety
- 🔍 **Smart Updates**: Deep state updates and automatic batching
- 🧪 **SSR Ready**: Built-in server-side rendering support

## Motivation

### Why Another State Manager?
Most state managers claim to solve Redux's problems but end up doing the same things as Redux. neutrix takes a fundamentally different approach:

### State management shouldn't be complicated .

While Redux offers great dev tools and predictable updates, and MobX provides elegant reactivity, they both come with significant learning curves and boilerplate (Redux has tons of it and it's extremely frustrating to use- or maybe I'm just dumb). We built neutrix because we believe you shouldn't need to learn actions, reducers, observables, or complex patterns just to manage your app's state. There's enough s**t to do, and am trying not to make it even more difficult than it has to be.

## Docs!
Docs can be found here 

<!-- Insert Link -->

## Key features

### 1. Automatic Dependency Tracking

```typescript
// Other libraries: Manual dependency declaration
const selectFullName = createSelector(
  [selectFirstName, selectLastName],
  (first, last) => `${first} ${last}`
);

// neutrix: Automatic tracking using hooks
function ProfileName() {
  const fullName = useNeutrixComputed(store => {
    const firstName = store.get('user.firstName');
    const lastName = store.get('user.lastName');
    return `${firstName} ${lastName}`;
  });
  
  return <h1>{fullName}</h1>;
}
```

### 2. Bidirectional middleware
```typescript
store.use({
  onSet: (path, value, prevValue) => {
    console.log(`Setting ${path}: ${prevValue} -> ${value}`);
    return value;
  },
  onGet: (path, value) => {
    console.log(`Reading ${path}: ${value}`);
    return value;
  },
  onBatch: (updates) => {
    console.log('Batch update:', updates);
    return updates;
  }
});
```

### Performance optimization

```typescript
// LRU Caching for computed values
const computedCache = new LRUCache<string, any>(50);

// Automatic dependency tracking
const trackDependency = (path: string, computedPath: string) => {
  if (!dependencyGraph.has(path)) {
    dependencyGraph.set(path, new Set());
  }
  dependencyGraph.get(path)!.add(computedPath);
};

// Smart proxy-based tracking
const proxy = new Proxy(state, {
  get(target, prop: string) {
    trackDependency(prop, path);
    return target[prop as keyof typeof target];
  }
});
```


## Quick Start

## Multiple Stores Example: 

```typescript
interface UserState {
  user: null | { name: string };
  theme: 'light' | 'dark';
}

interface CartState {
  items: string[];
}

const { store: userStore, useStore: useUserStore } = createNeutrixStore<UserState>({
  user: null,
  theme: 'light'
});

const { store: cartStore, useStore: useCartStore } = createNeutrixStore<CartState>({
  items: []
});

// 2. use them with the provider
function App() {
  return (
    <NeutrixProvider stores={{ userStore, cartStore }}>
      <YourApp />
    </NeutrixProvider>
  );
}

// 3. use hooks in components
function Profile() {
  const user = useNeutrixSelector(store => store.get('user'));
  const { execute: updateTheme } = useNeutrixAction(
    async (store) => {
      store.set('theme', 'dark');
    }
  );

  return (
    <button onClick={() => updateTheme()}>
      Hi {user?.name}!
    </button>
  );
}
```

## Single Store Example

```typescript
interface AppState {
  user: null | { name: string };
  theme: 'light' | 'dark';
}

function AppWithOneStore() {
  const { store, Provider } = createNeutrixStore<AppState>({
    user: null,
    theme: 'light'
  });

  return (
    <Provider>
      <YourApp />
    </Provider>
  );
}
```


## Real world example:

```typescript
// userStore.ts
interface UserState {
  profile: null | { name: string };
  preferences: {
    theme: 'light' | 'dark';
    language: string;
  };
}

const { store: userStore, useStore: useUserStore } = createNeutrixStore<UserState>({
  profile: null,
  preferences: {
    theme: 'light',
    language: 'en'
  }
});

// featureStore.ts
interface FeatureState {
  features: {
    newDashboard: boolean;
    betaFeatures: boolean;
  };
}

const { store: featureStore, useStore: useFeatureStore } = createNeutrixStore<FeatureState>({
  features: {
    newDashboard: false,
    betaFeatures: false
  }
});

// notificationStore.ts
interface NotificationState {
  notifications: Array<{ id: string; message: string }>;
  settings: {
    email: boolean;
    push: boolean;
  };
}

const { store: notificationStore, useStore: useNotificationStore } = createNeutrixStore<NotificationState>({
  notifications: [],
  settings: {
    email: true,
    push: true
  }
});

// App.tsx
function App() {
  return (
    <NeutrixProvider stores={{
      userStore,
      featureStore,
      notificationStore
    }}>
      <Header />
      <MainContent />
      <NotificationCenter />
    </NeutrixProvider>
  );
}

// Header.tsx
function Header() {
  const profile = useNeutrixSelector(store => store.get('profile'));
  const preferences = useNeutrixSelector(store => store.get('preferences'));

  return (
    <header>
      <h1>Welcome {profile?.name}</h1>
      <ThemeToggle current={preferences.theme} />
    </header>
  );
}

// NotificationCenter.tsx
function NotificationCenter() {
  const notifications = useNeutrixSelector(store => store.get('notifications'));
  
  return (
    <div>
      {notifications.map(note => (
        <Alert key={note.id}>{note.message}</Alert>
      ))}
    </div>
  );
}

// FeatureGate.tsx
function FeatureGate({ feature, children }: { feature: keyof FeatureState['features']; children: React.ReactNode }) {
  const isEnabled = useNeutrixSelector(store => 
    store.get(`features.${feature}`)
  );

  return isEnabled ? children : null;
}
```

## Why use neutrix?

### vs Redux
- No actions/reducers boilerplate
- Simpler middleware system (just `onGet`/`onSet`/`onBatch`)
- Hooks-based instead of HOCs
- Built-in async action handling with loading states
- Automatic deep updates with path syntax

### vs MobX
- No decorators needed
- Explicit subscriptions via hooks
- Predictable updates through immutable state
- Simpler mental model with `get`/`set`
- Good TypeScript support

### vs Context
- Optimized re-renders via smart subscriptions
- Granular updates with path syntax
- Built-in caching and memoization
- DevTools integration
- Single provider pattern
- Built-in performance optimizations
- Consolidated store management through `NeutrixProvider`

This clarifies how exactly “No provider hell” is accomplished.

## Under The Hood

neutrix is built on three key principles:

1. **React Context + Proxy Magic**: We are using React Context for the provider system. We further enhance it with ES6 Proxies for an easier experience.

2. **Optimized Updates**: All state updates are batched and optimized automatically. 

* Component only rerenders when their selected data actually changes. 
* Automatic memoization
* LRU caching

3. **Developer Experience**: We provide Redux DevTools integration, TypeScript support, and a simple mental model while handling complex state management patterns under the hood.

4. **Everything in neutrix is built on these fundamentals** :

* Zero-config setup
* Automatic performance optimizations
* Type safety throughout
* Predictable updates
* Better dev experience (or hopefully?)

## What this is not

This is *NOT* meant to replace redux. Redux has its place. We are also not attempting to solve every single edge case out there. 

## Contributing

We love contributions! Please see our contributing guide for details.

## License

MIT

---

Built with ❤️ by oha