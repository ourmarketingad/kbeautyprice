// 제목·설명문 길이 검사 — 병원 1,372곳 전부를 넣어 한도를 넘는 것이 없는지 본다.
// 쓰는 법: npx tsx qa/check-meta-fit.ts
import fs from "node:fs";
import { fitTitle, fitDesc, TITLE_SUFFIX } from "../lib/meta";

const providers: { en: string; field: string; area: string }[] =
  JSON.parse(fs.readFileSync("data/registered-providers.json", "utf8")).items;
// lib/clinics.ts 의 FIELD_LABEL 과 같은 값(그 파일은 next 전용 import 가 있어 여기서 못 불러온다).
const FIELD_LABEL: Record<string, string> = {
  skin: "Skin & aesthetics", surgery: "Plastic surgery", dental: "Dental", eye: "Eye",
  women: "Women's health", korean: "Korean medicine", hospital: "Hospital",
  general: "General & specialist",
};
const CHECKED = "2026-11-12";

let overT = 0, overD = 0, maxT = 0, maxD = 0;
const samples: string[] = [];
for (const c of providers) {
  const field = FIELD_LABEL[c.field] ?? c.field;
  const title = fitTitle([c.en, `${field} in ${c.area}`]) + TITLE_SUFFIX;
  const desc = fitDesc(
    `${c.en} (${field}, ${c.area}) is on the official registry of institutions permitted to receive foreign patients. Checked ${CHECKED}.`,
  );
  maxT = Math.max(maxT, title.length);
  maxD = Math.max(maxD, desc.length);
  if (title.length > 60) overT++;
  if (desc.length > 160) overD++;
  if (samples.length < 3) samples.push(`${title.length}자 | ${title}`);
}
console.log(`병원 쪽 ${providers.length}곳`);
console.log(`제목 60자 초과 ${overT}곳 (최대 ${maxT}자) · 설명문 160자 초과 ${overD}곳 (최대 ${maxD}자)`);
samples.forEach((s) => console.log("  " + s));
