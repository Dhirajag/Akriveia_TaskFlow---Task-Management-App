import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export const TaskFilter = ({
  statusFilter,
  categoryFilter,
  priorityFilter,
  categories,
  onSelectStatus,
  onSelectCategory,
  onSelectPriority,
}) => {
  const { colors } = useTheme();

  const statuses = ['All', 'Pending', 'Completed'];
  const priorities = ['All', 'High', 'Medium', 'Low'];

  const getPriorityBg = (pri, isSelected) => {
    if (!isSelected) return colors.surface;
    switch (pri) {
      case 'High': return colors.priorityHighBg;
      case 'Medium': return colors.priorityMediumBg;
      case 'Low': return colors.priorityLowBg;
      default: return colors.primary;
    }
  };

  const getPriorityText = (pri, isSelected) => {
    if (!isSelected) return colors.textSecondary;
    switch (pri) {
      case 'High': return colors.priorityHigh;
      case 'Medium': return colors.priorityMedium;
      case 'Low': return colors.priorityLow;
      default: return '#ffffff';
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Status Filter Row */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {statuses.map((status) => {
            const isSelected = statusFilter === status;
            return (
              <TouchableOpacity
                key={status}
                style={[
                  styles.pill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => onSelectStatus(status)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.pillText,
                    { color: isSelected ? '#ffffff' : colors.textSecondary },
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 2. Priority Filter Row */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.label, { color: colors.textMuted }]}>Priority:</Text>
          {priorities.map((pri) => {
            const isSelected = priorityFilter === pri;
            return (
              <TouchableOpacity
                key={pri}
                style={[
                  styles.smallPill,
                  {
                    backgroundColor: getPriorityBg(pri, isSelected),
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => onSelectPriority(pri)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.smallPillText,
                    { color: getPriorityText(pri, isSelected) },
                  ]}
                >
                  {pri === 'All' ? 'All Priorities' : pri}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Category Filter Row */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.label, { color: colors.textMuted }]}>Category:</Text>
          {['All', ...categories.filter((c) => c !== 'All')].map((cat) => {
            const isSelected = categoryFilter === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.smallPill,
                  {
                    backgroundColor: isSelected ? colors.primaryLight : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => onSelectCategory(cat)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.smallPillText,
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  filterSection: {
    marginBottom: spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    marginRight: spacing.xs,
    alignSelf: 'center',
  },
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  pillText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  smallPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  smallPillText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
});
