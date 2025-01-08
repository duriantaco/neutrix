import { createContext, useContext } from 'react';
import type { Store, State } from '../core/types';

export const StoreContext = createContext<Store<any> | null>(null);

export function useStoreContext<S extends State>(): Store<S> {
    const context = useContext(StoreContext);
    if (context === null) {
        throw new Error('useStore must be used within a Provider');
    }
    return context as unknown as Store<S>;
}