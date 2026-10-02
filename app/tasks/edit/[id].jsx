import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../src/theme/ThemeContext';
import { useTasks } from '../../../src/hooks/useTasks';
import { AppHeader } from '../../../src/components/common/AppHeader';
import { TaskForm } from '../../../src/components/task/TaskForm';
import { EmptyState } from '../../../src/components/common/EmptyState';

export default function EditTaskScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { tasks, updateTask } = useTasks();

  const task = (tasks || []).find((t) => t.id === id);

  if (!task) {
    console.log(`[EditTaskScreen] Task with ID "${id}" not found.`);
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <AppHeader title="Edit Task" showBack />
        <EmptyState
          title="Task Not Found"
          description="The task you are attempting to edit could not be found."
          actionTitle="Back to Task List"
          onAction={() => router.replace('/tasks')}
        />
      </SafeAreaView>
    );
  }

  const handleUpdate = async (data) => {
    console.log(`[EditTaskScreen] Submitting update for task ID "${task.id}":`, data.title);
    await updateTask(task.id, {
      title: data.title,
      description: data.description || '',
      category: data.category,
      priority: data.priority,
      startDate: data.startDate,
      dueDate: data.dueDate,
      status: data.status,
    });

    console.log(`[EditTaskScreen] Task ID "${task.id}" updated successfully. Navigating back...`);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(`/tasks/details/${task.id}`);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Edit Task" showBack />
      <View style={styles.container}>
        <TaskForm
          initialValues={{
            title: task.title,
            description: task.description,
            category: task.category,
            priority: task.priority,
            startDate: task.startDate,
            dueDate: task.dueDate,
            status: task.status,
          }}
          onSubmit={handleUpdate}
          submitButtonText="Update Task"
          isEditing
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
