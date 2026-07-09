// Punto de entrada para SSR hydration
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './index';

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <App />
  </StrictMode>,
);
