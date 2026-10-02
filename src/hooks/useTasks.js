import { useTaskContext } from '../context/TaskContext';
import { selectDashboardStats, selectUniqueCategories } from '../features/tasks/taskSelectors';

export const useTasks = () => {
  const context = useTaskContext();

  const dashboardStats = selectDashboardStats(context.tasks);
  const categories = selectUniqueCategories(context.tasks);

  return {
    ...context,
    dashboardStats,
    categories,
  };
};
