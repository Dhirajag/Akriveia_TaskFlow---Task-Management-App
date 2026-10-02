import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export const LoadingState = ({
  message = 'Loading tasks...',
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && (
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
});
