"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";


/**
 * ReactQueryProvider is a wrapper component that provides a React Query client
 * to its children via the QueryClientProvider. It initializes a new QueryClient
 * instance using React's useState hook and passes it to the QueryClientProvider.
 * This allows the children components to use React Query for data fetching and
 * caching.
 *
 * @param {object} props - The props object.
 * @param {React.ReactNode} props.children - The child components that will have
 * access to the React Query client.
 */

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
