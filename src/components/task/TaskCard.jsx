import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Trash2, CheckCircle2, Circle, Calendar, Folder } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { TaskStatusBadge } from './TaskStatusBadge';
import { formatDate } from '../../utils/date';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

const TaskCardComponent = ({
  task,
  onToggleComplete,
  onDelete,
}) => {
  const { colors } = useTheme();
  const router = useRouter();

  const isCompleted = task.status === 'Completed';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        },
      ]}
      onPress={() => router.push(`/tasks/details/${task.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.checkboxTouch}
          onPress={() => onToggleComplete(task.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isCompleted ? (
            <CheckCircle2 size={24} color={colors.statusCompleted} />
          ) : (
            <Circle size={24} color={colors.textMuted} />
          )}
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              { color: colors.textPrimary },
              isCompleted && [styles.completedTitle, { color: colors.textMuted }],
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          <View style={styles.categoryRow}>
            <Folder size={12} color={colors.textMuted} style={{ marginRight: 4 }} />
            <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
              {task.category}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => onDelete(task.id)}
          style={[styles.deleteButton, { backgroundColor: colors.surface }]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Trash2 size={16} color={colors.danger} />
        </TouchableOpacity>
      </View>

      {task.description ? (
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {task.description}
        </Text>
      ) : null}

      <View style={[styles.footerRow, { borderTopColor: colors.border }]}>
        <View style={styles.badgeGroup}>
          <TaskPriorityBadge priority={task.priority} />
          <TaskStatusBadge status={task.status} />
        </View>

        <View style={styles.dateGroup}>
          <Calendar size={13} color={colors.textMuted} style={styles.dateIcon} />
          <Text style={[styles.dateText, { color: colors.textMuted }]}>
            Due: {formatDate(task.dueDate)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const TaskCard = memo(TaskCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxTouch: {
    marginRight: spacing.md,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  categoryText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.sm,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
  },
  badgeGroup: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 4,
  },
  dateText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
});
