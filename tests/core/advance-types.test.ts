import { describe, it, expect } from 'vitest';
import type { 
  Store, 
  State, 
  DeepPartial, 
  Middleware,
  Action
} from '../../src/core/types';
import { vi } from 'vitest';

describe('Advanced Type Safety Tests', () => {
  describe('Complex Generic Constraints', () => {
    it('should handle complex nested state types', () => {
      interface ComplexState extends State {
        user: {
          profile: {
            name: string;
            settings: {
              theme: 'light' | 'dark';
              notifications: boolean;
            }[];
          };
          permissions: Record<string, boolean>;
        };
        metadata?: {
          created: Date;
          modified?: Date;
        };
      }

      const store: Store<ComplexState> = {} as Store<ComplexState>;
      type StoreType = typeof store.getState;
      
      type Test = StoreType extends () => ComplexState ? true : false;
      const typeCheck: Test = true;
      expect(typeCheck).toBe(true);
    });

    it('should handle union and intersection types', () => {
      type Theme = 'light' | 'dark' | 'system';
      type Status = 'active' | 'inactive' | 'pending';
      
      interface UserSettings {
        theme: Theme;
        notifications: boolean;
      }

      interface UserProfile {
        name: string;
        email: string;
      }

      interface ComplexState extends State {
        settings: UserSettings & { status: Status };
        profile: UserProfile | null;
      }

      const partial: DeepPartial<ComplexState> = {
        settings: {
          theme: 'light',
          status: 'active'
        }
      };

      expect(partial.settings?.theme).toBe('light');
    });

    it('should enforce readonly state modifications', () => {
        interface ReadonlyState extends State {
          readonly counter: number;
          readonly settings: {
            readonly theme: string;
          };
        }
      
        const store: Store<ReadonlyState> = {
          get: vi.fn(),
          set: vi.fn(),
          batch: vi.fn(),
          subscribe: vi.fn(),
          getState: vi.fn(),
          computed: vi.fn(),
          action: vi.fn(),
          suspend: vi.fn(),
          use: vi.fn()
        };
        
        // These should compile and not throw
        store.set('counter', 1);
        store.set('settings', { theme: 'dark' });
      
        const state = store.getState();
        expect(() => {
          // @ts-expect-error - should fail here
          state.counter = 2;
        }).toThrow();
      
        expect(() => {
          // @ts-expect-error - this should fail too 
          state.settings.theme = 'light';
        }).toThrow();
      });
    it('should handle discriminated unions', () => {
      type UserEvent = 
        | { type: 'login'; payload: { userId: string } }
        | { type: 'logout' }
        | { type: 'update'; payload: { name: string } };

      interface EventState extends State {
        currentEvent: UserEvent | null;
        history: UserEvent[];
      }

      const mockState: EventState = {
        currentEvent: null,
        history: []
      };

      const typeCheck = (event: UserEvent) => {
        switch (event.type) {
          case 'login':
            expect(typeof event.payload.userId).toBe('string');
            break;
          case 'logout':
            expect(event).not.toHaveProperty('payload');
            break;
          case 'update':
            expect(typeof event.payload.name).toBe('string');
            break;
        }
      };

      typeCheck({ type: 'login', payload: { userId: '123' } });
    });
  });

  describe('Type Safe Actions', () => {
    it('should enforce action type safety', () => {
      interface ActionState extends State {
        count: number;
        status: 'idle' | 'loading' | 'error';
      }

      const action: Action<[number], void> = async (
        store: Store<ActionState>,
        increment: number
      ) => {
        const current = store.get('count');
        store.set('count', current + increment);
      };

      type ActionArgs = Parameters<typeof action>;
      type ActionReturn = ReturnType<typeof action>;
      
      const argsCheck: ActionArgs = [{} as Store<ActionState>, 1];
      const returnCheck: ActionReturn extends Promise<void> ? true : false = true;
      
      expect(returnCheck).toBe(true);
    });
  });

  describe('Middleware Type Safety', () => {
    it('should enforce middleware type contracts', () => {
      interface TypedMiddleware extends Middleware {
        onSet?: <T>(path: string, value: T, prevValue: T) => T;
        onGet?: <T>(path: string, value: T) => T;
      }

      const middleware: TypedMiddleware = {
        onSet: (path, value, prevValue) => {
          return typeof value === typeof prevValue ? value : prevValue;
        },
        onGet: (path, value) => {
          return value;
        }
      };

      expect(typeof middleware.onSet).toBe('function');
      expect(typeof middleware.onGet).toBe('function');
    });
  });
});