import React from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { useTelemetryContext } from '../context/TelemetryContext.jsx';

export default function CheckoutConfirmation({ orderTotal, onStartOver }) {
  const { sessionId } = useTelemetryContext();
  const shortSession = sessionId.split('_').slice(-1)[0];

  return (
    <section className="flex flex-col items-center px-2 py-6 text-center sm:py-10">
      <p className="data-label mb-4">step 04 · order confirmed</p>
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-navy sm:h-16 sm:w-16">
        <CheckCircle2 size={28} strokeWidth={1.5} className="text-orange" />
      </div>
      <h1 className="font-display text-2xl font-semibold text-ink-high sm:text-3xl">Order placed.</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-mid sm:text-base">
        This session converted end to end. The full transition sequence has been written to the
        telemetry log for funnel analysis.
      </p>

      <div className="surface-card mt-8 w-full max-w-sm p-5 sm:p-6">
        <div className="flex justify-between font-mono text-sm text-ink-mid">
          <span>Order total</span>
          <span className="font-semibold text-ink-high">{orderTotal}</span>
        </div>
        <div className="mt-2 flex justify-between font-mono text-sm text-ink-mid">
          <span>Reference</span>
          <span className="text-ink-high">{shortSession}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onStartOver}
        className="btn-outline mt-8 inline-flex items-center gap-2"
      >
        <RotateCcw size={14} strokeWidth={2} />
        Simulate another session
      </button>
    </section>
  );
}
