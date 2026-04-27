import { describe, expect, it } from "vitest";
import { csvToJson, jsonToCsv } from "./jsonCsv";

describe("jsonToCsv - 기본 변환", () => {
  it("객체 배열 → CSV (헤더 + BOM + CRLF)", () => {
    const result = jsonToCsv([
      { name: "홍길동", age: 30 },
      { name: "이순신", age: 50 },
    ]);
    expect(result.rowCount).toBe(2);
    expect(result.columnCount).toBe(2);
    expect(result.output.startsWith("﻿")).toBe(true); // BOM
    expect(result.output).toContain("\r\n"); // CRLF
    expect(result.output).toContain("홍길동");
    expect(result.output).toContain("이순신");
  });

  it("BOM 없이, LF 줄바꿈", () => {
    const r = jsonToCsv([{ a: 1, b: 2 }], { withBom: false, useCrlf: false });
    expect(r.output.startsWith("﻿")).toBe(false);
    expect(r.output).toContain("\n");
    expect(r.output).not.toContain("\r\n");
  });

  it("쉼표·따옴표 포함 셀 이스케이프", () => {
    const r = jsonToCsv([{ note: 'Hello, "World"' }], { withBom: false });
    expect(r.output).toContain('"Hello, ""World"""');
  });

  it("세미콜론 구분자", () => {
    const r = jsonToCsv([{ a: 1, b: 2 }], {
      withBom: false,
      delimiter: ";",
    });
    expect(r.output).toContain(";");
    expect(r.output).not.toMatch(/,(?!.*;)/); // semicolons only
  });
});

describe("jsonToCsv - 빈 배열 / 잘못된 입력", () => {
  it("빈 배열 → BOM만 + warning", () => {
    const r = jsonToCsv([]);
    expect(r.rowCount).toBe(0);
    expect(r.warnings).toContain("input.empty");
  });

  it("배열이 아니면 throw", () => {
    expect(() => jsonToCsv({ a: 1 })).toThrow();
  });
});

describe("csvToJson - 기본 변환", () => {
  it("BOM + CRLF CSV → 객체 배열", () => {
    const csv = "﻿name,age\r\n홍길동,30\r\n이순신,50";
    const r = csvToJson(csv);
    expect(r.rowCount).toBe(2);
    expect(r.output[0]).toEqual({ name: "홍길동", age: 30 });
    expect(r.output[1]).toEqual({ name: "이순신", age: 50 });
  });

  it("LF 줄바꿈도 정상 처리", () => {
    const csv = "name,age\n홍길동,30";
    const r = csvToJson(csv);
    expect(r.output[0]).toEqual({ name: "홍길동", age: 30 });
  });

  it("따옴표 이스케이프 처리", () => {
    const csv = 'name,note\n홍길동,"Hello, ""World"""';
    const r = csvToJson(csv);
    expect(r.output[0]?.note).toBe('Hello, "World"');
  });

  it("자동 구분자 감지 (세미콜론)", () => {
    const csv = "name;age\n홍길동;30";
    const r = csvToJson(csv);
    expect(r.output[0]).toEqual({ name: "홍길동", age: 30 });
  });

  it("hasHeader=false → col1, col2 자동 헤더", () => {
    const csv = "홍길동,30";
    const r = csvToJson(csv, { hasHeader: false });
    expect(r.output[0]).toEqual({ col1: "홍길동", col2: 30 });
  });

  it("parseNumbers=false → 모두 문자열", () => {
    const csv = "name,age\n홍길동,30";
    const r = csvToJson(csv, { parseNumbers: false });
    expect(r.output[0]?.age).toBe("30");
  });
});

describe("왕복 변환 (round-trip)", () => {
  it("JSON → CSV → JSON 일관성", () => {
    const original = [
      { name: "홍길동", age: 30, note: "안녕, 세상" },
      { name: "이순신", age: 50, note: "장군" },
    ];
    const csv = jsonToCsv(original).output;
    const back = csvToJson(csv).output;
    expect(back).toEqual(original);
  });
});
