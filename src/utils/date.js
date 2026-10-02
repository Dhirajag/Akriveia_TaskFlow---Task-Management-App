import { format, parseISO, isValid, isToday, isBefore, startOfDay, parse } from 'date-fns';

export const formatDate = (dateString, formatPattern = 'MMM dd, yyyy') => {
  if (!dateString) return 'N/A';
  try {
    const parsed = parseISO(dateString);
    if (!isValid(parsed)) return dateString;
    return format(parsed, formatPattern);
  } catch {
    return dateString;
  }
};

export const getTodayIsoDate = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const isTaskForToday = (startDateStr, dueDateStr) => {
  try {
    const today = startOfDay(new Date());
    const start = startOfDay(parseISO(startDateStr));
    const due = startOfDay(parseISO(dueDateStr));
    
    if (!isValid(start) || !isValid(due)) return false;
    
    return isToday(start) || isToday(due) || (isBefore(start, today) && !isBefore(due, today));
  } catch {
    return false;
  }
};

export const isDueDateEarlierThanStart = (startDateStr, dueDateStr) => {
  if (!startDateStr || !dueDateStr) return false;
  try {
    const start = startOfDay(parseISO(startDateStr));
    const due = startOfDay(parseISO(dueDateStr));
    if (!isValid(start) || !isValid(due)) return false;
    return isBefore(due, start);
  } catch {
    return false;
  }
};

export const normalizeDateStringToIso = (rawDateStr) => {
  if (!rawDateStr || typeof rawDateStr !== 'string') return null;
  const trimmed = rawDateStr.trim();
  if (!trimmed) return null;

  const isoParsed = parseISO(trimmed);
  if (isValid(isoParsed)) {
    return format(isoParsed, 'yyyy-MM-dd');
  }

  const patterns = ['MM/dd/yyyy', 'dd/MM/yyyy', 'yyyy/MM/dd', 'dd-MM-yyyy', 'MM-dd-yyyy'];
  for (const pattern of patterns) {
    try {
      const parsed = parse(trimmed, pattern, new Date());
      if (isValid(parsed)) {
        return format(parsed, 'yyyy-MM-dd');
      }
    } catch {}
  }

  return null;
};
