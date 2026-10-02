import { useState, useMemo, useEffect } from 'react';
import { selectFilteredTasks, getActiveFiltersCount } from '../features/tasks/taskSelectors';

export const useTaskFilters = (allTasks, initialFilters = {}) => {
  const [filters, setFilters] = useState({
    status: initialFilters.status || 'All',
    category: initialFilters.category || 'All',
    priority: initialFilters.priority || 'All',
    todayOnly: initialFilters.todayOnly || false,
    searchQuery: initialFilters.searchQuery || '',
    sortBy: initialFilters.sortBy || 'dueDate',
    sortOrder: initialFilters.sortOrder || 'asc',
  });

  useEffect(() => {
    if (initialFilters && Object.keys(initialFilters).length > 0) {
      console.log('[useTaskFilters] Applying initial route filters:', initialFilters);
      setFilters((prev) => ({
        ...prev,
        status: initialFilters.status !== undefined ? initialFilters.status : prev.status,
        category: initialFilters.category !== undefined ? initialFilters.category : prev.category,
        priority: initialFilters.priority !== undefined ? initialFilters.priority : prev.priority,
        todayOnly: initialFilters.todayOnly !== undefined ? Boolean(initialFilters.todayOnly) : prev.todayOnly,
      }));
    }
  }, [initialFilters.status, initialFilters.category, initialFilters.priority, initialFilters.todayOnly]);

  const setStatusFilter = (status) => {
    console.log(`[useTaskFilters] Status filter set to: "${status}".`);
    setFilters((prev) => ({ ...prev, status, todayOnly: false }));
  };

  const setCategoryFilter = (category) => {
    console.log(`[useTaskFilters] Category filter set to: "${category}".`);
    setFilters((prev) => ({ ...prev, category }));
  };

  const setPriorityFilter = (priority) => {
    console.log(`[useTaskFilters] Priority filter set to: "${priority}".`);
    setFilters((prev) => ({ ...prev, priority }));
  };

  const setTodayOnlyFilter = (todayOnly) => {
    console.log(`[useTaskFilters] TodayOnly filter set to: ${todayOnly}.`);
    setFilters((prev) => ({ ...prev, todayOnly }));
  };

  const setSearchQuery = (searchQuery) => {
    console.log(`[useTaskFilters] Search query updated: "${searchQuery}".`);
    setFilters((prev) => ({ ...prev, searchQuery }));
  };

  const setSorting = (sortBy, sortOrder) => {
    console.log(`[useTaskFilters] Sorting updated: sortBy="${sortBy}", sortOrder="${sortOrder}".`);
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
  };

  const resetFilters = () => {
    console.log('[useTaskFilters] Resetting all filters to default.');
    setFilters({
      status: 'All',
      category: 'All',
      priority: 'All',
      todayOnly: false,
      searchQuery: '',
      sortBy: 'dueDate',
      sortOrder: 'asc',
    });
  };

  const filteredTasks = useMemo(() => {
    const result = selectFilteredTasks(allTasks, filters);
    console.log(`[useTaskFilters] Computed ${result.length} filtered tasks (Total available: ${(allTasks || []).length}).`);
    return result;
  }, [allTasks, filters]);

  const activeFiltersCount = useMemo(() => {
    const count = getActiveFiltersCount(filters);
    return count;
  }, [filters]);

  return {
    filters,
    filteredTasks,
    activeFiltersCount,
    setStatusFilter,
    setCategoryFilter,
    setPriorityFilter,
    setTodayOnlyFilter,
    setSearchQuery,
    setSorting,
    resetFilters,
  };
};
