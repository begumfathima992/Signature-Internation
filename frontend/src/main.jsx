import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/inter';
import './styles/theme.css';
import './styles/global.css';
import App from './App.jsx';

// index.html carries fallback meta tags for crawlers without JavaScript; PageMeta replaces them.
document.head.querySelectorAll('[data-fallback]').forEach((tag) => tag.remove());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
