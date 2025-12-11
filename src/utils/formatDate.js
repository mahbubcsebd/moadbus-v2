import { format, parseISO } from "date-fns";

/**
 * Converts a date string (ISO or YYYY-MM-DD) to MM/DD/YYYY format
 * @param {string | Date} date - The date to format
 * @returns {string} formatted date as MM/DD/YYYY
 */
export function formatToMMDDYYYY(date) {
  if (!date) return "";

  let parsedDate;
  
  if (typeof date === "string") {
    parsedDate = parseISO(date);
  } else if (date instanceof Date) {
    parsedDate = date;
  } else {
    return "";
  }

  if (isNaN(parsedDate)) return "";
  return format(parsedDate, "MM/dd/yyyy");
}
