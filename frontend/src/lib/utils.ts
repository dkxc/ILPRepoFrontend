import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * This function does nothing besides helping us to be able to
 * sort the classes inside style objects which is not supported
 * by the Tailwind IntelliSense by default.
 */
export function sortCx<
  T extends Record<
    string,
    | string
    | number
    | Record<string, string | number | Record<string, string | number>>
  >,
>(classes: T): T {
  return classes;
}
