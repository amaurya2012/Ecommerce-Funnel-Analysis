import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { TelemetryProvider } from './context/TelemetryContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TelemetryProvider>
      <App />
    </TelemetryProvider>
  </React.StrictMode>
);
