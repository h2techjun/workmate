/**
 * JSON ↔ CSV 변환기 (Korean encoding aware)
 *
 * 양방향 변환:
 *   - JSON 배열 → CSV (한국 Excel 호환 위해 BOM + CRLF 옵션)
 *   - CSV → JSON 배열 (CRLF/LF 모두 지원, 따옴표 이스케이프)
 *
 * 한국 환경 주의점:
 *   - Excel(한국)은 BOM 없이 UTF-8 CSV를 EUC-KR로 잘못 해석 → 한글 깨짐
 *   - CRLF 줄바꿈 필요 (Windows Excel 호환)
 *
 * 본 라이브러리는 외부 의존성 없이 순수 JS로 구현.
 */

export interface JsonToCsvOptions {
  /** UTF-8 BOM 추가 (Excel 한글 호환) */
  withBom?: boolean;
  /** CRLF 줄바꿈 (Windows Excel 호환). false면 LF. */
  useCrlf?: boolean;
  /** 헤더 순서 명시. 미지정 시 첫 객체의 key 순서. */
  headers?: string[];
  /** 구분자 (기본 ","). 한국에서 ; 사용 가능. */
  delimiter?: string;
}

export interface CsvToJsonOptions {
  /** 첫 행을 헤더로 사용 (기본 true). false면 col1, col2... */
  hasHeader?: boolean;
  /** 구분자 (기본 자동 감지) */
  delimiter?: string;
  /** 숫자처럼 보이는 값을 number로 변환 (기본 true) */
  parseNumbers?: boolean;
}

export interface ConversionResult<T> {
  output: T;
  rowCount: number;
  columnCount: number;
  warnings: string[];
}

const BOM = "﻿";

/* ===========================================================================
 * JSON → CSV
 * =========================================================================== */

function escapeCsvCell(value: unknown, delimiter: string): string {
  if (value === null || value === undefined) return "";
  const s = typeof value === "object" ? JSON.stringify(value) : String(value);
  // 특수문자 (따옴표, 구분자, 줄바꿈) 포함 시 따옴표로 감싸고 내부 따옴표 이스케이프
  if (
    s.includes('"') ||
    s.includes(delimiter) ||
    s.includes("\n") ||
    s.includes("\r")
  ) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function jsonToCsv(
  data: unknown,
  options: JsonToCsvOptions = {},
): ConversionResult<string> {
  const {
    withBom = true,
    useCrlf = true,
    headers,
    delimiter = ",",
  } = options;

  const warnings: string[] = [];

  if (!Array.isArray(data)) {
    throw new Error("input.notArray");
  }
  if (data.length === 0) {
    return {
      output: withBom ? BOM : "",
      rowCount: 0,
      columnCount: 0,
      warnings: ["input.empty"],
    };
  }

  const eol = useCrlf ? "\r\n" : "\n";

  // 헤더 결정
  const firstRow = data[0];
  if (typeof firstRow !== "object" || firstRow === null || Array.isArray(firstRow)) {
    throw new Error("input.notObjectArray");
  }
  const cols = headers ?? Object.keys(firstRow as Record<string, unknown>);

  // 헤더 행
  const lines: string[] = [];
  lines.push(cols.map((h) => escapeCsvCell(h, delimiter)).join(delimiter));

  // 데이터 행
  for (let i = 0; i < data.length; i += 1) {
    const row = data[i];
    if (typeof row !== "object" || row === null || Array.isArray(row)) {
      warnings.push(`row.${i}.notObject`);
      continue;
    }
    const r = row as Record<string, unknown>;
    const cells = cols.map((c) => escapeCsvCell(r[c], delimiter));
    lines.push(cells.join(delimiter));
  }

  const csv = (withBom ? BOM : "") + lines.join(eol);

  return {
    output: csv,
    rowCount: data.length,
    columnCount: cols.length,
    warnings,
  };
}

/* ===========================================================================
 * CSV → JSON
 * =========================================================================== */

/** 구분자 자동 감지 — 첫 행에서 ,/;/\t 중 가장 많은 것 */
function detectDelimiter(firstLine: string): string {
  const candidates = [",", ";", "\t"];
  let best = ",";
  let bestCount = 0;
  for (const c of candidates) {
    const count = firstLine.split(c).length - 1;
    if (count > bestCount) {
      best = c;
      bestCount = count;
    }
  }
  return best;
}

/** CSV 한 줄을 셀 배열로 분해 (따옴표·이스케이프 처리) */
function parseCsvLine(line: string, delimiter: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          // 이스케이프된 따옴표
          current += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      current += ch;
      i += 1;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (ch === delimiter) {
      cells.push(current);
      current = "";
      i += 1;
      continue;
    }
    current += ch;
    i += 1;
  }
  cells.push(current);
  return cells;
}

/** 따옴표를 고려해 텍스트를 라인으로 분리 (라인 내부의 \n은 보존) */
function splitCsvLines(text: string): string[] {
  const lines: string[] = [];
  let current = "";
  let inQuotes = false;
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch;
      i += 1;
      continue;
    }
    if (!inQuotes && (ch === "\n" || ch === "\r")) {
      // \r\n 처리
      if (ch === "\r" && text[i + 1] === "\n") {
        i += 2;
      } else {
        i += 1;
      }
      lines.push(current);
      current = "";
      continue;
    }
    current += ch;
    i += 1;
  }
  if (current.length > 0) lines.push(current);
  return lines;
}

function tryParseNumber(s: string): string | number {
  if (s === "" || s.trim() === "") return s;
  const n = Number(s);
  if (Number.isFinite(n) && /^-?\d+(\.\d+)?$/.test(s.trim())) {
    return n;
  }
  return s;
}

export function csvToJson(
  csvText: string,
  options: CsvToJsonOptions = {},
): ConversionResult<Array<Record<string, string | number>>> {
  const { hasHeader = true, parseNumbers = true } = options;
  const warnings: string[] = [];

  // BOM 제거
  let text = csvText;
  if (text.startsWith(BOM)) {
    text = text.slice(1);
  }
  if (text.length === 0) {
    return { output: [], rowCount: 0, columnCount: 0, warnings: ["input.empty"] };
  }

  const rawLines = splitCsvLines(text).filter((l) => l.length > 0);
  if (rawLines.length === 0) {
    return { output: [], rowCount: 0, columnCount: 0, warnings: ["input.empty"] };
  }

  const firstLine = rawLines[0] ?? "";
  const delimiter = options.delimiter ?? detectDelimiter(firstLine);

  let headers: string[];
  let dataLines: string[];
  if (hasHeader) {
    headers = parseCsvLine(firstLine, delimiter);
    dataLines = rawLines.slice(1);
  } else {
    const firstParsed = parseCsvLine(firstLine, delimiter);
    headers = firstParsed.map((_, i) => `col${i + 1}`);
    dataLines = rawLines;
  }

  const output: Array<Record<string, string | number>> = [];
  for (let i = 0; i < dataLines.length; i += 1) {
    const line = dataLines[i];
    if (line === undefined || line.length === 0) continue;
    const cells = parseCsvLine(line, delimiter);
    if (cells.length !== headers.length) {
      warnings.push(`row.${i + 1}.colMismatch`);
    }
    const row: Record<string, string | number> = {};
    headers.forEach((h, idx) => {
      const v = cells[idx] ?? "";
      row[h] = parseNumbers ? tryParseNumber(v) : v;
    });
    output.push(row);
  }

  return {
    output,
    rowCount: output.length,
    columnCount: headers.length,
    warnings,
  };
}
