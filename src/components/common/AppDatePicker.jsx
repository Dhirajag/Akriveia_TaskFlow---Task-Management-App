import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, isValid, addMonths, subMonths } from 'date-fns';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { AppButton } from './AppButton';
import { AppInput } from './AppInput';

export const AppDatePicker = ({
  label,
  value,
  onChange,
  error,
  containerStyle,
}) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  // Parse initial current date or default to today
  const initialDate = () => {
    if (value) {
      const parsed = parseISO(value);
      if (isValid(parsed)) return parsed;
    }
    return new Date();
  };

  const [currentMonth, setCurrentMonth] = useState(initialDate());
  const [selectedDate, setSelectedDate] = useState(initialDate());

  const handleSelectDate = (date) => {
    const formatted = format(date, 'yyyy-MM-dd');
    setSelectedDate(date);
    onChange(formatted);
    setModalVisible(false);
  };

  const applyQuickPreset = (daysToAdd) => {
    const targetDate = addDays(new Date(), daysToAdd);
    handleSelectDate(targetDate);
  };

  // Calendar Grid calculations
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDayOfWeek = monthStart.getDay(); // 0 = Sun, 1 = Mon ...
  const blankDaysBefore = Array.from({ length: startDayOfWeek });

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}

      {/* Date Trigger Button */}
      <TouchableOpacity
        style={[
          styles.triggerBtn,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : colors.border,
          },
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <CalendarIcon size={18} color={colors.primary} style={{ marginRight: spacing.sm }} />
        <Text
          style={[
            styles.triggerText,
            { color: value ? colors.textPrimary : colors.textMuted },
          ]}
        >
          {value || 'Select Date (YYYY-MM-DD)'}
        </Text>
      </TouchableOpacity>

      {error && <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>}

      {/* Interactive Date Picker Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalCard, { backgroundColor: colors.cardBackground }]}>
                {/* Modal Header */}
                <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                    {label || 'Select Date'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={[styles.closeBtn, { backgroundColor: colors.surface }]}
                  >
                    <X size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* Quick Presets */}
                <View style={styles.presetsRow}>
                  <TouchableOpacity
                    style={[styles.presetChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => applyQuickPreset(0)}
                  >
                    <Text style={[styles.presetChipText, { color: colors.primary }]}>Today</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.presetChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => applyQuickPreset(1)}
                  >
                    <Text style={[styles.presetChipText, { color: colors.primary }]}>Tomorrow</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.presetChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => applyQuickPreset(7)}
                  >
                    <Text style={[styles.presetChipText, { color: colors.primary }]}>In 1 Wk</Text>
                  </TouchableOpacity>
                </View>

                {/* Calendar Month Navigation Header */}
                <View style={styles.monthNavRow}>
                  <TouchableOpacity
                    onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    style={[styles.monthNavBtn, { backgroundColor: colors.surface }]}
                  >
                    <ChevronLeft size={18} color={colors.textPrimary} />
                  </TouchableOpacity>
                  <Text style={[styles.monthTitle, { color: colors.textPrimary }]}>
                    {format(currentMonth, 'MMMM yyyy')}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    style={[styles.monthNavBtn, { backgroundColor: colors.surface }]}
                  >
                    <ChevronRight size={18} color={colors.textPrimary} />
                  </TouchableOpacity>
                </View>

                {/* Weekday Headers */}
                <View style={styles.weekdayRow}>
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <Text key={day} style={[styles.weekdayText, { color: colors.textMuted }]}>
                      {day}
                    </Text>
                  ))}
                </View>

                {/* Calendar Days Grid */}
                <View style={styles.calendarGrid}>
                  {blankDaysBefore.map((_, idx) => (
                    <View key={`blank-${idx}`} style={styles.dayCell} />
                  ))}

                  {daysInMonth.map((dayDate) => {
                    const isSelected = value && isSameDay(dayDate, parseISO(value));
                    const isToday = isSameDay(dayDate, new Date());

                    return (
                      <TouchableOpacity
                        key={dayDate.toISOString()}
                        style={[
                          styles.dayCell,
                          isSelected && { backgroundColor: colors.primary, borderRadius: borderRadius.full },
                          !isSelected && isToday && { borderWidth: 1, borderColor: colors.primary, borderRadius: borderRadius.full },
                        ]}
                        onPress={() => handleSelectDate(dayDate)}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            { color: isSelected ? '#ffffff' : colors.textPrimary },
                          ]}
                        >
                          {format(dayDate, 'd')}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Direct Manual Entry */}
                <View style={styles.manualEntrySection}>
                  <AppInput
                    label="Or Edit YYYY-MM-DD Directly:"
                    value={value}
                    onChangeText={onChange}
                    placeholder="YYYY-MM-DD"
                    containerStyle={{ marginBottom: spacing.md }}
                  />
                  <AppButton
                    title="Done"
                    onPress={() => setModalVisible(false)}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.xs,
  },
  triggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    height: 48,
  },
  triggerText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  presetChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  presetChipText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  monthNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  monthNavBtn: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.xs,
  },
  weekdayText: {
    width: 36,
    textAlign: 'center',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  dayCell: {
    width: '14.28%',
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  dayText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  manualEntrySection: {
    marginTop: spacing.xs,
  },
});
