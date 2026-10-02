import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Folder, Calendar, Trash2, Edit3, CheckCircle2, Clock, Hash } from 'lucide-react-native';
import { useTheme } from '../../../src/theme/ThemeContext';
import { useTasks } from '../../../src/hooks/useTasks';
import { AppHeader } from '../../../src/components/common/AppHeader';
import { AppButton } from '../../../src/components/common/AppButton';
import { TaskPriorityBadge } from '../../../src/components/task/TaskPriorityBadge';
import { TaskStatusBadge } from '../../../src/components/task/TaskStatusBadge';
import { EmptyState } from '../../../src/components/common/EmptyState';
import { ConfirmDialog } from '../../../src/components/common/ConfirmDialog';
import { formatDate } from '../../../src/utils/date';
import { spacing, borderRadius } from '../../../src/constants/spacing';
import { typography } from '../../../src/constants/typography';

export default function TaskDetailsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { tasks, toggleTaskStatus, deleteTask } = useTasks();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const task = (tasks || []).find((t) => t.id === id);

  if (!task) {
    console.log(`[TaskDetailsScreen] Task ID "${id}" not found.`);
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <AppHeader title="Task Details" showBack />
        <EmptyState
          title="Task Not Found"
          description="The task you are looking for does not exist or has been deleted."
          actionTitle="Back to Task List"
          onAction={() => router.replace('/tasks')}
        />
      </SafeAreaView>
    );
  }

  const isCompleted = task.status === 'Completed';

  const handleDelete = async () => {
    console.log(`[TaskDetailsScreen] Confirming deletion for task ID "${task.id}" (${task.title})...`);
    await deleteTask(task.id);
    setShowDeleteModal(false);
    console.log(`[TaskDetailsScreen] Task ID "${task.id}" deleted. Redirecting to Task List...`);
    router.replace('/tasks');
  };

  const handleToggle = async () => {
    console.log(`[TaskDetailsScreen] Toggling status for task ID "${task.id}"...`);
    await toggleTaskStatus(task.id);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader
        title="Task Overview"
        showBack
        rightAction={
          <AppButton
            title="Edit"
            variant="outline"
            size="sm"
            onPress={() => router.push(`/tasks/edit/${task.id}`)}
          />
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Alert Banner */}
        <View
          style={[
            styles.statusBanner,
            {
              backgroundColor: isCompleted ? colors.statusCompletedBg : colors.statusPendingBg,
              borderColor: isCompleted ? colors.statusCompleted : colors.statusPending,
            },
          ]}
        >
          {isCompleted ? (
            <CheckCircle2 size={20} color={colors.statusCompleted} style={{ marginRight: spacing.sm }} />
          ) : (
            <Clock size={20} color={colors.statusPending} style={{ marginRight: spacing.sm }} />
          )}
          <Text
            style={[
              styles.statusBannerText,
              { color: isCompleted ? colors.statusCompleted : colors.statusPending },
            ]}
          >
            {isCompleted
              ? 'Task Complete — All objectives for this task have been satisfied.'
              : 'Task Pending — Awaiting execution and completion.'}
          </Text>
        </View>

        {/* Main Header Card */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.badgeRow}>
            <TaskPriorityBadge priority={task.priority} />
            <TaskStatusBadge status={task.status} />
          </View>

          <Text style={[styles.title, { color: colors.textPrimary }]}>{task.title}</Text>
          
          <View style={[styles.categoryBadge, { backgroundColor: colors.surface }]}>
            <Folder size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
            <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
              {task.category}
            </Text>
          </View>

          {task.description ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
                Description
              </Text>
              <Text style={[styles.descriptionText, { color: colors.textPrimary }]}>
                {task.description}
              </Text>
            </View>
          ) : null}

          {/* Dates Metadata Grid */}
          <View style={[styles.datesGrid, { backgroundColor: colors.surface }]}>
            <View style={styles.dateCol}>
              <Text style={[styles.dateLabel, { color: colors.textMuted }]}>Start Date</Text>
              <View style={styles.dateValRow}>
                <Calendar size={14} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={[styles.dateVal, { color: colors.textPrimary }]}>
                  {formatDate(task.startDate)}
                </Text>
              </View>
            </View>

            <View style={styles.dateCol}>
              <Text style={[styles.dateLabel, { color: colors.textMuted }]}>Due Date</Text>
              <View style={styles.dateValRow}>
                <Calendar size={14} color={colors.danger} style={{ marginRight: 4 }} />
                <Text style={[styles.dateVal, { color: colors.textPrimary }]}>
                  {formatDate(task.dueDate)}
                </Text>
              </View>
            </View>
          </View>

          {/* Technical Metadata Row */}
          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Hash size={12} color={colors.textMuted} style={{ marginRight: 2 }} />
              <Text style={[styles.metaText, { color: colors.textMuted }]}>
                ID: {task.id}
              </Text>
            </View>
            <Text style={[styles.metaText, { color: colors.textMuted }]}>
              Updated: {formatDate(task.updatedAt, 'MMM dd, HH:mm')}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <AppButton
            title={isCompleted ? 'Re-open as Pending' : 'Mark as Completed'}
            variant={isCompleted ? 'secondary' : 'primary'}
            onPress={handleToggle}
            icon={<CheckCircle2 size={18} color={isCompleted ? colors.textPrimary : '#ffffff'} />}
            style={{ marginBottom: spacing.md }}
          />

          <View style={styles.secondaryActions}>
            <AppButton
              title="Edit Task"
              variant="outline"
              onPress={() => router.push(`/tasks/edit/${task.id}`)}
              icon={<Edit3 size={16} color={colors.primary} />}
              style={{ flex: 1 }}
            />
            <AppButton
              title="Delete Task"
              variant="danger"
              onPress={() => setShowDeleteModal(true)}
              icon={<Trash2 size={16} color="#ffffff" />}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <ConfirmDialog
        visible={showDeleteModal}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmTitle="Delete"
        isDanger
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
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
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  statusBannerText: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  card: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginBottom: spacing.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  categoryText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  descriptionText: {
    fontSize: typography.fontSize.md,
    lineHeight: 22,
  },
  datesGrid: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  dateCol: {
    flex: 1,
  },
  dateLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    marginBottom: 4,
  },
  dateValRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateVal: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  metaCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: typography.fontSize.xs,
  },
  actionSection: {
    marginBottom: spacing.xxl,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
