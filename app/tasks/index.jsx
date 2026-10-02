import React, { useState, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, RotateCcw, Filter, SlidersHorizontal, ArrowUp, ArrowDown } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { useTasks } from '../../src/hooks/useTasks';
import { useTaskFilters } from '../../src/hooks/useTaskFilters';
import { AppHeader } from '../../src/components/common/AppHeader';
import { SearchInput } from '../../src/components/common/SearchInput';
import { TaskFilterModal } from '../../src/components/task/TaskFilterModal';
import { TaskCard } from '../../src/components/task/TaskCard';
import { EmptyState } from '../../src/components/common/EmptyState';
import { ConfirmDialog } from '../../src/components/common/ConfirmDialog';
import { spacing, borderRadius } from '../../src/constants/spacing';
import { typography } from '../../src/constants/typography';

export default function TaskListScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const { tasks, categories, toggleTaskStatus, deleteTask } = useTasks();

  const initialFilters = useMemo(
    () => ({
      status: searchParams.status || 'All',
      category: searchParams.category || 'All',
      priority: searchParams.priority || 'All',
      todayOnly: searchParams.todayOnly === 'true' || searchParams.todayOnly === true,
    }),
    [searchParams.status, searchParams.category, searchParams.priority, searchParams.todayOnly]
  );

  const {
    filters,
    filteredTasks,
    activeFiltersCount,
    setStatusFilter,
    setCategoryFilter,
    setPriorityFilter,
    setTodayOnlyFilter,
    setSearchQuery,
    setSorting,
    resetFilters,
  } = useTaskFilters(tasks, initialFilters);

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  const confirmDelete = useCallback(async () => {
    if (deleteTaskId) {
      await deleteTask(deleteTaskId);
      setDeleteTaskId(null);
    }
  }, [deleteTaskId, deleteTask]);

  const renderTaskItem = useCallback(
    ({ item }) => (
      <TaskCard
        task={item}
        onToggleComplete={toggleTaskStatus}
        onDelete={(id) => setDeleteTaskId(id)}
      />
    ),
    [toggleTaskStatus]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const getSortLabel = (sortBy, sortOrder) => {
    const labels = {
      dueDate: 'Due Date',
      priority: 'Priority',
      startDate: 'Start Date',
      status: 'Status',
      title: 'Title',
    };
    const name = labels[sortBy] || 'Due Date';
    const dir = sortOrder === 'asc' ? 'Earliest' : 'Latest';
    return `${name} (${dir})`;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader
        title="Task Management"
        showBack
        rightAction={
          <TouchableOpacity
            style={[styles.headerAddBtn, { backgroundColor: colors.primaryLight }]}
            onPress={() => router.push('/tasks/create')}
            activeOpacity={0.7}
          >
            <Plus size={16} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={[styles.headerAddText, { color: colors.primary }]}>New Task</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.headerSection}>
        {/* Search Input + Right Filter Button */}
        <View style={styles.searchFilterRow}>
          <View style={{ flex: 1 }}>
            <SearchInput
              value={filters.searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search title, description, category..."
            />
          </View>

          <TouchableOpacity
            style={[
              styles.filterIconButton,
              {
                backgroundColor: activeFiltersCount > 0 ? colors.primaryLight : colors.surface,
                borderColor: activeFiltersCount > 0 ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setIsFilterModalVisible(true)}
            activeOpacity={0.7}
          >
            <SlidersHorizontal
              size={20}
              color={activeFiltersCount > 0 ? colors.primary : colors.textPrimary}
            />
            {activeFiltersCount > 0 && (
              <View style={[styles.filterBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Active Filters & Sorting Status Bar */}
        <View style={[styles.activeFilterBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.activeFilterLeft}>
            <Filter size={13} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.activeFilterText, { color: colors.textPrimary }]}>
              {filteredTasks.length} task{filteredTasks.length === 1 ? '' : 's'} • Sorted by{' '}
              <Text style={{ fontWeight: 'bold', color: colors.primary }}>
                {getSortLabel(filters.sortBy, filters.sortOrder)}
              </Text>
            </Text>
          </View>

          {activeFiltersCount > 0 && (
            <TouchableOpacity onPress={resetFilters} style={styles.resetBtn} activeOpacity={0.7}>
              <RotateCcw size={12} color={colors.primary} style={{ marginRight: 4 }} />
              <Text style={[styles.resetBtnText, { color: colors.primary }]}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={keyExtractor}
        renderItem={renderTaskItem}
        initialNumToRender={10}
        maxToRenderPerBatch={15}
        windowSize={5}
        removeClippedSubviews={true}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          tasks.length === 0 ? (
            <EmptyState
              title="No Tasks Yet"
              description="Get started by creating your first task or uploading tasks via CSV."
              actionTitle="Create Task"
              onAction={() => router.push('/tasks/create')}
            />
          ) : (
            <EmptyState
              title="No Matching Tasks"
              description="Try adjusting your search query or clear filters to see more tasks."
              actionTitle="Reset All Filters"
              onAction={resetFilters}
            />
          )
        }
      />

      {/* Floating Action Button (+) */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/tasks/create')}
        activeOpacity={0.85}
      >
        <Plus size={28} color="#ffffff" />
      </TouchableOpacity>

      {/* Filter & Sort Bottom Sheet Modal */}
      <TaskFilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        filters={filters}
        categories={categories}
        totalMatches={filteredTasks.length}
        onApplyFilters={(newFilters) => {
          if (newFilters.status !== undefined) setStatusFilter(newFilters.status);
          if (newFilters.category !== undefined) setCategoryFilter(newFilters.category);
          if (newFilters.priority !== undefined) setPriorityFilter(newFilters.priority);
          if (newFilters.todayOnly !== undefined) setTodayOnlyFilter(newFilters.todayOnly);
          if (newFilters.sortBy !== undefined && newFilters.sortOrder !== undefined) {
            setSorting(newFilters.sortBy, newFilters.sortOrder);
          }
        }}
        onResetFilters={resetFilters}
      />

      {/* Delete Confirmation Modal */}
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
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  headerAddText: {
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.xs,
  },
  headerSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    marginBottom: spacing.xs,
  },
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  filterIconButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  activeFilterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginTop: spacing.xs,
  },
  activeFilterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activeFilterText: {
    fontSize: typography.fontSize.xs,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  resetBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 100,
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
