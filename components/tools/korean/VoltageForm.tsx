"use client";

import { useState } from "react";
import { checkVoltage } from "@/lib/calculations/korean/voltage";

interface VoltageFormProps {
  locale: "ko" | "en";
}

const T = {
  ko: {
    preset: "기기 전압 (라벨 INPUT 확인)",
    presets: {
      dual: "100~240V (프리볼트)",
      us: "120V 전용 (미국)",
      jp: "100V 전용 (일본)",
      kr: "220~240V (한국·유럽)",
    },
    plug: "출신 국가 플러그",
    plugs: { A: "A (미국·일본 납작 2핀)", B: "B (미국 3핀)", C: "C (유럽 둥근 2핀)", F: "F (독일 둥근 2핀)", G: "G (영국 3핀)", I: "I (호주 八자)", other: "기타" },
    result: "한국에서 필요한 것",
    transformer: "변압기 (변환기)",
    plugAdapter: "플러그 어댑터 (돼지코)",
    needYes: "필요",
    needNo: "불필요",
    stepDown: "강압 변압기 (220V → 기기 전압)",
    koreaStd: "한국 표준",
    note: "한국은 220V·60Hz, 플러그 타입 C/F. 노트북·폰 충전기는 대부분 프리볼트라 어댑터만 있으면 됨. 헤어드라이어·고데기 등 열기구는 전압 확인 필수. '돼지코'는 형태 변환 어댑터.",
  },
  en: {
    preset: "Device voltage (check the INPUT label)",
    presets: {
      dual: "100-240V (dual voltage)",
      us: "120V only (US)",
      jp: "100V only (Japan)",
      kr: "220-240V (Korea/Europe)",
    },
    plug: "Your country's plug",
    plugs: { A: "A (US/Japan flat 2-pin)", B: "B (US 3-pin)", C: "C (Europe round 2-pin)", F: "F (Germany round 2-pin)", G: "G (UK 3-pin)", I: "I (Australia)", other: "Other" },
    result: "What you need in Korea",
    transformer: "Voltage transformer",
    plugAdapter: "Plug adapter (돼지코)",
    needYes: "Needed",
    needNo: "Not needed",
    stepDown: "Step-down transformer (220V → device voltage)",
    koreaStd: "Korea standard",
    note: "Korea uses 220V/60Hz, plug type C/F. Laptop and phone chargers are usually dual-voltage — only a plug adapter is needed. Heat devices (hair dryers, flat irons) must match voltage. '돼지코' is a shape adapter.",
  },
} as const;

const PRESETS = {
  dual: { min: 100, max: 240 },
  us: { min: 120, max: 120 },
  jp: { min: 100, max: 100 },
  kr: { min: 220, max: 240 },
} as const;

type PresetKey = keyof typeof PRESETS;
type PlugType = "A" | "B" | "C" | "F" | "G" | "I" | "other";

export function VoltageForm({ locale }: VoltageFormProps): React.ReactElement {
  const t = T[locale];
  const [preset, setPreset] = useState<PresetKey>("dual");
  const [plug, setPlug] = useState<PlugType>("A");

  const { min, max } = PRESETS[preset];
  const r = checkVoltage({ deviceMinV: min, deviceMaxV: max, plugType: plug });

  const Badge = ({ need }: { need: boolean }) => (
    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${need ? "bg-amber-500/15 text-amber-300" : "bg-emerald-500/15 text-emerald-300"}`}>
      {need ? t.needYes : t.needNo}
    </span>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-5 p-5 md:p-7">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">{t.preset}</label>
          <div className="grid gap-2">
            {(Object.keys(PRESETS) as PresetKey[]).map((p) => (
              <button key={p} type="button" onClick={() => setPreset(p)}
                className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${preset === p ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white" : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-indigo-400"}`}>
                {t.presets[p]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">{t.plug}</label>
          <div className="grid grid-cols-2 gap-2">
            {(["A", "B", "C", "F", "G", "I", "other"] as PlugType[]).map((p) => (
              <button key={p} type="button" onClick={() => setPlug(p)}
                className={`rounded-lg px-2 py-2 text-left text-xs font-medium transition-colors ${plug === p ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white" : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-indigo-400"}`}>
                {t.plugs[p]}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">{t.result}</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4">
            <div>
              <p className="font-semibold text-[color:var(--color-text-primary)]">{t.transformer}</p>
              {r.needsTransformer && <p className="mt-0.5 text-xs text-[color:var(--color-text-tertiary)]">{t.stepDown}</p>}
            </div>
            <Badge need={r.needsTransformer} />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4">
            <p className="font-semibold text-[color:var(--color-text-primary)]">{t.plugAdapter}</p>
            <Badge need={r.needsPlugAdapter} />
          </div>
          <div className="rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-3 text-center text-sm text-[color:var(--color-text-secondary)]">
            {t.koreaStd}: <span className="font-bold text-[color:var(--color-text-primary)]">{r.koreaVoltage}V · {r.koreaFrequency}Hz · C/F</span>
          </div>
        </div>
        <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">{t.note}</p>
      </section>
    </div>
  );
}
