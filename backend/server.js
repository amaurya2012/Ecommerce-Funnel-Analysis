const express = require('express');
const cors = require('cors');
const { ensureCsvExists, appendTelemetryRow, CSV_PATH } = require('./csvLogger');
const { validateTelemetryPayload } = require('./validation');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '256kb' }));

app.post('/api/telemetry/log', async (req, res) => {
  const errors = validateTelemetryPayload(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const { userId, sessionId, currentStep, targetStep, action, deviceType, timestamp } = req.body;

  try {
    await appendTelemetryRow({ userId, sessionId, currentStep, targetStep, action, deviceType, timestamp });
    return res.status(201).json({ success: true });
  } catch (err) {
    console.error('[POST /api/telemetry/log] Failed to persist event:', err.message);
    return res.status(500).json({ success: false, errors: ['Failed to write telemetry event to disk.'] });
  }
});

app.get('/api/telemetry/health', (req, res) => {
  res.status(200).json({ status: 'ok', csvPath: CSV_PATH });
});

app.use((req, res) => {
  res.status(404).json({ success: false, errors: [`No route for ${req.method} ${req.path}`] });
});

app.use((err, req, res, next) => {
  console.error('[unhandled error]', err);
  res.status(500).json({ success: false, errors: ['Internal server error.'] });
});

if (require.main === module) {
  ensureCsvExists();
  app.listen(PORT, () => {
    console.log(`Telemetry server listening on http://localhost:${PORT}`);
    console.log(`Logging events to: ${CSV_PATH}`);
  });
}

module.exports = app;