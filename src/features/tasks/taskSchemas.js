import { z } from 'zod';
import { parseISO, isValid } from 'date-fns';
import { isDueDateEarlierThanStart } from '../../utils/date';

const isValidIsoDateString = (val) => {
  if (!val || typeof val !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(val.trim())) return false;
  const parsed = parseISO(val.trim());
  return isValid(parsed);
};

export const taskFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, 'Title must be at least 2 characters long')
      .max(100, 'Title cannot exceed 100 characters'),
    description: z
      .string()
      .max(500, 'Description cannot exceed 500 characters')
      .optional()
      .default(''),
    category: z
      .string()
      .trim()
      .min(1, 'Category is required')
      .max(30, 'Category cannot exceed 30 characters'),
    priority: z.enum(['Low', 'Medium', 'High'], {
      required_error: 'Priority is required. Please select Low, Medium, or High.',
      invalid_type_error: 'Priority must be Low, Medium, or High.',
    }),
    startDate: z
      .string()
      .trim()
      .min(1, 'Start date is required')
      .refine(isValidIsoDateString, {
        message: 'Start date must be a valid date in YYYY-MM-DD format',
      }),
    dueDate: z
      .string()
      .trim()
      .min(1, 'Due date is required')
      .refine(isValidIsoDateString, {
        message: 'Due date must be a valid date in YYYY-MM-DD format',
      }),
    status: z.enum(['Pending', 'Completed'], {
      required_error: 'Status is required. Please select Pending or Completed.',
      invalid_type_error: 'Status must be Pending or Completed.',
    }),
  })
  .refine(
    (data) => !isDueDateEarlierThanStart(data.startDate, data.dueDate),
    {
      message: 'Due date cannot be earlier than the start date',
      path: ['dueDate'],
    }
  );
