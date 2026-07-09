"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * 통합 문의·피드백 폼 — 유형 선택 + 내용 + 선택 이메일.
 *
 * 전송: 환경변수 NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY 가 있으면 Web3Forms
 * 서버리스 엔드포인트로 자동 전송(운영자 메일 도착). 없으면 mailto 프리필로
 * 폴백해 key 설정 전에도 즉시 작동한다. honeypot(botcheck) 로 스팸 차단.
 */

interface FormValues {
  type: string;
  message: string;
  email?: string;
  /** honeypot — 봇만 채움 */
  botcheck?: string;
}

type Copy = {
  heading: string;
  intro: string;
  typeLabel: string;
  types: { value: string; label: string }[];
  messageLabel: string;
  messagePh: string;
  emailLabel: string;
  emailPh: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
  requiredMsg: string;
  privacy: string;
};

const COPY: Record<"ko" | "en" | "zh" | "vi", Copy> = {
  ko: {
    heading: "문의 · 피드백 · 개선 제안",
    intro:
      "버그, 새 도구 요청, 계산 정확성, 개선 아이디어 — 무엇이든 편하게 보내주세요. 같은 요청이 여러 번 오면 우선순위로 반영합니다.",
    typeLabel: "유형",
    types: [
      { value: "bug", label: "버그 제보" },
      { value: "feature", label: "새 도구 요청" },
      { value: "accuracy", label: "계산 정확성" },
      { value: "improve", label: "개선 제안" },
      { value: "partner", label: "제휴 · 광고" },
      { value: "etc", label: "기타" },
    ],
    messageLabel: "내용",
    messagePh:
      "어떤 도구에서 무슨 일이 있었는지(입력값·결과), 또는 어떤 제안인지 적어주세요. 결과 공유 URL이 있으면 재현이 빨라요.",
    emailLabel: "이메일 (선택)",
    emailPh: "답장 받을 주소 — 비워두셔도 됩니다",
    submit: "보내기",
    sending: "보내는 중...",
    success: "보냈습니다! 소중한 의견 감사합니다.",
    error: "전송에 실패했어요. 잠시 후 다시 시도하거나 메일로 보내주세요.",
    requiredMsg: "내용을 입력해주세요.",
    privacy: "입력한 내용은 운영자에게만 전달되며, 답장 외 용도로 쓰지 않습니다.",
  },
  en: {
    heading: "Contact · Feedback · Suggestions",
    intro:
      "Bugs, new tool requests, calculation accuracy, improvement ideas — send anything. Frequent requests get prioritized.",
    typeLabel: "Type",
    types: [
      { value: "bug", label: "Bug report" },
      { value: "feature", label: "New tool request" },
      { value: "accuracy", label: "Calc accuracy" },
      { value: "improve", label: "Improvement" },
      { value: "partner", label: "Partnership · Ads" },
      { value: "etc", label: "Other" },
    ],
    messageLabel: "Message",
    messagePh:
      "Which tool, what inputs and result — or your suggestion. A share URL helps me reproduce fast.",
    emailLabel: "Email (optional)",
    emailPh: "For a reply — you can leave it blank",
    submit: "Send",
    sending: "Sending...",
    success: "Sent! Thanks for the feedback.",
    error: "Failed to send. Please retry shortly, or email me.",
    requiredMsg: "Please enter a message.",
    privacy:
      "Your message goes only to the operator and is used solely to reply.",
  },
  zh: {
    heading: "咨询 · 反馈 · 改进建议",
    intro:
      "Bug、新工具请求、计算准确性、改进想法 — 欢迎随时告诉我们。相同请求越多，优先级越高。",
    typeLabel: "类型",
    types: [
      { value: "bug", label: "Bug 报告" },
      { value: "feature", label: "新工具请求" },
      { value: "accuracy", label: "计算准确性" },
      { value: "improve", label: "改进建议" },
      { value: "partner", label: "合作 · 广告" },
      { value: "etc", label: "其他" },
    ],
    messageLabel: "内容",
    messagePh:
      "在哪个工具、输入了什么、得到什么结果 — 或者您的建议。附上结果分享链接可加快复现。",
    emailLabel: "邮箱（选填）",
    emailPh: "用于回复 — 也可留空",
    submit: "发送",
    sending: "发送中...",
    success: "已发送！感谢您的宝贵意见。",
    error: "发送失败。请稍后重试，或改用邮件联系。",
    requiredMsg: "请填写内容。",
    privacy: "您的内容仅发送给运营者，且只用于回复。",
  },
  vi: {
    heading: "Liên hệ · Phản hồi · Góp ý",
    intro:
      "Lỗi, yêu cầu công cụ mới, độ chính xác tính toán, ý tưởng cải thiện — gửi bất cứ điều gì. Yêu cầu lặp lại nhiều sẽ được ưu tiên.",
    typeLabel: "Loại",
    types: [
      { value: "bug", label: "Báo lỗi" },
      { value: "feature", label: "Yêu cầu công cụ mới" },
      { value: "accuracy", label: "Độ chính xác" },
      { value: "improve", label: "Cải thiện" },
      { value: "partner", label: "Hợp tác · Quảng cáo" },
      { value: "etc", label: "Khác" },
    ],
    messageLabel: "Nội dung",
    messagePh:
      "Công cụ nào, nhập gì và kết quả ra sao — hoặc góp ý của bạn. Có link chia sẻ kết quả sẽ giúp tái hiện nhanh.",
    emailLabel: "Email (tùy chọn)",
    emailPh: "Để nhận phản hồi — có thể để trống",
    submit: "Gửi",
    sending: "Đang gửi...",
    success: "Đã gửi! Cảm ơn góp ý của bạn.",
    error: "Gửi thất bại. Vui lòng thử lại sau, hoặc gửi email cho tôi.",
    requiredMsg: "Vui lòng nhập nội dung.",
    privacy:
      "Nội dung chỉ được gửi tới người vận hành và chỉ dùng để phản hồi.",
  },
};

