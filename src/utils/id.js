export const generateTaskId = () => {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timeStr = Date.now().toString(36).substring(4).toUpperCase();
  return `TASK-${randomStr}${timeStr}`;
};
