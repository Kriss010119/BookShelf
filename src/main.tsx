import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AuthProvider } from './context/auth-context';
import App from './App';
import { store } from './store/store.tsx';
import './index.css';

import * as Sentry from "@sentry/react";
import { StrictMode } from "react";

Sentry.init({
  dsn: "https://a869374fa7b5e21771a6600f6876d838@o4509884596420608.ingest.us.sentry.io/4509884598779904",
  sendDefaultPii: true
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <StrictMode>
            <App />
          </StrictMode>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
