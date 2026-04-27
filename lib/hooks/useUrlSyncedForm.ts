"use client";

/**
 * URL ↔ form state 동기화 hook.
 *
 * - 마운트 시: URL search params에서 값 읽어 reset 호출
 * - 폼 변경 시: 디바운스로 URL 업데이트 (history.replaceState)
 * - localStorage에도 동시 저장 — 같은 도구 다음 방문 시 복원
 *
 * 설계:
 *   - useForm 인스턴스의 watch() + reset()을 받아 처리
 *   - 도구별 unique storageKey 필요
 */

import { useEffect, useRef } from "react";
import type { UseFormReturn, FieldValues } from "react-hook-form";

interface UseUrlSyncedFormOptions<T extends FieldValues> {
  /** localStorage key (예: "wireSize") */
  storageKey: string;
  /** RHF instance */
  form: UseFormReturn<T>;
  /** URL 동기화 비활성 (큰 폼 등) */
  disabled?: boolean;
}

function safeParse(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function readFromUrl(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const data = params.get("d");
  if (!data) return null;
  try {
    const decoded = decodeURIComponent(data);
    const parsed = JSON.parse(decoded);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return null;
  }
  return null;
}

function writeToUrl(values: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const encoded = encodeURIComponent(JSON.stringify(values));
  url.searchParams.set("d", encoded);
  window.history.replaceState({}, "", url.toString());
}

function readFromStorage(key: string): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(`worktool:${key}`);
    return safeParse(v) as Record<string, unknown> | null;
  } catch {
    return null;
  }
}

function writeToStorage(key: string, values: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`worktool:${key}`, JSON.stringify(values));
  } catch {
    // 용량 초과 등 — 무시
  }
}

export function useUrlSyncedForm<T extends FieldValues>({
  storageKey,
  form,
  disabled = false,
}: UseUrlSyncedFormOptions<T>): void {
  const initialized = useRef(false);

  // 1) 마운트 시 URL > localStorage > defaultValues 우선순위로 복원
  useEffect(() => {
    if (disabled || initialized.current) return;
    initialized.current = true;

    const fromUrl = readFromUrl();
    const fromStorage = readFromStorage(storageKey);
    const restored = fromUrl ?? fromStorage;
    if (restored) {
      try {
        form.reset(restored as T, { keepDefaultValues: false });
      } catch {
        // 검증 실패 — 무시 (스키마 미통과 시 defaultValues 유지)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, storageKey]);

  // 2) 폼 값 변경 시 디바운스 후 URL + localStorage 동시 업데이트
  useEffect(() => {
    if (disabled) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const subscription = form.watch((values) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        // 값이 모두 undefined인 초기 상태는 스킵
        const data = values as Record<string, unknown>;
        const hasAny = Object.values(data).some(
          (v) => v !== undefined && v !== null && v !== "",
        );
        if (!hasAny) return;
        writeToUrl(data);
        writeToStorage(storageKey, data);
      }, 400);
    });
    return () => {
      subscription.unsubscribe();
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, storageKey]);
}
