# Tests

## Provider 
tests/react/provider.test.tsx (8)
   ✓ NeutrixProvider (8)
     ✓ Single Store Mode (2)
       ✓ should provide single store through context
       ✓ should render children with single store
     ✓ Multi Store Mode (2)
       ✓ should provide multiple stores through context
       ✓ should render children with multiple stores
     ✓ should throw error if neither store nor stores is provided
     ✓ should allow multiple children
     ✓ Store Subscription (2)
       ✓ should handle store subscription and cleanup
       ✓ should handle multiple store subscriptions in multi-store mode

## Index 

✓ tests/react/index.test.tsx (6)
   ✓ React Index Module (6)
     ✓ should export NeutrixProvider
     ✓ should export NeutrixProviderProps type
     ✓ should export NeutrixContextValue type
     ✓ should export useNeutrixSelector
     ✓ should export useNeutrixComputed
     ✓ should export useNeutrixAction

## Context
 ✓ tests/react/context.test.tsx (2)
   ✓ useStoreContext (2)
     ✓ should throw an error if used outside of a Provider
     ✓ should return the store if used within a Provider

## Utils
✓ tests/core/utils.test.ts (4)
   ✓ utils (4)
     ✓ get (2)
       ✓ should get nested value from object
       ✓ should return undefined for non-existent path
     ✓ set (2)
       ✓ should set nested value in object
       ✓ should handle array paths

## Types

✓ tests/core/types.test.ts (3)
   ✓ Type definitions (3)
     ✓ DeepPartial type handles primitive values
     ✓ DeepPartial type handles nested objects
     ✓ Store interface type check

## Path optimization

✓ tests/core/optimizePath.test.ts (5)
   ✓ optimizePath (5)
     ✓ should split a dot-separated string into an array of strings
     ✓ should handle empty string
     ✓ should ignore consecutive dots
     ✓ should handle leading and trailing dots
     ✓ should handle only dots

## Creating Neutrix store

 ✓ tests/core/createNeutrix.test.ts (4)
   ✓ createNeutrixStore (4)
     ✓ should initialize store with initial state
     ✓ should update state and notify subscribers
     ✓ should use selector to derive state
     ✓ should unsubscribe on unmount

## Connections

✓ tests/core/connections.test.ts (5)
   ✓ connectStores (4)
     ✓ should call then function when when function returns true
     ✓ should not call then function when when function returns false
     ✓ should call handler immediately if immediate is true
     ✓ should return a function that unsubscribes all connections
   ✓ connectStore (1)
     ✓ should call connectStores with a single connection