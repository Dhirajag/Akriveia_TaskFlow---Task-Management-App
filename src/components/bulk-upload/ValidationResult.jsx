import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { formatDate } from '../../utils/date';

export const ValidationResult = ({
  errors,
  validTasks = [],
  importedCount,
  totalCount,
  duplicateStrategy,
  onStrategyChange,
}) => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('valid'); // 'valid' | 'errors'

  if (totalCount === 0) return null;

  const hasErrors = errors.length > 0;

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return { bg: colors.dangerBg, text: colors.danger };
      case 'Low':
        return { bg: colors.surface, text: colors.textSecondary };
      case 'Medium':
      default:
        return { bg: colors.warningBg, text: colors.warning };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        Validation & Import Summary
      </Text>

      {/* Summary Metric Stat Cards */}
      <View style={styles.statSummaryRow}>
        <TouchableOpacity
          style={[
            styles.statBox,
            { backgroundColor: colors.successBg },
            activeTab === 'valid' && styles.activeStatBox,
          ]}
          onPress={() => setActiveTab('valid')}
          activeOpacity={0.8}
        >
          <Text style={[styles.statNumber, { color: colors.success }]}>
            {importedCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.success }]}>Valid Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statBox,
            {
              backgroundColor: hasErrors ? colors.dangerBg : colors.surface,
            },
            activeTab === 'errors' && styles.activeStatBox,
          ]}
          onPress={() => setActiveTab('errors')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.statNumber,
              { color: hasErrors ? colors.danger : colors.textMuted },
            ]}
          >
            {errors.length}
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: hasErrors ? colors.danger : colors.textMuted },
            ]}
          >
            Errors Found
          </Text>
        </TouchableOpacity>
      </View>

      {/* Strategy Control for Duplicate Handling */}
      {hasErrors && (
        <View style={[styles.strategyCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={[styles.strategyTitle, { color: colors.textPrimary }]}>
            Duplicate ID Resolution Strategy:
          </Text>
          <View style={styles.strategyRow}>
            <TouchableOpacity
              style={[
                styles.strategyOption,
                duplicateStrategy === 'skip' && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
                duplicateStrategy !== 'skip' && {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => onStrategyChange('skip')}
            >
              <Text
                style={[
                  styles.strategyText,
                  { color: duplicateStrategy === 'skip' ? '#FFFFFF' : colors.textPrimary },
                ]}
              >
                Skip Duplicate Rows
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.strategyOption,
                duplicateStrategy === 'auto_id' && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
                duplicateStrategy !== 'auto_id' && {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => onStrategyChange('auto_id')}
            >
              <Text
                style={[
                  styles.strategyText,
                  { color: duplicateStrategy === 'auto_id' ? '#FFFFFF' : colors.textPrimary },
                ]}
              >
                Auto-Generate New IDs
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Tab Selector Header */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'valid' && [styles.activeTab, { backgroundColor: colors.cardBackground }],
          ]}
          onPress={() => setActiveTab('valid')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'valid' ? colors.primary : colors.textSecondary },
            ]}
          >
            Valid Tasks Preview ({validTasks.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'errors' && [styles.activeTab, { backgroundColor: colors.cardBackground }],
          ]}
          onPress={() => setActiveTab('errors')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'errors' ? colors.danger : colors.textSecondary },
            ]}
          >
            Errors ({errors.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB CONTENT: Valid Tasks Preview */}
      {activeTab === 'valid' && (
        <View style={styles.previewContainer}>
          {validTasks.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.surface }]}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                No valid task records to display. Check the errors tab.
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.previewScroll} nestedScrollEnabled>
              {validTasks.map((item, idx) => {
                const prioStyle = getPriorityStyle(item.priority);
                return (
                  <View
                    key={item.id || idx}
                    style={[
                      styles.previewCard,
                      { backgroundColor: colors.cardBackground, borderColor: colors.border },
                    ]}
                  >
                    <View style={styles.cardHeader}>
                      <Text style={[styles.taskTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <View style={[styles.prioPill, { backgroundColor: prioStyle.bg }]}>
                        <Text style={[styles.prioText, { color: prioStyle.text }]}>
                          {item.priority}
                        </Text>
                      </View>
                    </View>

                    {item.description ? (
                      <Text style={[styles.taskDesc, { color: colors.textSecondary }]} numberOfLines={1}>
                        {item.description}
                      </Text>
                    ) : null}

                    <View style={styles.cardFooter}>
                      <Text style={[styles.catBadge, { color: colors.primary, backgroundColor: colors.primaryLight }]}>
                        📁 {item.category}
                      </Text>
                      <Text style={[styles.dateText, { color: colors.textMuted }]}>
                        📅 {formatDate(item.startDate, 'MMM d')} - {formatDate(item.dueDate, 'MMM d')}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      )}

      {/* TAB CONTENT: Errors List */}
      {activeTab === 'errors' && (
        <View style={styles.errorListContainer}>
          {!hasErrors ? (
            <View style={[styles.cleanBox, { backgroundColor: colors.successBg }]}>
              <Text style={[styles.cleanText, { color: colors.success }]}>
                ✓ Perfect! All records passed validation cleanly without any errors.
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.errorScroll} nestedScrollEnabled>
              {errors.map((err, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.errorRow,
                    { backgroundColor: colors.dangerBg, borderColor: colors.danger },
                  ]}
                >
                  <View style={styles.errorHeaderRow}>
                    <Text style={[styles.errorRowTitle, { color: colors.danger }]}>
                      Line {err.rowNumber} {err.taskId ? `[${err.taskId}]` : ''}
                    </Text>
                  </View>
                  <Text style={[styles.errorMessage, { color: colors.textPrimary }]}>
                    {err.message}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.md,
  },
  statSummaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statBox: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  activeStatBox: {
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  statNumber: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    marginTop: 2,
  },
  strategyCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  strategyTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  strategyRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  strategyOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  strategyText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  activeTab: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  previewContainer: {
    maxHeight: 280,
  },
  previewScroll: {
    maxHeight: 280,
  },
  previewCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    flex: 1,
    marginRight: spacing.sm,
  },
  prioPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  prioText: {
    fontSize: typography.fontSize.xs - 2,
    fontWeight: typography.fontWeight.bold,
  },
  taskDesc: {
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catBadge: {
    fontSize: typography.fontSize.xs - 1,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  dateText: {
    fontSize: typography.fontSize.xs - 1,
  },
  errorListContainer: {
    maxHeight: 280,
  },
  errorScroll: {
    maxHeight: 280,
  },
  errorRow: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    marginBottom: spacing.sm,
  },
  errorHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorRowTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  errorMessage: {
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  cleanBox: {
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  cleanText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  emptyBox: {
    padding: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.xs,
  },
});
