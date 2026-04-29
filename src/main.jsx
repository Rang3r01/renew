import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { App } from './App';
import './index.css';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkReady = CLERK_KEY && !CLERK_KEY.startsWith('YOUR_CLERK');

const Root = clerkReady ? (
  <ClerkProvider publishableKey={CLERK_KEY}>
    <App clerkEnabled />
  </ClerkProvider>
) : (
  <App clerkEnabled={false} />
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>{Root}</React.StrictMode>
);
