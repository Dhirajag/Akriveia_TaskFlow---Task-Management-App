import { normalizeDateStringToIso, isDueDateEarlierThanStart, getTodayIsoDate } from '../../utils/date';
import { generateTaskId } from '../../utils/id';

// Helper to look up values using multiple case-insensitive key aliases
const getFieldValue = (record, aliases) => {
  if (!record || typeof record !== 'object') return undefined;
  const keys = Object.keys(record);
  for (const alias of aliases) {
    const matchedKey = keys.find(
      (k) => k.trim().toLowerCase() === alias.trim().toLowerCase()
    );
    if (matchedKey && record[matchedKey] !== undefined && record[matchedKey] !== null) {
      const val = String(record[matchedKey]).trim();
      if (val !== '') return val;
    }
  }
  return undefined;
};

export const validateCsvRecords = (records, existingTasks = [], options = {}) => {
  const { duplicateStrategy = 'skip' } = options; // 'skip' or 'auto_id'
  console.log(`[CsvValidator] Validating ${records.length} CSV records with duplicateStrategy="${duplicateStrategy}"...`);
  
  const validTasks = [];
  const errors = [];
  let duplicateCount = 0;

  const existingIds = new Set((existingTasks || []).map((t) => String(t.id).toLowerCase()));
  const csvSeenIds = new Set();
  const todayStr = getTodayIsoDate();

  records.forEach((record, index) => {
    const rowNumber = index + 2; // Row 1 is header
    const rowErrors = [];

    // 1. Title Extraction & Validation
    const title = getFieldValue(record, [
      'title',
      'task_title',
      'task title',
      'task',
      'name',
      'subject',
      'item',
      'summary',
    ]);
    if (!title) {
      rowErrors.push('Title is missing or empty.');
    }

    // 2. Description
    const description =
      getFieldValue(record, ['description', 'details', 'notes', 'note', 'desc']) || '';

    // 3. Category
    const category =
      getFieldValue(record, ['category', 'tag', 'tags', 'project', 'type', 'group']) ||
      'General';

    // 4. Priority Normalization
    const rawPriority = getFieldValue(record, [
      'priority',
      'importance',
      'urgency',
      'prio',
    ]);
    let normalizedPriority = 'Medium';
    if (rawPriority) {
      const lowerP = rawPriority.toLowerCase();
      if (['high', 'h', 'urgent', 'critical', '3'].includes(lowerP)) {
        normalizedPriority = 'High';
      } else if (['low', 'l', 'minor', '1'].includes(lowerP)) {
        normalizedPriority = 'Low';
      } else if (['medium', 'med', 'm', 'normal', '2'].includes(lowerP)) {
        normalizedPriority = 'Medium';
      } else {
        rowErrors.push(`Invalid Priority "${rawPriority}". Must be Low, Medium, or High.`);
      }
    }

    // 5. Status Normalization
    const rawStatus = getFieldValue(record, [
      'status',
      'state',
      'condition',
      'complete',
      'completed',
    ]);
    let normalizedStatus = 'Pending';
    if (rawStatus) {
      const lowerS = rawStatus.toLowerCase();
      if (
        ['completed', 'complete', 'done', 'finished', 'true', '1', 'yes'].includes(
          lowerS
        )
      ) {
        normalizedStatus = 'Completed';
      } else if (
        ['pending', 'open', 'todo', 'to-do', 'in progress', 'false', '0', 'no'].includes(
          lowerS
        )
      ) {
        normalizedStatus = 'Pending';
      } else {
        rowErrors.push(
          `Invalid Status "${rawStatus}". Must be Pending or Completed.`
        );
      }
    }

    // 6. Dates Extraction & Validation
    const rawStartDate = getFieldValue(record, [
      'start_date',
      'startdate',
      'start date',
      'created_date',
      'begin_date',
      'start',
      'created',
    ]);
    const rawDueDate = getFieldValue(record, [
      'due_date',
      'duedate',
      'due date',
      'deadline',
      'end_date',
      'target_date',
      'due',
    ]);

    let startDateIso = rawStartDate ? normalizeDateStringToIso(rawStartDate) : todayStr;
    let dueDateIso = rawDueDate ? normalizeDateStringToIso(rawDueDate) : startDateIso;

    if (rawStartDate && !startDateIso) {
      rowErrors.push(`Invalid start date format (received "${rawStartDate}").`);
    }
    if (rawDueDate && !dueDateIso) {
      rowErrors.push(`Invalid due date format (received "${rawDueDate}").`);
    }

    if (startDateIso && dueDateIso) {
      if (isDueDateEarlierThanStart(startDateIso, dueDateIso)) {
        rowErrors.push(
          `Due date (${dueDateIso}) cannot be earlier than start date (${startDateIso}).`
        );
      }
    }

    // 7. Duplicate & Unique ID Handling
    const rawId = getFieldValue(record, ['id', 'task_id', 'taskid', 'key']);
    let finalId = rawId ? rawId.trim() : '';

    if (finalId) {
      const lowerId = finalId.toLowerCase();
      if (existingIds.has(lowerId)) {
        duplicateCount++;
        if (duplicateStrategy === 'auto_id') {
          finalId = generateTaskId();
        } else {
          rowErrors.push(
            `Duplicate Task ID "${finalId}" already exists in the application.`
          );
        }
      } else if (csvSeenIds.has(lowerId)) {
        duplicateCount++;
        if (duplicateStrategy === 'auto_id') {
          finalId = generateTaskId();
        } else {
          rowErrors.push(
            `Duplicate Task ID "${finalId}" appears multiple times in this CSV.`
          );
        }
      } else {
        csvSeenIds.add(lowerId);
      }
    } else {
      finalId = generateTaskId();
    }

    // Accumulate Results
    if (rowErrors.length > 0) {
      errors.push({
        rowNumber,
        taskId: finalId || `Row ${rowNumber}`,
        title: title || 'Untitled Task',
        message: rowErrors.join(' '),
        rawData: record,
      });
    } else {
      const now = new Date().toISOString();
      validTasks.push({
        id: finalId,
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        priority: normalizedPriority,
        startDate: startDateIso,
        dueDate: dueDateIso,
        status: normalizedStatus,
        createdAt: now,
        updatedAt: now,
      });
    }
  });

  console.log(`[CsvValidator] Validation complete. Valid=${validTasks.length}, Errors=${errors.length}, Duplicates=${duplicateCount}.`);

  return {
    validTasks,
    errors,
    duplicateCount,
  };
};
