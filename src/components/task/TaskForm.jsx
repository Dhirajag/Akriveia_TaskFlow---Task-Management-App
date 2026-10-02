import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskFormSchema } from '../../features/tasks/taskSchemas';
import { useTheme } from '../../theme/ThemeContext';
import { AppInput } from '../common/AppInput';
import { AppButton } from '../common/AppButton';
import { AppDatePicker } from '../common/AppDatePicker';
import { APP_CONSTANTS } from '../../constants/app';
import { getTodayIsoDate } from '../../utils/date';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export const TaskForm = ({
  initialValues,
  onSubmit,
  submitButtonText = 'Save Task',
  isEditing = false,
}) => {
  const { colors } = useTheme();

  const defaultStartDate = getTodayIsoDate();
  const defaultDueDate = getTodayIsoDate();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm({
    resolver: zodResolver(taskFormSchema),
    mode: 'onTouched',
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      category: initialValues?.category || 'General',
      priority: initialValues?.priority || 'Medium',
      startDate: initialValues?.startDate || defaultStartDate,
      dueDate: initialValues?.dueDate || defaultDueDate,
      status: initialValues?.status || 'Pending',
    },
  });

  const selectedPriority = watch('priority');
  const selectedStatus = watch('status');

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <AppInput
            label="Task Title *"
            placeholder="e.g. Design Mobile Wireframes"
            value={value}
            onChangeText={onChange}
            maxLength={100}
            showCharCount
            isValid={touchedFields.title && !errors.title && (value || '').trim().length >= 2}
            error={errors.title?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <AppInput
            label="Description"
            placeholder="Detailed task instructions or notes..."
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={4}
            maxLength={500}
            showCharCount
            isValid={touchedFields.description && !errors.description && (value || '').trim().length > 0}
            error={errors.description?.message}
          />
        )}
      />

      {/* Category Selector / Input */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Category *</Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pickerRow}
              >
                {APP_CONSTANTS.DEFAULT_CATEGORIES.map((cat) => {
                  const isSelected = value === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.surface,
                          borderColor: isSelected ? colors.primary : colors.border,
                        },
                      ]}
                      onPress={() => onChange(cat)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          { color: isSelected ? '#ffffff' : colors.textPrimary },
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <AppInput
                placeholder="Or type custom category..."
                value={value}
                onChangeText={onChange}
                maxLength={30}
                isValid={touchedFields.category && !errors.category && (value || '').trim().length > 0}
                error={errors.category?.message}
                containerStyle={{ marginTop: spacing.sm }}
              />
            </>
          )}
        />
      </View>

      {/* Priority Selection */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Priority *</Text>
        <View style={styles.buttonSelectorRow}>
          {['Low', 'Medium', 'High'].map((pri) => {
            const isSelected = selectedPriority === pri;
            return (
              <TouchableOpacity
                key={pri}
                style={[
                  styles.selectorButton,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setValue('priority', pri, { shouldValidate: true })}
              >
                <Text
                  style={[
                    styles.selectorText,
                    { color: isSelected ? '#ffffff' : colors.textPrimary },
                  ]}
                >
                  {pri}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.priority && (
          <Text style={[styles.errorText, { color: colors.danger }]}>
            {errors.priority.message}
          </Text>
        )}
      </View>

      {/* Date Pickers */}
      <View style={styles.dateRow}>
        <View style={styles.dateColumn}>
          <Controller
            control={control}
            name="startDate"
            render={({ field: { onChange, value } }) => (
              <AppDatePicker
                label="Start Date *"
                value={value}
                onChange={onChange}
                error={errors.startDate?.message}
              />
            )}
          />
        </View>
        <View style={styles.dateColumn}>
          <Controller
            control={control}
            name="dueDate"
            render={({ field: { onChange, value } }) => (
              <AppDatePicker
                label="Due Date *"
                value={value}
                onChange={onChange}
                error={errors.dueDate?.message}
              />
            )}
          />
        </View>
      </View>

      {/* Status Selection */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Status *</Text>
        <View style={styles.buttonSelectorRow}>
          {['Pending', 'Completed'].map((st) => {
            const isSelected = selectedStatus === st;
            return (
              <TouchableOpacity
                key={st}
                style={[
                  styles.selectorButton,
                  {
                    backgroundColor: isSelected
                      ? st === 'Completed'
                        ? colors.statusCompleted
                        : colors.primary
                      : colors.surface,
                    borderColor: isSelected ? 'transparent' : colors.border,
                  },
                ]}
                onPress={() => setValue('status', st, { shouldValidate: true })}
              >
                <Text
                  style={[
                    styles.selectorText,
                    { color: isSelected ? '#ffffff' : colors.textPrimary },
                  ]}
                >
                  {st}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <AppButton
        title={submitButtonText}
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        style={{ marginTop: spacing.xl, marginBottom: spacing.xxl }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
  },
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.xs,
  },
  pickerRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  buttonSelectorRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  dateRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  dateColumn: {
    flex: 1,
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
  },
});
