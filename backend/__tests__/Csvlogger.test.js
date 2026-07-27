const fs = require('fs');
const os = require('os');
const path = require('path');
const { escapeCsvField, rowToCsvLine, createCsvLogger } = require('../csvLogger');

describe('escapeCsvField', () => {
  test('leaves a simple value unquoted', () => {
    expect(escapeCsvField('browse')).toBe('browse');
  });

  test('quotes a value containing a comma', () => {
    expect(escapeCsvField('user, with comma')).toBe('"user, with comma"');
  });

  test('quotes and doubles internal double quotes', () => {
    expect(escapeCsvField('session "quoted"')).toBe('"session ""quoted"""');
  });

  test('quotes a value containing a newline', () => {
    expect(escapeCsvField('line one\nline two')).toBe('"line one\nline two"');
  });

  test('converts null/undefined to an empty string', () => {
    expect(escapeCsvField(null)).toBe('');
    expect(escapeCsvField(undefined)).toBe('');
  });

  test('stringifies numbers without quoting', () => {
    expect(escapeCsvField(42)).toBe('42');
  });
});

describe('rowToCsvLine', () => {
  test('orders fields per CSV_HEADERS and ends with a newline', () => {
    const line = rowToCsvLine({
      userId: 'u1',
      sessionId: 's1',
      currentStep: 'browse',
      targetStep: 'cart',
      action: 'add_to_cart',
      deviceType: 'mobile',
      timestamp: '2026-07-16T10:00:00.000Z',
    });
    expect(line).toBe('u1,s1,browse,cart,add_to_cart,mobile,2026-07-16T10:00:00.000Z\n');
  });
});

describe('createCsvLogger (file-based)', () => {
  let tmpDir;
  let csvPath;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'csv-logger-test-'));
    csvPath = path.join(tmpDir, 'test_logs.csv');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('creates the file with a header row if it does not exist', () => {
    const logger = createCsvLogger(csvPath);
    logger.ensureCsvExists();

    const content = fs.readFileSync(csvPath, 'utf8');
    expect(content).toBe('userId,sessionId,currentStep,targetStep,action,deviceType,timestamp\n');
  });

  test('does not overwrite an existing file on repeated calls', () => {
    const logger = createCsvLogger(csvPath);
    logger.ensureCsvExists();
    fs.appendFileSync(csvPath, 'u1,s1,browse,cart,view,desktop,2026-07-16T10:00:00.000Z\n');
    logger.ensureCsvExists();

    const lines = fs.readFileSync(csvPath, 'utf8').trim().split('\n');
    expect(lines).toHaveLength(2);
  });

  test('appends rows without touching existing rows', async () => {
    const logger = createCsvLogger(csvPath);

    await logger.appendTelemetryRow({
      userId: 'u1',
      sessionId: 's1',
      currentStep: 'browse',
      targetStep: 'product_detail',
      action: 'view',
      deviceType: 'desktop',
      timestamp: '2026-07-16T10:00:00.000Z',
    });
    await logger.appendTelemetryRow({
      userId: 'u2, with comma',
      sessionId: 's2 "quoted"',
      currentStep: 'cart',
      targetStep: 'cart',
      action: 'abandon',
      deviceType: 'mobile',
      timestamp: '2026-07-16T10:05:00.000Z',
    });
    await logger.closeStream();

    const lines = fs.readFileSync(csvPath, 'utf8').trim().split('\n');
    expect(lines).toHaveLength(3); // header + 2 rows
    expect(lines[0]).toBe('userId,sessionId,currentStep,targetStep,action,deviceType,timestamp');
    expect(lines[1]).toBe('u1,s1,browse,product_detail,view,desktop,2026-07-16T10:00:00.000Z');
    expect(lines[2]).toBe('"u2, with comma","s2 ""quoted""",cart,cart,abandon,mobile,2026-07-16T10:05:00.000Z');
  });

  test('serializes concurrent writes without interleaving lines', async () => {
    const logger = createCsvLogger(csvPath);

    const writes = Array.from({ length: 20 }, (_, i) =>
      logger.appendTelemetryRow({
        userId: `u${i}`,
        sessionId: `s${i}`,
        currentStep: 'browse',
        targetStep: 'product_detail',
        action: 'view',
        deviceType: 'desktop',
        timestamp: '2026-07-16T10:00:00.000Z',
      })
    );

    await Promise.all(writes);
    await logger.closeStream();

    const lines = fs.readFileSync(csvPath, 'utf8').trim().split('\n');
    expect(lines).toHaveLength(21); // header + 20 rows
    lines.slice(1).forEach((line) => {
      expect(line.split(',')).toHaveLength(7);
    });
  });
});