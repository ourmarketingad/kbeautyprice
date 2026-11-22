// 지역 쪽 본문 문구(언어별). 영어 쪽과 같은 뜻으로 쓰고, 지역 가격을 지어내는 말은 어느 언어에도 없다.
// 숫자는 전부 자료에서 넣는다. 이 파일에는 숫자가 없다.
import type { Locale } from "@/data/i18n";

export type AreaDict = {
  registryCrumb: string;
  areaTitle: (area: string) => string;
  areaMeta: (area: string, n: string, checked: string) => string;
  areaLead: (area: string, district: string, n: string, checked: string) => string;
  canTellTitle: string;
  canTell1: (area: string) => string;
  canTell2: (area: string) => string;
  canTell3: string;
  registryTitle: (area: string) => string;
  rowRegistered: string;
  rowDistrict: string;
  rowTransit: string;
  rowChecked: string;
  byFieldTitle: string;
  registeredCount: (n: string) => string;
  priceTitle: (area: string) => string;
  priceLead: (collected: string, area: string) => string;
  inArea: (treatment: string, area: string) => string;
  eventOnly: string;
  clinicsPublished: (n: number) => string;
  howCollectedLink: string;
  allTreatmentsLink: string;
  clinicsHereTitle: (area: string) => string;
  clinicsHereLead: (n: string, area: string) => string;
  seeAllClinics: (n: string, area: string) => string;
  otherAreasTitle: string;
  /** 시술 목록 쪽에서 지역 쪽으로 보낼 때의 안내 한 줄. */
  areaIndexLead: string;

  atTitle: (treatment: string, area: string) => string;
  atMetaWith: (
    n: string,
    area: string,
    clinics: number,
    spec: string,
    won: string,
    collected: string,
  ) => string;
  atMetaNo: (n: string, area: string) => string;
  atLead: (
    district: string,
    n: string,
    area: string,
    fields: string,
    checked: string,
  ) => string;
  readFirstTitle: string;
  readFirstBody: (area: string, treatment: string) => string;
  rangeTitle: string;
  fullPricePage: (treatment: string) => string;
  whatAreaHasTitle: (area: string) => string;
  rowFieldClinics: string;
  rowFieldClinicsVal: (n: string, fields: string) => string;
  rowAllClinics: string;
  whereToLookTitle: (area: string) => string;
  whereToLookBody: (
    n: string,
    fields: string,
    area: string,
    treatment: string,
  ) => string;
  seeFieldClinics: (n: string, fields: string, area: string) => string;
  everythingIn: (area: string) => string;
  checkTitle: (area: string) => string;
  glossaryEnNote: string;
  questionsTitle: string;
  faqCostQ: (treatment: string, area: string) => string;
  faqCostAWith: (
    area: string,
    clinics: number,
    spec: string,
    won: string,
    usd: string,
    date: string,
  ) => string;
  faqCostANo: (min: number) => string;
  faqElsewhereQ: (treatment: string) => string;
  faqElsewhereA: string;
  faqHowManyQ: (area: string) => string;
  faqHowManyA: (
    inField: string,
    all: string,
    area: string,
    fields: string,
    treatment: string,
  ) => string;
  inOtherAreasTitle: (treatment: string) => string;
  otherTreatmentsTitle: (area: string) => string;
};

