import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Mail } from "lucide-react";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";

interface PageProps {
  params: Promise<{ locale: string }>;
}

function localeKeyOf(locale: string): "ko" | "en" | "zh" | "vi" {
  if (locale === "ko") return "ko";
  if (locale === "zh") return "zh";
  if (locale === "vi") return "vi";
  return "en";
}

const META = {
  ko: {
    title: "문의 · 피드백 — Workmate",
    desc: "버그 제보, 새 도구 요청, 계산 정확성, 개선 제안 — Workmate 운영자에게 바로 전하세요.",
  },
  en: {
    title: "Contact · Feedback — Workmate",
    desc: "Bug reports, new tool requests, calculation accuracy, improvement ideas — reach the Workmate operator directly.",
  },
  zh: {
    title: "咨询 · 反馈 — Workmate",
    desc: "Bug 报告、新工具请求、计算准确性、改进建议 — 直接联系 Workmate 运营者。",
  },
  vi: {
    title: "Liên hệ · Phản hồi — Workmate",
    desc: "Báo lỗi, yêu cầu công cụ mới, độ chính xác, góp ý cải thiện — liên hệ trực tiếp người vận hành Workmate.",
  },
} as const;

const PAGE = {
  ko: {
    home: "홈",
    directPrefix: "직접 메일이 편하시면",
    reply: "보통 영업일 기준 1~3일 내 답장 드립니다.",
    cantTitle: "답장이 어려운 문의",
    cant: [
      "개별 시공 현장의 구조·전기 컨설팅 (구조기술사·전기안전관리자에게)",
      "세무 신고 대행 (세무사 사무소)",
      "특정 사업자의 휴·폐업 조회 (홈택스에서 직접)",
    ],
  },
  en: {
    home: "Home",
    directPrefix: "Prefer email?",
    reply: "I usually reply within 1–3 business days.",
    cantTitle: "What I can't answer",
    cant: [
      "On-site structural/electrical consulting (see a licensed engineer)",
      "Tax filing on your behalf (a tax accountant)",
      "Business open/close lookups for a specific entity (use Hometax)",
    ],
  },
  zh: {
    home: "首页",
    directPrefix: "更喜欢邮件？",
    reply: "通常在 1~3 个工作日内回复。",
    cantTitle: "无法答复的咨询",
    cant: [
      "具体施工现场的结构·电气咨询（请咨询结构技师·电气安全管理者）",
      "税务申报代办（税务师事务所）",
      "特定事业者的停业·歇业查询（请在 Hometax 直接查询）",
    ],
  },
  vi: {
    home: "Trang chủ",
    directPrefix: "Thích dùng email hơn?",
    reply: "Thường phản hồi trong 1–3 ngày làm việc.",
    cantTitle: "Những việc không thể hỗ trợ",
    cant: [
      "Tư vấn kết cấu·điện tại công trình cụ thể (hãy hỏi kỹ sư có chứng chỉ)",
      "Khai thuế thay bạn (văn phòng kế toán thuế)",
      "Tra cứu tình trạng kinh doanh của một pháp nhân cụ thể (dùng Hometax)",
    ],
  },
} as const;

const EMAIL = "h2techjun@gmail.com";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const m = META[localeKeyOf(locale)];
  return { title: m.title, description: m.desc };
}

export default async function ContactPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const k = localeKeyOf(locale);
  const p = PAGE[k];

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-2xl">
        <nav className="mb-6 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {p.home}
          </Link>
        </nav>

        <FeedbackForm locale={k} />

        <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-[color:var(--color-text-tertiary)]">
          <span>{p.directPrefix}</span>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center gap-1 font-mono text-indigo-300 transition-colors hover:underline"
          >
            <Mail className="h-3.5 w-3.5" />
            {EMAIL}
          </a>
          <span className="w-full text-xs">{p.reply}</span>
        </div>

        <section className="mt-10 space-y-3 border-t border-[color:var(--color-border-subtle)] pt-6 leading-relaxed">
          <h2 className="text-sm font-semibold text-[color:var(--color-text-secondary)]">
            {p.cantTitle}
          </h2>
          <ul className="list-inside list-disc space-y-1.5 text-xs text-[color:var(--color-text-tertiary)]">
            {p.cant.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
