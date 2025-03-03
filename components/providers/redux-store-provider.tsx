"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/lib/redux-store/store";

/**
 * Provides the Redux store to the wrapped children. The store is created
 * the first time this component renders, and is reused across subsequent
 * renders.
 */
const ReduxStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default ReduxStoreProvider;
