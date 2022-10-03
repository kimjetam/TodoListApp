import React, { createContext, useContext } from 'react';
import { TodoStore } from '../stores/todoStore';

export type IValueMap = Record<string, any>;

export interface ProviderProps extends IValueMap {
  children: React.ReactNode;
}

const StoreContext = createContext<IValueMap>({});
StoreContext.displayName = 'StoreContext';

export function TodoStoreProvider(props: ProviderProps) {
  const { children, ...stores } = props;

  const parentValue = React.useContext(StoreContext);
  const mutableProviderRef = React.useRef({ ...parentValue, ...stores });
  const value = mutableProviderRef.current;

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useTodoStore(): TodoStore {
  const context = useContext(StoreContext);

  if (context === undefined) {
    throw new Error('useTodoStore must be used within TodoStorePovider');
  }

  if (context.store === undefined) {
    throw new Error('TodoStoreProvider does not specify "store" property');
  }

  return context.store;
}
