// AI 검색 로봇이 우리 쪽을 읽는지 세기 위한 판별기.
//
// 왜 세나: 「AI가 우리를 인용한다」를 재려면 먼저 「AI 로봇이 우리 쪽에 오기는 하나」를
// 알아야 한다. 이 숫자는 인용 횟수가 아니다. 방문 횟수다. 둘을 섞어 말하지 않는다.
// 근거 문서: OUR-Marketing-KB/80_work/ourmarketing/web/2026-11-23-세이프닥-분석-입점모델/
//
// 목록 원본은 app/robots.ts 와 같아야 한다. 거기서 허용·차단을 정하고, 여기서 센다.

import { LOCALES } from "@/data/i18n";

export type BotGroup = "ai_search" | "ai_training" | "search" | "other";

type Rule = { needle: string; name: string; group: BotGroup };

// 위에서부터 먼저 맞는 것을 쓴다. 더 좁은 이름을 반드시 위에 둔다
// (예: Applebot-Extended 가 Applebot 보다, Google-Extended 가 Googlebot 보다 위).
const RULES: Rule[] = [
  // 질문에 답하며 출처로 달아 주는 로봇 — 우리가 보고 싶은 쪽
  { needle: "oai-searchbot", name: "OAI-SearchBot", group: "ai_search" },
  { needle: "chatgpt-user", name: "ChatGPT-User", group: "ai_search" },
  { needle: "perplexitybot", name: "PerplexityBot", group: "ai_search" },
  { needle: "perplexity-user", name: "Perplexity-User", group: "ai_search" },
  { needle: "claude-searchbot", name: "Claude-SearchBot", group: "ai_search" },
  { needle: "claude-user", name: "Claude-User", group: "ai_search" },
  { needle: "duckassistbot", name: "DuckAssistBot", group: "ai_search" },
  { needle: "mistralai-user", name: "MistralAI-User", group: "ai_search" },
  { needle: "youbot", name: "YouBot", group: "ai_search" },
  { needle: "meta-externalfetcher", name: "Meta-ExternalFetcher", group: "ai_search" },
  { needle: "amazonbot", name: "Amazonbot", group: "ai_search" },

  // 학습용 수집 로봇 — robots.txt 로 막아 둔 쪽. 막혔는데도 오는지 보려고 센다.
  { needle: "gptbot", name: "GPTBot", group: "ai_training" },
  { needle: "google-extended", name: "Google-Extended", group: "ai_training" },
  { needle: "google-cloudvertexbot", name: "Google-CloudVertexBot", group: "ai_training" },
  { needle: "applebot-extended", name: "Applebot-Extended", group: "ai_training" },
  { needle: "anthropic-ai", name: "anthropic-ai", group: "ai_training" },
  { needle: "claudebot", name: "ClaudeBot", group: "ai_training" },
  { needle: "ccbot", name: "CCBot", group: "ai_training" },
  { needle: "bytespider", name: "Bytespider", group: "ai_training" },
  { needle: "meta-externalagent", name: "Meta-ExternalAgent", group: "ai_training" },
  { needle: "facebookbot", name: "FacebookBot", group: "ai_training" },
  { needle: "cohere-ai", name: "cohere-ai", group: "ai_training" },
  { needle: "diffbot", name: "Diffbot", group: "ai_training" },
  { needle: "omgilibot", name: "Omgilibot", group: "ai_training" },
  { needle: "pangubot", name: "PanguBot", group: "ai_training" },
  { needle: "timpibot", name: "Timpibot", group: "ai_training" },
  { needle: "webzio-extended", name: "Webzio-Extended", group: "ai_training" },
  { needle: "imagesiftbot", name: "ImagesiftBot", group: "ai_training" },
  { needle: "ai2bot", name: "AI2Bot", group: "ai_training" },

  // 보통 검색 로봇 — 비교 기준선. AI 로봇 수가 많은지 적은지 이것과 견준다.
  { needle: "googlebot", name: "Googlebot", group: "search" },
  { needle: "bingbot", name: "Bingbot", group: "search" },
  { needle: "yeti", name: "Yeti(네이버)", group: "search" },
  { needle: "daum", name: "Daum", group: "search" },
  { needle: "duckduckbot", name: "DuckDuckBot", group: "search" },
  { needle: "applebot", name: "Applebot", group: "search" },
  { needle: "yandexbot", name: "YandexBot", group: "search" },
  { needle: "baiduspider", name: "Baiduspider", group: "search" },
  { needle: "slurp", name: "Slurp(야후)", group: "search" },
  { needle: "petalbot", name: "PetalBot", group: "search" },
];

/** 사용자 에이전트 문자열에서 아는 로봇을 찾는다. 사람이면 null. */
export function detectBot(ua: string | null): { name: string; group: BotGroup } | null {
  if (!ua) return null;
  const s = ua.toLowerCase();
  for (const r of RULES) {
    if (s.includes(r.needle)) return { name: r.name, group: r.group };
  }
  return null;
}

const LOCALE_SET = new Set<string>(LOCALES as readonly string[]);

/**
 * 주소를 「어떤 종류의 쪽인가」로 묶는다.
 * 병원 쪽(hospital)을 로봇이 건너뛰는지 보는 것이 이 작업의 핵심 질문이다.
 */
export function pageKind(pathname: string): { kind: string; lang: string | null } {
  const parts = pathname.split("/").filter(Boolean);
  let lang: string | null = null;
  if (parts.length && LOCALE_SET.has(parts[0])) {
    lang = parts[0];
    parts.shift();
  }
  if (parts.length === 0) return { kind: "home", lang };

  const head = parts[0];
  const deep = parts.length > 1;
  switch (head) {
    case "hospitals":
      return { kind: deep ? "hospital" : "hospital_index", lang };
    case "clinics":
      return { kind: deep ? "clinic" : "clinic_index", lang };
    case "treatments":
      return { kind: deep ? "treatment" : "treatment_index", lang };
    case "in":
      return { kind: parts.length > 2 ? "area_treatment" : deep ? "area" : "area_index", lang };
    case "guides":
      return { kind: deep ? "guide" : "guide_index", lang };
    case "glossary":
      return { kind: deep ? "glossary" : "glossary_index", lang };
    case "robots.txt":
    case "sitemap.xml":
    case "llms.txt":
      return { kind: head, lang };
    default:
      return { kind: head, lang };
  }
}
