// From BJORK UI by Isaiah Bjork (MIT), https://github.com/isaiahbjork/ui
// Source: lib/utils.ts
// Only the import paths were changed, to the flat names the scatter brush uses.
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
