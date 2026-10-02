import { isTaskForToday } from '../../utils/date';

export const selectDashboardStats = (tasks) => {
  const safeTasks = tasks || [];
  const total = safeTasks.length;
  const completed = safeTasks.filter((t) => t.status === 'Completed').length;
  const pending = safeTasks.filter((t) => t.status === 'Pending').length;
  const today = safeTasks.filter((t) => isTaskForToday(t.startDate, t.dueDate)).length;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    today,
    completionPercentage,
  };
};

export const selectFilteredTasks = (tasks, filters) => {
  const safeTasks = tasks || [];
  return safeTasks
    .filter((task) => {
      // 1. Status Filter
      if (filters.status && filters.status !== 'All' && task.status !== filters.status) {
        return false;
      }

      // 2. Category Filter
      if (filters.category && filters.category !== 'All' && task.category !== filters.category) {
        return false;
      }

      // 3. Priority Filter
      if (filters.priority && filters.priority !== 'All' && task.priority !== filters.priority) {
        return false;
      }

      // 4. Today Only Filter
      if (filters.todayOnly && !isTaskForToday(task.startDate, task.dueDate)) {
        return false;
      }

      // 5. Search Query (Title, Description, Category, or ID)
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchTitle = (task.title || '').toLowerCase().includes(query);
        const matchDesc = (task.description || '').toLowerCase().includes(query);
        const matchCat = (task.category || '').toLowerCase().includes(query);
        const matchId = (task.id || '').toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchCat && !matchId) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      const orderMultiplier = filters.sortOrder === 'asc' ? 1 : -1;

      switch (filters.sortBy) {
        case 'dueDate': {
          const comp = (a.dueDate || '').localeCompare(b.dueDate || '');
          if (comp !== 0) return comp * orderMultiplier;
          return (a.title || '').localeCompare(b.title || '');
        }

        case 'startDate': {
          const comp = (a.startDate || '').localeCompare(b.startDate || '');
          if (comp !== 0) return comp * orderMultiplier;
          return (a.title || '').localeCompare(b.title || '');
        }

        case 'priority': {
          const priorityWeight = { High: 3, Medium: 2, Low: 1 };
          const weightA = priorityWeight[a.priority] || 0;
          const weightB = priorityWeight[b.priority] || 0;
          const diff = weightA - weightB;
          if (diff !== 0) return diff * orderMultiplier;
          return (a.dueDate || '').localeCompare(b.dueDate || '');
        }

        case 'status': {
          const statusWeight = { Pending: 2, Completed: 1 };
          const weightA = statusWeight[a.status] || 0;
          const weightB = statusWeight[b.status] || 0;
          const diff = weightA - weightB;
          if (diff !== 0) return diff * orderMultiplier;
          return (a.dueDate || '').localeCompare(b.dueDate || '');
        }

        case 'title':
        default:
          return (a.title || '').localeCompare(b.title || '') * orderMultiplier;
      }
    });
};

export const selectUniqueCategories = (tasks) => {
  const safeTasks = tasks || [];
  const categoriesSet = new Set(safeTasks.map((t) => (t.category || '').trim()).filter(Boolean));
  return ['All', ...Array.from(categoriesSet)];
};

export const getActiveFiltersCount = (filters) => {
  if (!filters) return 0;
  let count = 0;
  if (filters.status && filters.status !== 'All') count++;
  if (filters.category && filters.category !== 'All') count++;
  if (filters.priority && filters.priority !== 'All') count++;
  if (filters.todayOnly) count++;
  if (filters.searchQuery && filters.searchQuery.trim() !== '') count++;
  return count;
};
