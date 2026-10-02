import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Settings,
  LayoutGrid,
  CheckCircle2,
  Clock,
  Calendar,
  UploadCloud,
  ListTodo,
  Plus,
  Sparkles,
  ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '../src/theme/ThemeContext';
import { useTasks } from '../src/hooks/useTasks';
import { AppHeader } from '../src/components/common/AppHeader';
import { DashboardStatCard } from '../src/components/dashboard/DashboardStatCard';
import { TaskCard } from '../src/components/task/TaskCard';
import { LoadingState } from '../src/components/common/LoadingState';
import { ErrorState } from '../src/components/common/ErrorState';
import { ConfirmDialog } from '../src/components/common/ConfirmDialog';
import { spacing, borderRadius } from '../src/constants/spacing';
import { typography } from '../src/constants/typography';

export default function DashboardScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const {
    tasks,
    isLoading,
    error,
    dashboardStats,
    toggleTaskStatus,
    deleteTask,
    clearError,
  } = useTasks();

  const [deleteTaskId, setDeleteTaskId] = useState(null);

  const confirmDelete = useCallback(async () => {
    if (deleteTaskId) {
      await deleteTask(deleteTaskId);
      setDeleteTaskId(null);
    }
  }, [deleteTaskId, deleteTask]);

  if (isLoading) {
    return <LoadingState message="Loading your dashboard..." />;
  }

  const recentTasks = (tasks || []).slice(0, 3);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader
        title="TaskFlow"
        rightAction={
          <TouchableOpacity
            style={[
              styles.headerIconBtn,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => router.push('/settings')}
            activeOpacity={0.7}
          >
            <Settings size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {error && <ErrorState message={error} onRetry={clearError} />}

        {/* Hero Welcome Banner */}
        <View style={[styles.welcomeCard, { backgroundColor: colors.primary }]}>
          <View style={styles.welcomeTopRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.badgeLabel}>
                <Sparkles size={12} color="#ffffff" style={{ marginRight: 4 }} />
                <Text style={styles.badgeLabelText}>PRODUCTIVITY DASHBOARD</Text>
              </View>
              <Text style={styles.welcomeTitle}>Welcome Back 👋</Text>
              <Text style={styles.welcomeSubtitle}>
                You have <Text style={styles.highlightText}>{dashboardStats.pending}</Text> pending tasks requiring your focus today.
              </Text>
            </View>

            <View style={styles.circleProgressContainer}>
              <Text style={styles.circleProgressValue}>{dashboardStats.completionPercentage}%</Text>
              <Text style={styles.circleProgressLabel}>Done</Text>
            </View>
          </View>
          
          <View style={styles.progressRow}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${dashboardStats.completionPercentage}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Dashboard Stat Cards */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Overview Statistics
        </Text>
        
        <View style={styles.statsGrid}>
          <DashboardStatCard
            title="Total Tasks"
            count={dashboardStats.total}
            icon={<LayoutGrid size={22} color={colors.primary} />}
            colorBg={colors.primaryLight}
            colorText={colors.primary}
            onPress={() => router.push({ pathname: '/tasks', params: { status: 'All' } })}
          />
          <DashboardStatCard
            title="Completed"
            count={dashboardStats.completed}
            icon={<CheckCircle2 size={22} color={colors.statusCompleted} />}
            colorBg={colors.statusCompletedBg}
            colorText={colors.statusCompleted}
            onPress={() => router.push({ pathname: '/tasks', params: { status: 'Completed' } })}
          />
          <DashboardStatCard
            title="Pending"
            count={dashboardStats.pending}
            icon={<Clock size={22} color={colors.statusPending} />}
            colorBg={colors.statusPendingBg}
            colorText={colors.statusPending}
            onPress={() => router.push({ pathname: '/tasks', params: { status: 'Pending' } })}
          />
          <DashboardStatCard
            title="Today's Tasks"
            count={dashboardStats.today}
            icon={<Calendar size={22} color={colors.priorityMedium} />}
            colorBg={colors.priorityMediumBg}
            colorText={colors.priorityMedium}
            onPress={() => router.push({ pathname: '/tasks', params: { todayOnly: 'true' } })}
          />
        </View>

        {/* Quick Action Navigation Buttons */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={[
              styles.actionCard,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}
            onPress={() => router.push('/tasks')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconWrapper, { backgroundColor: colors.primaryLight }]}>
              <ListTodo size={22} color={colors.primary} />
            </View>
            <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
              View All Tasks
            </Text>
            <Text style={[styles.actionSubtitle, { color: colors.textMuted }]}>
              Search, filter & sort
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionCard,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}
            onPress={() => router.push('/bulk-upload')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconWrapper, { backgroundColor: colors.primaryLight }]}>
              <UploadCloud size={22} color={colors.primary} />
            </View>
            <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
              Bulk Upload
            </Text>
            <Text style={[styles.actionSubtitle, { color: colors.textMuted }]}>
              Import CSV tasks
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Tasks List */}
        {recentTasks.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.recentHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: 0 }]}>
                Recent Tasks
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/tasks')}
                style={styles.seeAllBtn}
                activeOpacity={0.7}
              >
                <Text style={[styles.seeAllText, { color: colors.primary }]}>
                  See All
                </Text>
                <ChevronRight size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={toggleTaskStatus}
                onDelete={(id) => setDeleteTaskId(id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button (+) */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/tasks/create')}
        activeOpacity={0.85}
      >
        <Plus size={28} color="#ffffff" />
      </TouchableOpacity>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        visible={deleteTaskId !== null}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmTitle="Delete"
        isDanger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTaskId(null)}
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
    paddingBottom: 100,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
    elevation: 4,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  welcomeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  badgeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  badgeLabelText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  welcomeTitle: {
    color: '#ffffff',
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  welcomeSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: typography.fontSize.sm,
    marginTop: 4,
    lineHeight: 18,
  },
  highlightText: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  circleProgressContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  circleProgressValue: {
    color: '#ffffff',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  circleProgressLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 9,
    fontWeight: typography.fontWeight.semibold,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.full,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actionCard: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  actionIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  actionSubtitle: {
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  recentSection: {
    marginTop: spacing.xs,
  },
  recentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
});
