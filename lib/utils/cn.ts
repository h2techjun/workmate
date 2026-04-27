import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스를 안전하게 병합합니다.
 * shadcn/ui 표준 유틸 함수.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
