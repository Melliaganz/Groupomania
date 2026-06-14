import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nProvider } from './_utils/i18n/I18nContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <I18nProvider>
    <Router>
      <App />
    </Router>
  </I18nProvider>
);
