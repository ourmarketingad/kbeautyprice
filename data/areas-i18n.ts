// 지역 쪽의 언어별 문구. 영어 쪽(/in/...)과 같은 자료를 쓰고 말만 바꾼다.
// 숫자·날짜·병원 수는 번역하지 않고 자료에서 그대로 넣는다.
// 지역별 가격은 없다 — 어느 언어에서도 「이 지역이 싸다·좋다」로 읽히는 말을 쓰지 않는다.
import type { Locale } from "@/data/i18n";

/** 지역 이름·행정구역·교통. 확인된 사실만. */
export type AreaL10n = { name: string; district: string; transit: string };

export const AREA_L10N: Record<Locale, Record<string, AreaL10n>> = {
  ja: {
    "gangnam-station": {
      name: "江南駅",
      district: "ソウル・江南区と瑞草区",
      transit: "地下鉄2号線・新盆唐線の江南駅",
    },
    apgujeong: {
      name: "狎鴎亭",
      district: "ソウル・江南区",
      transit: "3号線の狎鴎亭駅、水仁盆唐線の狎鴎亭ロデオ駅",
    },
    cheongdam: {
      name: "清潭",
      district: "ソウル・江南区",
      transit: "地下鉄7号線の清潭駅",
    },
    sinnonhyeon: {
      name: "新論峴",
      district: "ソウル・江南区",
      transit: "9号線・新盆唐線の新論峴駅",
    },
    myeongdong: {
      name: "明洞",
      district: "ソウル・中区",
      transit: "4号線の明洞駅、2号線の乙支路入口駅",
    },
    hongdae: {
      name: "弘大",
      district: "ソウル・麻浦区",
      transit: "2号線・空港鉄道・京義中央線の弘大入口駅",
    },
    busan: {
      name: "釜山",
      district: "ソウルとは別の都市、釜山",
      transit: "釜山市。ソウルからは KTX、または金海空港への航空便",
    },
  },
  "zh-Hant": {
    "gangnam-station": {
      name: "江南站",
      district: "首爾江南區與瑞草區",
      transit: "地鐵2號線、新盆唐線江南站",
    },
    apgujeong: {
      name: "狎鷗亭",
      district: "首爾江南區",
      transit: "3號線狎鷗亭站、水仁盆唐線狎鷗亭羅德歐站",
    },
    cheongdam: {
      name: "清潭",
      district: "首爾江南區",
      transit: "地鐵7號線清潭站",
    },
    sinnonhyeon: {
      name: "新論峴",
      district: "首爾江南區",
      transit: "9號線、新盆唐線新論峴站",
    },
    myeongdong: {
      name: "明洞",
      district: "首爾中區",
      transit: "4號線明洞站、2號線乙支路入口站",
    },
    hongdae: {
      name: "弘大",
      district: "首爾麻浦區",
      transit: "2號線、機場鐵道、京義中央線弘大入口站",
    },
    busan: {
      name: "釜山",
      district: "釜山，與首爾不同的城市",
      transit: "釜山市。自首爾可搭 KTX，或飛往金海機場",
    },
  },
  "zh-Hans": {
    "gangnam-station": {
      name: "江南站",
      district: "首尔江南区与瑞草区",
      transit: "地铁2号线、新盆唐线江南站",
    },
    apgujeong: {
      name: "狎鸥亭",
      district: "首尔江南区",
      transit: "3号线狎鸥亭站、水仁盆唐线狎鸥亭罗德奥站",
    },
    cheongdam: {
      name: "清潭",
      district: "首尔江南区",
      transit: "地铁7号线清潭站",
    },
    sinnonhyeon: {
      name: "新论岘",
      district: "首尔江南区",
      transit: "9号线、新盆唐线新论岘站",
    },
    myeongdong: {
      name: "明洞",
      district: "首尔中区",
      transit: "4号线明洞站、2号线乙支路入口站",
    },
    hongdae: {
      name: "弘大",
      district: "首尔麻浦区",
      transit: "2号线、机场铁道、京义中央线弘大入口站",
    },
    busan: {
      name: "釜山",
      district: "釜山，与首尔不同的城市",
      transit: "釜山市。自首尔可乘 KTX，或飞往金海机场",
    },
  },
  es: {
    "gangnam-station": {
      name: "Estación de Gangnam",
      district: "Distritos de Gangnam y Seocho, Seúl",
      transit: "Estación de Gangnam, líneas 2 y Shinbundang del metro",
    },
    apgujeong: {
      name: "Apgujeong",
      district: "Distrito de Gangnam, Seúl",
      transit:
        "Estación de Apgujeong (línea 3) y Apgujeong Rodeo (línea Suin-Bundang)",
    },
    cheongdam: {
      name: "Cheongdam",
      district: "Distrito de Gangnam, Seúl",
      transit: "Estación de Cheongdam, línea 7 del metro",
    },
    sinnonhyeon: {
      name: "Sinnonhyeon",
      district: "Distrito de Gangnam, Seúl",
      transit: "Estación de Sinnonhyeon, líneas 9 y Shinbundang",
    },
    myeongdong: {
      name: "Myeongdong",
      district: "Distrito de Jung, Seúl",
      transit: "Estación de Myeongdong (línea 4) y Euljiro 1-ga (línea 2)",
    },
    hongdae: {
      name: "Hongdae",
      district: "Distrito de Mapo, Seúl",
      transit:
        "Estación de Hongik Univ.: línea 2, Airport Railroad y línea Gyeongui-Jungang",
    },
    busan: {
      name: "Busan",
      district: "Busan, una ciudad distinta de Seúl",
      transit: "Ciudad de Busan; desde Seúl en KTX o en avión a Gimhae",
    },
  },
  ko: {
    "gangnam-station": {
      name: "강남역",
      district: "서울 강남구·서초구",
      transit: "지하철 2호선·신분당선 강남역",
    },
    apgujeong: {
      name: "압구정",
      district: "서울 강남구",
      transit: "3호선 압구정역, 수인분당선 압구정로데오역",
    },
    cheongdam: {
      name: "청담",
      district: "서울 강남구",
      transit: "지하철 7호선 청담역",
    },
    sinnonhyeon: {
      name: "신논현",
      district: "서울 강남구",
      transit: "9호선·신분당선 신논현역",
    },
    myeongdong: {
      name: "명동",
      district: "서울 중구",
      transit: "4호선 명동역, 2호선 을지로입구역",
    },
    hongdae: {
      name: "홍대",
      district: "서울 마포구",
      transit: "2호선·공항철도·경의중앙선 홍대입구역",
    },
    busan: {
      name: "부산",
      district: "서울이 아닌 다른 도시, 부산",
      transit: "부산시. 서울에서 KTX 또는 김해공항 항공편",
    },
  },
};

