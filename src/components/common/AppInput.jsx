import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { AlertCircle, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export const AppInput = ({
  label,
  error,
  containerStyle,
  style,
  maxLength,
  showCharCount = false,
  isValid = false,
  ...props
}) => {
  const { colors } = useTheme();

  const currentLength = (props.value || '').length;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelRow}>
        {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}
        {showCharCount && maxLength ? (
          <Text
            style={[
              styles.charCounter,
              { color: currentLength >= maxLength ? colors.danger : colors.textMuted },
            ]}
          >
            {currentLength}/{maxLength}
          </Text>
        ) : null}
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              color: colors.textPrimary,
              borderColor: error ? colors.danger : isValid ? colors.success : colors.border,
            },
            props.multiline ? styles.multiline : null,
            style,
          ]}
          placeholderTextColor={colors.textMuted}
          maxLength={maxLength}
          {...props}
        />
        {error ? (
          <AlertCircle
            size={18}
            color={colors.danger}
            style={[styles.statusIcon, props.multiline ? styles.statusIconMultiline : null]}
          />
        ) : isValid ? (
          <CheckCircle2
            size={18}
            color={colors.success}
            style={[styles.statusIcon, props.multiline ? styles.statusIconMultiline : null]}
          />
        ) : null}
      </View>

      {error ? (
        <View style={styles.errorRow}>
          <AlertCircle size={14} color={colors.danger} style={{ marginRight: 4 }} />
          <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  charCounter: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingRight: 40,
    fontSize: typography.fontSize.md,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  statusIcon: {
    position: 'absolute',
    right: 12,
  },
  statusIconMultiline: {
    top: 14,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  error: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
});
