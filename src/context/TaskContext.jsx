import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { taskStorage } from '../services/storage/taskStorage';
import { processCsvImport } from '../services/csv/csvImporter';
import { generateTaskId } from '../utils/id';

const TaskContext = createContext({
  tasks: [],
  themeMode: 'light',
  isLoading: true,
  error: null,
  addTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
  toggleTaskStatus: async () => {},
  deleteAllTasks: async () => {},
  importTasksFromCsv: async () => {},
  toggleTheme: async () => {},
  clearError: () => {},
});

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [themeMode, setThemeMode] = useState('light');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      console.log('[TaskContext] Initializing task data and theme from storage...');
      setIsLoading(true);
      setError(null);
      try {
        const [savedTasks, savedTheme] = await Promise.all([
          taskStorage.getTasks(),
          taskStorage.getThemePreference(),
        ]);
        console.log(`[TaskContext] Context initialized: Loaded ${savedTasks.length} tasks, ThemeMode="${savedTheme || 'light'}".`);
        setTasks(savedTasks);
        setThemeMode(savedTheme || 'light');
      } catch (err) {
        console.error('[TaskContext] Error loading initial data:', err);
        setError(err?.message || 'Failed to load application data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const addTask = useCallback(async (taskData) => {
    console.log('[TaskContext] Adding new task:', taskData.title);
    const now = new Date().toISOString();
    const newTask = {
      ...taskData,
      id: generateTaskId(),
      createdAt: now,
      updatedAt: now,
    };

    setTasks((prevTasks) => {
      const updated = [newTask, ...prevTasks];
      console.log(`[TaskContext] Task added with ID "${newTask.id}". Total tasks: ${updated.length}.`);
      taskStorage.saveTasks(updated);
      return updated;
    });

    return newTask;
  }, []);

  const updateTask = useCallback(async (id, updates) => {
    console.log(`[TaskContext] Updating task ID "${id}":`, updates);
    const now = new Date().toISOString();
    setTasks((prevTasks) => {
      const updated = prevTasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: now } : task
      );
      console.log(`[TaskContext] Task ID "${id}" updated successfully.`);
      taskStorage.saveTasks(updated);
      return updated;
    });
  }, []);

  const deleteTask = useCallback(async (id) => {
    console.log(`[TaskContext] Deleting task ID "${id}"...`);
    setTasks((prevTasks) => {
      const updated = prevTasks.filter((task) => task.id !== id);
      console.log(`[TaskContext] Task ID "${id}" deleted. Remaining tasks: ${updated.length}.`);
      taskStorage.saveTasks(updated);
      return updated;
    });
  }, []);

  const toggleTaskStatus = useCallback(async (id) => {
    const now = new Date().toISOString();
    let nextStatus = '';
    setTasks((prevTasks) => {
      const updated = prevTasks.map((task) => {
        if (task.id === id) {
          nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...task, status: nextStatus, updatedAt: now };
        }
        return task;
      });
      console.log(`[TaskContext] Toggled task status for ID "${id}" -> "${nextStatus}".`);
      taskStorage.saveTasks(updated);
      return updated;
    });
  }, []);

  const deleteAllTasks = useCallback(async () => {
    console.log('[TaskContext] Deleting all tasks from context...');
    setTasks([]);
    await taskStorage.clearTasks();
    console.log('[TaskContext] All tasks cleared from context.');
  }, []);

  const importTasksFromCsv = useCallback(async (csvContent, options = {}) => {
    console.log('[TaskContext] Processing CSV bulk import with options:', options);
    let summary = null;

    setTasks((prevTasks) => {
      summary = processCsvImport(csvContent, prevTasks, options);
      console.log(`[TaskContext] CSV Import Outcome: Imported=${summary.imported}, Errors=${summary.errors.length}, Duplicates=${summary.duplicates}.`);
      if (summary.importedTasks.length > 0) {
        const merged = [...summary.importedTasks, ...prevTasks];
        console.log(`[TaskContext] Merged ${summary.importedTasks.length} imported tasks into state. Total: ${merged.length}.`);
        taskStorage.saveTasks(merged);
        return merged;
      }
      return prevTasks;
    });

    return summary;
  }, []);

  const toggleTheme = useCallback(async () => {
    setThemeMode((prevTheme) => {
      const nextTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log(`[TaskContext] Toggling ThemeMode -> "${nextTheme}".`);
      taskStorage.saveThemePreference(nextTheme);
      return nextTheme;
    });
  }, []);

  const clearError = useCallback(() => {
    console.log('[TaskContext] Clearing error state.');
    setError(null);
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        themeMode,
        isLoading,
        error,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        deleteAllTasks,
        importTasksFromCsv,
        toggleTheme,
        clearError,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);
