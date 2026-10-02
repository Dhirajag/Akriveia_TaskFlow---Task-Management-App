import { formatDate, isDueDateEarlierThanStart, normalizeDateStringToIso } from '../src/utils/date.js';
import { parseCsvString } from '../src/services/csv/csvParser.js';
import { validateCsvRecords } from '../src/services/csv/csvValidator.js';
import { selectDashboardStats, selectFilteredTasks } from '../src/features/tasks/taskSelectors.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`[FAIL] ${message}`);
  }
}

console.log('====================================================');
console.log('   TaskFlow Automated Test Suite Running...        ');
console.log('====================================================\n');

// 1. DATE UTILS TESTS
console.log('--- 1. Testing Date Utilities ---');
assert(formatDate('2026-10-01') === 'Oct 01, 2026', 'formatDate() correctly formats YYYY-MM-DD');
assert(isDueDateEarlierThanStart('2026-10-10', '2026-10-01') === true, 'isDueDateEarlierThanStart() detects invalid earlier due date');
assert(isDueDateEarlierThanStart('2026-10-01', '2026-10-05') === false, 'isDueDateEarlierThanStart() accepts valid due date');
assert(normalizeDateStringToIso('2026-10-05') === '2026-10-05', 'normalizeDateStringToIso() preserves valid ISO date');
assert(normalizeDateStringToIso('05/10/2026') !== null, 'normalizeDateStringToIso() handles slash date format');

// 2. CSV PARSER TESTS
console.log('\n--- 2. Testing CSV Parser Engine ---');
const standardCsv = `id,title,description,category,priority,start_date,due_date,status
T-1,Test Task,Description,Work,High,2026-10-01,2026-10-05,Pending`;

const parsedStandard = parseCsvString(standardCsv);
assert(parsedStandard.data.length === 1, 'parseCsvString() parses 1 standard record');
assert(parsedStandard.data[0].title === 'Test Task', 'parseCsvString() extracts record title correctly');

const headerlessCsv = `101,Headerless Task,No header,Design,Medium,2026-10-02,2026-10-06,Completed`;
const parsedHeaderless = parseCsvString(headerlessCsv);
assert(parsedHeaderless.data.length === 1, 'parseCsvString() parses 1 headerless record');
assert(parsedHeaderless.data[0].title === 'Headerless Task', 'parseCsvString() auto-detects headerless columns');

// 3. CSV VALIDATOR TESTS
console.log('\n--- 3. Testing CSV Validator Engine ---');
const recordsToValidate = [
  { title: 'Valid Task', priority: 'high', status: 'pending', start_date: '2026-10-01', due_date: '2026-10-05' },
  { title: 'Invalid Dates Task', priority: 'Medium', status: 'Pending', start_date: '2026-10-10', due_date: '2026-10-01' },
  { title: '', priority: 'Low', status: 'Pending', start_date: '2026-10-01', due_date: '2026-10-02' },
];

const validationResult = validateCsvRecords(recordsToValidate, []);
assert(validationResult.validTasks.length === 1, 'validateCsvRecords() accepts exactly 1 valid record');
assert(validationResult.errors.length === 2, 'validateCsvRecords() catches 2 row errors (invalid dates & empty title)');
assert(validationResult.validTasks[0].priority === 'High', 'validateCsvRecords() normalizes priority "high" -> "High"');

// Duplicate ID strategy test
const duplicateRecords = [
  { id: 'DUP-1', title: 'Task 1', start_date: '2026-10-01', due_date: '2026-10-02' },
  { id: 'DUP-1', title: 'Task 2', start_date: '2026-10-01', due_date: '2026-10-02' },
];
const dupSkip = validateCsvRecords(duplicateRecords, [], { duplicateStrategy: 'skip' });
assert(dupSkip.validTasks.length === 1, 'duplicateStrategy="skip" skips duplicate ID records');

const dupAuto = validateCsvRecords(duplicateRecords, [], { duplicateStrategy: 'auto_id' });
assert(dupAuto.validTasks.length === 2, 'duplicateStrategy="auto_id" generates new unique IDs for duplicates');

// 4. TASK SELECTORS & FILTERING TESTS
console.log('\n--- 4. Testing Task Selectors & Sorting ---');
const sampleTasks = [
  { id: '1', title: 'Task B', category: 'Work', priority: 'High', status: 'Pending', startDate: '2026-10-01', dueDate: '2026-10-05' },
  { id: '2', title: 'Task A', category: 'Personal', priority: 'Low', status: 'Completed', startDate: '2026-10-01', dueDate: '2026-10-02' },
  { id: '3', title: 'Task C', category: 'Work', priority: 'Medium', status: 'Pending', startDate: '2026-10-02', dueDate: '2026-10-10' },
];

const stats = selectDashboardStats(sampleTasks);
assert(stats.total === 3, 'selectDashboardStats() returns total task count of 3');
assert(stats.completed === 1, 'selectDashboardStats() returns completed count of 1');
assert(stats.pending === 2, 'selectDashboardStats() returns pending count of 2');

const pendingOnly = selectFilteredTasks(sampleTasks, { status: 'Pending', sortOrder: 'asc', sortBy: 'title' });
assert(pendingOnly.length === 2, 'selectFilteredTasks() filters by status="Pending"');
assert(pendingOnly[0].title === 'Task B', 'selectFilteredTasks() sorts alphabetically Task B before Task C');

console.log('\n====================================================');
console.log(`   Test Results: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
console.log('====================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
