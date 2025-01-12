# 🌀 Spyn

A powerful and hopefully simple state management library for React.

## Motivation

### Why Another State Manager?
Most state managers claim to solve Redux's problems but end up doing the same things as Redux. Spyn takes a fundamentally different approach:

### State management shouldn't be complicated .

While Redux offers great dev tools and predictable updates, and MobX provides elegant reactivity, they both come with significant learning curves and boilerplate (Redux has tons of it and it's extremely frustrating to use- or maybe I'm just dumb). We built Spyn because we believe you shouldn't need to learn actions, reducers, observables, or complex patterns just to manage your app's state. There's enough s**t to do, and am trying not to make it even more difficult than it has to be.

## Why Spyn?

- 📦 **Tiny**
- 🎯 **Dead simple API** - just get() and set()
- 🔥 **Powerful features** under the hood
- ⚡ **High performance** with automatic optimizations
- 🛠 **Redux DevTools** support out of the box
- 🎨 **TypeScript** ready
- 0️⃣ Minimal configuration

## Docs!
Docs can be found here 

<!-- Insert Link -->

## Key features

### 1. Automatic Dependency Tracking

```
// Other libraries: Manual dependency declaration
const selectFullName = createSelector(
  [selectFirstName, selectLastName],
  (first, last) => `${first} ${last}`
);

// Spyn: Automatic tracking
const fullName = store.computed('fullName', state => {
  return `${state.user.firstName} ${state.user.lastName}`;
});
```

### 2. Bidirectional middleware
```
store.use({
  onSet: (path, value, prevValue) => {
    console.log(`Setting ${path}: ${prevValue} -> ${value}`);
    return value;
  },
  onGet: (path, value) => {
    console.log(`Reading ${path}: ${value}`);
    return value;
  }
});
```

### 3. Caching

Computed values are cached using an LRU strategy:

`const computedCache = new LRUCache<string, any>(50);`

This provides optimal performance while preventing memory leaks.

### 4. Dependency tracking

Spyn uses ES6 Proxies to automatically track dependencies in computed values:

```
const proxy = new Proxy(state, {
  get(target, prop: string) {
    trackDependency(prop, path);
    return target[prop as keyof typeof target];
  }
});
```

## Installation

`npm install spyn`
# or
`yarn add spyn`

## Quick Start

## Simple Example: 

```
// 1. Create stores
const userStore = createStore({
  user: null,
  theme: 'light'
});

const cartStore = createStore({
  items: []
});

// 2. Use them
function App() {
  return (
    <Provider store={userStore}>
      <Provider store={cartStore}>
        <YourApp />
      </Provider>
    </Provider>  
  );
}

// 3. That's it..
function Profile() {
  const { user } = useStore(store => ({
    user: store.get('user')
  }));

  return (
    <button onClick={() => store.set('theme', 'dark')}>
      Hi {user?.name}!
    </button>
  );
}
```

## Real world example:

```
// userStore.ts - All the user's data
const userStore = createStore({
  profile: null,
  preferences: {
    theme: 'light',
    language: 'en'
  }
});

// featureStore.ts 
const featureStore = createStore({
  features: {
    newDashboard: false,
    betaFeatures: false
  }
});

// notificationStore.ts - noti center thingy
const notificationStore = createStore({
  notifications: [],
  settings: {
    email: true,
    push: true
  }
});

// App.tsx
function App() {
  return (
    <Provider store={userStore}>
      <Provider store={featureStore}>
        <Provider store={notificationStore}>
          <Header />
          <MainContent />
          <NotificationCenter />
        </Provider>
      </Provider>
    </Provider>
  );
}

// Header.tsx
function Header() {
  // Only cares about user stuff - just use the hook directly
  const { profile, preferences } = useStore(store => ({
    profile: store.get('profile'),
    preferences: store.get('preferences')
  }));

  return (
    <header>
      <h1>Welcome {profile?.name}</h1>
      <ThemeToggle current={preferences.theme} />
    </header>
  );
}

// NotificationCenter.tsx
function NotificationCenter() {
  // Only subscribes to notification updates - clean and simple!!
  const { notifications } = useStore(store => ({
    notifications: store.get('notifications')
  }));

  return (
    <div>
      {notifications.map(note => (
        <Alert key={note.id}>{note.message}</Alert>
      ))}
    </div>
  );
}

// FeatureGate.tsx
function FeatureGate({ feature, children }) {
  // checks feature flags ONLY - direct path access - clean and simple!!!
  const isEnabled = useStore(store => 
    store.get(`features.${feature}`)
  );

  return isEnabled ? children : null;
}
```

## Why use Spyn?

### vs Redux
- No actions/reducers boilerplate
- No middleware complexity
- No connect() HOCs
- Same great dev tools
- Simpler async handling
- Easier deep updates

### vs MobX
- No decorators or class syntax
- No observable complexities
- More predictable updates
- Simpler mental model
- Better TypeScript support
- Less magic

### vs Context
- Better performance
- Simpler API for updates
- Deep updates out of the box
- DevTools support
- No provider hell
- Proper state management patterns

## Under The Hood

Spyn is built on three key principles:

1. **React Context + Proxy Magic**: We are using React Context for the provider system. We further enhance it with ES6 Proxies for an easier experience.

2. **Optimized Updates**: All state updates are batched and optimized automatically. 

* Component only rerenders when their selected data actually changes. 
* Automatic memoization
* LRU caching

3. **Developer Experience**: We provide Redux DevTools integration, TypeScript support, and a simple mental model while handling complex state management patterns under the hood.

4. **Everything in Spyn is built on these fundamentals** :

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