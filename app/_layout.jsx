import React from 'react';
import { LogBox } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TaskProvider } from '../src/context/TaskContext';
import { ThemeProvider } from '../src/theme/ThemeContext';
import { useTasks } from '../src/hooks/useTasks';

LogBox.ignoreLogs([
  'Looks like you have configured linking in multiple places',
]);

function MainContent() {
  const { themeMode, toggleTheme } = useTasks();
  const isDark = themeMode === 'dark';

  return (
    <ThemeProvider themeMode={themeMode} toggleTheme={toggleTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="tasks/index" />
        <Stack.Screen name="tasks/create" />
        <Stack.Screen name="tasks/details/[id]" />
        <Stack.Screen name="tasks/edit/[id]" />
        <Stack.Screen name="bulk-upload/index" />
        <Stack.Screen name="settings/index" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <TaskProvider>
        <MainContent />
      </TaskProvider>
    </SafeAreaProvider>
  );
}
