import type { MetadataRoute } from "next";

// 검색 로봇 규칙.
// [결정 2026-11-19 대표] 검색 공개 시작. AI 검색(인용)은 허용하고, 학습 수집 로봇은 막는다.
// 로그인·관리·제보 확인 쪽은 색인하지 않는다.
const SITE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kbeautyprice.vercel.app";

const PRIVATE = ["/admin", "/manage", "/auth", "/my-submissions", "/api/"];

// 학습용으로 글을 가져가는 로봇. 인용은 못 하고 모델 학습에만 쓰여서 막는다.
const TRAINING_BOTS = [
  "GPTBot",
  "Google-Extended",
  "CCBot",
  "anthropic-ai",
  "ClaudeBot",
  "Applebot-Extended",
  "Bytespider",
  "Meta-ExternalAgent",
  "meta-externalagent",
  "FacebookBot",
  "cohere-ai",
  "Diffbot",
  "Omgilibot",
  "PanguBot",
  "Timpibot",
  "Webzio-Extended",
  "ImagesiftBot",
  "AI2Bot",
];

// 질문에 답할 때 우리 쪽을 찾아 읽고 출처로 다는 로봇. 허용한다.
const AI_SEARCH_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
  "Amazonbot",
  "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_SEARCH_BOTS, allow: "/", disallow: PRIVATE },
      { userAgent: TRAINING_BOTS, disallow: "/" },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
