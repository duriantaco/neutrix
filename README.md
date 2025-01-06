# 🌀 Spyn

A powerful and hopefully simple state management library for React.

## Motivation

State management shouldn't be complicated. Period.

While Redux offers great dev tools and predictable updates, and MobX provides elegant reactivity, they both come with significant learning curves and boilerplate (Redux has tons of it and it's extremely frustrating to use- or maybe I'm just dumb). We built Spyn because we believe you shouldn't need to learn actions, reducers, observables, or complex patterns just to manage your app's state.

## Why Spyn?

- 📦 **Tiny**
- 🎯 **Dead simple API** - just get() and set()
- 🔥 **Powerful features** under the hood
- ⚡ **High performance** with automatic optimizations
- 🛠 **Redux DevTools** support out of the box
- 🎨 **TypeScript** ready
- 0️⃣ Minimal configuration

## Installation

`npm install spyn`
# or
`yarn add spyn`

## Quick Start

## Example 1: 

```
import { createStore, Provider, useStore } from 'spyn';

// 1. Create store
const store = createStore({
  notifications: {
    isEnabled: false,
    token: null,
    settings: {
      email: true,
      push: true,
      marketing: false
    }
  }
});

// 2. Wrap app
function App() {
  return (
    <Provider store={store}>
      <NotificationSettings />
    </Provider>
  );
}

// 3. Use it
function NotificationSettings() {
  const { settings, isEnabled } = useStore(store => ({
    settings: store.get('notifications.settings'),
    isEnabled: store.get('notifications.isEnabled')
  }));

  const toggleNotification = async (type) => {
    try {
      await updateNotificationPreference(type);
      
      // spyn
      store.set(`notifications.settings.${type}`, !settings[type]);
    } catch (error) {
    }
  };

  return (
    <div>
      <div>
        <input 
          type="checkbox"
          checked={settings.email}
          onChange={() => toggleNotification('email')}
        />
        Email Notifications
      </div>

      <div>
        <input 
          type="checkbox"
          checked={settings.push}
          onChange={() => toggleNotification('push')}
        />
        Push Notifications
      </div>
    </div>
  );
}
```

## Core Concepts

### Simple but Powerful API

Get values:
```
const value = store.get('some.deep.path');
```

Set values:
```
store.set('some.deep.path', newValue);
```

Batch updates:
```
store.batch([
  ['user', newUser],
  ['theme', 'dark'],
  ['lastUpdated', Date.now()]
]);
```

### Performance Optimizations

Use selectors to prevent unnecessary rerenders:
```
// Only rerenders when user changes
const user = useStore(store => store.get('user'));

// Select multiple values
const { user, theme } = useStore(store => ({
  user: store.get('user'),
  theme: store.get('theme')
}));
```

### Deep Updates Made Easy

```
// No need for deep spreads or immer
store.set('deeply.nested.value', newValue);

// Batch deep updates
store.batch([
  ['user.settings.theme', 'dark'],
  ['user.preferences.notifications', true]
]);
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

2. **Updates**: All state updates are batched and optimized automatically. Components only rerender when their selected data actually changes.

3. **Developer Experience**: We provide Redux DevTools integration, TypeScript support, and a simple mental model while handling complex state management patterns under the hood.

## Advanced Usage

### Async Actions
```
function UserProfile() {
  const store = useStore();

  const fetchUser = async (id) => {
    store.set('loading', true);
    try {
      const user = await api.getUser(id);
      store.batch([
        ['user', user],
        ['loading', false],
        ['error', null]
      ]);
    } catch (error) {
      store.batch([
        ['error', error.message],
        ['loading', false]
      ]);
    }
  };
}
```

### Form Handling
```
function ComplexForm() {
  const store = useStore();

  const updateField = (field, value) => {
    store.batch([
      [`form.${field}`, value],
      ['form.dirty', true],
      ['form.valid', validateForm()]
    ]);
  };
}
```

### Real-time Updates
```
function LiveDashboard() {
  const store = useStore();

  useEffect(() => {
    const socket = new WebSocket('...');
    socket.onmessage = (event) => {
      const { path, value } = JSON.parse(event.data);
      store.set(path, value);
    };
  }, []);
}
```

## Best Practices

1. Keep state flat when possible
2. Use batch() for multiple updates
3. Use selectors for performance
4. Split state logically
5. Keep components focused

## What this is not

This is *NOT* meant to replace redux. Redux has its place. We are also not attempting to solve every single edge case out there. 

## Contributing

We love contributions! Please see our contributing guide for details.

## License

MIT

---

Built with ❤️ by oha