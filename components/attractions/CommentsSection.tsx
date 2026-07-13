"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Send, MessageCircle } from "lucide-react";
import type { Locale } from "@/i18n";
import { COMMENT_LIMITS } from "@/lib/comments/validation";

interface Comment {
  id: number;
  nickname: string;
  content: string;
  createdAt: string;
}

interface FormValues {
  nickname: string;
  content: string;
  /** honeypot */
  botcheck?: string;
}

type Copy = {
  heading: string;
  nicknamePh: string;
  contentPh: string;
  submit: string;
  sending: string;
  empty: string;
  loadMore: string;
  guide: string;
  errorGeneric: string;
  errorRate: string;
  errorBlocked: string;
};

const COPY: Record<Locale, Copy> = {
  ko: {
    heading: "다녀오셨나요? 한마디 남겨주세요",
    nicknamePh: "닉네임",
    contentPh: "방문 후기나 팁을 남겨주세요 (로그인 없이 익명)",
    submit: "등록",
    sending: "등록 중...",
    empty: "첫 댓글을 남겨보세요!",
    loadMore: "더 보기",
    guide: "로그인 없이 익명으로 남길 수 있어요. 욕설·광고·개인정보는 삼가주세요.",
    errorGeneric: "등록에 실패했어요. 잠시 후 다시 시도해주세요.",
    errorRate: "잠시 후에 다시 남겨주세요 (너무 빠른 연속 작성).",
    errorBlocked: "부적절한 내용이 포함되어 등록할 수 없어요.",
  },
  en: {
    heading: "Been here? Leave a comment",
    nicknamePh: "Nickname",
    contentPh: "Share your visit or a tip (anonymous, no login)",
    submit: "Post",
    sending: "Posting...",
    empty: "Be the first to comment!",
    loadMore: "Load more",
    guide: "Post anonymously without login. Please avoid abuse, ads, and personal info.",
    errorGeneric: "Couldn't post. Please try again shortly.",
    errorRate: "Please wait a moment before posting again.",
    errorBlocked: "Your comment contains blocked content.",
  },
  zh: {
    heading: "来过这里吗？留下评论吧",
    nicknamePh: "昵称",
    contentPh: "分享你的到访体验或小贴士（匿名，无需登录）",
    submit: "发布",
    sending: "发布中...",
    empty: "来发第一条评论吧！",
    loadMore: "加载更多",
    guide: "无需登录即可匿名发布。请勿发布辱骂、广告和个人信息。",
    errorGeneric: "发布失败，请稍后再试。",
    errorRate: "请稍等片刻再发布。",
    errorBlocked: "评论包含不当内容，无法发布。",
  },
  vi: {
    heading: "Bạn đã đến đây? Để lại bình luận nhé",
    nicknamePh: "Biệt danh",
    contentPh: "Chia sẻ trải nghiệm hoặc mẹo (ẩn danh, không cần đăng nhập)",
    submit: "Đăng",
    sending: "Đang đăng...",
    empty: "Hãy là người bình luận đầu tiên!",
    loadMore: "Xem thêm",
    guide: "Đăng ẩn danh không cần đăng nhập. Vui lòng tránh lời lẽ xúc phạm, quảng cáo và thông tin cá nhân.",
    errorGeneric: "Không đăng được. Vui lòng thử lại sau.",
    errorRate: "Vui lòng đợi một lát rồi đăng lại.",
    errorBlocked: "Bình luận chứa nội dung bị chặn.",
  },
};

function formatDate(iso: string, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : locale, {
      dateStyle: "medium",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

export function CommentsSection({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}): React.ReactElement {
  const c = COPY[locale];
  const [comments, setComments] = useState<Comment[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>();

  const load = useCallback(
    async (cur: number | null) => {
      const qs = cur ? `?cursor=${cur}` : "";
      const res = await fetch(`/api/attractions/${slug}/comments${qs}`);
      const d = await res.json();
      setComments((prev) =>
        cur ? [...prev, ...(d.items ?? [])] : (d.items ?? []),
      );
      setCursor(d.nextCursor ?? null);
      setLoaded(true);
    },
    [slug],
  );

  useEffect(() => {
    load(null).catch(() => setLoaded(true));
  }, [load]);

  async function onSubmit(data: FormValues): Promise<void> {
    if (data.botcheck) return; // honeypot
    setError(null);
    try {
      const res = await fetch(`/api/attractions/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: data.nickname,
          content: data.content,
          locale,
        }),
      });
      if (res.status === 201) {
        const created = await res.json();
        if (created?.id) setComments((prev) => [created, ...prev]);
        reset({ nickname: "", content: "" });
        return;
      }
      if (res.status === 429) setError(c.errorRate);
      else if (res.status === 400) setError(c.errorBlocked);
      else setError(c.errorGeneric);
    } catch {
      setError(c.errorGeneric);
    }
  }

  return (
    <section className="mt-12 border-t border-[color:var(--color-border-subtle)] pt-8">
      <h2 className="flex items-center gap-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        <MessageCircle className="h-5 w-5 text-rose-400" />
        {c.heading}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 space-y-3 rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-4"
      >
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          {...register("botcheck")}
        />
        <input
          type="text"
          placeholder={c.nicknamePh}
          maxLength={COMMENT_LIMITS.nicknameMax}
          {...register("nickname", { required: true, maxLength: COMMENT_LIMITS.nicknameMax })}
          className="w-full rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] px-3 py-2 text-sm text-[color:var(--color-text-primary)] outline-none focus:border-rose-400/50"
        />
        <textarea
          rows={3}
          placeholder={c.contentPh}
          maxLength={COMMENT_LIMITS.contentMax}
          {...register("content", {
            required: true,
            minLength: COMMENT_LIMITS.contentMin,
          })}
          className="w-full resize-y rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] px-3 py-2 text-sm leading-relaxed text-[color:var(--color-text-primary)] outline-none focus:border-rose-400/50"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs leading-relaxed text-[color:var(--color-text-tertiary)]">
            {c.guide}
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

      <ul className="mt-6 space-y-3">
        {loaded && comments.length === 0 && (
          <li className="py-6 text-center text-sm text-[color:var(--color-text-tertiary)]">
            {c.empty}
          </li>
        )}
        {comments.map((cm) => (
          <li
            key={cm.id}
            className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-4"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                {cm.nickname}
              </span>
              <span className="text-xs text-[color:var(--color-text-tertiary)]">
                {formatDate(cm.createdAt, locale)}
              </span>
            </div>
            <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
              {cm.content}
            </p>
          </li>
        ))}
      </ul>

      {cursor && (
        <button
          type="button"
          onClick={() => load(cursor)}
          className="mt-4 w-full rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] py-2.5 text-sm font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-rose-400/40"
        >
          {c.loadMore}
        </button>
      )}
    </section>
  );
}
