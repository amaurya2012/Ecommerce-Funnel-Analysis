import { useCallback, useMemo } from 'react';
import axios from 'axios';

const TELEMETRY_ENDPOINT = import.meta.env.VITE_TELEMETRY_API_URL || 'http://localhost:4000/api/telemetry/log';

function detectDeviceType() {
  if (typeof navigator === 'undefined') return 'desktop';
  const userAgent = navigator.userAgent || '';
  const isTablet = /iPad|Tablet|Nexus 7|Nexus 10/i.test(userAgent);
  const isMobile = !isTablet && /Mobi|Android|iPhone/i.test(userAgent);
  if (isTablet) return 'tablet';
  if (isMobile) return 'mobile';
  return 'desktop';
}

/**
 * Wraps an Axios instance dedicated to telemetry logging. Every call fires
 * a non-blocking POST to the backend and never throws into the calling
 * component — a failed telemetry write should never break the shopping UI.
 */
export function useTelemetry(userId, sessionId) {
  const client = useMemo(
    () =>
      axios.create({
        baseURL: undefined,
        timeout: 4000,
        headers: { 'Content-Type': 'application/json' },
      }),
    []
  );

  const deviceType = useMemo(detectDeviceType, []);

  const logTransition = useCallback(
    (currentStep, targetStep, action) => {
      const payload = {
        userId,
        sessionId,
        currentStep,
        targetStep,
        action,
        deviceType,
        timestamp: new Date().toISOString(),
      };

      client.post(TELEMETRY_ENDPOINT, payload).catch((err) => {
        console.warn('[useTelemetry] Event failed to send:', err.message);
      });
    },
    [client, userId, sessionId, deviceType]
  );

  return { logTransition, deviceType };
}
