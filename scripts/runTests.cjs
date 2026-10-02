const { parseISO, isValid, isBefore, startOfDay, format } = require('date-fns');
const Papa = require('papaparse');

// ====================================================
// CORE BUSINESS LOGIC IMPLS FOR TESTING CONTRACTS
// ====================================================

function formatDate(dateString, formatPattern = 'MMM dd, yyyy') {
  if (!dateString) return 'N/A';
  try {
    const parsed = parseISO(dateString);
    if (!isValid(parsed)) return dateString;
    return format(parsed, formatPattern);
  } catch {
    return dateString;
  }
}

function isDueDateEarlierThanStart(startDateStr, dueDateStr) {
  if (!startDateStr || !dueDateStr) return false;
  try {
    const start = startOfDay(parseISO(startDateStr));
    const due = startOfDay(parseISO(dueDateStr));
    if (!isValid(start) || !isValid(due)) return false;
    return isBefore(due, start);
  } catch {
    return false;
  }
}

function normalizeDateStringToIso(rawDateStr) {
  if (!rawDateStr || typeof rawDateStr !== 'string') return null;
  const trimmed = rawDateStr.trim();
  if (!trimmed) return null;
  const isoParsed = parseISO(trimmed);
  if (isValid(isoParsed)) {
    return format(isoParsed, 'yyyy-MM-dd');
  }
  return null;
}

function parseCsvString(csvContent) {
  const result = Papa.parse(csvContent, {
    header: false,
    skipEmptyLines: 'greedy',
    transform: (val) => String(val).trim(),
  });

  if (!result.data || result.data.length === 0) {
    return { data: [], errors: result.errors.map((e) => e.message || 'Empty or unparseable CSV') };
  }

  const firstRow = result.data[0];
  const knownHeaderTokens = ['id', 'title', 'description', 'category', 'priority', 'start_date', 'due_date', 'status'];
  const isHeaderRow = firstRow.some((col) => knownHeaderTokens.includes(String(col).toLowerCase().trim()));

  let headers = [];
  let dataRows = [];

  if (isHeaderRow) {
    headers = firstRow.map((col) => String(col).trim().toLowerCase());
    dataRows = result.data.slice(1);
  } else {
    const defaultHeaders = ['id', 'title', 'description', 'category', 'priority', 'start_date', 'due_date', 'status'];
    headers = firstRow.map((_, idx) => defaultHeaders[idx] || `col_${idx + 1}`);
    dataRows = result.data;
  }

  const dataObjects = dataRows.map((row) => {
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = row[idx] !== undefined ? String(row[idx]).trim() : '';
    });
    return obj;
  });

  return { data: dataObjects, errors: result.errors.map((e) => e.message) };
}

function validateCsvRecords(records, existingTasks = [], options = {}) {
  const { duplicateStrategy = 'skip' } = options;
  const validTasks = [];
  const errors = [];
  let duplicateCount = 0;

  const existingIds = new Set((existingTasks || []).map((t) => String(t.id).toLowerCase()));
  const csvSeenIds = new Set();
  let nextGenId = 100;

  records.forEach((record, index) => {
    const rowNumber = index + 2;
    const rowErrors = [];

    const title = record.title || record.Title || record.name;
    if (!title || String(title).trim() === '') {
      rowErrors.push('Title is missing or empty.');
    }

    const rawPriority = record.priority || record.Priority || 'Medium';
    let normalizedPriority = 'Medium';
    const lowerP = String(rawPriority).toLowerCase().trim();
    if (['high', 'h', 'urgent', 'critical'].includes(lowerP)) {
      normalizedPriority = 'High';
    } else if (['low', 'l', 'minor'].includes(lowerP)) {
      normalizedPriority = 'Low';
    } else if (['medium', 'med', 'm', 'normal'].includes(lowerP)) {
      normalizedPriority = 'Medium';
    } else {
      rowErrors.push(`Invalid Priority "${rawPriority}".`);
    }

    const rawStatus = record.status || record.Status || 'Pending';
    let normalizedStatus = 'Pending';
    const lowerS = String(rawStatus).toLowerCase().trim();
    if (['completed', 'complete', 'done', 'yes', '1'].includes(lowerS)) {
      normalizedStatus = 'Completed';
    } else if (['pending', 'open', 'todo', 'no', '0'].includes(lowerS)) {
      normalizedStatus = 'Pending';
    } else {
      rowErrors.push(`Invalid Status "${rawStatus}".`);
    }

    const startDateIso = normalizeDateStringToIso(record.start_date || record.startDate) || '2026-10-01';
    const dueDateIso = normalizeDateStringToIso(record.due_date || record.dueDate) || startDateIso;

    if (startDateIso && dueDateIso && isDueDateEarlierThanStart(startDateIso, dueDateIso)) {
      rowErrors.push(`Due date (${dueDateIso}) cannot be earlier than start date (${startDateIso}).`);
    }

    let finalId = record.id ? String(record.id).trim() : '';
    if (finalId) {
      const lowerId = finalId.toLowerCase();
      if (existingIds.has(lowerId) || csvSeenIds.has(lowerId)) {
        duplicateCount++;
        if (duplicateStrategy === 'auto_id') {
          finalId = `GEN-${++nextGenId}`;
        } else {
          rowErrors.push(`Duplicate Task ID "${finalId}".`);
        }
      } else {
        csvSeenIds.add(lowerId);
      }
    } else {
      finalId = `GEN-${++nextGenId}`;
    }

    if (rowErrors.length > 0) {
      errors.push({ rowNumber, taskId: finalId, message: rowErrors.join(' ') });
    } else {
      validTasks.push({
        id: finalId,
        title: String(title).trim(),
        category: record.category || 'General',
        priority: normalizedPriority,
        startDate: startDateIso,
        dueDate: dueDateIso,
        status: normalizedStatus,
      });
    }
  });

  return { validTasks, errors, duplicateCount };
}

