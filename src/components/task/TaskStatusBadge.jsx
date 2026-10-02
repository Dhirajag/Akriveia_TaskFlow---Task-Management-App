import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, Clock } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export const TaskStatusBadge = ({ status }) => {
  const { colors } = useTheme();

  const isCompleted = status === 'Completed';
  const bg = isCompleted ? colors.statusCompletedBg : colors.statusPendingBg;
  const textColor = isCompleted ? colors.statusCompleted : colors.statusPending;

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      {isCompleted ? (
        <CheckCircle2 size={14} color={textColor} style={styles.icon} />
      ) : (
        <Clock size={14} color={textColor} style={styles.icon} />
      )}
      <Text style={[styles.text, { color: textColor }]}>
        {isCompleted ? 'Completed' : 'Pending'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
});
