import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {QueryClient, QueryClientProvider,} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { App } from '@app/App'

// Cliente global do React Query
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Provider do React Query */}
    <QueryClientProvider client={queryClient}>
      <App />
    {/*  <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>

  </StrictMode>,
)