function selectDashboardStats(tasks) {
  const safeTasks = tasks || [];
  const total = safeTasks.length;
  const completed = safeTasks.filter((t) => t.status === 'Completed').length;
  const pending = safeTasks.filter((t) => t.status === 'Pending').length;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, pending, completionPercentage };
}

function selectFilteredTasks(tasks, filters) {
  const safeTasks = tasks || [];
  return safeTasks
    .filter((task) => {
      if (filters.status && filters.status !== 'All' && task.status !== filters.status) return false;
      if (filters.category && filters.category !== 'All' && task.category !== filters.category) return false;
      if (filters.priority && filters.priority !== 'All' && task.priority !== filters.priority) return false;
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase().trim();
        const match = (task.title || '').toLowerCase().includes(q) || (task.id || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      return (a.title || '').localeCompare(b.title || '') * order;
    });
}

// ====================================================
// TEST SUITE ASSERTION ENGINE (POSITIVE & NEGATIVE)
// ====================================================

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message, flowType = 'POSITIVE') {
  totalTests++;
  const tag = flowType === 'POSITIVE' ? '[+ POSITIVE]' : '[- NEGATIVE]';
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${tag} ${message}`);
  } else {
    failedTests++;
    console.error(`[FAIL] ${tag} ${message}`);
  }
}

console.log('===========================================================');
console.log('  TaskFlow Comprehensive Test Suite (Positive & Negative)  ');
console.log('===========================================================\n');

// ----------------------------------------------------
// 1. DATE UTILITIES & CONSTRAINTS
// ----------------------------------------------------
console.log('--- 1. Date Utilities & Constraint Validation ---');
// Positive Flows
assert(formatDate('2026-10-01') === 'Oct 01, 2026', 'formatDate() formats YYYY-MM-DD correctly', 'POSITIVE');
assert(isDueDateEarlierThanStart('2026-10-01', '2026-10-05') === false, 'isDueDateEarlierThanStart() passes valid date range', 'POSITIVE');
assert(normalizeDateStringToIso('2026-10-05') === '2026-10-05', 'normalizeDateStringToIso() preserves valid ISO date', 'POSITIVE');

// Negative Flows
assert(isDueDateEarlierThanStart('2026-10-10', '2026-10-01') === true, 'isDueDateEarlierThanStart() catches invalid due date before start date', 'NEGATIVE');
assert(formatDate(null) === 'N/A', 'formatDate() handles null date input safely', 'NEGATIVE');
assert(normalizeDateStringToIso('invalid-date-string') === null, 'normalizeDateStringToIso() rejects corrupt date string', 'NEGATIVE');


// ----------------------------------------------------
// 2. CSV PARSER ENGINE
// ----------------------------------------------------
console.log('\n--- 2. CSV Parser Engine ---');
// Positive Flows
const validCsv = `id,title,category,priority,start_date,due_date,status\nT-1,Task One,Work,High,2026-10-01,2026-10-05,Pending`;
const parsedValid = parseCsvString(validCsv);
assert(parsedValid.data.length === 1 && parsedValid.data[0].title === 'Task One', 'parseCsvString() parses valid standard CSV with headers', 'POSITIVE');

const headerlessCsv = `101,Headerless Task,Design,Medium,2026-10-02,2026-10-06,Completed`;
const parsedHeaderless = parseCsvString(headerlessCsv);
assert(parsedHeaderless.data.length === 1 && parsedHeaderless.data[0].title === 'Headerless Task', 'parseCsvString() auto-detects headerless CSV columns', 'POSITIVE');

// Negative Flows
const emptyCsv = ``;
const parsedEmpty = parseCsvString(emptyCsv);
assert(parsedEmpty.data.length === 0, 'parseCsvString() handles empty CSV string safely without throwing', 'NEGATIVE');


// ----------------------------------------------------
// 3. CSV VALIDATOR & BUSINESS RULES
// ----------------------------------------------------
console.log('\n--- 3. CSV Validator & Business Rules ---');
// Positive Flows
const positiveRecords = [
  { id: 'T-10', title: 'Clean Task', priority: 'urgent', status: 'done', start_date: '2026-10-01', due_date: '2026-10-05' },
];
const valPos = validateCsvRecords(positiveRecords, []);
assert(valPos.validTasks.length === 1, 'validateCsvRecords() accepts valid task record', 'POSITIVE');
assert(valPos.validTasks[0].priority === 'High', 'validateCsvRecords() normalizes priority "urgent" -> "High"', 'POSITIVE');
assert(valPos.validTasks[0].status === 'Completed', 'validateCsvRecords() normalizes status "done" -> "Completed"', 'POSITIVE');

// Negative Flows (Field validation & constraints)
const negativeRecords = [
  { id: 'T-11', title: '', priority: 'Medium', status: 'Pending', start_date: '2026-10-01', due_date: '2026-10-05' }, // Empty title
  { id: 'T-12', title: 'Bad Dates', priority: 'Medium', status: 'Pending', start_date: '2026-10-10', due_date: '2026-10-01' }, // Due < Start
  { id: 'T-13', title: 'Bad Status', priority: 'Medium', status: 'UnknownStatus', start_date: '2026-10-01', due_date: '2026-10-05' }, // Bad status
];
const valNeg = validateCsvRecords(negativeRecords, []);
assert(valNeg.validTasks.length === 0, 'validateCsvRecords() rejects all 3 invalid records', 'NEGATIVE');
assert(valNeg.errors.length === 3, 'validateCsvRecords() records 3 explicit error messages', 'NEGATIVE');

// Duplicate ID strategy flows
const dupRecords = [
  { id: 'DUP-1', title: 'Task Alpha' },
  { id: 'DUP-1', title: 'Task Beta' },
];
const dupSkip = validateCsvRecords(dupRecords, [], { duplicateStrategy: 'skip' });
assert(dupSkip.errors.length === 1, 'duplicateStrategy="skip" produces validation error for duplicate ID', 'NEGATIVE');

const dupAuto = validateCsvRecords(dupRecords, [], { duplicateStrategy: 'auto_id' });
assert(dupAuto.validTasks.length === 2 && dupAuto.validTasks[1].id !== 'DUP-1', 'duplicateStrategy="auto_id" generates new unique ID for duplicate', 'POSITIVE');


// ----------------------------------------------------
// 4. TASK METRICS & FILTERING ENGINE
// ----------------------------------------------------
console.log('\n--- 4. Task Metrics & Filtering Engine ---');
const sampleTasks = [
  { id: '1', title: 'Alpha Task', category: 'Work', priority: 'High', status: 'Pending' },
  { id: '2', title: 'Beta Task', category: 'Personal', priority: 'Low', status: 'Completed' },
  { id: '3', title: 'Gamma Task', category: 'Work', priority: 'Medium', status: 'Pending' },
];

// Positive Flows
const statsPos = selectDashboardStats(sampleTasks);
assert(statsPos.total === 3 && statsPos.completed === 1 && statsPos.pending === 2, 'selectDashboardStats() calculates correct total, completed, pending counts', 'POSITIVE');

const filteredPos = selectFilteredTasks(sampleTasks, { status: 'Pending', sortOrder: 'asc' });
assert(filteredPos.length === 2 && filteredPos[0].title === 'Alpha Task', 'selectFilteredTasks() correctly filters Pending tasks and sorts A-Z', 'POSITIVE');

// Negative Flows
const filteredNoMatch = selectFilteredTasks(sampleTasks, { searchQuery: 'NonExistentTaskQuery123' });
assert(filteredNoMatch.length === 0, 'selectFilteredTasks() handles zero search matches safely', 'NEGATIVE');

const emptyTaskArrayStats = selectDashboardStats(null);
assert(emptyTaskArrayStats.total === 0 && emptyTaskArrayStats.completionPercentage === 0, 'selectDashboardStats() handles null task array safely without crashing', 'NEGATIVE');


console.log('\n===========================================================');
console.log(`  Test Results Summary: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
console.log('===========================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
