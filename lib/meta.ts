// 검색 결과에 보이는 제목·설명문 길이를 맞춘다. 2026-11-24
//
// 왜: 2026-11-24 전수 측정에서 2,042쪽 중 제목 60자 초과 589쪽, 설명문 160자 초과
// 1,549쪽(76%)이 나왔다. 구글은 제목을 약 60자, 설명문을 약 155~160자에서 자르기 때문에
// 그 뒤에 쓴 말은 검색 결과에서 사라진다. 병원 이름 길이가 제각각이라 템플릿만 줄여서는
// 안 되고, 조립한 뒤에 길이를 보고 뒤 토막을 떼는 방식이 필요하다.
//
// 자르지 않고 「떼어 낸다」: 말이 중간에서 끊기면 안 되므로 제목은 토막 단위로,
// 설명문은 문장 → 단어 경계로 줄인다.

/** app/layout.tsx 의 title.template 이 붙이는 꼬리. 길이 계산에 포함해야 한다. */
export const TITLE_SUFFIX = " | KBeautyPrice";
export const TITLE_MAX = 60;
export const DESC_MAX = 155;

/**
 * 제목 토막들을 " — " 로 잇는다. 꼬리까지 더해 TITLE_MAX 를 넘으면 뒤 토막을 하나씩 뗀다.
 * 첫 토막(보통 병원·시술 이름)만 남아도 넘칠 때는 그 토막을 단어 경계에서 줄인다.
 */
export function fitTitle(parts: (string | false | null | undefined)[], max = TITLE_MAX): string {
  const kept = parts.filter((p): p is string => Boolean(p && p.trim())).map((p) => p.trim());
  for (let n = kept.length; n > 1; n--) {
    const t = kept.slice(0, n).join(" — ");
    if (t.length + TITLE_SUFFIX.length <= max) return t;
  }
  const first = kept[0] ?? "";
  const room = max - TITLE_SUFFIX.length;
  return first.length <= room ? first : cutAtWord(first, room);
}

/** 설명문을 DESC_MAX 안으로. 문장 끝이 들어가면 거기서, 아니면 단어 경계에서 끊는다. */
export function fitDesc(s: string, max = DESC_MAX): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const head = t.slice(0, max + 1);
  const lastStop = Math.max(head.lastIndexOf(". "), head.lastIndexOf("? "), head.lastIndexOf("! "));
  if (lastStop >= max * 0.55) return t.slice(0, lastStop + 1);
  return cutAtWord(t, max);
}

function cutAtWord(s: string, max: number): string {
  if (s.length <= max) return s;
  const head = s.slice(0, max - 1);
  const sp = head.lastIndexOf(" ");
  // 한국어·중국어처럼 공백이 거의 없는 글은 그냥 자르고 말줄임표를 붙인다.
  return (sp > max * 0.5 ? head.slice(0, sp) : head).replace(/[\s,·—-]+$/, "") + "…";
}
