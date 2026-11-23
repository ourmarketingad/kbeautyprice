// 사이트가 자기 주소라고 말하는 값. canonical·hreflang·robots·sitemap·llms.txt 가 모두 이걸 쓴다.
//
// [사실 2026-11-23 확인] kbeautyprice.com 은 아워마케팅이 산 도메인이 아니다.
// 2025-08-15 에 등록된 남의 도메인이고(네임서버가 Cloudflare, 만료 2027-08-15), 우리 Vercel 팀에는
// 「외부 도메인」으로 얹혀 있을 뿐이다. 그런데 환경변수 NEXT_PUBLIC_SITE_URL 에 그 주소가 들어가 있어서
// 모든 쪽이 검색엔진에 「내 주소는 kbeautyprice.com」이라고 말하고 있었다. 색인이 잡히지 않았다.
//
// [결정 2026-11-23 대표 「koreabeautyprice.com 이거사」] 그래서 우리 도메인을 샀다.
// Vercel 등록, $12.03/1년, 만료 2027-11-23, 네임서버 ns1·ns2.vercel-dns.com, 자동갱신 끔.
//
// 환경변수는 읽지 않는다. 코드가 환경변수보다 뒤에 적용되므로 이 쪽이 확실하고,
// 주소가 또 바뀌면 이 한 줄만 고치면 된다.
export const SITE = "https://koreabeautyprice.com";
