// 法人紹介資料のサンプル（内容は https://jchres.jp の掲載情報のみを使用）
const path = require("path");
const J = require("../jchres_theme");

async function main() {
  const pres = J.newDeck({ author: "山口 拓允" });

  J.addTitleSlide(pres, {
    eyebrow: "Company Profile",
    title: "一般社団法人ヘルスケア研究・教育支援機構のご紹介",
    subtitle: "研究の構想から社会実装まで",
    presenter: "専務理事　山口 拓允",
    date: "2026年9月",
  });

  J.addStatementSlide(pres, {
    eyebrow: "Mission",
    message: "エビデンスに、道をつくる。",
    body: "研究の構想から社会実装まで。科学的根拠が人々の健康を変える力となるよう、その道筋のすべてを支援します。",
  });

  J.addStatementSlide(pres, {
    eyebrow: "Vision",
    message: "データが医療を変える社会を、ここからつくる。",
    body: "RWD、AI、デジタルヘルス、分散型臨床試験など次世代の研究基盤を取り入れ、患者中心の医療を支える科学的インフラを構築します。",
  });

  J.addSectionSlide(pres, { number: 1, eyebrow: "Service", title: "事業内容", note: "多領域を横断的に統合した研究支援" });

  J.addGridSlide(pres, {
    eyebrow: "Service",
    title: "8つの支援領域",
    items: [
      "臨床研究支援",
      "統計解析・データサイエンス",
      "リアルワールドデータ\n（RWD）解析",
      "医療経済評価\nアウトカムリサーチ",
      "AI・デジタルヘルス研究支援",
      "論文化・学術発信支援",
      "教育・人材育成",
      "研究コンサルティング",
    ],
  });

  J.addProcessSlide(pres, {
    eyebrow: "Approach",
    title: "研究の構想から社会実装までを一貫して支援",
    steps: [
      { header: "研究デザインの策定" },
      { header: "データ構築・解析" },
      { header: "論文化" },
      { header: "ガイドラインへの反映" },
      { header: "社会実装" },
    ],
  });

  J.addCardSlide(pres, {
    eyebrow: "Service",
    title: "主な支援内容",
    cards: [
      { header: "臨床研究支援", text: "研究デザイン、プロトコル作成、症例数設計、統計解析計画を支援" },
      { header: "統計解析", text: "解析手法の選定からプログラム作成、結果の解釈まで支援" },
      { header: "論文化・学術発信", text: "構成設計、図表作成、投稿先の選定、査読対応まで支援" },
    ],
  });

  J.addPeopleSlide(pres, {
    title: "理事",
    people: [
      { role: "代表理事", name: "川﨑 洋平", degree: "博士（理学）", fields: ["生物統計学", "ベイズ統計学", "臨床試験学"] },
      { role: "専務理事", name: "山口 拓允", degree: "博士（医学）", fields: ["疫学", "被ばく医療学", "保健統計学"] },
      { role: "理事", name: "仕子 優樹", degree: "博士（工学）", fields: ["生物統計学", "疫学", "予測モデル"] },
      { role: "理事", name: "大澤 麻衣子", degree: "博士（薬科学）", fields: ["生物統計学", "医療経済学"] },
    ],
  });

  J.addTableSlide(pres, {
    eyebrow: "Company",
    title: "法人概要",
    header: ["項目", "内容"],
    colW: [3.0, J.W - J.MARGIN * 2 - 3.0],
    fontSize: 20,
    rows: [
      ["法人名", "一般社団法人ヘルスケア研究・教育支援機構（JCHRES）"],
      ["代表理事", "川﨑 洋平"],
      ["設立日", "2026年1月22日"],
      ["所在地", "東京都新宿区西新宿3丁目3番13号 西新宿水間ビル2F"],
      ["お問い合わせ", "info@jchres.jp"],
    ],
  });

  J.addClosingSlide(pres);

  const out = path.join(__dirname, "..", "dist", "JCHRES_company_profile_sample.pptx");
  await J.writeDeck(pres, out);
  console.log("wrote", out);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
