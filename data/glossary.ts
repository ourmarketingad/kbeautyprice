// 용어사전. 외국인이 한국 병원 견적서와 가격표에서 만나는 말을 풀어 쓴다.
// 효과·적합성 주장, 병원 이름, 환자 사례, 지어낸 숫자를 쓰지 않는다.
// 금액은 data/prices.json 에서만 가져온다(priceSlug 로 연결).

export type GlossaryCategory =
  | "pricing"
  | "lifting"
  | "injectable"
  | "laser"
  | "surgery"
  | "visiting";

export const GLOSSARY_CATEGORY: Record<
  GlossaryCategory,
  { label: string; blurb: string }
> = {
  pricing: {
    label: "Prices & quotes",
    blurb: "Words that decide what a number on a Korean clinic page means.",
  },
  lifting: {
    label: "Lifting devices",
    blurb: "Energy-based devices sold by shot count or by area.",
  },
  injectable: {
    label: "Injectables",
    blurb: "Treatments priced by vial, syringe, cc or unit.",
  },
  laser: {
    label: "Lasers & skin devices",
    blurb: "Devices usually sold per session or as a course.",
  },
  surgery: {
    label: "Surgery",
    blurb: "Procedures quoted as one price that covers several line items.",
  },
  visiting: {
    label: "Visiting a Korean clinic",
    blurb: "Rules, registries and practical words for foreign patients.",
  },
};

export type GlossaryTerm = {
  slug: string;
  en: string;
  ko?: string;
  category: GlossaryCategory;
  aka?: string[];
  short: string;
  blocks: { h: string; p: string[] }[];
  related?: string[];
  priceSlug?: string;
};

