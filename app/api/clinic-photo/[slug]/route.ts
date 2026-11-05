// 병원 목록의 구글 공식 사진. 구글 키는 코메디 서버에만 있고, 이 사이트는 코메디의 연동을 거친다.
// 사진 주소는 잠깐만 유효하며 약관상 저장하지 않으므로 캐시하지 않는다.
// 얼굴·배너·전후·가격표가 없는 것으로 확인한 병원(photo: true)만 부른다.
import providers from "@/data/registered-providers.json";

const OK = new Set(
  (providers.items as { slug: string; photo?: boolean }[])
    .filter((p) => p.photo)
    .map((p) => p.slug),
);
const none = () =>
  new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!OK.has(slug)) return none();
  try {
    const r = await fetch(
      `https://koreabeautyconsultant.com/api/place-photo/${encodeURIComponent(slug)}`,
      { cache: "no-store", signal: AbortSignal.timeout(8000) },
    );
    if (r.status !== 200) return none();
    const j = (await r.json()) as {
      uri?: string;
      authors?: { name: string; uri?: string }[];
    };
    if (!j.uri?.startsWith("https://")) return none();
    return Response.json(
      { uri: j.uri, authors: j.authors ?? [] },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return none();
  }
}
