import { parseCsvString } from './csvParser';
import { validateCsvRecords } from './csvValidator';

export const processCsvImport = (csvContent, existingTasks, options = {}) => {
  const parseResult = parseCsvString(csvContent);

  if (parseResult.data.length === 0) {
    return {
      total: 0,
      imported: 0,
      failed: 0,
      duplicates: 0,
      errors: [
        {
          rowNumber: 0,
          message: parseResult.errors.length > 0 
            ? parseResult.errors.join('; ') 
            : 'CSV file is empty or could not be parsed.',
          rawData: {},
        },
      ],
      importedTasks: [],
    };
  }

  const validationResult = validateCsvRecords(parseResult.data, existingTasks, options);

  const totalRows = parseResult.data.length;
  const failedRowsCount = new Set(validationResult.errors.map((e) => e.rowNumber)).size;
  const importedCount = validationResult.validTasks.length;

  return {
    total: totalRows,
    imported: importedCount,
    failed: failedRowsCount,
    duplicates: validationResult.duplicateCount,
    errors: validationResult.errors,
    importedTasks: validationResult.validTasks,
  };
};
