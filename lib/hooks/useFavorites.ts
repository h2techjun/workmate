"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "workmate:favorites";

/**
 * 도구 즐겨찾기 — localStorage 영속(서버 미전송). 도구 path 배열을 저장한다.
 * SSR 안전: 초기값 빈 배열로 렌더 → 마운트 후 hydrate(깜빡임 방지용 hydrated 플래그).
 */
export function useFavorites(): {
  favorites: string[];
  isFavorite: (path: string) => boolean;
  toggle: (path: string) => void;
  hydrated: boolean;
} {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setFavorites(parsed.filter((p): p is string => typeof p === "string"));
        }
      }
    } catch {
      // 손상된 값 무시
    }
    setHydrated(true);
  }, []);

  const toggle = useCallback((path: string) => {
    setFavorites((prev) => {
      const next = prev.includes(path)
        ? prev.filter((p) => p !== path)
        : [...prev, path];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // 저장 실패(쿼터 등) 무시 — 메모리 상태는 유지
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (path: string) => favorites.includes(path),
    [favorites],
  );

  return { favorites, isFavorite, toggle, hydrated };
}
