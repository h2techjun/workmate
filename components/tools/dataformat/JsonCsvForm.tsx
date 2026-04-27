"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeftRight, Copy, Download } from "lucide-react";
import { csvToJson, jsonToCsv } from "@/lib/calculations/dataformat/jsonCsv";
import { cn } from "@/lib/utils/cn";
import {
  ActionRow,
  EmptyResult,
  ErrorBox,
  Field,
  FieldGroup,
  FormShell,
  ResultShell,
  Stat,
} from "@/components/ui/calc-form";

type Direction = "jsonToCsv" | "csvToJson";

interface ConversionState {
  output: string;
  rowCount: number;
  columnCount: number;
  warnings: string[];
}

const DEFAULT_JSON = `[
  { "name": "홍길동", "age": 30, "city": "서울" },
  { "name": "이순신", "age": 50, "city": "부산" },
  { "name": "세종대왕", "age": 53, "city": "한양" }
]`;

const DEFAULT_CSV = `name,age,city
홍길동,30,서울
이순신,50,부산
세종대왕,53,한양`;

export function JsonCsvForm(): React.ReactElement {
  const t = useTranslations("jsonCsvTool");
  const [direction, setDirection] = useState<Direction>("jsonToCsv");
  const [input, setInput] = useState<string>(DEFAULT_JSON);
  const [withBom, setWithBom] = useState(true);
  const [useCrlf, setUseCrlf] = useState(true);
  const [hasHeader, setHasHeader] = useState(true);
  const [parseNumbers, setParseNumbers] = useState(true);
  const [result, setResult] = useState<ConversionState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const swapDirection = (): void => {
    const next = direction === "jsonToCsv" ? "csvToJson" : "jsonToCsv";
    setDirection(next);
    setInput(next === "jsonToCsv" ? DEFAULT_JSON : DEFAULT_CSV);
    setResult(null);
    setError(null);
  };

  const onConvert = (): void => {
    setError(null);
    setCopied(false);
    try {
      if (direction === "jsonToCsv") {
        const parsed = JSON.parse(input);
        const r = jsonToCsv(parsed, { withBom, useCrlf });
        setResult({
          output: r.output,
          rowCount: r.rowCount,
          columnCount: r.columnCount,
          warnings: r.warnings,
        });
      } else {
        const r = csvToJson(input, { hasHeader, parseNumbers });
        setResult({
          output: JSON.stringify(r.output, null, 2),
          rowCount: r.rowCount,
          columnCount: r.columnCount,
          warnings: r.warnings,
        });
      }
    } catch (e) {
      setResult(null);
      setError(
        e instanceof Error ? e.message : t("errors.unknown"),
      );
    }
  };

  const onCopy = async (): Promise<void> => {
    if (!result) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const onDownload = (): void => {
    if (!result) return;
    const isCsv = direction === "jsonToCsv";
    const mime = isCsv ? "text/csv;charset=utf-8" : "application/json";
    const ext = isCsv ? "csv" : "json";
    const blob = new Blob([result.output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `worktool-${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onReset = (): void => {
    setInput(direction === "jsonToCsv" ? DEFAULT_JSON : DEFAULT_CSV);
    setResult(null);
    setError(null);
    setCopied(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
      <FormShell
        onSubmit={(e) => {
          e.preventDefault();
          onConvert();
        }}
      >
        <FieldGroup title={t("sections.direction")}>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-semibold",
                direction === "jsonToCsv"
                  ? "bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-500/40"
                  : "bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-tertiary)]",
              )}
            >
              JSON
            </span>
            <button
              type="button"
              onClick={swapDirection}
              aria-label="swap"
              className="rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] p-2 transition-colors hover:bg-[color:var(--color-bg-card-hover)]"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
            <span
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-semibold",
                direction === "csvToJson"
                  ? "bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-500/40"
                  : "bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-tertiary)]",
              )}
            >
              CSV
            </span>
          </div>
        </FieldGroup>

        <FieldGroup title={t("sections.input")}>
          <Field label={direction === "jsonToCsv" ? "JSON" : "CSV"}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={14}
              spellCheck={false}
              className="input-base font-mono text-xs"
            />
          </Field>
        </FieldGroup>

        <FieldGroup title={t("sections.options")}>
          {direction === "jsonToCsv" ? (
            <>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[color:var(--color-text-secondary)]">
                <input
                  type="checkbox"
                  checked={withBom}
                  onChange={(e) => setWithBom(e.target.checked)}
                  className="h-4 w-4"
                />
                <span>{t("options.withBom")}</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[color:var(--color-text-secondary)]">
                <input
                  type="checkbox"
                  checked={useCrlf}
                  onChange={(e) => setUseCrlf(e.target.checked)}
                  className="h-4 w-4"
                />
                <span>{t("options.useCrlf")}</span>
              </label>
            </>
          ) : (
            <>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[color:var(--color-text-secondary)]">
                <input
                  type="checkbox"
                  checked={hasHeader}
                  onChange={(e) => setHasHeader(e.target.checked)}
                  className="h-4 w-4"
                />
                <span>{t("options.hasHeader")}</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[color:var(--color-text-secondary)]">
                <input
                  type="checkbox"
                  checked={parseNumbers}
                  onChange={(e) => setParseNumbers(e.target.checked)}
                  className="h-4 w-4"
                />
                <span>{t("options.parseNumbers")}</span>
              </label>
            </>
          )}
        </FieldGroup>

        <ActionRow
          primary={
            <button type="submit" className="btn-primary flex-1">
              {t("actions.convert")}
            </button>
          }
          secondary={
            <button
              type="button"
              onClick={onReset}
              className="btn-ghost sm:w-auto"
            >
              {t("actions.reset")}
            </button>
          }
        />
      </FormShell>

      <ResultShell heading={t("result.heading")}>
        {error && <ErrorBox message={error} />}
        {!error && !result && <EmptyResult message={t("result.empty")} />}
        {result && (
          <div className="animate-fade-up space-y-4">
            <dl className="grid grid-cols-2 gap-3">
              <Stat label={t("result.rows")} value={result.rowCount.toString()} />
              <Stat
                label={t("result.cols")}
                value={result.columnCount.toString()}
              />
            </dl>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                  {direction === "jsonToCsv" ? "CSV" : "JSON"}
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onCopy}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] px-2.5 py-1 text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-bg-card-hover)]"
                  >
                    <Copy className="h-3 w-3" />
                    {copied ? t("actions.copied") : t("actions.copy")}
                  </button>
                  <button
                    type="button"
                    onClick={onDownload}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] px-2.5 py-1 text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-bg-card-hover)]"
                  >
                    <Download className="h-3 w-3" />
                    {t("actions.download")}
                  </button>
                </div>
              </div>
              <textarea
                readOnly
                value={result.output}
                rows={16}
                spellCheck={false}
                className="input-base font-mono text-xs"
              />
            </div>

            {result.warnings.length > 0 && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                <h4 className="mb-1 font-semibold">{t("result.warnings")}</h4>
                <ul className="list-inside list-disc space-y-0.5">
                  {result.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="border-t border-[color:var(--color-border-subtle)] pt-3 text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
              {t("result.note")}
            </p>
          </div>
        )}
      </ResultShell>
    </div>
  );
}
