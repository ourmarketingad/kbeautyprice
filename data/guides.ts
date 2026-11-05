// 칼럼(가이드). 비용·견적을 다룬다. 의학적 효과·적합성 주장은 쓰지 않는다.
// 병원 이름, 환자 경험담, 지어낸 사례를 쓰지 않는다. 금액은 data/prices.json 에서만 가져온다.
export type GuideBlock = { h: string; p?: string[]; items?: string[] };
export type Guide = {
  slug: string;
  group: "Reading prices" | "Quotes" | "Published prices";
  title: string;
  answer: string;
  date: string;
  priceSlug?: string;
  blocks: GuideBlock[];
  faq: { q: string; a: string }[];
};

export const guides: Guide[] = [
  {
    slug: "why-same-treatment-different-price",
    group: "Reading prices",
    title: "Why does the same treatment cost so differently between Seoul clinics?",
    answer:
      "Because a treatment name is not one fixed product. Device version, dose, who performs it and what the price includes all change the number, and clinics set non-insured prices themselves.",
    date: "2026-11-06",
    blocks: [
      {
        h: "Same name, different thing",
        p: [
          "Two prices for a lifting device can cover different shot counts, different tips or an add-on such as anaesthetic cream. Compare the line items, not the name.",
          "Cosmetic treatments are generally not covered by Korean national health insurance, so each clinic sets its own price.",
        ],
      },
      {
        h: "What to compare",
        p: [
          "Ask for the product or device, the dose or shots, the number of sessions, and whether VAT, anaesthesia and follow-up are included. Two quotes can only be compared once these match.",
        ],
      },
    ],
    faq: [
      {
        q: "Does a higher price mean a better result?",
        a: "Price alone does not tell you that. It reflects what is included and how the clinic sets its prices. A doctor can explain what is planned for you.",
      },
    ],
  },
  {
    slug: "is-the-lowest-price-the-final-price",
    group: "Reading prices",
    title: "Is the lowest price you see online the price you will pay?",
    answer:
      "Often not. A low advertised price may be a first-visit offer, a smaller dose or exclude VAT. Treat it as a starting point and ask for the total in writing.",
    date: "2026-11-06",
    blocks: [
      {
        h: "Common reasons the number changes",
        p: [
          "First-visit or limited-time conditions, a smaller dose than you assumed, add-ons such as anaesthesia or sedation, and VAT shown separately.",
          "On this site, event prices are kept apart from listed prices, and first-visit trial prices are left out.",
        ],
      },
      {
        h: "One question that helps",
        p: [
          "Ask: what is the total I pay on the day, including VAT, for exactly this product and dose? Ask for the answer in writing before you book.",
        ],
      },
    ],
    faq: [
      {
        q: "Are event prices bad?",
        a: "Not in themselves. Check the dates, who qualifies and what is included, then compare them with the listed price.",
      },
    ],
  },
  {
    slug: "what-a-written-quote-should-include",
    group: "Quotes",
    title: "What should a written quote from a Korean clinic include?",
    answer:
      "At least the product or device, dose, sessions, who performs it, what is included, the total with VAT, how long the quote is valid and how refunds work.",
    date: "2026-11-06",
    blocks: [
      {
        h: "A simple checklist",
        items: [
          "Treatment and product name",
          "Dose, shots or area",
          "Number of sessions",
          "Doctor or staff role",
          "Anaesthesia, medication and follow-up visits",
          "VAT",
          "Total amount and currency",
          "Valid until",
          "Refund and cancellation terms",
        ],
      },
      {
        h: "Why in writing",
        p: [
          "Messages and verbal explanations are easy to misread across languages. A written list lets you compare clinics and check what you are charged on the day.",
        ],
      },
    ],
    faq: [
      {
        q: "Will the price change after the consultation?",
        a: "It can. The doctor may suggest a different plan, so ask for the quote to be updated before you agree.",
      },
    ],
  },
  {
    slug: "questions-before-you-pay",
    group: "Quotes",
    title: "Six questions to ask before you pay at a clinic in Korea",
    answer:
      "Ask who performs the treatment, what exactly is used, what the total is, what is not included, what happens if you need a follow-up after you fly home, and how refunds work.",
    date: "2026-11-06",
    blocks: [
      {
        h: "The six questions",
        items: [
          "Who performs it?",
          "Which product or device, and how much?",
          "What is the total including VAT?",
          "What costs extra?",
          "What happens if I need follow-up after I leave Korea?",
          "What is the refund policy if I cancel?",
        ],
      },
      {
        h: "If you do not get clear answers",
        p: [
          "You do not have to decide on the day. Ask for the details in writing and take the time you need.",
        ],
      },
    ],
    faq: [
      {
        q: "Should I pay on the day of consultation?",
        a: "Only if you are ready. You can ask for a written quote and decide later.",
      },
    ],
  },
  {
    slug: "ultherapy-300-shots-published-prices",
    group: "Published prices",
    title: "Ultherapy Prime 300 shots: what Seoul clinics publish",
    answer:
      "See the range below, taken from prices clinics show on their own websites. Your price depends on the clinic and plan, so ask for a written quote.",
    date: "2026-11-06",
    priceSlug: "ultherapy",
    blocks: [
      {
        h: "How to read this range",
        p: [
          "It uses each clinic's regular or pre-discount price for 300 shots. Some clinics state VAT separately and some do not say, so check this when you ask.",
          "Whether this treatment suits you is for a doctor to decide at consultation.",
        ],
      },
    ],
    faq: [
      {
        q: "Why show a range instead of one average?",
        a: "We checked a small number of clinics. A range is honest about that; an average would suggest more precision than we have.",
      },
    ],
  },
  {
    slug: "rejuran-healer-2cc-published-prices",
    group: "Published prices",
    title: "Rejuran Healer 2cc: what Seoul clinics publish",
    answer:
      "See the ranges below, taken from prices clinics show on their own websites, with listed and event prices kept apart. Your price depends on the clinic and plan.",
    date: "2026-11-06",
    priceSlug: "rejuran",
    blocks: [
      {
        h: "How to read these ranges",
        p: [
          "Compare 2cc with 2cc. Some clinics also sell other doses or bundles, which we leave out here. Check VAT and whether anaesthetic cream or other steps are included.",
          "Whether this treatment suits you is for a doctor to decide at consultation.",
        ],
      },
    ],
    faq: [
      {
        q: "Is the event price available to everyone?",
        a: "Not always. Events can be limited by date or by who qualifies, so ask the clinic.",
      },
    ],
  },
];

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
