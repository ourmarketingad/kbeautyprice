"use client";
// 병원 카드. 호출은 유료라 카드가 화면에 들어올 때만 사진을 부른다. 구글 출처·작성자 표기 필수.
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icons";

type Photo = { uri: string; authors: { name: string; uri?: string }[] };

export default function ClinicCard({
  slug,
  en,
  ko,
  meta,
  hasPhoto,
}: {
  slug: string;
  en: string;
  ko: string;
  meta: string;
  hasPhoto: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [broken, setBroken] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !hasPhoto) return;
    let live = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        fetch(`/api/clinic-photo/${encodeURIComponent(slug)}`)
          .then((r) => (r.status === 200 ? r.json() : null))
          .then((j) => live && j?.uri && setPhoto(j))
          .catch(() => {});
      },
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => {
      live = false;
      io.disconnect();
    };
  }, [slug, hasPhoto]);
  const show = photo && !broken;
  return (
    <li ref={ref} className="clinic-card">
      <div className="clinic-photo">
        {show ? (
          <img
            src={photo.uri}
            alt={`${en}, photo from Google`}
            referrerPolicy="no-referrer"
            onError={() => setBroken(true)}
          />
        ) : (
          <span aria-hidden="true">
            <Icon name="clinic" size={26} />
          </span>
        )}
      </div>
      <div className="clinic-body">
        <strong>{en}</strong>
        {en !== ko && <span lang="ko">{ko}</span>}
        <span>{meta}</span>
        {show && (
          <small>
            Photo:{" "}
            {photo.authors.map((a, i) => (
              <span key={i}>
                {i > 0 && ", "}
                {a.uri ? (
                  <a href={a.uri} target="_blank" rel="noopener noreferrer">
                    {a.name}
                  </a>
                ) : (
                  a.name
                )}
              </span>
            ))}{" "}
            · Google
          </small>
        )}
      </div>
    </li>
  );
}
