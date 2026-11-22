// 사이트가 자기 주소라고 말하는 값. canonical·hreflang·robots·sitemap·llms.txt 가 모두 이걸 쓴다.
//
// [사실 2026-11-23 확인] kbeautyprice.com 은 아워마케팅이 산 도메인이 아니다.
// 2025-08-15 에 Cloudflare 에서 등록된 남의 도메인이고, DNS 기록이 없어 아무것도 응답하지 않는다.
// 그런데 Vercel 환경변수 NEXT_PUBLIC_SITE_URL 에 그 주소가 들어가 있어서(19일 전 누군가 넣음)
// 모든 쪽이 검색엔진에 「내 주소는 kbeautyprice.com」이라고 말하고 있었다. 색인이 잡히지 않는다.
//
// 그래서 환경변수를 읽지 않고 실제로 열리는 주소를 코드에 적는다. 환경변수 삭제는 사람 승인이 필요해
// 거절됐고, 코드가 환경변수보다 뒤에 적용되므로 이 쪽이 확실하다.
// 도메인을 새로 사면 이 한 줄만 바꾸면 된다.
export const SITE = "https://kbeautyprice.vercel.app";
