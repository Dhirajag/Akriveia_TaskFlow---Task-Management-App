import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { AppButton } from '../common/AppButton';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export const ImportSummaryModal = ({
  visible,
  summary,
  onClose,
  onViewTasks,
}) => {
  const { colors } = useTheme();

  if (!visible || !summary) return null;

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={styles.icon}>🎉</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Import Completed</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Summary of CSV dynamic processing:
          </Text>

          <View style={styles.grid}>
            <View style={[styles.gridItem, { backgroundColor: colors.surface }]}>
              <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
                {summary.total}
              </Text>
              <Text style={[styles.gridLabel, { color: colors.textMuted }]}>Total Records</Text>
            </View>

            <View style={[styles.gridItem, { backgroundColor: colors.successBg }]}>
              <Text style={[styles.gridValue, { color: colors.success }]}>
                {summary.imported}
              </Text>
              <Text style={[styles.gridLabel, { color: colors.success }]}>Imported</Text>
            </View>

            <View style={[styles.gridItem, { backgroundColor: colors.warningBg }]}>
              <Text style={[styles.gridValue, { color: colors.warning }]}>
                {summary.duplicates}
              </Text>
              <Text style={[styles.gridLabel, { color: colors.warning }]}>Duplicates</Text>
            </View>

            <View style={[styles.gridItem, { backgroundColor: colors.dangerBg }]}>
              <Text style={[styles.gridValue, { color: colors.danger }]}>
                {summary.failed}
              </Text>
              <Text style={[styles.gridLabel, { color: colors.danger }]}>Failed Rows</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <AppButton
              title="Close"
              variant="secondary"
              onPress={onClose}
              style={{ flex: 1 }}
            />
            <AppButton
              title="View Tasks"
              onPress={onViewTasks}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  icon: {
    fontSize: 44,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
    width: '100%',
  },
  gridItem: {
    width: '47%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  gridValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  gridLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
});