export const glossary: GlossaryTerm[] = [
  // ─── PRICES & QUOTES ────────────────────────────────────────
  {
    slug: "listed-price",
    en: "Listed price",
    ko: "정가",
    category: "pricing",
    aka: ["regular price", "normal price", "pre-discount price"],
    short:
      "The regular price a clinic publishes for a treatment, before any event or discount is applied.",
    blocks: [
      {
        h: "What it is",
        p: [
          "A listed price is the standing price on a clinic's own price page or procedure page. It is the number the clinic charges when no event, package or first-visit condition applies.",
          "On this site, listed prices and event prices are shown separately and never blended into one range. A range built from listed prices tells you what the treatment normally costs; a range built from event prices tells you what it costs under conditions you may or may not meet.",
        ],
      },
      {
        h: "Why it matters when you compare",
        p: [
          "Two clinics can show the same number while meaning different things: one as its standing price, the other as a limited event price. Comparing those two numbers directly tells you very little.",
          "A listed price is also the number a clinic is most likely to honour on a normal visit, which makes it the more useful figure when you are planning a budget from abroad.",
        ],
      },
    ],
    related: ["event-price", "vat", "written-quote", "first-visit-price"],
  },
  {
    slug: "event-price",
    en: "Event price",
    ko: "이벤트가",
    category: "pricing",
    aka: ["promotion price", "campaign price", "이벤트 가격"],
    short:
      "A temporary price that applies only under stated conditions, such as a date range, a first visit or a package.",
    blocks: [
      {
        h: "What it is",
        p: [
          "An event price is a price a clinic offers for a limited period or to a limited group. Korean medical advertising rules expect an event price to state the regular price, the period, who qualifies and any conditions attached.",
          "If a page shows a low number with none of that information, you cannot tell what you would actually pay, and neither can we.",
        ],
      },
      {
        h: "What to check before you count on it",
        p: [
          "Look for the dates, whether it is limited to a first visit, whether it requires paying for several sessions at once, and whether VAT is included.",
          "Ask whether the event price still applies on the day you can travel. Events published for a Korean audience often end before an overseas visitor can book a trip.",
        ],
      },
    ],
    related: ["listed-price", "first-visit-price", "package-deal", "vat"],
  },
  {
    slug: "vat",
    en: "VAT",
    ko: "부가세",
    category: "pricing",
    aka: ["value added tax", "부가가치세", "VAT included", "VAT excluded"],
    short:
      "A 10% tax added to cosmetic medical treatments in Korea, which a clinic may quote as included or excluded.",
    blocks: [
      {
        h: "Why it changes the number you compare",
        p: [
          "Cosmetic treatments in Korea are subject to 10% VAT. A clinic may publish a price with VAT already included, or publish the pre-tax figure and add the tax at payment.",
          "A price marked VAT excluded is 10% higher than it looks. When two clinics publish the same figure and one includes VAT, the real gap between them is 10%.",
        ],
      },
      {
        h: "How to read it on a Korean page",
        p: [
          "Korean price pages mark this as 부가세 포함 (VAT included) or 부가세 별도 (VAT separate). Some pages say nothing at all, which usually means you should ask.",
          "On this site each range states whether the prices behind it included VAT, excluded it, or mixed both. A mixed range is wider than the real spread for that reason.",
        ],
      },
    ],
    related: ["tax-refund", "listed-price", "written-quote"],
  },
  {
    slug: "shot-count",
    en: "Shot count",
    ko: "샷 수",
    category: "pricing",
    aka: ["shots", "lines", "발수", "300 shots", "600 shots"],
    short:
      "The number of energy pulses delivered in a device treatment, and the unit most lifting devices are sold by.",
    blocks: [
      {
        h: "Why a price means nothing without it",
        p: [
          "Devices such as Ultherapy, Thermage and HIFU systems are sold by shot count. A price for 100 shots and a price for 300 shots are not comparable figures, even for the same device on the same face.",
          "This is the single most common reason two quotes for the same treatment look wildly different.",
        ],
      },
      {
        h: "How we handle it",
        p: [
          "Every range on this site names the size it covers, for example 300 shots or 600 shots. We do not merge different shot counts into one number.",
          "When you ask a clinic for a quote, ask for the price and the shot count together. A written quote that omits the count is incomplete.",
        ],
      },
    ],
    related: ["ultherapy", "thermage", "written-quote", "cartridge"],
  },
  {
    slug: "cc-and-syringe",
    en: "cc and syringe",
    ko: "cc·주사기 단위",
    category: "pricing",
    aka: ["per cc", "per syringe", "1cc", "volume"],
    short:
      "The volume unit injectables are sold by, where one syringe does not always hold one cc.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Fillers and some skin treatments are priced by volume in cc, or by the syringe. A standard filler syringe commonly holds 1cc, but products and brands differ, so a price per syringe and a price per cc are not automatically the same figure.",
          "Some clinics quote per vial instead, which is a sealed container of product rather than a measured dose.",
        ],
      },
      {
        h: "What to ask",
        p: [
          "Ask how many cc the quoted price covers and what happens if more product is used during the appointment. Clinics differ on whether the extra is charged at the same rate.",
          "For products sold by vial, ask whether an opened vial is charged in full even when part of it is not used.",
        ],
      },
    ],
    related: ["ha-filler", "written-quote", "session-and-course"],
  },
  {
    slug: "session-and-course",
    en: "Session and course",
    ko: "1회·패키지 횟수",
    category: "pricing",
    aka: ["per session", "course of treatment", "1회 가격", "3회 패키지"],
    short:
      "Whether a price covers one appointment or a set number of appointments bought together.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Many laser and injectable treatments are published both as a single-session price and as a multi-session course. The per-session figure inside a course is usually lower than the standalone price.",
          "A page showing only the course price can look much cheaper than a page showing a single session, when the underlying rate is similar.",
        ],
      },
      {
        h: "What this means for a visitor",
        p: [
          "A course only helps if you can return for the remaining sessions. If you are visiting Korea once, a course price is not a price you can use.",
          "Ask whether unused sessions can be refunded, transferred or held for a later visit, and get the answer in writing.",
        ],
      },
    ],
    related: ["package-deal", "listed-price", "written-quote"],
  },
  {
    slug: "consultation-fee",
    en: "Consultation fee",
    ko: "상담비·진료비",
    category: "pricing",
    aka: ["doctor consultation", "초진료"],
    short:
      "A charge for seeing a doctor, which some clinics waive and some deduct from the treatment price.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Some clinics charge for the initial consultation with a doctor, especially for surgical procedures. The amount and the rules differ widely between clinics.",
          "Clinics commonly waive the fee or deduct it from the treatment cost if you go ahead on the same day, but that is a clinic policy, not a rule.",
        ],
      },
      {
        h: "What to ask",
        p: [
          "Ask whether a consultation fee applies, whether it is deducted if you proceed, and whether it is refundable if you decide not to.",
          "If you are travelling and want to compare several clinics in person, these fees add up, so it is worth asking before you book each visit.",
        ],
      },
    ],
    related: ["written-quote", "first-visit-price", "anesthesia-fee"],
  },
  {
    slug: "anesthesia-fee",
    en: "Anesthesia fee",
    ko: "마취비",
    category: "pricing",
    aka: ["numbing cream fee", "sedation fee", "수면마취 비용"],
    short:
      "A charge for numbing or sedation that is sometimes inside the treatment price and sometimes added on top.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Treatments use anything from a topical numbing cream to sedation administered by an anaesthetist. The cost may be folded into the quoted price or billed as a separate line.",
          "For surgery, sedation is normally a significant separate item. For device treatments, numbing cream is often included, but clinics differ.",
        ],
      },
      {
        h: "Why it shows up in price gaps",
        p: [
          "Two quotes for the same surgery can differ largely because one includes sedation and the other does not. Asking which line items the number covers usually explains more of the gap than the treatment itself.",
        ],
      },
    ],
    related: ["written-quote", "consultation-fee", "aftercare-fee"],
  },
  {
    slug: "aftercare-fee",
    en: "Aftercare fee",
    ko: "사후관리 비용",
    category: "pricing",
    aka: ["follow-up fee", "post-care", "재진료"],
    short:
      "Charges for follow-up visits, dressings, medication or recovery treatments after the main procedure.",
    blocks: [
      {
        h: "What it is",
        p: [
          "After surgery or an injectable treatment, clinics may schedule follow-up visits, prescribe medication, or offer recovery care such as soothing laser sessions. These can be included, discounted or charged in full.",
          "Prescription medication is billed separately at a pharmacy in Korea, so it rarely appears in a clinic quote at all.",
        ],
      },
      {
        h: "What a visitor should settle first",
        p: [
          "Ask how many follow-up visits are expected, which of them are included, and what happens if you have already flown home.",
          "Ask whether the clinic can handle follow-up remotely and in which language, and whether any part of the fee is refundable if you cannot return.",
        ],
      },
    ],
    related: ["anesthesia-fee", "written-quote", "downtime"],
  },
  {
    slug: "package-deal",
    en: "Package",
    ko: "패키지",
    category: "pricing",
    aka: ["bundle", "combo", "묶음 상품"],
    short:
      "Several treatments or sessions sold together at one price, which cannot be compared with a single-item price.",
    blocks: [
      {
        h: "What it is",
        p: [
          "A package bundles different treatments, or several sessions of one treatment, into a single figure. Clinics use packages to present a lower effective rate per item.",
          "Because the contents differ from clinic to clinic, two packages with the same price can contain very different things.",
        ],
      },
      {
        h: "Why we leave packages out of ranges",
        p: [
          "This site builds ranges only from prices for a single named treatment at a stated size. Bundles are excluded, because including them would make a range look lower than what one treatment actually costs.",
          "If a clinic quotes you a package, ask for the price of each item on its own as well. That is the number you can compare.",
        ],
      },
    ],
    related: ["session-and-course", "event-price", "written-quote"],
  },
  {
    slug: "deposit",
    en: "Deposit",
    ko: "예약금",
    category: "pricing",
    aka: ["booking fee", "reservation fee", "선결제"],
    short:
      "An advance payment to hold an appointment, with refund rules that differ by clinic.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Clinics may ask for a deposit to reserve a date, particularly for surgery or for visitors booking from abroad. It is usually deducted from the final bill.",
          "Agencies and platforms sometimes collect a deposit of their own, which is a separate arrangement from the clinic's.",
        ],
      },
      {
        h: "What to settle in writing",
        p: [
          "Ask who holds the money, whether it is refundable, by when you must cancel, and what happens if a flight or visa problem stops you travelling.",
          "Keep the answer in writing in a language you read. A verbal assurance is difficult to rely on from another country.",
        ],
      },
    ],
    related: ["written-quote", "medical-agency", "session-and-course"],
  },
  {
    slug: "tax-refund",
    en: "VAT refund for foreign patients",
    ko: "외국인 환자 부가세 환급",
    category: "pricing",
    aka: ["medical tax refund", "tax free", "의료 택스리펀"],
    short:
      "A refund of part of the VAT on some cosmetic treatments, available to eligible foreign visitors at participating clinics.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Korea operates a VAT refund scheme covering certain cosmetic medical treatments for eligible foreign visitors. The clinic must be registered for the scheme and you receive the refund through the designated process, not from the clinic as cash at the desk.",
          "Eligibility depends on your visitor status and how long you have been in Korea, and the scheme has been extended and adjusted several times.",
        ],
      },
      {
        h: "What to confirm before you count on it",
        p: [
          "Ask the clinic directly whether it participates, which treatments qualify, and what documents you must present. Not every clinic is registered and not every treatment is covered.",
          "Because the rules and the end date have changed before, confirm the current terms with the clinic or the official scheme rather than relying on an older article.",
        ],
      },
    ],
    related: ["vat", "foreign-patient-registry", "written-quote"],
  },
  {
    slug: "written-quote",
    en: "Written quote",
    ko: "견적서",
    category: "pricing",
    aka: ["estimate", "itemised quote", "견적"],
    short:
      "An itemised document stating what you will pay, for which treatment, at which size, with tax and extras shown.",
    blocks: [
      {
        h: "What a complete quote contains",
        p: [
          "A usable quote names the treatment and the brand or device, states the size (shot count, cc, units or session count), shows whether VAT is included, and lists consultation, anaesthesia and aftercare separately.",
          "It should also state how long the quoted price is valid, because event prices expire.",
        ],
      },
      {
        h: "Why to ask for it in writing",
        p: [
          "Prices discussed in a consultation can shift once the doctor assesses you in person. A written quote gives you a fixed reference point and something to compare between clinics.",
          "If you do not read Korean, ask for the quote in English or ask which items each line covers. A number without a line item is not a quote.",
        ],
      },
    ],
    related: ["listed-price", "vat", "shot-count", "anesthesia-fee"],
  },
  {
    slug: "first-visit-price",
    en: "First-visit price",
    ko: "첫 방문가·체험가",
    category: "pricing",
    aka: ["trial price", "new patient price", "체험가"],
    short:
      "A reduced price offered once to a new patient, which does not apply to later visits.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Clinics commonly advertise a low trial price for a first visit, intended to bring a new patient in. The second and later sessions revert to the standing price.",
          "The trial is sometimes a smaller size than the standard treatment, for example a lower shot count or a partial area.",
        ],
      },
      {
        h: "Why it is left out of our ranges",
        p: [
          "A first-visit price is not what the treatment costs; it is what the first one costs. Including these would pull a range below anything you could pay twice.",
          "If you plan a course of treatments, ask for the repeat price before you judge whether a trial figure is worth travelling for.",
        ],
      },
    ],
    related: ["event-price", "session-and-course", "listed-price"],
  },

  // ─── LIFTING DEVICES ────────────────────────────────────────
  {
    slug: "hifu",
    en: "HIFU",
    ko: "고강도 집속 초음파",
    category: "lifting",
    aka: ["focused ultrasound", "초음파 리프팅", "ultrasound lifting"],
    short:
      "High-intensity focused ultrasound, a category of lifting device sold by shot count rather than a single brand.",
    blocks: [
      {
        h: "What it is",
        p: [
          "HIFU stands for high-intensity focused ultrasound. The device focuses ultrasound energy at a set depth below the skin surface rather than heating the surface itself.",
          "It is a category, not a product. Ultherapy, Shurink and several other systems are all HIFU devices, and their prices differ by a wide margin.",
        ],
      },
      {
        h: "Why the word alone tells you little about price",
        p: [
          "A clinic page saying only HIFU does not tell you which device, which cartridge depth or how many shots. Those three things drive the price.",
          "When comparing quotes, confirm the brand name and the shot count. Two HIFU prices without that information are not comparable.",
        ],
      },
    ],
    related: ["ultherapy", "shurink", "shot-count", "cartridge"],
  },
  {
    slug: "rf-lifting",
    en: "RF lifting",
    ko: "고주파 리프팅",
    category: "lifting",
    aka: ["radiofrequency", "monopolar RF", "고주파"],
    short:
      "Radiofrequency devices that heat tissue over a broader area, usually sold by shot count or by area.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Radiofrequency devices pass energy through tissue to heat it. Unlike focused ultrasound, the heating is spread over an area rather than concentrated at points.",
          "Thermage is the device most people mean in Korea, but several RF systems are in use and are priced differently.",
        ],
      },
      {
        h: "How it is priced",
        p: [
          "RF treatments are commonly sold by shot count with a stated cartridge, or by named area such as full face or neck. The same brand can be quoted in either form.",
          "Ask which cartridge and how many shots the quote covers, and whether the neck or under-eye area is inside the price.",
        ],
      },
    ],
    related: ["thermage", "shot-count", "cartridge", "hifu"],
  },
  {
    slug: "ultherapy",
    en: "Ultherapy",
    ko: "울쎄라",
    category: "lifting",
    aka: ["Ulthera", "Ultherapy Prime", "울세라"],
    short:
      "A focused ultrasound lifting device, sold by shot count, with a newer Prime version priced separately.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Ultherapy is a focused ultrasound device used for lifting treatments. It is the device most often quoted by name on Korean price pages in this category.",
          "Ultherapy Prime is a later version of the system. Clinics may price Prime and the earlier model differently, so the version belongs in the quote.",
        ],
      },
      {
        h: "What to confirm in a quote",
        p: [
          "Confirm the version, the shot count and which areas the shots cover. A face-only count and a face-and-neck count are different treatments at different prices.",
          "Counterfeit and unlicensed cartridges have been a reported problem in the wider market, so asking a clinic to confirm the device and cartridge is a reasonable question.",
        ],
      },
    ],
    related: ["hifu", "shot-count", "cartridge", "thermage"],
    priceSlug: "ultherapy",
  },
  {
    slug: "thermage",
    en: "Thermage",
    ko: "써마지",
    category: "lifting",
    aka: ["Thermage FLX", "써마지 FLX", "RF tightening"],
    short:
      "A monopolar radiofrequency device, sold by shot count, with FLX the version usually quoted in Korea.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Thermage is a monopolar radiofrequency device used for skin tightening treatments. FLX is the version most commonly named on Korean clinic pages.",
          "It is sold by shot count, most often in blocks such as 300, 600 or 900 shots.",
        ],
      },
      {
        h: "Why quotes differ so much",
        p: [
          "The shot count is the main driver. A 600-shot price and a 300-shot price are different products, and some pages show the lower count without saying so.",
          "Whether the price includes the eye or neck tips, and whether VAT is included, explain much of the remaining gap.",
        ],
      },
    ],
    related: ["rf-lifting", "shot-count", "cartridge", "vat"],
    priceSlug: "thermage",
  },
  {
    slug: "shurink",
    en: "Shurink",
    ko: "슈링크",
    category: "lifting",
    aka: ["Shurink Universe", "슈링크 유니버스"],
    short:
      "A Korean-made focused ultrasound device, generally the lower-priced HIFU option on clinic price lists.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Shurink is a domestically produced focused ultrasound system. Universe is a later version that clinics usually price separately from the original.",
          "Because it is made in Korea and widely installed, it typically appears at a lower price point than imported HIFU devices.",
        ],
      },
      {
        h: "How to read its prices",
        p: [
          "Shurink is sold in shot blocks, and many clinics advertise large counts at low per-shot rates as an event price.",
          "Check the version, the count, and whether the advertised figure is a first-visit price before comparing it with another clinic's standing price.",
        ],
      },
    ],
    related: ["hifu", "shot-count", "first-visit-price", "event-price"],
    priceSlug: "shurink",
  },
  {
    slug: "sofwave",
    en: "Sofwave",
    ko: "소프웨이브",
    category: "lifting",
    aka: ["SUPERB ultrasound", "소프웨이브 리프팅"],
    short:
      "An ultrasound lifting device that delivers energy to the mid-dermis, usually priced per session or per area.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Sofwave is an ultrasound device that targets a shallower layer than deep-focused HIFU systems, using parallel beams rather than single focal points.",
          "It is a newer arrival on Korean price lists than Ultherapy or Thermage, and fewer clinics publish a price for it.",
        ],
      },
      {
        h: "How it is priced",
        p: [
          "Clinics usually quote Sofwave per session or per treated area rather than per shot, so comparing it with a shot-count device needs care.",
          "Ask which areas the session covers and whether a course is required to reach the result discussed in the consultation.",
        ],
      },
    ],
    related: ["hifu", "session-and-course", "ultherapy"],
    priceSlug: "sofwave",
  },
  {
    slug: "thread-lift",
    en: "Thread lift",
    ko: "실리프팅",
    category: "lifting",
    aka: ["PDO threads", "cog threads", "매선", "실 리프팅"],
    short:
      "A procedure using absorbable threads placed under the skin, priced per thread or per set.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Thread lifting places absorbable sutures under the skin. Threads differ in material, length, and whether they carry barbs or cogs, and those differences change the price per thread considerably.",
          "It is a procedure performed by a doctor, not a device session, and it carries a recovery period.",
        ],
      },
      {
        h: "How it is quoted",
        p: [
          "Prices are usually given per thread or per set of a stated number. A quote of a set without the thread count or type is incomplete.",
          "Ask the thread brand, the type, how many will be used, and whether anaesthesia and follow-up visits are in the price.",
        ],
      },
    ],
    related: ["anesthesia-fee", "written-quote", "downtime"],
  },
  {
    slug: "cartridge",
    en: "Cartridge and depth",
    ko: "카트리지·깊이",
    category: "lifting",
    aka: ["tip", "transducer", "1.5mm", "3.0mm", "4.5mm"],
    short:
      "The replaceable head on a device, whose depth and type decide both the treatment and the price.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Focused ultrasound and RF devices use replaceable cartridges or tips. On ultrasound systems these are labelled by depth, commonly 1.5mm, 3.0mm and 4.5mm, each reaching a different layer.",
          "A cartridge holds a fixed number of shots and is a consumable cost for the clinic, which is why shot count and price track each other so closely.",
        ],
      },
      {
        h: "Why it appears in quotes",
        p: [
          "A treatment that uses two depths costs more than one that uses a single depth, even at the same total shot count.",
          "Eye and neck areas often need a specific cartridge, so a quote for a face treatment may not cover them.",
        ],
      },
    ],
    related: ["shot-count", "hifu", "ultherapy", "thermage"],
  },

  // ─── INJECTABLES ────────────────────────────────────────────
  {
    slug: "skin-booster",
    en: "Skin booster",
    ko: "스킨부스터",
    category: "injectable",
    aka: ["injectable moisturiser", "물광주사", "water light injection"],
    short:
      "A category of injected products placed into the skin rather than used to add volume, priced per vial or per session.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Skin booster is an umbrella term for products injected into the skin in many small points across an area. It covers quite different products, including polynucleotide and polylactic-acid based ones.",
          "It is a category name, not a product name, so a price for a skin booster tells you little until the product is named.",
        ],
      },
      {
        h: "How it is priced",
        p: [
          "Clinics quote per vial, per session, or as a course of several sessions. Prices between products in this category differ by a large margin.",
          "Ask for the product name and the number of vials, then compare like with like.",
        ],
      },
    ],
    related: ["rejuran", "juvelook", "mesotherapy", "cc-and-syringe"],
  },
  {
    slug: "rejuran",
    en: "Rejuran",
    ko: "리쥬란",
    category: "injectable",
    aka: ["Rejuran Healer", "polynucleotide", "PN", "리쥬란 힐러"],
    short:
      "A polynucleotide injectable sold by vial, with several variants that are priced differently.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Rejuran is a polynucleotide product injected into the skin. Several variants exist, including ones intended for the under-eye area and ones supplied with lidocaine.",
          "The variants carry different prices, so the exact product name matters when comparing quotes.",
        ],
      },
      {
        h: "How it is priced",
        p: [
          "It is quoted per vial or per cc, often as a course of several sessions spaced weeks apart.",
          "Confirm how many vials the price covers and whether the quoted figure is a single session or a course. A course price divided by its sessions is not the single-session price a clinic would charge you on one visit.",
        ],
      },
    ],
    related: ["skin-booster", "cc-and-syringe", "session-and-course"],
    priceSlug: "rejuran",
  },
  {
    slug: "juvelook",
    en: "Juvelook",
    ko: "쥬베룩",
    category: "injectable",
    aka: ["PDLLA", "collagen booster", "쥬베룩 볼륨"],
    short:
      "A poly-D,L-lactic acid injectable sold by vial, with a separate volume version priced differently.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Juvelook is an injectable based on poly-D,L-lactic acid. A separate product in the same family, usually labelled Volume, is used differently and priced differently.",
          "Clinics sometimes list both under one heading, which makes the published price ambiguous.",
        ],
      },
      {
        h: "What to confirm",
        p: [
          "Ask which of the products the quote covers, how many vials, and how many sessions are planned.",
          "As with other vial-based products, ask whether a partially used vial is charged in full.",
        ],
      },
    ],
    related: ["skin-booster", "collagen-stimulator", "cc-and-syringe"],
    priceSlug: "juvelook",
  },
  {
    slug: "ha-filler",
    en: "Hyaluronic acid filler",
    ko: "히알루론산 필러",
    category: "injectable",
    aka: ["HA filler", "dermal filler", "필러"],
    short:
      "A gel injected to add volume, priced per cc or per syringe, with wide price differences between brands.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Hyaluronic acid fillers are gels injected to add volume to an area. Brands differ in particle size and firmness, and are chosen for different areas of the face.",
          "Both imported and domestically produced brands are in common use in Korea, and the price gap between them is substantial.",
        ],
      },
      {
        h: "How to compare prices",
        p: [
          "Ask for the brand, the product line within that brand, and the cc. A per-cc price for one brand says nothing about another.",
          "Ask what happens if the doctor uses more than the quoted volume during the appointment.",
        ],
      },
    ],
    related: ["cc-and-syringe", "written-quote", "collagen-stimulator"],
    priceSlug: "dermal-filler",
  },
  {
    slug: "botulinum-toxin",
    en: "Botulinum toxin",
    ko: "보툴리눔 톡신",
    category: "injectable",
    aka: ["botox", "보톡스", "units", "unit price"],
    short:
      "An injectable sold by unit or by area, where the brand and the unit count both change the price.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Botulinum toxin products are injected to reduce muscle activity in a treated area. Botox is one brand name among several, and Korea has a number of domestic manufacturers.",
          "Products are measured in units, and brands are not interchangeable unit for unit.",
        ],
      },
      {
        h: "How it is priced",
        p: [
          "Clinics quote either a price per unit or a flat price for a named area such as forehead or jaw. A flat area price hides the unit count, which is the thing that varies.",
          "Ask the brand and the number of units. A low area price with a low unit count is a smaller treatment, not a better rate.",
        ],
      },
    ],
    related: ["jaw-botox", "skin-botox", "written-quote"],
  },
  {
    slug: "jaw-botox",
    en: "Jaw botox",
    ko: "턱보톡스",
    category: "injectable",
    aka: ["masseter botox", "사각턱 보톡스", "jawline slimming"],
    short:
      "Botulinum toxin injected into the masseter muscle, quoted per side, per area or by unit count.",
    blocks: [
      {
        h: "What it is",
        p: [
          "This is botulinum toxin injected into the masseter, the chewing muscle at the jaw angle. It is one of the most commonly published prices on Korean clinic pages.",
          "Treatments are usually repeated at intervals, so the repeat price matters as much as the first one.",
        ],
      },
      {
        h: "What to confirm",
        p: [
          "Confirm the brand, the units per side, and whether the price covers both sides.",
          "Many advertised prices for this treatment are first-visit prices. Ask for the standing price before comparing clinics.",
        ],
      },
    ],
    related: ["botulinum-toxin", "first-visit-price", "listed-price"],
    priceSlug: "jaw-botox",
  },
  {
    slug: "skin-botox",
    en: "Skin botox",
    ko: "스킨보톡스",
    category: "injectable",
    aka: ["micro botox", "mesobotox", "더모톡신"],
    short:
      "Diluted botulinum toxin injected shallowly across an area, priced per session or as a course.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Skin botox refers to injecting diluted botulinum toxin into the skin across many points, rather than into a muscle at a few points.",
          "Because the dilution and the number of points vary between clinics, the amount of product in a session is not standard.",
        ],
      },
      {
        h: "How it is priced",
        p: [
          "It is usually sold per session for a named area, sometimes as a course. The unit count is often not published.",
          "Ask the brand, the total units and the area covered so the session can be compared with another clinic's.",
        ],
      },
    ],
    related: ["botulinum-toxin", "session-and-course", "mesotherapy"],
    priceSlug: "skin-botox",
  },
  {
    slug: "collagen-stimulator",
    en: "Collagen stimulator",
    ko: "콜라겐 자극제",
    category: "injectable",
    aka: ["Sculptra", "Ellanse", "PLLA", "PCL", "스컬트라", "엘란쎄"],
    short:
      "Injectables based on materials such as PLLA or PCL, sold by vial, that work over months rather than at once.",
    blocks: [
      {
        h: "What it is",
        p: [
          "This group covers injectables made from materials such as poly-L-lactic acid or polycaprolactone. They are placed to prompt the body's own tissue response over time rather than to add gel volume immediately.",
          "Products in this group differ in how long the material remains, which is one reason their prices differ.",
        ],
      },
      {
        h: "How it is priced",
        p: [
          "Quotes are per vial, and more than one vial is commonly planned across sessions.",
          "Ask the product name, the number of vials in the quote, and how many sessions are expected. A single-vial price is not the cost of the plan.",
        ],
      },
    ],
    related: ["ha-filler", "juvelook", "session-and-course"],
  },
  {
    slug: "exosome",
    en: "Exosome treatment",
    ko: "엑소좀",
    category: "injectable",
    aka: ["exosomes", "엑소좀 시술"],
    short:
      "A product category applied after laser or microneedling treatments, usually priced as an add-on per session.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Exosome products are applied to the skin after a treatment that creates micro-channels, or used alongside other procedures. Several brands are in use in Korea.",
          "Regulatory status and permitted use differ by country and have changed over time, so what a clinic may offer varies.",
        ],
      },
      {
        h: "How it shows up in a quote",
        p: [
          "It usually appears as a line added to a laser or microneedling session rather than a standalone price.",
          "Ask whether the quoted session already includes it, and what the session costs without it.",
        ],
      },
    ],
    related: ["potenza", "session-and-course", "skin-booster"],
  },
  {
    slug: "mesotherapy",
    en: "Mesotherapy",
    ko: "메조테라피",
    category: "injectable",
    aka: ["water light injection", "물광주사", "aqua peel injection"],
    short:
      "Many shallow injections of a mixed solution across an area, priced per session and varying by what is mixed in.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Mesotherapy delivers a solution into the skin through many shallow injections, by hand or with an injector device. What goes into the solution differs between clinics.",
          "In Korea the term overlaps in everyday use with skin booster treatments, and clinic pages do not always separate them.",
        ],
      },
      {
        h: "How to compare",
        p: [
          "Because the contents are not standard, two mesotherapy prices are rarely comparable. Ask what is in the mix and how many sessions are planned.",
        ],
      },
    ],
    related: ["skin-booster", "skin-botox", "session-and-course"],
  },

  // ─── LASERS & SKIN DEVICES ──────────────────────────────────
  {
    slug: "pico-laser",
    en: "Pico laser",
    ko: "피코 레이저",
    category: "laser",
    aka: ["picosecond laser", "pico toning", "피코토닝"],
    short:
      "A laser that fires in picosecond pulses, sold per session or as a course, with brand and mode changing the price.",
    blocks: [
      {
        h: "What it is",
        p: [
          "A picosecond laser delivers energy in extremely short pulses. Several brands are in use in Korea and clinics usually name the brand on their price page.",
          "The same machine is used in different modes, and a toning mode session and a fractional-handpiece session are priced differently.",
        ],
      },
      {
        h: "How to compare prices",
        p: [
          "Ask the brand, the mode or handpiece, and whether the price is for full face or a spot area.",
          "These treatments are commonly sold as courses, so check whether the advertised figure is a single session or a per-session rate inside a package.",
        ],
      },
    ],
    related: ["laser-toning", "session-and-course", "fractional-laser"],
    priceSlug: "pico-toning",
  },
  {
    slug: "laser-toning",
    en: "Laser toning",
    ko: "레이저 토닝",
    category: "laser",
    aka: ["toning", "토닝", "low fluence laser"],
    short:
      "Repeated low-energy laser sessions over an area, normally sold in courses of several sessions.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Toning means passing a laser over an area at low energy, repeated across multiple sessions rather than done once at high energy.",
          "It can be performed with different laser types, including nanosecond and picosecond systems, at different prices.",
        ],
      },
      {
        h: "What a single-session price means",
        p: [
          "Because toning is designed as a series, the single-session price is rarely the whole cost. Clinics usually publish both a per-session figure and a course.",
          "If you are visiting Korea briefly, ask whether a short series is possible within your stay and what the sessions cost individually.",
        ],
      },
    ],
    related: ["pico-laser", "session-and-course", "package-deal"],
  },
  {
    slug: "fractional-laser",
    en: "Fractional laser",
    ko: "프락셔널 레이저",
    category: "laser",
    aka: ["fractional CO2", "resurfacing", "프락셔널"],
    short:
      "A laser that treats the skin in a grid of micro-columns, priced per session with recovery time to plan around.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Fractional lasers treat a fraction of the surface in a grid of tiny columns, leaving untreated skin between them. Both ablative and non-ablative systems are used.",
          "Ablative treatments involve visible recovery, which matters if you are flying home soon after.",
        ],
      },
      {
        h: "What to ask about price",
        p: [
          "Ask the device, the area, the number of passes and whether post-treatment care is in the price.",
          "Ask how many days of visible recovery to expect before you book travel around the appointment.",
        ],
      },
    ],
    related: ["downtime", "pico-laser", "aftercare-fee"],
  },
  {
    slug: "ipl",
    en: "IPL",
    ko: "아이피엘",
    category: "laser",
    aka: ["intense pulsed light", "BBL", "photofacial"],
    short:
      "Broad-spectrum light rather than a laser, sold per session or in courses, with filters changing what a session covers.",
    blocks: [
      {
        h: "What it is",
        p: [
          "IPL uses a broad band of light rather than a single laser wavelength. Different filters select different parts of the spectrum.",
          "Several branded systems exist, and clinics price them separately from one another.",
        ],
      },
      {
        h: "How it is priced",
        p: [
          "Usually per session for a named area, often with a course price. The filter or handpiece used is not always published.",
          "Ask the device name and which areas a session covers.",
        ],
      },
    ],
    related: ["laser-toning", "session-and-course", "pico-laser"],
  },
  {
    slug: "potenza",
    en: "Potenza",
    ko: "포텐자",
    category: "laser",
    aka: ["microneedling RF", "RF microneedling", "니들 RF"],
    short:
      "A radiofrequency microneedling device, priced per session with tip type and shot count affecting the figure.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Potenza is a microneedling device that delivers radiofrequency energy through fine needles into the skin. Several tip types are available for different purposes.",
          "It is one of the device names most often published by name on Korean clinic pages in this category.",
        ],
      },
      {
        h: "What changes the price",
        p: [
          "The tip used, the number of shots or passes, the area, and whether a product such as an exosome preparation is applied afterwards.",
          "Ask which of those the quote includes, and whether numbing cream is counted separately.",
        ],
      },
    ],
    related: ["exosome", "anesthesia-fee", "session-and-course"],
    priceSlug: "potenza",
  },
  {
    slug: "diode-hair-removal",
    en: "Laser hair removal",
    ko: "레이저 제모",
    category: "laser",
    aka: ["diode laser", "제모", "Soprano", "alexandrite"],
    short:
      "Hair removal using laser, priced per area per session and almost always sold as a multi-session course.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Laser hair removal is performed with several laser types, including diode and alexandrite systems. Clinics usually name the machine.",
          "Because hair grows in cycles, treatment is planned as a series spaced weeks apart rather than a single appointment.",
        ],
      },
      {
        h: "How it is priced",
        p: [
          "Prices are given per body area per session, with course prices for a set number of sessions. Area definitions differ between clinics, so the same area name can cover different ground.",
          "For a short visit, ask what one session costs on its own, since a course you cannot finish is not a usable price.",
        ],
      },
    ],
    related: ["session-and-course", "package-deal", "listed-price"],
    priceSlug: "laser-hair-removal",
  },
  {
    slug: "pass-and-pulse",
    en: "Pass, pulse and shot",
    ko: "패스·펄스·샷",
    category: "laser",
    aka: ["number of passes", "pulses", "패스 수"],
    short:
      "The units that describe how much treatment a laser session actually delivers.",
    blocks: [
      {
        h: "What the words mean",
        p: [
          "A pulse or shot is one firing of the device. A pass is one sweep across the treated area, which contains many pulses.",
          "A session described as three passes delivers more than one described as one pass, on the same machine at the same settings.",
        ],
      },
      {
        h: "Why it belongs in a quote",
        p: [
          "Session prices rarely state passes, which is one reason two session prices for the same device can differ.",
          "Asking how many passes or shots a session includes makes two quotes comparable in a way the device name alone does not.",
        ],
      },
    ],
    related: ["shot-count", "written-quote", "laser-toning"],
  },
  {
    slug: "downtime",
    en: "Downtime",
    ko: "회복 기간",
    category: "laser",
    aka: ["recovery", "social downtime", "다운타임"],
    short:
      "The period after a treatment when visible redness, swelling or scabbing is expected.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Downtime is the time during which the effects of a treatment are visible on the surface, separate from how long healing continues underneath.",
          "It varies by treatment, by settings and by person, so a figure a clinic gives is a typical range rather than a promise.",
        ],
      },
      {
        h: "Why it matters for a trip",
        p: [
          "Downtime decides the order of your appointments and whether you can fly, attend events or wear makeup afterwards.",
          "Ask about it before you book flights, and ask what care is needed in the days after, since that may add cost.",
        ],
      },
    ],
    related: ["fractional-laser", "aftercare-fee", "thread-lift"],
  },

  // ─── SURGERY ────────────────────────────────────────────────
  {
    slug: "double-eyelid-non-incision",
    en: "Non-incision double eyelid surgery",
    ko: "비절개 쌍꺼풀",
    category: "surgery",
    aka: ["buried suture", "매몰법", "suture method"],
    short:
      "A double eyelid method using sutures rather than a cut, quoted as a single figure that may or may not include anaesthesia.",
    blocks: [
      {
        h: "What it is",
        p: [
          "In the non-incision method the eyelid crease is formed with sutures placed through small punctures rather than through a cut along the lid.",
          "Variants differ in the number of fixation points, and clinics may price them separately.",
        ],
      },
      {
        h: "What the quoted price usually covers",
        p: [
          "Ask whether the figure includes the consultation, anaesthesia, medication, follow-up visits and suture removal.",
          "Ask what happens, and what it costs, if a revision is needed later. Revision terms vary widely and are worth getting in writing.",
        ],
      },
    ],
    related: ["double-eyelid-incision", "anesthesia-fee", "aftercare-fee"],
    priceSlug: "double-eyelid-non-incision",
  },
  {
    slug: "double-eyelid-incision",
    en: "Incisional double eyelid surgery",
    ko: "절개 쌍꺼풀",
    category: "surgery",
    aka: ["full incision", "절개법", "partial incision"],
    short:
      "A double eyelid method using an incision, usually priced above the non-incision method and often combined with other work.",
    blocks: [
      {
        h: "What it is",
        p: [
          "The incisional method forms the crease through a cut along the eyelid, which allows tissue to be adjusted at the same time.",
          "Partial-incision variants exist and are priced between the two main methods at many clinics.",
        ],
      },
      {
        h: "Why quotes vary",
        p: [
          "This surgery is frequently combined with other procedures, and a combined quote cannot be compared with a single-procedure price.",
          "Ask for each item priced separately, and ask which line items — anaesthesia, medication, follow-ups — are inside the total.",
        ],
      },
    ],
    related: ["double-eyelid-non-incision", "epicanthoplasty", "written-quote"],
    priceSlug: "double-eyelid-incision",
  },
  {
    slug: "epicanthoplasty",
    en: "Epicanthoplasty",
    ko: "앞트임",
    category: "surgery",
    aka: ["inner corner surgery", "앞트임 수술", "lateral canthoplasty"],
    short:
      "Surgery on the corner of the eye, usually quoted as an addition to double eyelid surgery rather than alone.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Epicanthoplasty adjusts the inner corner of the eye. A separate procedure adjusts the outer corner, and the two are priced separately.",
          "Both are commonly performed alongside double eyelid surgery, which is why they often appear as add-on lines in a quote.",
        ],
      },
      {
        h: "Reading the quote",
        p: [
          "Check whether the headline surgery price already contains it or whether it is an extra line.",
          "Ask about revision terms specifically for this procedure, since they can differ from the main surgery's.",
        ],
      },
    ],
    related: ["double-eyelid-incision", "written-quote", "aftercare-fee"],
  },
  {
    slug: "rhinoplasty",
    en: "Rhinoplasty",
    ko: "코성형",
    category: "surgery",
    aka: ["nose surgery", "코 수술", "revision rhinoplasty"],
    short:
      "Nose surgery, where the material used and whether it is a first or revision operation drive the price.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Rhinoplasty covers a wide range of operations on the nose. Implants, the patient's own cartilage and processed materials are all used, and the choice changes both the surgery and the price.",
          "Revision surgery on a previously operated nose is a different and generally more expensive operation.",
        ],
      },
      {
        h: "Why published prices vary so widely",
        p: [
          "A clinic's lowest advertised figure usually describes the simplest case with the least costly material. The price discussed after an in-person assessment is often different.",
          "Ask which materials the quote assumes, whether sedation is included, how many follow-ups are covered and what revision would cost.",
        ],
      },
    ],
    related: ["anesthesia-fee", "written-quote", "aftercare-fee"],
    priceSlug: "rhinoplasty",
  },
  {
    slug: "liposuction",
    en: "Liposuction",
    ko: "지방흡입",
    category: "surgery",
    aka: ["lipo", "지방 흡입", "body contouring"],
    short:
      "Surgical fat removal, priced by area and by method, with compression garments and follow-up care often extra.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Liposuction removes fat through small incisions using suction, with several assisting technologies in use. It is surgery with a recovery period, not a device session.",
          "Areas are priced separately, and area definitions differ between clinics.",
        ],
      },
      {
        h: "What is often outside the headline price",
        p: [
          "Compression garments, follow-up visits, drainage or massage care and medication are commonly separate lines.",
          "Ask what the price covers, how many nights you should stay nearby, and how long before flying is advised.",
        ],
      },
    ],
    related: ["anesthesia-fee", "aftercare-fee", "downtime"],
    priceSlug: "liposuction",
  },

  // ─── VISITING A KOREAN CLINIC ───────────────────────────────
  {
    slug: "foreign-patient-registry",
    en: "Foreign patient registry",
    ko: "외국인환자 유치 등록",
    category: "visiting",
    aka: ["registered institution", "Medical Korea registry", "유치 등록 의료기관"],
    short:
      "The official list of institutions permitted to receive foreign patients, which is a permission, not a quality mark.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Korean law requires medical institutions and agencies that attract foreign patients to register with the authorities. The register is maintained publicly.",
          "This site lists registered providers from that register, by area and field, alphabetically.",
        ],
      },
      {
        h: "What it does and does not tell you",
        p: [
          "Being listed means the institution has registered and may receive foreign patients. It says nothing about price, quality, waiting times or which treatments are offered.",
          "A listing on this site is not a recommendation, and we publish no ratings or rankings of any kind.",
        ],
      },
    ],
    related: ["medical-agency", "tax-refund", "interpretation"],
  },
  {
    slug: "medical-agency",
    en: "Medical agency",
    ko: "유치업자·에이전시",
    category: "visiting",
    aka: ["facilitator", "medical tourism agency", "코디네이터"],
    short:
      "A registered company that arranges treatment for foreign patients and may charge the clinic a fee.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Agencies that bring foreign patients to Korean clinics must themselves be registered. Registered agencies may receive a fee from the clinic, within limits set by official guidance.",
          "This exception applies to foreign patients. Paying a fee for introducing domestic patients is treated differently under Korean law.",
        ],
      },
      {
        h: "What to ask",
        p: [
          "Ask whether the price you are quoted is the clinic's price or includes an agency fee, and who holds any deposit you pay.",
          "Ask whether the agency is registered, and compare the quoted figure with prices the clinic publishes itself.",
        ],
      },
    ],
    related: ["foreign-patient-registry", "deposit", "written-quote"],
  },
  {
    slug: "interpretation",
    en: "Interpretation at the clinic",
    ko: "통역",
    category: "visiting",
    aka: ["translator", "language support", "영어 상담"],
    short:
      "Language support during consultation and treatment, which may be staffed, booked or charged.",
    blocks: [
      {
        h: "What it is",
        p: [
          "Some clinics have in-house coordinators who speak English, Japanese or Chinese; others arrange an interpreter per appointment, and some have none.",
          "Consent forms and quotes are often written in Korean even when the consultation is interpreted.",
        ],
      },
      {
        h: "What to settle beforehand",
        p: [
          "Ask which languages are available on the day you will visit, whether there is a charge, and whether written documents can be provided in your language.",
          "Ask for your quote in writing in a language you read, so you can check it after the appointment.",
        ],
      },
    ],
    related: ["written-quote", "foreign-patient-registry", "consultation-fee"],
  },
  {
    slug: "clinic-vs-hospital",
    en: "Clinic, hospital and 의원",
    ko: "의원·병원 구분",
    category: "visiting",
    aka: ["의원", "병원", "의료기관 종별"],
    short:
      "Korean institution types that differ by size and bed count, and that English pages translate inconsistently.",
    blocks: [
      {
        h: "What the words mean",
        p: [
          "Korean medical institutions are classified by type, with 의원 broadly corresponding to a smaller clinic and 병원 to a hospital with inpatient beds, and further categories above that.",
          "Most cosmetic and dermatology practices foreign visitors see are of the smaller type, even when their English name says hospital or centre.",
        ],
      },
      {
        h: "Why it appears in prices",
        p: [
          "Official guidance on fees for foreign patient referrals sets different limits by institution type, which is one reason the type is worth knowing.",
          "The type does not tell you about price level or specialisation on its own.",
        ],
      },
    ],
    related: ["foreign-patient-registry", "medical-agency"],
  },
];

export function getTerm(slug: string) {
  return glossary.find((t) => t.slug === slug);
}

export function termsInCategory(c: GlossaryCategory) {
  return glossary.filter((t) => t.category === c);
}
