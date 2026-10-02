import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONSTANTS } from '../../constants/app';

export class TaskStorageService {
  async getTasks() {
    try {
      console.log('[TaskStorage] Fetching tasks from AsyncStorage...');
      const jsonValue = await AsyncStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.TASKS);
      const parsed = jsonValue != null ? JSON.parse(jsonValue) : [];
      console.log(`[TaskStorage] Successfully retrieved ${parsed.length} tasks from AsyncStorage.`);
      return parsed;
    } catch (error) {
      console.error('[TaskStorage] Error reading tasks from AsyncStorage:', error);
      return [];
    }
  }

  async saveTasks(tasks) {
    try {
      console.log(`[TaskStorage] Saving ${tasks.length} tasks to AsyncStorage...`);
      const jsonValue = JSON.stringify(tasks);
      await AsyncStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.TASKS, jsonValue);
      console.log('[TaskStorage] Tasks saved to AsyncStorage successfully.');
    } catch (error) {
      console.error('[TaskStorage] Error saving tasks to AsyncStorage:', error);
      throw new Error('Failed to save tasks to local storage.');
    }
  }

  async clearTasks() {
    try {
      console.log('[TaskStorage] Clearing all tasks from AsyncStorage...');
      await AsyncStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.TASKS);
      console.log('[TaskStorage] All tasks cleared from AsyncStorage.');
    } catch (error) {
      console.error('[TaskStorage] Error clearing tasks from AsyncStorage:', error);
      throw new Error('Failed to clear tasks from local storage.');
    }
  }

  async getThemePreference() {
    try {
      console.log('[TaskStorage] Getting theme preference from AsyncStorage...');
      const value = await AsyncStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.THEME);
      console.log(`[TaskStorage] Theme preference retrieved: "${value || 'default (light)'}".`);
      return value === 'dark' || value === 'light' ? value : null;
    } catch {
      return null;
    }
  }

  async saveThemePreference(theme) {
    try {
      console.log(`[TaskStorage] Saving theme preference "${theme}" to AsyncStorage...`);
      await AsyncStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.THEME, theme);
      console.log('[TaskStorage] Theme preference saved.');
    } catch (error) {
      console.error('[TaskStorage] Error saving theme preference:', error);
    }
  }
}

export const taskStorage = new TaskStorageService();