/** 명부 분야 이름. lib/clinics.ts 의 FIELD_LABEL 과 같은 키. */
export const FIELD_L10N: Record<Locale, Record<string, string>> = {
  ja: {
    skin: "皮膚・美容",
    surgery: "美容外科",
    dental: "歯科",
    eye: "眼科",
    women: "女性の健康",
    korean: "韓医院",
    hospital: "病院",
    general: "一般・専門科",
  },
  "zh-Hant": {
    skin: "皮膚與美容",
    surgery: "整形外科",
    dental: "牙科",
    eye: "眼科",
    women: "婦女健康",
    korean: "韓醫",
    hospital: "醫院",
    general: "一般與專科",
  },
  "zh-Hans": {
    skin: "皮肤与美容",
    surgery: "整形外科",
    dental: "牙科",
    eye: "眼科",
    women: "妇女健康",
    korean: "韩医",
    hospital: "医院",
    general: "一般与专科",
  },
  es: {
    skin: "Dermatología y estética",
    surgery: "Cirugía plástica",
    dental: "Odontología",
    eye: "Oftalmología",
    women: "Salud de la mujer",
    korean: "Medicina coreana",
    hospital: "Hospital",
    general: "General y especialidades",
  },
  ko: {
    skin: "피부·미용",
    surgery: "성형외과",
    dental: "치과",
    eye: "안과",
    women: "여성 건강",
    korean: "한의원",
    hospital: "병원",
    general: "일반·전문과",
  },
};

export const areaL10n = (lang: Locale, slug: string): AreaL10n | undefined =>
  AREA_L10N[lang][slug];

export const fieldL10n = (lang: Locale, field: string): string =>
  FIELD_L10N[lang][field] ?? field;
