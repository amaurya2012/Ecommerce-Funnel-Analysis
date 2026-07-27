const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, 'user_behavior_logs.csv');
const CSV_HEADERS = ['userId', 'sessionId', 'currentStep', 'targetStep', 'action', 'deviceType', 'timestamp'];

/**
 * Escapes a single CSV field per RFC 4180: wraps the field in double quotes
 * if it contains a comma, double quote, or newline, and doubles any internal
 * double quotes. Leaves simple values untouched to keep the file readable.
 */
function escapeCsvField(value) {
  const stringValue = value === undefined || value === null ? '' : String(value);
  const needsQuoting = /[",\n\r]/.test(stringValue);
  if (!needsQuoting) {
    return stringValue;
  }
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function rowToCsvLine(row) {
  return CSV_HEADERS.map((field) => escapeCsvField(row[field])).join(',') + '\n';
}

/**
 * Builds a CSV logger bound to a specific file path. The default export
 * below binds one of these to the real backend/user_behavior_logs.csv path;
 * tests can call this factory directly with a temp file path so they never
 * touch the real log.
 */
function createCsvLogger(csvPath) {
  let writeStream = null;
  let writeQueue = Promise.resolve();

  function ensureCsvExists() {
    if (!fs.existsSync(csvPath)) {
      fs.writeFileSync(csvPath, CSV_HEADERS.join(',') + '\n', { encoding: 'utf8' });
    }
  }

  function getWriteStream() {
    if (!writeStream) {
      ensureCsvExists();
      writeStream = fs.createWriteStream(csvPath, { flags: 'a', encoding: 'utf8' });
      writeStream.on('error', (err) => {
        console.error('[csvLogger] Write stream error:', err.message);
        writeStream = null;
      });
    }
    return writeStream;
  }

  function appendTelemetryRow(row) {
    writeQueue = writeQueue.then(
      () =>
        new Promise((resolve, reject) => {
          const stream = getWriteStream();
          const line = rowToCsvLine(row);
          stream.write(line, 'utf8', (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        })
    );
    return writeQueue;
  }

  function closeStream() {
    return new Promise((resolve) => {
      if (writeStream) {
        writeStream.end(() => {
          writeStream = null;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  return { csvPath, ensureCsvExists, appendTelemetryRow, closeStream };
}

const defaultLogger = createCsvLogger(CSV_PATH);

module.exports = {
  CSV_PATH,
  CSV_HEADERS,
  escapeCsvField,
  rowToCsvLine,
  createCsvLogger,
  ensureCsvExists: defaultLogger.ensureCsvExists,
  appendTelemetryRow: defaultLogger.appendTelemetryRow,
};