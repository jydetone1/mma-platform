export const checkDateFormat = (date: Date) => {
  return date ? new Date(date) : null;
};
