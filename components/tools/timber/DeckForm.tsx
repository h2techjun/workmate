"use client";

import { useState } from "react";
import {
  calculateDeck,
  calculateFence,
} from "@/lib/calculations/timber/deckFence";

interface DeckFormProps {
  locale: "ko" | "en";
}

const T = {
  ko: {
    mode: "계산 종류",
    deck: "데크 보드",
    fence: "울타리",
    // deck
    area: "데크 면적 (m²)",
    boardWidth: "보드 폭 (mm)",
    boardLength: "보드 길이 (m)",
    gap: "보드 간격 (mm)",
    deckLength: "데크 한 변 길이 (m)",
    joistSpacing: "장선 간격 (mm)",
    boardCount: "필요 보드",
    boardUnit: "장",
    totalLength: "총 보드 길이",
    joistCount: "장선 개수",
    // fence
    length: "울타리 길이 (m)",
    postSpacing: "기둥 간격 (m)",
    picketSpacing: "세로살 간격 (mm)",
    postCount: "기둥",
    railCount: "가로 레일",
    picketCount: "세로살",
    count: "개",
    result: "필요 자재",
    deckNote: "보드 유효폭 = 보드폭 + 간격. 손실 할증 10% 포함. 장선은 한 변 길이 입력 시 산정.",
    fenceNote: "기둥 = 칸 수 + 1. 가로 레일은 칸당 상·하 2단. 세로살 간격 0이면 살 미산정.",
  },
  en: {
    mode: "Calculation type",
    deck: "Deck board",
    fence: "Fence",
    area: "Deck area (m²)",
    boardWidth: "Board width (mm)",
    boardLength: "Board length (m)",
    gap: "Board gap (mm)",
    deckLength: "Deck side length (m)",
    joistSpacing: "Joist spacing (mm)",
    boardCount: "Boards needed",
    boardUnit: "boards",
    totalLength: "Total board length",
    joistCount: "Joists",
    length: "Fence length (m)",
    postSpacing: "Post spacing (m)",
    picketSpacing: "Picket spacing (mm)",
    postCount: "Posts",
    railCount: "Rails",
    picketCount: "Pickets",
    count: "",
    result: "Materials needed",
    deckNote: "Effective board width = width + gap. Includes 10% waste. Joists calculated when side length is entered.",
    fenceNote: "Posts = sections + 1. Rails are 2 per section (top/bottom). Picket spacing 0 skips pickets.",
  },
} as const;

export function DeckForm({ locale }: DeckFormProps): React.ReactElement {
  const t = T[locale];
  const [mode, setMode] = useState<"deck" | "fence">("deck");

  // deck
  const [area, setArea] = useState(20);
  const [boardWidth, setBoardWidth] = useState(140);
  const [boardLength, setBoardLength] = useState(3.6);
  const [gap, setGap] = useState(5);
  const [deckLength, setDeckLength] = useState(5);
  const [joistSpacing, setJoistSpacing] = useState(400);
  // fence
  const [length, setLength] = useState(20);
  const [postSpacing, setPostSpacing] = useState(2);
  const [picketSpacing, setPicketSpacing] = useState(100);

  const deck = calculateDeck({ area, boardWidth, boardLength, gap, deckLength, joistSpacing, waste: 10 });
  const fence = calculateFence({ length, postSpacing, picketSpacing });

  const field = (label: string, value: number, setter: (v: number) => void, step = 1) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">{label}</label>
      <input type="number" step={step} className="input-base" value={value} onChange={(e) => setter(parseFloat(e.target.value) || 0)} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="surface-card p-5">
        <div className="grid grid-cols-2 gap-2">
          {(["deck", "fence"] as const).map((mo) => (
            <button key={mo} type="button" onClick={() => setMode(mo)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${mode === mo ? "bg-gradient-to-br from-amber-600 to-orange-700 text-white" : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-amber-500"}`}>
              {mo === "deck" ? t.deck : t.fence}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card space-y-4 p-5 md:p-7">
          {mode === "deck" ? (
            <>
              {field(t.area, area, setArea)}
              <div className="grid grid-cols-2 gap-3">
                {field(t.boardWidth, boardWidth, setBoardWidth)}
                {field(t.boardLength, boardLength, setBoardLength, 0.1)}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {field(t.gap, gap, setGap)}
                {field(t.deckLength, deckLength, setDeckLength, 0.1)}
                {field(t.joistSpacing, joistSpacing, setJoistSpacing)}
              </div>
            </>
          ) : (
            <>
              {field(t.length, length, setLength)}
              <div className="grid grid-cols-2 gap-3">
                {field(t.postSpacing, postSpacing, setPostSpacing, 0.1)}
                {field(t.picketSpacing, picketSpacing, setPicketSpacing)}
              </div>
            </>
          )}
        </section>

        <section className="surface-card space-y-4 p-5 md:p-7">
          <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">{t.result}</h2>
          {mode === "deck" ? (
            <>
              <div className="rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 p-4 ring-1 ring-amber-500/20">
                <dt className="text-xs text-[color:var(--color-text-tertiary)]">{t.boardCount}</dt>
                <dd className="mt-1 text-4xl font-bold tabular-nums text-[#eef0f5]">{deck.boardCount}<span className="ml-1 text-base font-medium text-[color:var(--color-text-secondary)]">{t.boardUnit}</span></dd>
              </div>
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.totalLength}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{deck.totalBoardLength} m</dd></div>
                <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.joistCount}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{deck.joistCount} {t.count}</dd></div>
              </dl>
              <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">{t.deckNote}</p>
            </>
          ) : (
            <>
              <div className="rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 p-4 ring-1 ring-amber-500/20">
                <dt className="text-xs text-[color:var(--color-text-tertiary)]">{t.postCount}</dt>
                <dd className="mt-1 text-4xl font-bold tabular-nums text-[#eef0f5]">{fence.postCount}<span className="ml-1 text-base font-medium text-[color:var(--color-text-secondary)]">{t.count}</span></dd>
              </div>
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.railCount}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{fence.railCount} {t.count}</dd></div>
                <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.picketCount}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{fence.picketCount} {t.count}</dd></div>
              </dl>
              <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">{t.fenceNote}</p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
