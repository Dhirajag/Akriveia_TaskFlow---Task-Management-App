import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export const TaskSort = ({
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  const { colors } = useTheme();

  const options = [
    { label: 'Due Date', value: 'dueDate' },
    { label: 'Priority', value: 'priority' },
    { label: 'Start Date', value: 'startDate' },
    { label: 'Title', value: 'title' },
    { label: 'Status', value: 'status' },
  ];

  const toggleOrder = () => {
    onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getSortOrderLabel = () => {
    if (sortBy === 'priority') {
      return sortOrder === 'desc' ? 'High → Low' : 'Low → High';
    }
    if (sortBy === 'dueDate' || sortBy === 'startDate') {
      return sortOrder === 'asc' ? 'Earliest First' : 'Latest First';
    }
    return sortOrder === 'asc' ? 'A → Z' : 'Z → A';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.leftGroup}>
        <ArrowUpDown size={14} color={colors.primary} style={{ marginRight: 6 }} />
        <Text style={[styles.label, { color: colors.textMuted }]}>Sort:</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
        {options.map((opt) => {
          const isSelected = sortBy === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.optionBtn,
                {
                  backgroundColor: isSelected ? colors.primary : 'transparent',
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
              onPress={() => onSortChange(opt.value, sortOrder)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: isSelected ? '#ffffff' : colors.textSecondary },
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        onPress={toggleOrder}
        style={[styles.orderBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
        activeOpacity={0.7}
      >
        {sortOrder === 'asc' ? (
          <ArrowUp size={13} color={colors.primary} style={{ marginRight: 4 }} />
        ) : (
          <ArrowDown size={13} color={colors.primary} style={{ marginRight: 4 }} />
        )}
        <Text style={[styles.orderText, { color: colors.primary }]}>
          {getSortOrderLabel()}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: spacing.xs,
  },
  optionBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  optionText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  orderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  orderText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
});
