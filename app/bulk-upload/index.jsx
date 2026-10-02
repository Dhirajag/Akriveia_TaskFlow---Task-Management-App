import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { useTasks } from '../../src/hooks/useTasks';
import { AppHeader } from '../../src/components/common/AppHeader';
import { FilePicker } from '../../src/components/bulk-upload/FilePicker';
import { ValidationResult } from '../../src/components/bulk-upload/ValidationResult';
import { ImportSummaryModal } from '../../src/components/bulk-upload/ImportSummaryModal';
import { AppButton } from '../../src/components/common/AppButton';
import { parseCsvString } from '../../src/services/csv/csvParser';
import { validateCsvRecords } from '../../src/services/csv/csvValidator';
import { spacing } from '../../src/constants/spacing';

const SAMPLE_CSV_CONTENT = `id,title,description,category,priority,start_date,due_date,status
TASK-101,Design Mobile Wireframes,Create initial wireframes for TaskFlow,Design,High,2026-10-01,2026-10-05,Completed
TASK-102,Setup Zustand Store,Implement local task state management with AsyncStorage,Development,High,2026-10-02,2026-10-06,Completed
TASK-103,Build CSV Validation Engine,Validate input CSV records for required fields and logic,Development,High,2026-10-02,2026-10-08,Pending
TASK-104,Implement Dark Mode Theme,Centralize color design system and support toggle,UI/UX,Medium,2026-10-03,2026-10-07,Pending
TASK-105,Write Unit & Integration Tests,Add test cases for store persistence,Testing,Low,2026-10-05,2026-10-12,Pending
TASK-106,Invalid Date Sample Task,This task has an invalid due date earlier than start date,Testing,Medium,2026-10-10,2026-10-01,Pending
TASK-101,Duplicate ID Record,This record shares an ID with TASK-101 to test duplicate detection,Testing,Low,2026-10-02,2026-10-05,Pending`;

export default function BulkUploadScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { tasks, importTasksFromCsv } = useTasks();

  const [csvContent, setCsvContent] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [validTasks, setValidTasks] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [validCount, setValidCount] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [duplicateStrategy, setDuplicateStrategy] = useState('skip');

  const [summary, setSummary] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilePicked = (content, fileName) => {
    console.log(`[BulkUploadScreen] File picked: "${fileName}". Raw byte length: ${content ? content.length : 0}.`);
    setCsvContent(content);
    setSelectedFileName(fileName);
    runPreviewValidation(content, duplicateStrategy);
  };

  const handleLoadSample = () => {
    console.log('[BulkUploadScreen] Loading built-in sample CSV file...');
    setCsvContent(SAMPLE_CSV_CONTENT);
    setSelectedFileName('sample_tasks.csv');
    runPreviewValidation(SAMPLE_CSV_CONTENT, duplicateStrategy);
  };

  const handleClearFile = () => {
    console.log('[BulkUploadScreen] Clearing currently selected CSV file.');
    setCsvContent(null);
    setSelectedFileName(null);
    setValidTasks([]);
    setValidationErrors([]);
    setValidCount(0);
    setTotalRecords(0);
  };

  const handleStrategyChange = (newStrategy) => {
    console.log(`[BulkUploadScreen] Duplicate resolution strategy changed to: "${newStrategy}".`);
    setDuplicateStrategy(newStrategy);
    if (csvContent) {
      runPreviewValidation(csvContent, newStrategy);
    }
  };

  const runPreviewValidation = (content, strategy) => {
    console.log('[BulkUploadScreen] Running CSV preview validation...');
    const parsed = parseCsvString(content);
    const validation = validateCsvRecords(parsed.data, tasks, {
      duplicateStrategy: strategy,
    });

    console.log(`[BulkUploadScreen] Validation preview complete. Total rows=${parsed.data.length}, Valid=${validation.validTasks.length}, Errors=${validation.errors.length}.`);
    setTotalRecords(parsed.data.length);
    setValidTasks(validation.validTasks);
    setValidCount(validation.validTasks.length);
    setValidationErrors(validation.errors);
  };

  const handleExecuteImport = async () => {
    if (!csvContent) return;
    console.log('[BulkUploadScreen] Executing bulk CSV import...');
    setIsProcessing(true);
    try {
      const result = await importTasksFromCsv(csvContent, {
        duplicateStrategy,
      });
      console.log('[BulkUploadScreen] Bulk import executed successfully:', result);
      setSummary(result);
      setShowSummaryModal(true);
    } catch (err) {
      console.error('[BulkUploadScreen] Error executing bulk import:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Bulk Upload Tasks" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FilePicker
          selectedFileName={selectedFileName}
          onFilePicked={handleFilePicked}
          onLoadSampleCsv={handleLoadSample}
          onClearFile={handleClearFile}
        />

        {totalRecords > 0 && (
          <>
            <ValidationResult
              errors={validationErrors}
              validTasks={validTasks}
              importedCount={validCount}
              totalCount={totalRecords}
              duplicateStrategy={duplicateStrategy}
              onStrategyChange={handleStrategyChange}
            />

            <AppButton
              title={`Import ${validCount} Valid Record${validCount === 1 ? '' : 's'}`}
              onPress={handleExecuteImport}
              disabled={validCount === 0 || isProcessing}
              loading={isProcessing}
              style={{ marginTop: spacing.lg, marginBottom: spacing.xxl }}
            />
          </>
        )}
      </ScrollView>

      {/* Import Summary Modal */}
      <ImportSummaryModal
        visible={showSummaryModal}
        summary={summary}
        onClose={() => setShowSummaryModal(false)}
        onViewTasks={() => {
          setShowSummaryModal(false);
          router.replace('/tasks');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
});
