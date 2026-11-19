// 언어별 문구. 영어 쪽(/treatments/...)은 그대로 두고, 이 사전은 다국어 쪽에서만 쓴다.
// 시술·분류 이름은 data/treatments.ts, data/categories.ts 에 이미 들어 있는 값을 쓴다.
// 숫자·날짜·병원 수는 번역하지 않고 자료에서 그대로 넣는다.

export const LOCALES = ["ja", "zh-Hant", "ko"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_META: Record<
  Locale,
  { label: string; htmlLang: string; nameKey: "ja" | "zh-TW" | "ko" }
> = {
  ja: { label: "日本語", htmlLang: "ja", nameKey: "ja" },
  "zh-Hant": { label: "繁體中文", htmlLang: "zh-Hant", nameKey: "zh-TW" },
  ko: { label: "한국어", htmlLang: "ko", nameKey: "ko" },
};

export type Dict = {
  siteName: string;
  priceInSeoul: (name: string) => string;
  metaWithRange: (name: string) => string;
  metaNoRange: (name: string) => string;
  prices: string;
  publishedRanges: string;
  listedPrice: string;
  eventPrice: string;
  vatIncluded: string;
  vatExcluded: string;
  vatMixed: string;
  vatUnknown: string;
  clinicsCount: string;
  checkedOn: string;
  aboutUsd: string;
  noRangeTitle: string;
  noRangeBody: (min: number) => string;
  howCollected: string;
  notNamed: (krwPerUsd: string, date: string) => string;
  faqTitle: string;
  faqCost: (name: string) => string;
  faqCostA: (
    clinics: number,
    spec: string,
    won: string,
    usd: string,
    date: string,
  ) => string;
  faqCostNoneA: (min: number) => string;
  faqVat: string;
  faqVatA: Record<"included" | "excluded" | "mixed" | "unknown", string>;
  faqEvent: string;
  faqEventA: (clinics: number, won: string) => string;
  faqWhyDiffer: string;
  faqWhyDifferA: string;
  related: string;
  seeEnglish: string;
  otherLanguages: string;
  disclaimer: string;
  allTreatments: string;
  allTreatmentsLead: (count: number, withPrice: number, date: string) => string;
  glossaryNote: string;
};

export const DICTS: Record<Locale, Dict> = {
  ja: {
    siteName: "KBeautyPrice",
    priceInSeoul: (n) => `${n} の韓国での料金`,
    metaWithRange: (n) =>
      `${n} の料金レンジ。ソウルのクリニックが自社サイトで公開している価格から、件数と確認日つきでまとめています。`,
    metaNoRange: (n) =>
      `${n} は、同じ条件で価格を公開しているクリニックがまだ少ないため、レンジを出していません。見積書のもらい方を説明します。`,
    prices: "料金",
    publishedRanges: "公開価格のレンジ",
    listedPrice: "通常価格",
    eventPrice: "イベント価格",
    vatIncluded: "付加価値税（VAT）込み",
    vatExcluded: "付加価値税（VAT）別",
    vatUnknown: "VAT の記載なし",
    vatMixed: "クリニックにより VAT 込み・別が混在",
    clinicsCount: "クリニック数",
    checkedOn: "確認日",
    aboutUsd: "米ドル概算",
    noRangeTitle: "まだレンジを出していません",
    noRangeBody: (m) =>
      `同じ条件で価格を公開しているクリニックが ${m} 院に届かないため、推測で数字を出さずレンジなしとしています。`,
    howCollected: "価格の集め方",
    notNamed: (rate, date) =>
      `クリニック名は出さず、順位もつけません。米ドルは 1 ドル ${rate} ウォン（${date} 時点）での概算で、支払いはウォンです。`,
    faqTitle: "よくある質問",
    faqCost: (n) => `${n} は韓国でいくらぐらいですか。`,
    faqCostA: (c, spec, won, usd, date) =>
      `ソウルのクリニック ${c} 院が ${spec} を自社サイトで ${won}（約 ${usd}）と公開しています。確認日は ${date} です。実際の金額はクリニック・製品・施術計画によって変わります。`,
    faqCostNoneA: (m) =>
      `同じ条件で公開しているクリニックが ${m} 院に届かないため、数字を出していません。確かな金額はクリニックの書面見積りです。`,
    faqVat: "この価格に VAT は含まれていますか。",
    faqVatA: {
      included: "数えたクリニックは VAT 込みで表示しています。",
      excluded:
        "数えたクリニックは VAT 前の金額を表示しているため、支払額はこれより高くなります。",
      mixed:
        "クリニックによって異なります。VAT 込みのところと別のところが混在しています。",
      unknown: "VAT の扱いを書いていないクリニックがほとんどです。",
    },
    faqEvent: "イベント価格とは何ですか。",
    faqEventA: (c, won) =>
      `${c} 院が期間や条件つきのイベント価格 ${won} も出しています。条件で変わるため、通常価格とは分けて表示しています。`,
    faqWhyDiffer: "クリニックによって価格がこれほど違うのはなぜですか。",
    faqWhyDifferA:
      "機器や製品のバージョン、ショット数や量、どこまで含むか、VAT を含むかがクリニックごとに違います。書面見積りを項目ごとに比べてください。",
    related: "同じ分類の施術",
    seeEnglish: "English version",
    otherLanguages: "他の言語",
    disclaimer:
      "参考情報であり、見積り・医療上の助言ではありません。当サイトは診断も施術の推奨も行いません。",
    allTreatments: "施術別の料金",
    allTreatmentsLead: (c, w, d) =>
      `${c} 施術のうち ${w} 施術に公開価格のレンジがあります。クリニックが自社サイトで公開している価格を ${d} に確認しました。`,
    glossaryNote: "見積書の用語集（英語）",
  },
  "zh-Hant": {
    siteName: "KBeautyPrice",
    priceInSeoul: (n) => `${n} 在韓國的費用`,
    metaWithRange: (n) =>
      `${n} 的價格區間，取自首爾診所在自家網站公開的價格，標示診所家數與查核日期。`,
    metaNoRange: (n) =>
      `${n} 目前公開同一條件價格的診所還不夠多，因此不列出區間。說明如何取得書面報價。`,
    prices: "價格",
    publishedRanges: "公開價格區間",
    listedPrice: "原價",
    eventPrice: "活動價",
    vatIncluded: "含加值稅（VAT）",
    vatExcluded: "未含加值稅（VAT）",
    vatUnknown: "未標示是否含稅",
    vatMixed: "各診所不一，含稅與未稅皆有",
    clinicsCount: "診所家數",
    checkedOn: "查核日期",
    aboutUsd: "美元約略",
    noRangeTitle: "尚未列出區間",
    noRangeBody: (m) =>
      `公開同一條件價格的診所不足 ${m} 家，我們不以推測填數字，因此不列區間。`,
    howCollected: "價格如何蒐集",
    notNamed: (rate, date) =>
      `不列出診所名稱，也不排名。美元為 1 美元兌 ${rate} 韓元（${date} 時點）的約略換算，實際以韓元收費。`,
    faqTitle: "常見問題",
    faqCost: (n) => `${n} 在韓國大約多少錢？`,
    faqCostA: (c, spec, won, usd, date) =>
      `首爾 ${c} 家診所在自家網站公開 ${spec} 為 ${won}（約 ${usd}）。查核日期為 ${date}。實際金額視診所、產品與療程安排而定。`,
    faqCostNoneA: (m) =>
      `公開同一條件價格的診所不足 ${m} 家，因此不列數字。可靠的金額是診所的書面報價。`,
    faqVat: "這些價格含加值稅嗎？",
    faqVatA: {
      included: "我們計入的診所標示為含加值稅。",
      excluded: "我們計入的診所標示為未含加值稅，實付金額會更高。",
      mixed: "各診所不同，有些含稅有些未含。",
      unknown: "多數診所未說明是否含稅。",
    },
    faqEvent: "活動價是什麼？",
    faqEventA: (c, won) =>
      `另有 ${c} 家診所公開限期或限條件的活動價 ${won}。因條件而異，故與原價分開列示。`,
    faqWhyDiffer: "為什麼各診所價差這麼大？",
    faqWhyDifferA:
      "機器與產品版本、發數或劑量、包含到哪些項目、是否含稅，各家都不同。請逐項比較書面報價。",
    related: "同分類的療程",
    seeEnglish: "English version",
    otherLanguages: "其他語言",
    disclaimer:
      "本頁為參考資訊，不是報價，也不是醫療建議。本站不進行診斷，也不推薦特定療程。",
    allTreatments: "各療程價格",
    allTreatmentsLead: (c, w, d) =>
      `${c} 項療程中有 ${w} 項列有公開價格區間。取自診所自家網站的公開價格，於 ${d} 查核。`,
    glossaryNote: "報價用語說明（英文）",
  },
  ko: {
    siteName: "KBeautyPrice",
    priceInSeoul: (n) => `${n} 한국 가격`,
    metaWithRange: (n) =>
      `${n} 가격 범위. 서울 병원들이 자기 홈페이지에 공개한 가격에서 모았고, 몇 곳인지와 확인일을 함께 적습니다.`,
    metaNoRange: (n) =>
      `${n} 은 같은 조건으로 가격을 공개한 병원이 아직 적어 범위를 내지 않습니다. 견적서 받는 법을 설명합니다.`,
    prices: "가격",
    publishedRanges: "공개된 가격 범위",
    listedPrice: "정가",
    eventPrice: "이벤트가",
    vatIncluded: "부가세 포함",
    vatExcluded: "부가세 별도",
    vatUnknown: "부가세 표기 없음",
    vatMixed: "병원마다 다름(포함·별도 섞임)",
    clinicsCount: "병원 수",
    checkedOn: "확인일",
    aboutUsd: "미국 달러 환산",
    noRangeTitle: "아직 범위를 내지 않았습니다",
    noRangeBody: (m) =>
      `같은 조건으로 가격을 공개한 병원이 ${m}곳에 못 미쳐, 추측으로 숫자를 내지 않고 범위를 비워 둡니다.`,
    howCollected: "가격을 모으는 방법",
    notNamed: (rate, date) =>
      `병원 이름은 적지 않고 순위도 매기지 않습니다. 달러는 1달러 ${rate}원(${date} 기준) 어림이며, 실제 결제는 원화입니다.`,
    faqTitle: "자주 묻는 질문",
    faqCost: (n) => `${n}은 한국에서 얼마인가요?`,
    faqCostA: (c, spec, won, usd, date) =>
      `서울 병원 ${c}곳이 ${spec}을 자기 홈페이지에 ${won}(약 ${usd})으로 공개했습니다. 확인일은 ${date}입니다. 실제 금액은 병원·제품·시술 계획에 따라 달라집니다.`,
    faqCostNoneA: (m) =>
      `같은 조건으로 공개한 병원이 ${m}곳에 못 미쳐 숫자를 내지 않습니다. 확실한 금액은 병원 서면 견적입니다.`,
    faqVat: "이 가격에 부가세가 들어 있나요?",
    faqVatA: {
      included: "저희가 센 병원들은 부가세를 포함해 적었습니다.",
      excluded:
        "저희가 센 병원들은 부가세 전 금액을 적었습니다. 실제 결제액은 더 높습니다.",
      mixed: "병원마다 다릅니다. 포함한 곳과 별도인 곳이 섞여 있습니다.",
      unknown: "대부분 부가세 포함 여부를 적지 않았습니다.",
    },
    faqEvent: "이벤트가는 무엇인가요?",
    faqEventA: (c, won) =>
      `${c}곳이 기간이나 조건이 붙은 이벤트가 ${won}도 함께 공개했습니다. 조건에 따라 달라져 정가와 따로 보여 드립니다.`,
    faqWhyDiffer: "병원마다 가격이 왜 이렇게 다른가요?",
    faqWhyDifferA:
      "장비와 제품 버전, 샷 수나 용량, 어디까지 포함하는지, 부가세를 넣었는지가 병원마다 다릅니다. 서면 견적을 항목별로 비교하세요.",
    related: "같은 분류의 시술",
    seeEnglish: "English version",
    otherLanguages: "다른 언어",
    disclaimer:
      "참고 정보이며 견적이나 의료 조언이 아닙니다. 진단하거나 시술을 권하지 않습니다.",
    allTreatments: "시술별 가격",
    allTreatmentsLead: (c, w, d) =>
      `시술 ${c}개 가운데 ${w}개에 공개 가격 범위가 있습니다. 병원이 자기 홈페이지에 공개한 가격을 ${d}에 확인했습니다.`,
    glossaryNote: "견적 용어 설명(영어)",
  },
};

export const isLocale = (s: string): s is Locale =>
  (LOCALES as readonly string[]).includes(s);
