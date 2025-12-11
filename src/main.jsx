import { PopupProvider } from '@/context/PopupContext';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router';
import App from './App.jsx';
import BackButtonHandler from './components/global/BackButtonHandler.jsx';
import { SessionProvider } from './context/SessionContext';
import { useInitialFetch } from './hooks/useInitialFetch';
import './index.css';
import useBrandStore from './store/brandStore.js';
import { isDebugMode } from './utils/devDebug.js';

const startApp = () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  useBrandStore.getState().initializeBrand();

  root.render(
    <React.StrictMode>
      <HashRouter>
        <PopupProvider>
          <SessionProvider>
            <BackButtonHandler>
              <App />
            </BackButtonHandler>
          </SessionProvider>
        </PopupProvider>
      </HashRouter>
    </React.StrictMode>,
  );
};

if (window.cordova) {
  document.addEventListener(
    'deviceready',
    () => {
      startApp();
      useInitialFetch();
      if (isDebugMode()) {
        alert('hello from device ready....');
      }
    },
    false,
  );
  // alert('window cordova....', window.cordova);
} else {
  startApp();
}
