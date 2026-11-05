"use client";
// 모션 카드(35_capabilities/web-motion): HB-20 숫자 띠 · WL-20 어절 제목 · RL-13 선 긋기
// 움직임 줄이기 설정이면 전부 끝 상태로 보인다. 글자는 화면낭독기와 검색 로봇에 그대로 읽힌다.
import { useEffect, useRef, useState } from "react";

const reduced = () =>
  typeof window === "undefined" ||
  matchMedia("(prefers-reduced-motion: reduce)").matches;

function useSeen<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

/** HB-20 변형: 평소엔 실제 금액을 그대로 보여 준다(틀린 숫자가 멈춰 보이지 않게).
 *  화면에 들어왔을 때 0.8초만 자리마다 돌고 다시 일반 글자로 돌아간다. */
export function Odometer({ value }: { value: string }) {
  const [ref, seen] = useSeen<HTMLSpanElement>();
  const [phase, setPhase] = useState<"plain" | "armed" | "run">("plain");
  useEffect(() => {
    if (!seen || reduced()) return;
    setPhase("armed");
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setPhase("run")),
    );
    const done = setTimeout(() => setPhase("plain"), 1500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(done);
    };
  }, [seen]);
  return (
    <span ref={ref} className="odo">
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">
        {phase === "plain"
          ? value
          : value.split("").map((c, i) =>
              /\d/.test(c) ? (
                <span key={i} className="odo-d">
                  <span className="odo-size">{c}</span>
                  <span
                    className="odo-col"
                    style={{
                      transform:
                        phase === "run"
                          ? `translate3d(0, -${Number(c) + 10}em, 0)`
                          : "translate3d(0, 0, 0)",
                      transitionDelay: `${i * 30}ms`,
                    }}
                  >
                    {Array.from({ length: 20 }, (_, n) => (
                      <span key={n}>{n % 10}</span>
                    ))}
                  </span>
                </span>
              ) : (
                <span key={i}>{c}</span>
              ),
            )}
      </span>
    </span>
  );
}

/** WL-20: 어절 단위로 0.03초 간격, 0.28em 떠오름 */
export function WordTitle({ text }: { text: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (reduced()) return;
    setOn(true);
  }, []);
  return (
    <h1 className={on ? "word-title on" : "word-title"} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{ animationDelay: `${i * 30}ms` }}
        >
          {w}{" "}
        </span>
      ))}
    </h1>
  );
}

/** RL-13: 구역 나누는 가는 선이 왼쪽에서 오른쪽으로 그어진다 */
export function DrawLine() {
  const [ref, seen] = useSeen<HTMLDivElement>(0);
  return (
    <div
      ref={ref}
      className={seen ? "draw-line seen" : "draw-line"}
      aria-hidden="true"
    />
  );
}
