import React, { createContext, useContext, useMemo, useState } from 'react';
import { useTelemetry } from '../hooks/useTelemetry.js';

const TelemetryContext = createContext(null);

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function TelemetryProvider({ children }) {
  const [userId, setUserId] = useState(() => generateId('user'));
  const [sessionId, setSessionId] = useState(() => generateId('session'));

  const { logTransition, deviceType } = useTelemetry(userId, sessionId);

  const startNewSession = useMemo(
    () => () => {
      setUserId(generateId('user'));
      setSessionId(generateId('session'));
    },
    []
  );

  const value = useMemo(
    () => ({ userId, sessionId, deviceType, logTransition, startNewSession }),
    [userId, sessionId, deviceType, logTransition, startNewSession]
  );

  return <TelemetryContext.Provider value={value}>{children}</TelemetryContext.Provider>;
}

export function useTelemetryContext() {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetryContext must be used within a TelemetryProvider');
  }
  return context;
}