const OPERATOR_EMAIL = "h2techjun@gmail.com";

export function FeedbackForm({
  locale,
}: {
  locale: "ko" | "en" | "zh" | "vi";
}): React.ReactElement {
  const c = COPY[locale];
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { type: "bug" } });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const typeLabel = (v: string): string =>
    c.types.find((t) => t.value === v)?.label ?? v;

  async function onSubmit(data: FormValues): Promise<void> {
    if (data.botcheck) return; // honeypot — 봇 차단
    setStatus("idle");

    if (accessKey) {
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `[Workmate] ${typeLabel(data.type)}`,
            from_name: "Workmate Feedback",
            email: data.email?.trim() || "no-reply@workmate.tools",
            message: `[${typeLabel(data.type)}] (${locale})\n\n${data.message}\n\n---\nReply-to: ${data.email?.trim() || "(none)"}`,
          }),
        });
        if (res.ok) {
          setStatus("success");
          reset({ type: "bug", message: "", email: "" });
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
      return;
    }

    // 폴백: access key 미설정 시 mailto 프리필
    const subject = encodeURIComponent(
      `[Workmate] ${typeLabel(data.type)}`,
    );
    const body = encodeURIComponent(
      `[${typeLabel(data.type)}]\n\n${data.message}\n\n---\n${data.email?.trim() ?? ""}`,
    );
    window.location.href = `mailto:${OPERATOR_EMAIL}?subject=${subject}&body=${body}`;
    setStatus("success");
    reset({ type: "bug", message: "", email: "" });
  }

  if (status === "success") {
    return (
      <div className="surface-card flex flex-col items-center gap-3 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        <p className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          {c.success}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-1 text-sm font-medium text-indigo-300 hover:underline"
        >
          {c.submit} +
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="surface-card space-y-5 p-5 md:p-6"
    >
      {/* honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register("botcheck")}
      />

      <div>
        <label
          htmlFor="fb-type"
          className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]"
        >
          {c.typeLabel}
        </label>
        <select
          id="fb-type"
          {...register("type")}
          className="w-full rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] px-3 py-2.5 text-sm text-[color:var(--color-text-primary)] outline-none transition-colors focus:border-indigo-500/50"
        >
          {c.types.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="fb-message"
          className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]"
        >
          {c.messageLabel}
        </label>
        <textarea
          id="fb-message"
          rows={5}
          placeholder={c.messagePh}
          {...register("message", { required: true, minLength: 5 })}
          className="w-full resize-y rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] px-3 py-2.5 text-sm leading-relaxed text-[color:var(--color-text-primary)] outline-none transition-colors placeholder:text-[color:var(--color-text-muted)] focus:border-indigo-500/50"
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-red-400">{c.requiredMsg}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="fb-email"
          className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]"
        >
          {c.emailLabel}
        </label>
        <input
          id="fb-email"
          type="email"
          placeholder={c.emailPh}
          {...register("email")}
          className="w-full rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] px-3 py-2.5 text-sm text-[color:var(--color-text-primary)] outline-none transition-colors placeholder:text-[color:var(--color-text-muted)] focus:border-indigo-500/50"
        />
      </div>

      {status === "error" && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{c.error}</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs leading-relaxed text-[color:var(--color-text-tertiary)]">
          {c.privacy}
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary shrink-0 disabled:opacity-60"
        >
          {isSubmitting ? c.sending : c.submit}
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
