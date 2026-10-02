import Papa from 'papaparse';

export const parseCsvString = (csvContent) => {
  console.log('[CsvParser] Starting raw CSV string parsing...');
  const result = Papa.parse(csvContent, {
    header: false,
    skipEmptyLines: 'greedy',
    transform: (val) => String(val).trim(),
  });

  if (!result.data || result.data.length === 0) {
    console.log('[CsvParser] Parsed CSV data is empty or unparseable.');
    return {
      data: [],
      errors: result.errors.map((e) => e.message || 'Empty or unparseable CSV'),
    };
  }

  const firstRow = result.data[0];
  const knownHeaderTokens = [
    'id',
    'title',
    'description',
    'category',
    'priority',
    'start_date',
    'due_date',
    'status',
    'name',
    'task',
    'details',
    'start',
    'due',
    'deadline',
  ];

  // Detect whether row 1 contains field header names
  const isHeaderRow = firstRow.some((col) =>
    knownHeaderTokens.includes(String(col).toLowerCase().trim())
  );

  console.log(`[CsvParser] Header detection result: isHeaderRow=${isHeaderRow}. Total raw lines=${result.data.length}.`);

  let headers = [];
  let dataRows = [];

  if (isHeaderRow) {
    headers = firstRow.map((col) => String(col).trim().toLowerCase());
    dataRows = result.data.slice(1);
  } else {
    // Positional default header fallback for headerless CSV files
    const defaultPositionalHeaders = [
      'id',
      'title',
      'description',
      'category',
      'priority',
      'start_date',
      'due_date',
      'status',
    ];
    headers = firstRow.map((_, idx) => defaultPositionalHeaders[idx] || `col_${idx + 1}`);
    dataRows = result.data;
  }

  const dataObjects = dataRows.map((row) => {
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = row[idx] !== undefined ? String(row[idx]).trim() : '';
    });
    return obj;
  });

  const parseErrors = (result.errors || []).map(
    (e) => `Line ${(e.row ?? 0) + 1}: ${e.message}`
  );

  console.log(`[CsvParser] CSV parsing completed. Generated ${dataObjects.length} records with ${parseErrors.length} parse errors.`);

  return {
    data: dataObjects,
    errors: parseErrors,
  };
};
