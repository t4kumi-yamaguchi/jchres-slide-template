// 全レイアウトの見本（セミナー・学術発表向け）。文言と数値はすべて差し替え用のダミー
const path = require("path");
const J = require("../jchres_theme");

async function main() {
  const pres = J.newDeck({ author: "作成者名" });

  J.addTitleSlide(pres, {
    eyebrow: "Seminar",
    title: "セミナータイトルをここに記載",
    subtitle: "副題をここに記載",
    presenter: "発表者名",
    affiliation: "JCHRES",
    date: "2026年10月1日",
  });

  J.addAgendaSlide(pres, {
    items: ["はじめに", "研究デザインの基本", "統計解析の考え方", "演習", "まとめ"],
    current: 2,
  });

  J.addSectionSlide(pres, { number: 2, eyebrow: "Chapter", title: "章タイトルをここに記載", note: "章の概要を一文で記載" });

  J.addBulletSlide(pres, {
    eyebrow: "Background",
    title: "箇条書きスライド",
    bullets: [
      "1項目1行、全角25字程度までに収める",
      "収まらない場合は文章を短くする",
      "本文中の出典は著者年で示す（Author, 2026）",
    ],
    point: { label: "Point", text: "このスライドで最も伝えたい内容を記載する" },
    source: "Author, A. A. (2026). Article title. Journal Name, 1(1), 1–10.",
  });

  J.addCardSlide(pres, {
    eyebrow: "Method",
    title: "カードスライド",
    cards: [
      { header: "見出し1", text: "説明を短く記載" },
      { header: "見出し2", text: "説明を短く記載" },
      { header: "見出し3", text: "説明を短く記載" },
    ],
  });

  J.addProcessSlide(pres, {
    eyebrow: "Flow",
    title: "プロセススライド",
    steps: [
      { header: "段階1", text: "説明を短く" },
      { header: "段階2", text: "説明を短く" },
      { header: "段階3", text: "説明を短く" },
      { header: "段階4", text: "説明を短く" },
    ],
  });

  J.addChartStatSlide(pres, {
    eyebrow: "Result",
    title: "グラフと数値のスライド",
    chart: { labels: ["項目A", "項目B", "項目C", "項目D"], values: [10, 20, 30, 40], seriesName: "ダミー値" },
    stat: { value: "00%", label: "数値の説明" },
    source: ["Author, A. A. (2026). Article title. Journal Name, 1(1), 1–10.", "Author, B. B. (2025). Article title. Journal Name, 2(3), 11–20."],
  });

  J.addTableSlide(pres, {
    eyebrow: "Comparison",
    title: "表のスライド",
    header: ["比較項目", "案A", "案B"],
    rows: [
      ["項目1", "内容", "内容"],
      ["項目2", "内容", "内容"],
      ["項目3", "内容", "内容"],
    ],
  });

  J.addStatementSlide(pres, {
    eyebrow: "Key Message",
    message: "伝えたいメッセージを大きく示す",
    body: "補足の説明文をここに記載する。",
  });

  J.addSummarySlide(pres, { items: ["要点1を記載する", "要点2を記載する", "要点3を記載する"] });

  J.addClosingSlide(pres);

  const out = path.join(__dirname, "..", "dist", "JCHRES_layout_catalog.pptx");
  await J.writeDeck(pres, out);
  console.log("wrote", out);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
