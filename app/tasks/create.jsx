import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { useTasks } from '../../src/hooks/useTasks';
import { AppHeader } from '../../src/components/common/AppHeader';
import { TaskForm } from '../../src/components/task/TaskForm';

export default function CreateTaskScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { addTask } = useTasks();

  const handleCreate = async (data) => {
    console.log('[CreateTaskScreen] Submitting new task creation:', data.title);
    await addTask({
      title: data.title,
      description: data.description || '',
      category: data.category,
      priority: data.priority,
      startDate: data.startDate,
      dueDate: data.dueDate,
      status: data.status,
    });

    console.log('[CreateTaskScreen] Task created successfully. Navigating back...');
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/tasks');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Create New Task" showBack />
      <View style={styles.container}>
        <TaskForm onSubmit={handleCreate} submitButtonText="Save Task" />
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
