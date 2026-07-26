const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, 'user_behavior_logs.csv');
const CSV_HEADERS = ['userId', 'sessionId', 'currentStep', 'targetStep', 'action', 'deviceType', 'timestamp'];

let writeStream = null;
let writeQueue = Promise.resolve();

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
 * Ensures the CSV file exists on disk with the correct header row before
 * any writes are attempted. Safe to call multiple times; only writes the
 * header once per process lifetime unless the file is deleted externally.
 */
function ensureCsvExists() {
  if (!fs.existsSync(CSV_PATH)) {
    fs.writeFileSync(CSV_PATH, CSV_HEADERS.join(',') + '\n', { encoding: 'utf8' });
  }
}

function getWriteStream() {
  if (!writeStream) {
    ensureCsvExists();
    writeStream = fs.createWriteStream(CSV_PATH, { flags: 'a', encoding: 'utf8' });
    writeStream.on('error', (err) => {
      console.error('[csvLogger] Write stream error:', err.message);
      writeStream = null;
    });
  }
  return writeStream;
}

/**
 * Appends a single telemetry event row to the CSV file. Writes are
 * serialized through writeQueue so concurrent requests never interleave
 * partial lines, even under load from the traffic simulator.
 */
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

module.exports = {
  CSV_PATH,
  CSV_HEADERS,
  ensureCsvExists,
  appendTelemetryRow,
};
