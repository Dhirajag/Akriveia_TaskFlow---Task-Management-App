import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { AppButton } from './AppButton';

export const ErrorState = ({ message, onRetry }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.dangerBg, borderColor: colors.danger }]}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={[styles.title, { color: colors.danger }]}>Something went wrong</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      {onRetry && (
        <AppButton
          title="Try Again"
          onPress={onRetry}
          variant="outline"
          size="sm"
          style={{ marginTop: spacing.md }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    borderRadius: spacing.md,
    borderWidth: 1,
    alignItems: 'center',
    margin: spacing.lg,
  },
  icon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  message: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
