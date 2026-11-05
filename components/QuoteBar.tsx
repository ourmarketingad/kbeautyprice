// 휴대폰 하단 고정 상담 버튼. 탭 막대 대신 나타난다. PC에서는 숨긴다.
export const WHATSAPP = "https://wa.me/821076851434";
export const LINE_JA = "https://line.me/R/ti/p/@474nuxym";
export const LINE_TW = "https://line.me/R/ti/p/@218ndlak";

export default function QuoteBar({ treatment }: { treatment?: string }) {
  const text = encodeURIComponent(
    treatment
      ? `Hello, I would like a written quote for ${treatment}.`
      : "Hello, I would like a written quote.",
  );
  return (
    <div className="quote-bar" role="region" aria-label="Ask for a written quote">
      <p>Written quote via COMEDI, same operator</p>
      <div>
        <a className="btn" href={`${WHATSAPP}?text=${text}`}>
          WhatsApp
        </a>
        <a className="btn-line" href={LINE_JA} lang="ja">
          LINE 日本語
        </a>
        <a className="btn-line" href={LINE_TW} lang="zh-Hant">
          LINE 繁中
        </a>
      </div>
    </div>
  );
}
