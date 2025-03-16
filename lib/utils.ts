import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a random Date object within the range of January 1st, 2022 and December 31st, 2024.
 * @returns A random Date object.
 */
export function getRandomDateInRange(): Date {
  const start = new Date(2022, 0, 1).getTime();
  const end = new Date(2024, 11, 31).getTime();
  const randomTime = Math.random() * (end - start) + start;
  return new Date(randomTime);
}
/**
 * Format a date string into a human-readable format relative to the current date.
 *
 * If the date is today, it will return "Today". If the date is yesterday, it will
 * return "Yesterday". Otherwise, it will return a string in one of the following
 * formats:
 *
 * - "{X} days ago", where {X} is the number of days between the given date and
 *   today.
 * - "{month} {day}, {year}", where {month} is the month of the year in short
 *   format (e.g. "Jan"), {day} is the day of the month, and {year} is the year.
 * - "{X} {year|years} ago", where {X} is the number of years between the given
 *   date and today.
 *
 * @param {string} date - The date to format, in ISO format.
 * @returns {string} The formatted date string.
 */

export const formatDate = (date: string | Date): string => {
  const messageDate = new Date(date);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const diffInMonths =
    now.getMonth() -
    messageDate.getMonth() +
    12 * (now.getFullYear() - messageDate.getFullYear());
  const diffInYears = now.getFullYear() - messageDate.getFullYear();

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  } else if (diffInMonths < 1) {
    return `${diffInDays} days ago`;
  } else if (diffInYears < 1) {
    return messageDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } else {
    return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
  }
};

export const lowerCase = (str: string): string => {
  return str.charAt(0).toLowerCase() + str.slice(1).toLowerCase();
};

export const convertUnicodeToFlag = (unicode: string) => {
  // Split the Unicode string into an array
  const codePoints = unicode
    .split(" ")
    .map((u) => parseInt(u.replace("U+", ""), 16)); // Convert each to a number
  // Convert code points to a string
  return String.fromCodePoint(...codePoints);
};
