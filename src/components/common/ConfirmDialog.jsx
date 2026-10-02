import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { AppButton } from './AppButton';

export const ConfirmDialog = ({
  visible,
  title,
  message,
  confirmTitle = 'Confirm',
  cancelTitle = 'Cancel',
  isDanger = false,
  onConfirm,
  onCancel,
}) => {
  const { colors } = useTheme();

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.dialog, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
              <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
              
              <View style={styles.actionRow}>
                <AppButton
                  title={cancelTitle}
                  variant="secondary"
                  onPress={onCancel}
                  style={styles.actionButton}
                />
                <AppButton
                  title={confirmTitle}
                  variant={isDanger ? 'danger' : 'primary'}
                  onPress={onConfirm}
                  style={styles.actionButton}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  dialog: {
    width: '100%',
    maxWidth: 340,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
