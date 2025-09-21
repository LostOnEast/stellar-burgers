import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Provider } from 'react-redux'; // 🔹 добавили
import { store } from './services/store'; // 🔹 импорт твоего стора
import App from './components/app/app';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
