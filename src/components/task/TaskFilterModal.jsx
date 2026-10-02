import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { X, ArrowUp, ArrowDown, Check, RotateCcw, Calendar, SlidersHorizontal } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { AppButton } from '../common/AppButton';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export const TaskFilterModal = ({
  visible,
  onClose,
  filters,
  categories = [],
  onApplyFilters,
  onResetFilters,
  totalMatches = 0,
}) => {
  const { colors } = useTheme();

  const [draftFilters, setDraftFilters] = useState(filters);

  useEffect(() => {
    if (visible) {
      setDraftFilters(filters);
    }
  }, [visible, filters]);

  const statuses = ['All', 'Pending', 'Completed'];
  const priorities = ['All', 'High', 'Medium', 'Low'];
  const sortOptions = [
    { label: 'Due Date', value: 'dueDate', icon: '📅' },
    { label: 'Priority', value: 'priority', icon: '⚡' },
    { label: 'Start Date', value: 'startDate', icon: '🚩' },
    { label: 'Status', value: 'status', icon: '⏳' },
    { label: 'Task Title', value: 'title', icon: '🔤' },
  ];

  const handleSelectStatus = (status) => {
    setDraftFilters((prev) => ({ ...prev, status, todayOnly: false }));
  };

  const handleSelectPriority = (priority) => {
    setDraftFilters((prev) => ({ ...prev, priority }));
  };

  const handleSelectCategory = (category) => {
    setDraftFilters((prev) => ({ ...prev, category }));
  };

  const handleToggleTodayOnly = () => {
    setDraftFilters((prev) => ({ ...prev, todayOnly: !prev.todayOnly }));
  };

  const handleSelectSortBy = (sortBy) => {
    setDraftFilters((prev) => ({ ...prev, sortBy }));
  };

  const handleToggleSortOrder = (sortOrder) => {
    setDraftFilters((prev) => ({ ...prev, sortOrder }));
  };

  const handleReset = () => {
    onResetFilters();
    onClose();
  };

  const handleApply = () => {
    onApplyFilters(draftFilters);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.sheetContainer,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
              ]}
            >
              {/* Drag Handle Top Bar */}
              <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />

              {/* Header Row */}
              <View style={[styles.headerRow, { borderBottomColor: colors.border }]}>
                <View style={styles.headerTitleGroup}>
                  <SlidersHorizontal size={20} color={colors.primary} style={{ marginRight: 8 }} />
                  <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    Filter & Sort Tasks
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={[styles.closeBtn, { backgroundColor: colors.surface }]}
                  activeOpacity={0.7}
                >
                  <X size={18} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* 1. STATUS FILTER */}
                <View style={styles.section}>
                  <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                    Task Status
                  </Text>
                  <View style={styles.segmentedRow}>
                    {statuses.map((st) => {
                      const isSelected = draftFilters.status === st && !draftFilters.todayOnly;
                      return (
                        <TouchableOpacity
                          key={st}
                          style={[
                            styles.segmentBtn,
                            {
                              backgroundColor: isSelected ? colors.primary : colors.surface,
                              borderColor: isSelected ? colors.primary : colors.border,
                            },
                          ]}
                          onPress={() => handleSelectStatus(st)}
                          activeOpacity={0.75}
                        >
                          <Text
                            style={[
                              styles.segmentText,
                              { color: isSelected ? '#ffffff' : colors.textSecondary },
                            ]}
                          >
                            {st}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 2. QUICK TODAY FILTER */}
                <View style={styles.section}>
                  <TouchableOpacity
                    style={[
                      styles.todayFilterCard,
                      {
                        backgroundColor: draftFilters.todayOnly
                          ? colors.primaryLight
                          : colors.surface,
                        borderColor: draftFilters.todayOnly ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={handleToggleTodayOnly}
                    activeOpacity={0.8}
                  >
                    <View style={styles.todayRow}>
                      <Calendar
                        size={18}
                        color={draftFilters.todayOnly ? colors.primary : colors.textMuted}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={[
                          styles.todayText,
                          {
                            color: draftFilters.todayOnly
                              ? colors.primary
                              : colors.textPrimary,
                          },
                        ]}
                      >
                        Show Today's Tasks Only
                      </Text>
                    </View>
                    {draftFilters.todayOnly && (
                      <Check size={18} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                </View>

                {/* 3. PRIORITY FILTER */}
                <View style={styles.section}>
                  <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                    Priority Level
                  </Text>
                  <View style={styles.chipGrid}>
                    {priorities.map((pri) => {
                      const isSelected = draftFilters.priority === pri;
                      let bg = isSelected ? colors.primary : colors.surface;
                      let text = isSelected ? '#ffffff' : colors.textSecondary;
                      if (pri === 'High' && isSelected) {
                        bg = colors.dangerBg;
                        text = colors.danger;
                      } else if (pri === 'Medium' && isSelected) {
                        bg = colors.warningBg;
                        text = colors.warning;
                      }

                      return (
                        <TouchableOpacity
                          key={pri}
                          style={[
                            styles.chip,
                            {
                              backgroundColor: bg,
                              borderColor: isSelected ? colors.primary : colors.border,
                            },
                          ]}
                          onPress={() => handleSelectPriority(pri)}
                          activeOpacity={0.75}
                        >
                          <Text style={[styles.chipText, { color: text }]}>
                            {pri === 'All' ? 'All Priorities' : pri}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 4. CATEGORY FILTER */}
                <View style={styles.section}>
                  <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                    Category
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalScroll}
                  >
                    {['All', ...categories.filter((c) => c !== 'All')].map((cat) => {
                      const isSelected = draftFilters.category === cat;
                      return (
                        <TouchableOpacity
                          key={cat}
                          style={[
                            styles.chip,
                            {
                              backgroundColor: isSelected
                                ? colors.primaryLight
                                : colors.surface,
                              borderColor: isSelected ? colors.primary : colors.border,
                            },
                          ]}
                          onPress={() => handleSelectCategory(cat)}
                          activeOpacity={0.75}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              { color: isSelected ? colors.primary : colors.textSecondary },
                            ]}
                          >
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* 5. SORT FIELD SELECTOR */}
                <View style={styles.section}>
                  <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                    Sort By Field
                  </Text>
                  <View style={styles.chipGrid}>
                    {sortOptions.map((opt) => {
                      const isSelected = draftFilters.sortBy === opt.value;
                      return (
                        <TouchableOpacity
                          key={opt.value}
                          style={[
                            styles.chip,
                            {
                              backgroundColor: isSelected
                                ? colors.primaryLight
                                : colors.surface,
                              borderColor: isSelected ? colors.primary : colors.border,
                            },
                          ]}
                          onPress={() => handleSelectSortBy(opt.value)}
                          activeOpacity={0.75}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              { color: isSelected ? colors.primary : colors.textSecondary },
                            ]}
                          >
                            {opt.icon} {opt.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 6. SORT DIRECTION SELECTOR */}
                <View style={styles.section}>
                  <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                    Sort Direction
                  </Text>
                  <View style={styles.directionRow}>
                    <TouchableOpacity
                      style={[
                        styles.directionBtn,
                        {
                          backgroundColor:
                            draftFilters.sortOrder === 'asc'
                              ? colors.primary
                              : colors.surface,
                          borderColor:
                            draftFilters.sortOrder === 'asc'
                              ? colors.primary
                              : colors.border,
                        },
                      ]}
                      onPress={() => handleToggleSortOrder('asc')}
                      activeOpacity={0.8}
                    >
                      <ArrowUp
                        size={16}
                        color={draftFilters.sortOrder === 'asc' ? '#ffffff' : colors.textSecondary}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={[
                          styles.directionText,
                          {
                            color:
                              draftFilters.sortOrder === 'asc'
                                ? '#ffffff'
                                : colors.textSecondary,
                          },
                        ]}
                      >
                        Ascending (Earliest / A-Z)
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.directionBtn,
                        {
                          backgroundColor:
                            draftFilters.sortOrder === 'desc'
                              ? colors.primary
                              : colors.surface,
                          borderColor:
                            draftFilters.sortOrder === 'desc'
                              ? colors.primary
                              : colors.border,
                        },
                      ]}
                      onPress={() => handleToggleSortOrder('desc')}
                      activeOpacity={0.8}
                    >
                      <ArrowDown
                        size={16}
                        color={draftFilters.sortOrder === 'desc' ? '#ffffff' : colors.textSecondary}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={[
                          styles.directionText,
                          {
                            color:
                              draftFilters.sortOrder === 'desc'
                                ? '#ffffff'
                                : colors.textSecondary,
                          },
                        ]}
                      >
                        Descending (Latest / Z-A)
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>

              {/* Footer Action Bar */}
              <View style={[styles.footerRow, { borderTopColor: colors.border }]}>
                <AppButton
                  title="Reset All"
                  variant="outline"
                  onPress={handleReset}
                  icon={<RotateCcw size={16} color={colors.textPrimary} />}
                  style={{ flex: 1 }}
                />

                <AppButton
                  title={`Apply Filters (${totalMatches})`}
                  variant="primary"
                  onPress={handleApply}
                  style={{ flex: 1.5 }}
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
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    borderWidth: 1,
    maxHeight: '85%',
    paddingBottom: spacing.lg,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  segmentedRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  todayFilterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  todayRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  horizontalScroll: {
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  directionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  directionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  directionText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  footerRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    gap: spacing.md,
  },
});
