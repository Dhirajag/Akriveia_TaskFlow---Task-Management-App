import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export const TaskPriorityBadge = ({ priority }) => {
  const { colors } = useTheme();

  const getStyle = () => {
    switch (priority) {
      case 'High':
        return { bg: colors.priorityHighBg, text: colors.priorityHigh };
      case 'Medium':
        return { bg: colors.priorityMediumBg, text: colors.priorityMedium };
      case 'Low':
      default:
        return { bg: colors.priorityLowBg, text: colors.priorityLow };
    }
  };

  const styleConfig = getStyle();

  return (
    <View style={[styles.badge, { backgroundColor: styleConfig.bg }]}>
      <Text style={[styles.text, { color: styleConfig.text }]}>{priority}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
});