export const AREA_DICTS: Record<Locale, AreaDict> = {
  ja: {
    registryCrumb: "登録クリニック",
    areaTitle: (a) => `${a}のクリニックと料金`,
    areaMeta: (a, n, checked) =>
      `${a}では ${n} 院が、外国人患者の受け入れを認められた公式登録簿に載っています（${checked} 確認）。当サイトの公開価格レンジは全国まとめで、地域別ではありません。`,
    areaLead: (a, district, n, checked) =>
      `${district}。${a}の ${n} 院が、外国人患者の受け入れを認められた公式登録簿（Medical Korea）に載っています。確認日は ${checked}。`,
    canTellTitle: "このページで分かること・分からないこと",
    canTell1: (a) =>
      `${a}のクリニック数は公的な登録簿の数字です。登録されている機関の数で、良いクリニックの数ではありません。`,
    canTell2: (a) =>
      `当サイトの価格レンジは、クリニックが自社サイトで公開している価格です。地域別に分けられていないため、「${a}の価格」はここにはなく、推測で作ることもしません。`,
    canTell3:
      "ランキング・口コミ・評点・ビフォーアフター写真は、このページにも他のどのページにもありません。",
    registryTitle: (a) => `登録簿から見た${a}`,
    rowRegistered: "登録クリニック数",
    rowDistrict: "行政区",
    rowTransit: "行き方",
    rowChecked: "登録簿の確認日",
    byFieldTitle: "診療分野別",
    registeredCount: (n) => `${n} 院が登録`,
    priceTitle: (a) => `施術別の料金と、${a}のクリニック数`,
    priceLead: (collected, a) =>
      `レンジはソウル全域のクリニックのサイトから ${collected} に集めたものです。下の各ページには、${a}でその分野に登録しているクリニック数も載せています。`,
    inArea: (t, a) => `${a}の${t}`,
    eventOnly: "イベント価格のみ — ページをご覧ください",
    clinicsPublished: (n) => `${n} 院が公開`,
    howCollectedLink: "価格の集め方",
    allTreatmentsLink: "施術の一覧",
    clinicsHereTitle: (a) => `${a}の登録クリニック`,
    clinicsHereLead: (n, a) =>
      `クリニック名は価格の横ではなく登録簿のページに置いています。${a}の ${n} 院すべてを名前順に並べ、順位づけも推薦もしていません。`,
    seeAllClinics: (n, a) => `${a}の登録クリニック ${n} 院をすべて見る`,
    otherAreasTitle: "他の地域",
    areaIndexLead:
      "地域ごとのページもあります。価格は地域別にはありませんが、その地域の登録クリニック数と、ソウル全域の公開レンジを載せています。",

    atTitle: (t, a) => `${a}の${t} — クリニックと公開価格`,
    atMetaWith: (n, a, clinics, spec, w, collected) =>
      `${a}ではこの分野に ${n} 院が登録しています。ソウル全域では ${clinics} 院が ${spec} を ${w} で公開（${collected} 確認）。価格は地域別には公開されていません。`,
    atMetaNo: (n, a) =>
      `${a}ではこの分野に ${n} 院が登録しています。予約前に確認すること、そしてソウル全域の公開価格レンジ。`,
    atLead: (district, n, a, fields, checked) =>
      `${district}。${a}では ${n} 院が${fields}として登録しています。確認日は ${checked}。`,
    readFirstTitle: "はじめにお読みください",
    readFirstBody: (a, t) =>
      `韓国のクリニックは価格を地域別に公開しておらず、当サイトも地域別には集めていません。そのため、${t} の「${a}の価格」はこのサイトにありません。以下はソウル全域の公開レンジと、${a}が登録簿上で実際に持っているものです。数字を作るより、ないと言う方を選びます。`,
    rangeTitle: "ソウル全域の公開レンジ",
    fullPricePage: (t) => `${t} の料金ページ`,
    whatAreaHasTitle: (a) => `${a}にあるもの`,
    rowFieldClinics: "この分野のクリニック",
    rowFieldClinicsVal: (n, fields) => `${fields}として ${n} 院が登録`,
    rowAllClinics: "この地域の登録クリニック総数",
    whereToLookTitle: (a) => `${a}でどこを見るか`,
    whereToLookBody: (n, fields, a, t) =>
      `当サイトはクリニック名を価格の横に置きません。そのため上の数字とクリニックの一覧は分けています。${a}の${fields}の登録クリニック ${n} 院は登録簿に名前順で並んでおり、順位づけも推薦もありません。登録簿にはどの施術を行うかが書かれていないため、${t} を扱うかは訪問前に問い合わせてください。`,
    seeFieldClinics: (n, fields, a) =>
      `${a}の${fields}登録クリニック ${n} 院を見る`,
    everythingIn: (a) => `${a}のまとめページ`,
    checkTitle: (a) => `${a}で予約する前に確認すること`,
    glossaryEnNote: "用語の説明ページは英語です。",
    questionsTitle: "よくある質問",
    faqCostQ: (t, a) => `${a}で ${t} はいくらですか。`,
    faqCostAWith: (a, clinics, spec, w, u, date) =>
      `地域別の価格は持っていないため、${a}の金額というものはありません。ソウル全域では ${clinics} 院が ${spec} を ${w}（約 ${u}）で公開しています。確認日は ${date}。${a}のクリニックがこのレンジの内か外かは分かりません。`,
    faqCostANo: (min) =>
      `地域別の価格は持っていません。同じ条件で ${min} 院以上が公開している場合にだけレンジを出しますが、この施術はイベント価格のみです。書面見積りをもらってください。`,
    faqElsewhereQ: (t) => `${t} はソウルの他の地域の方が安いですか。`,
    faqElsewhereA:
      "分かりません。集めている価格に地域のタグはなく、公開しているクリニックもソウル全域に散らばっています。数字を見せずに「この地域が安い」と言う人は、推測で言っています。",
    faqHowManyQ: (a) => `${a}では何院がこれを行っていますか。`,
    faqHowManyA: (inField, all, a, fields, t) =>
      `${a}の登録クリニック ${all} 院のうち ${inField} 院が、この施術が属する${fields}として登録しています。登録簿には各クリニックがどの施術を行うかが書かれていないため、これは分野の数で、${t} を実施するクリニックの数ではありません。`,
    inOtherAreasTitle: (t) => `他の地域の${t}`,
    otherTreatmentsTitle: (a) => `${a}の他の施術`,
  },

  "zh-Hant": {
    registryCrumb: "登錄診所",
    areaTitle: (a) => `${a}的診所與價格`,
    areaMeta: (a, n, checked) =>
      `${a}有 ${n} 家診所列於可接待外國患者的官方登錄名單（${checked} 查核）。本站的公開價格區間為全國彙整，並非按地區區分。`,
    areaLead: (a, district, n, checked) =>
      `${district}。${a}有 ${n} 家診所列於可接待外國患者的官方登錄名單（Medical Korea）。查核日期為 ${checked}。`,
    canTellTitle: "這一頁能告訴您什麼、不能告訴您什麼",
    canTell1: (a) =>
      `${a}的診所家數取自公開登錄名單。那是登錄機構的數量，不是好診所的數量。`,
    canTell2: (a) =>
      `本站的價格區間取自診所在自家網站公開的價格，並未按地區拆分，因此這裡沒有「${a}的價格」，我們也不會憑推測造一個。`,
    canTell3: "本頁與全站都沒有排名、評論、評分或前後對比照片。",
    registryTitle: (a) => `登錄名單裡的${a}`,
    rowRegistered: "登錄診所家數",
    rowDistrict: "行政區",
    rowTransit: "怎麼去",
    rowChecked: "名單查核日期",
    byFieldTitle: "依診療分類",
    registeredCount: (n) => `${n} 家登錄`,
    priceTitle: (a) => `各療程價格，附${a}診所家數`,
    priceLead: (collected, a) =>
      `區間於 ${collected} 自首爾各診所網站蒐集。下列各頁也會寫出${a}在該分類登錄的診所家數。`,
    inArea: (t, a) => `${a}的${t}`,
    eventOnly: "僅有活動價 — 請見該頁",
    clinicsPublished: (n) => `${n} 家公開`,
    howCollectedLink: "價格如何蒐集",
    allTreatmentsLink: "所有療程",
    clinicsHereTitle: (a) => `${a}的登錄診所`,
    clinicsHereLead: (n, a) =>
      `診所名稱放在登錄名單頁，不放在價格旁邊。${a}的 ${n} 家全部依名稱排列，不排名、不推薦。`,
    seeAllClinics: (n, a) => `查看${a}全部 ${n} 家登錄診所`,
    otherAreasTitle: "其他地區",
    areaIndexLead:
      "也有各地區的頁面。價格沒有按地區區分，但每一頁都寫出該地區的登錄診所家數，以及首爾全域的公開價格區間。",

    atTitle: (t, a) => `${a}的${t} — 診所與公開價格`,
    atMetaWith: (n, a, clinics, spec, w, collected) =>
      `${a}有 ${n} 家登錄診所屬於這個分類。在首爾全域，${clinics} 家診所公開 ${spec} 為 ${w}（${collected} 查核）。價格並未按地區公開。`,
    atMetaNo: (n, a) =>
      `${a}有 ${n} 家登錄診所屬於這個分類。預約前要確認什麼，以及首爾全域的公開價格區間。`,
    atLead: (district, n, a, fields, checked) =>
      `${district}。${a}有 ${n} 家診所登錄為${fields}。查核日期為 ${checked}。`,
    readFirstTitle: "請先看這裡",
    readFirstBody: (a, t) =>
      `韓國診所不按地區公開價格，我們也不按地區蒐集，因此本站沒有 ${t} 的「${a}價格」。以下是首爾全域的公開區間，以及${a}在登錄名單上實際有的東西。我們寧可這樣說，也不憑空給一個數字。`,
    rangeTitle: "首爾全域公開區間",
    fullPricePage: (t) => `${t} 完整價格頁`,
    whatAreaHasTitle: (a) => `${a}有什麼`,
    rowFieldClinics: "這個分類的診所",
    rowFieldClinicsVal: (n, fields) => `${n} 家登錄為${fields}`,
    rowAllClinics: "本地區登錄診所總數",
    whereToLookTitle: (a) => `在${a}該看哪裡`,
    whereToLookBody: (n, fields, a, t) =>
      `本站任何地方都不把診所名稱放在價格旁邊，所以上面的數字與診所名單是分開的。${a}的${fields}登錄診所 ${n} 家依名稱排列，不排名、不推薦。登錄名單不會寫出每家做哪些療程，因此是否做 ${t}，出發前請先問清楚。`,
    seeFieldClinics: (n, fields, a) =>
      `查看${a}的${fields}登錄診所 ${n} 家`,
    everythingIn: (a) => `${a}總覽頁`,
    checkTitle: (a) => `在${a}預約前要確認的事`,
    glossaryEnNote: "用語說明頁為英文。",
    questionsTitle: "常見問題",
    faqCostQ: (t, a) => `在${a}做 ${t} 要多少錢？`,
    faqCostAWith: (a, clinics, spec, w, u, date) =>
      `我們沒有按地區的價格，所以沒有「${a}的金額」。在首爾全域，${clinics} 家診所公開 ${spec} 為 ${w}（約 ${u}），查核日期 ${date}。${a}的診所收費可能在這個區間內，也可能不在。`,
    faqCostANo: (min) =>
      `我們沒有按地區的價格。只有同一條件至少 ${min} 家公開時才列區間，而這一項只有活動價。請向診所索取書面報價。`,
    faqElsewhereQ: (t) => `${t} 在首爾其他地區比較便宜嗎？`,
    faqElsewhereA:
      "我們無法這樣說。蒐集到的價格沒有地區標記，公開價格的診所也分散在首爾各處。沒有拿出數字就說某一區比較便宜的人，是在猜。",
    faqHowManyQ: (a) => `${a}有幾家診所做這個？`,
    faqHowManyA: (inField, all, a, fields, t) =>
      `${a} ${all} 家登錄診所中，有 ${inField} 家登錄為${fields}，也就是這項療程所屬的分類。登錄名單不會列出每家做哪些療程，所以這是分類家數，不是做 ${t} 的診所家數。`,
    inOtherAreasTitle: (t) => `其他地區的${t}`,
    otherTreatmentsTitle: (a) => `${a}的其他療程`,
  },

  "zh-Hans": {
    registryCrumb: "登记诊所",
    areaTitle: (a) => `${a}的诊所与价格`,
    areaMeta: (a, n, checked) =>
      `${a}有 ${n} 家诊所列入可接待外国患者的官方登记名单（${checked} 核对）。本站的公开价格区间为全国汇总，不按地区区分。`,
    areaLead: (a, district, n, checked) =>
      `${district}。${a}有 ${n} 家诊所列入可接待外国患者的官方登记名单（Medical Korea）。核对日期为 ${checked}。`,
    canTellTitle: "这一页能告诉您什么、不能告诉您什么",
    canTell1: (a) =>
      `${a}的诊所家数取自公开登记名单。那是登记机构的数量，不是好诊所的数量。`,
    canTell2: (a) =>
      `本站的价格区间取自诊所在自家官网公开的价格，并未按地区拆分，所以这里没有「${a}的价格」，我们也不会凭猜测造一个。`,
    canTell3: "本页与全站都没有排名、点评、评分或前后对比照片。",
    registryTitle: (a) => `登记名单里的${a}`,
    rowRegistered: "登记诊所家数",
    rowDistrict: "行政区",
    rowTransit: "怎么去",
    rowChecked: "名单核对日期",
    byFieldTitle: "按诊疗分类",
    registeredCount: (n) => `${n} 家登记`,
    priceTitle: (a) => `各项目价格，附${a}诊所家数`,
    priceLead: (collected, a) =>
      `区间于 ${collected} 自首尔各诊所官网采集。下列各页也会写出${a}在该分类登记的诊所家数。`,
    inArea: (t, a) => `${a}的${t}`,
    eventOnly: "仅有活动价 — 请看该页",
    clinicsPublished: (n) => `${n} 家公开`,
    howCollectedLink: "价格如何采集",
    allTreatmentsLink: "所有项目",
    clinicsHereTitle: (a) => `${a}的登记诊所`,
    clinicsHereLead: (n, a) =>
      `诊所名称放在登记名单页，不放在价格旁边。${a}的 ${n} 家全部按名称排列，不排名、不推荐。`,
    seeAllClinics: (n, a) => `查看${a}全部 ${n} 家登记诊所`,
    otherAreasTitle: "其他地区",
    areaIndexLead:
      "也有各地区的页面。价格不按地区区分，但每一页都写出该地区的登记诊所家数，以及首尔全域的公开价格区间。",

    atTitle: (t, a) => `${a}的${t} — 诊所与公开价格`,
    atMetaWith: (n, a, clinics, spec, w, collected) =>
      `${a}有 ${n} 家登记诊所属于这一分类。在首尔全域，${clinics} 家诊所公开 ${spec} 为 ${w}（${collected} 核对）。价格并不按地区公开。`,
    atMetaNo: (n, a) =>
      `${a}有 ${n} 家登记诊所属于这一分类。预约前要确认什么，以及首尔全域的公开价格区间。`,
    atLead: (district, n, a, fields, checked) =>
      `${district}。${a}有 ${n} 家诊所登记为${fields}。核对日期为 ${checked}。`,
    readFirstTitle: "请先看这里",
    readFirstBody: (a, t) =>
      `韩国诊所不按地区公开价格，我们也不按地区采集，所以本站没有 ${t} 的「${a}价格」。下面是首尔全域的公开区间，以及${a}在登记名单上实际有的东西。我们宁可这样说，也不凭空给一个数字。`,
    rangeTitle: "首尔全域公开区间",
    fullPricePage: (t) => `${t} 完整价格页`,
    whatAreaHasTitle: (a) => `${a}有什么`,
    rowFieldClinics: "这一分类的诊所",
    rowFieldClinicsVal: (n, fields) => `${n} 家登记为${fields}`,
    rowAllClinics: "本地区登记诊所总数",
    whereToLookTitle: (a) => `在${a}该看哪里`,
    whereToLookBody: (n, fields, a, t) =>
      `本站任何地方都不把诊所名称放在价格旁边，所以上面的数字与诊所名单是分开的。${a}的${fields}登记诊所 ${n} 家按名称排列，不排名、不推荐。登记名单不会写出每家做哪些项目，所以是否做 ${t}，出发前请先问清楚。`,
    seeFieldClinics: (n, fields, a) =>
      `查看${a}的${fields}登记诊所 ${n} 家`,
    everythingIn: (a) => `${a}总览页`,
    checkTitle: (a) => `在${a}预约前要确认的事`,
    glossaryEnNote: "用语说明页为英文。",
    questionsTitle: "常见问题",
    faqCostQ: (t, a) => `在${a}做 ${t} 要多少钱？`,
    faqCostAWith: (a, clinics, spec, w, u, date) =>
      `我们没有按地区的价格，所以没有「${a}的金额」。在首尔全域，${clinics} 家诊所公开 ${spec} 为 ${w}（约 ${u}），核对日期 ${date}。${a}的诊所收费可能在这个区间内，也可能不在。`,
    faqCostANo: (min) =>
      `我们没有按地区的价格。只有同一规格至少 ${min} 家公开时才列区间，而这一项只有活动价。请向诊所索取书面报价。`,
    faqElsewhereQ: (t) => `${t} 在首尔其他地区更便宜吗？`,
    faqElsewhereA:
      "我们无法这样说。采集到的价格没有地区标记，公开价格的诊所也分散在首尔各处。不拿出数字就说某一区更便宜的人，是在猜。",
    faqHowManyQ: (a) => `${a}有几家诊所做这个？`,
    faqHowManyA: (inField, all, a, fields, t) =>
      `${a} ${all} 家登记诊所中，有 ${inField} 家登记为${fields}，也就是这项项目所属的分类。登记名单不会列出每家做哪些项目，所以这是分类家数，不是做 ${t} 的诊所家数。`,
    inOtherAreasTitle: (t) => `其他地区的${t}`,
    otherTreatmentsTitle: (a) => `${a}的其他项目`,
  },

  es: {
    registryCrumb: "Clínicas registradas",
    areaTitle: (a) => `Clínicas y precios en ${a}`,
    areaMeta: (a, n, checked) =>
      `${n} clínicas de ${a} figuran en el registro oficial de centros autorizados a atender pacientes extranjeros (revisado el ${checked}). Los rangos de precio de esta web son de todo el país, no por zona.`,
    areaLead: (a, district, n, checked) =>
      `${district}. ${n} clínicas de ${a} figuran en el registro oficial (Medical Korea) de centros autorizados a atender pacientes extranjeros. Revisado el ${checked}.`,
    canTellTitle: "Lo que esta página sí dice y lo que no",
    canTell1: (a) =>
      `El número de clínicas de ${a} sale del registro público. Es un recuento de centros registrados, no de centros buenos.`,
    canTell2: (a) =>
      `Los rangos de precio de esta web salen de lo que las clínicas publican en su propia página. No están separados por zona, así que aquí no hay un «precio de ${a}» y no nos lo inventamos.`,
    canTell3:
      "No hay rankings, reseñas, puntuaciones ni fotos de antes y después, ni en esta página ni en el resto de la web.",
    registryTitle: (a) => `${a} en el registro`,
    rowRegistered: "Clínicas registradas",
    rowDistrict: "Distrito",
    rowTransit: "Cómo llegar",
    rowChecked: "Registro revisado el",
    byFieldTitle: "Por especialidad",
    registeredCount: (n) => `${n} registradas`,
    priceTitle: (a) => `Precios por tratamiento, con las clínicas de ${a}`,
    priceLead: (collected, a) =>
      `Los rangos se recogieron el ${collected} de las webs de clínicas de todo Seúl. Cada página de abajo indica además cuántas clínicas registradas de ${a} trabajan en esa especialidad.`,
    inArea: (t, a) => `${t} en ${a}`,
    eventOnly: "Solo precio promocional — véase la página",
    clinicsPublished: (n) => `${n} clínicas lo publican`,
    howCollectedLink: "Cómo recogemos los precios",
    allTreatmentsLink: "Todos los tratamientos",
    clinicsHereTitle: (a) => `Clínicas registradas en ${a}`,
    clinicsHereLead: (n, a) =>
      `Los nombres de las clínicas están en las páginas del registro, no junto a los precios. Las ${n} de ${a} aparecen por orden alfabético, sin ranking y sin recomendación.`,
    seeAllClinics: (n, a) => `Ver las ${n} clínicas registradas en ${a}`,
    otherAreasTitle: "Otras zonas",
    areaIndexLead:
      "También hay una página por zona. Los precios no van por zona, pero cada página indica cuántas clínicas registradas hay allí y el rango publicado en todo Seúl.",

    atTitle: (t, a) => `${t} en ${a}: clínicas y precios publicados`,
    atMetaWith: (n, a, clinics, spec, w, collected) =>
      `${n} clínicas registradas de ${a} trabajan en esta especialidad. En todo Seúl, ${clinics} clínicas publican ${spec} a ${w} (recogido el ${collected}). Los precios no se publican por zona.`,
    atMetaNo: (n, a) =>
      `${n} clínicas registradas de ${a} trabajan en esta especialidad. Qué comprobar antes de reservar y el rango publicado en todo Seúl.`,
    atLead: (district, n, a, fields, checked) =>
      `${district}. ${n} clínicas registradas de ${a} están dadas de alta en ${fields}. Revisado el ${checked}.`,
    readFirstTitle: "Lea esto primero",
    readFirstBody: (a, t) =>
      `Las clínicas coreanas no publican precios por distrito y nosotros no los recogemos así, de modo que en esta web no hay un precio de ${t} en ${a}. Lo que sigue es el rango que las clínicas publican en todo Seúl y lo que ${a} tiene realmente en el registro. Preferimos decirlo antes que inventar una cifra.`,
    rangeTitle: "Rango publicado en todo Seúl",
    fullPricePage: (t) => `Página completa de precios de ${t}`,
    whatAreaHasTitle: (a) => `Qué hay en ${a}`,
    rowFieldClinics: "Clínicas de esta especialidad",
    rowFieldClinicsVal: (n, fields) => `${n} dadas de alta en ${fields}`,
    rowAllClinics: "Clínicas registradas en total aquí",
    whereToLookTitle: (a) => `Dónde mirar en ${a}`,
    whereToLookBody: (n, fields, a, t) =>
      `En esta web no ponemos nombres de clínicas junto a los precios, así que la lista va aparte de las cifras de arriba. Las ${n} clínicas de ${fields} registradas en ${a} aparecen por orden alfabético, sin ranking y sin recomendación. El registro no dice qué tratamientos hace cada clínica, así que pregunte por ${t} antes de viajar.`,
    seeFieldClinics: (n, fields, a) =>
      `Ver las ${n} clínicas de ${fields} registradas en ${a}`,
    everythingIn: (a) => `Todo sobre ${a}`,
    checkTitle: (a) => `Qué comprobar antes de reservar en ${a}`,
    glossaryEnNote: "Las páginas del glosario están en inglés.",
    questionsTitle: "Preguntas",
    faqCostQ: (t, a) => `¿Cuánto cuesta ${t} en ${a}?`,
    faqCostAWith: (a, clinics, spec, w, u, date) =>
      `No tenemos precios por zona, así que no hay una cifra de ${a}. En todo Seúl, ${clinics} clínicas publican ${spec} entre ${w} (unos ${u}), revisado el ${date}. Las clínicas de ${a} pueden cobrar dentro o fuera de ese rango.`,
    faqCostANo: (min) =>
      `No tenemos precios por zona. Publicamos un rango solo cuando al menos ${min} clínicas publican lo mismo con el mismo tamaño, y aquí solo hay precios promocionales. Pida un presupuesto por escrito.`,
    faqElsewhereQ: (t) => `¿Es ${t} más barato en otra zona de Seúl?`,
    faqElsewhereA:
      "No podemos decirlo. Los precios que recogemos no llevan etiqueta de zona y las clínicas que los publican están repartidas por todo Seúl. Quien le diga que un distrito sale más barato está adivinando, salvo que le muestre sus números.",
    faqHowManyQ: (a) => `¿Cuántas clínicas de ${a} lo hacen?`,
    faqHowManyA: (inField, all, a, fields, t) =>
      `${inField} de las ${all} clínicas registradas en ${a} están dadas de alta en ${fields}, que es la especialidad a la que pertenece este tratamiento. El registro no indica qué tratamientos ofrece cada clínica, así que esta es la cifra de la especialidad, no el número de clínicas que hacen ${t}.`,
    inOtherAreasTitle: (t) => `${t} en otras zonas`,
    otherTreatmentsTitle: (a) => `Otros tratamientos en ${a}`,
  },

  ko: {
    registryCrumb: "등록 병원",
    areaTitle: (a) => `${a} 병원과 가격`,
    areaMeta: (a, n, checked) =>
      `${a}에 등록된 병원은 ${n}곳입니다. 외국인 환자를 받을 수 있는 공식 명부 기준이며 ${checked}에 확인했습니다. 이 사이트의 공개 가격 범위는 전국을 모은 것이고 지역별이 아닙니다.`,
    areaLead: (a, district, n, checked) =>
      `${district}. ${a}의 ${n}곳이 외국인 환자를 받을 수 있는 공식 명부(메디컬코리아)에 올라 있습니다. 확인일은 ${checked}입니다.`,
    canTellTitle: "이 쪽이 말할 수 있는 것과 없는 것",
    canTell1: (a) =>
      `${a}의 병원 수는 공개 명부에서 센 숫자입니다. 등록된 기관 수이고, 좋은 병원 수가 아닙니다.`,
    canTell2: (a) =>
      `이 사이트의 가격 범위는 병원이 자기 홈페이지에 공개한 가격입니다. 지역별로 나뉘어 있지 않아 「${a} 가격」은 여기에 없고, 지어내지도 않습니다.`,
    canTell3:
      "순위·후기·별점·전후 사진은 이 쪽에도, 이 사이트 어디에도 없습니다.",
    registryTitle: (a) => `명부에서 본 ${a}`,
    rowRegistered: "등록 병원 수",
    rowDistrict: "행정구역",
    rowTransit: "가는 길",
    rowChecked: "명부 확인일",
    byFieldTitle: "분야별",
    registeredCount: (n) => `${n}곳 등록`,
    priceTitle: (a) => `시술별 가격과 ${a} 병원 수`,
    priceLead: (collected, a) =>
      `범위는 서울 전역 병원 홈페이지에서 ${collected}에 모았습니다. 아래 각 쪽에는 ${a}에서 그 분야로 등록한 병원 수도 함께 적었습니다.`,
    inArea: (t, a) => `${a} ${t}`,
    eventOnly: "이벤트가만 있음 — 쪽에서 확인",
    clinicsPublished: (n) => `${n}곳이 공개`,
    howCollectedLink: "가격을 모으는 방법",
    allTreatmentsLink: "시술 전체",
    clinicsHereTitle: (a) => `${a}의 등록 병원`,
    clinicsHereLead: (n, a) =>
      `병원 이름은 가격 옆이 아니라 명부 쪽에 둡니다. ${a}의 ${n}곳을 모두 이름 순으로 놓았고, 순위도 추천도 없습니다.`,
    seeAllClinics: (n, a) => `${a} 등록 병원 ${n}곳 모두 보기`,
    otherAreasTitle: "다른 지역",
    areaIndexLead:
      "지역별 쪽도 있습니다. 가격은 지역별로 없지만, 각 쪽에 그 지역 등록 병원 수와 서울 전역 공개 범위를 적었습니다.",

    atTitle: (t, a) => `${a} ${t} — 병원과 공개 가격`,
    atMetaWith: (n, a, clinics, spec, w, collected) =>
      `${a}에서 이 분야로 등록한 병원은 ${n}곳입니다. 서울 전역에서는 ${clinics}곳이 ${spec}을 ${w}으로 공개했습니다(${collected} 확인). 가격은 지역별로 공개되지 않습니다.`,
    atMetaNo: (n, a) =>
      `${a}에서 이 분야로 등록한 병원은 ${n}곳입니다. 예약 전에 확인할 것과, 서울 전역의 공개 가격 범위를 적었습니다.`,
    atLead: (district, n, a, fields, checked) =>
      `${district}. ${a}에서 ${n}곳이 ${fields}로 등록했습니다. 확인일은 ${checked}입니다.`,
    readFirstTitle: "먼저 읽어 주세요",
    readFirstBody: (a, t) =>
      `한국 병원은 가격을 지역별로 공개하지 않고, 저희도 지역별로 모으지 않습니다. 그래서 이 사이트에 ${t}의 「${a} 가격」은 없습니다. 아래는 서울 전역의 공개 범위와, ${a}가 명부에 실제로 가진 것입니다. 숫자를 지어내기보다 없다고 말하는 쪽을 택했습니다.`,
    rangeTitle: "서울 전역 공개 범위",
    fullPricePage: (t) => `${t} 가격 쪽 전체`,
    whatAreaHasTitle: (a) => `${a}에 있는 것`,
    rowFieldClinics: "이 분야 병원",
    rowFieldClinicsVal: (n, fields) => `${fields}로 ${n}곳 등록`,
    rowAllClinics: "이 지역 등록 병원 전체",
    whereToLookTitle: (a) => `${a}에서 어디를 볼까`,
    whereToLookBody: (n, fields, a, t) =>
      `저희는 사이트 어디에서도 병원 이름을 가격 옆에 두지 않습니다. 그래서 위 숫자와 병원 목록을 따로 둡니다. ${a}의 ${fields} 등록 병원 ${n}곳은 명부에 이름 순으로 올라 있고, 순위도 추천도 없습니다. 명부에는 어떤 시술을 하는지 적혀 있지 않으니 ${t}을 하는지는 가기 전에 물어보세요.`,
    seeFieldClinics: (n, fields, a) =>
      `${a}의 ${fields} 등록 병원 ${n}곳 보기`,
    everythingIn: (a) => `${a} 전체 보기`,
    checkTitle: (a) => `${a}에서 예약 전에 확인할 것`,
    glossaryEnNote: "용어 설명 쪽은 영어입니다.",
    questionsTitle: "질문",
    faqCostQ: (t, a) => `${a}에서 ${t}은 얼마인가요?`,
    faqCostAWith: (a, clinics, spec, w, u, date) =>
      `지역별 가격 자료가 없어 「${a} 금액」이라는 것은 없습니다. 서울 전역에서는 ${clinics}곳이 ${spec}을 ${w}(약 ${u})으로 공개했고 확인일은 ${date}입니다. ${a} 병원이 이 범위 안인지 밖인지는 알 수 없습니다.`,
    faqCostANo: (min) =>
      `지역별 가격 자료가 없습니다. 같은 조건으로 ${min}곳 이상이 공개했을 때만 범위를 내는데, 이 시술은 이벤트가만 있습니다. 병원에 서면 견적을 요청하세요.`,
    faqElsewhereQ: (t) => `${t}은 서울 다른 지역이 더 싼가요?`,
    faqElsewhereA:
      "알 수 없습니다. 저희가 모은 가격에는 지역 표시가 없고, 공개한 병원도 서울 전역에 흩어져 있습니다. 숫자를 보여 주지 않으면서 어느 동네가 더 싸다고 말하는 사람은 추측하는 것입니다.",
    faqHowManyQ: (a) => `${a}에서 몇 곳이 이 시술을 하나요?`,
    faqHowManyA: (inField, all, a, fields, t) =>
      `${a}의 등록 병원 ${all}곳 가운데 ${inField}곳이 이 시술이 속한 ${fields}로 등록했습니다. 명부에는 병원별로 어떤 시술을 하는지 적혀 있지 않으므로, 이것은 분야 수이고 ${t}을 하는 병원 수가 아닙니다.`,
    inOtherAreasTitle: (t) => `다른 지역의 ${t}`,
    otherTreatmentsTitle: (a) => `${a}의 다른 시술`,
  },
};
