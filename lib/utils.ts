import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomDateInRange(): Date {
  const start = new Date(2022, 0, 1).getTime();
  const end = new Date(2024, 11, 31).getTime();
  const randomTime = Math.random() * (end - start) + start;
  return new Date(randomTime);
}