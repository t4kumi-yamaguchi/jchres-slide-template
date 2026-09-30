/**
 * jchres_theme.js
 * 一般社団法人ヘルスケア研究・教育支援機構（JCHRES）スライドテンプレート（PptxGenJS）
 *
 * AIへの指示例:
 *   「jchres_theme.js を使い、README の執筆ルールを守って以下の内容でスライドを作成して。
 *     保存は writeDeck を使うこと」
 *
 * const J = require("./jchres_theme");
 * const pres = J.newDeck({ author: "山口 拓允" });
 * J.addTitleSlide(pres, { title: "...", presenter: "...", date: "..." });
 * J.addBulletSlide(pres, { eyebrow: "BACKGROUND", title: "...", bullets: [...] });
 * await J.writeDeck(pres, "out.pptx");
 *
 * ブランド要素（https://jchres.jp のサイトとロゴから採取）:
 *  - メインカラー #17408C（サイトの見出し・ボタン色）、濃色 #113069
 *  - アクセント #2493CF（ロゴの棒グラフの水色）、中間色 #1868A0
 *  - ロゴ文字色 #303048（"RES" 部分）、サイトの淡背景 #F7F7F7
 *  - モチーフ: ロゴの「右肩上がりの棒グラフ＋折れ線」。サイトの見出しに倣い
 *    英字の小見出し（MISSION など）と日本語タイトルを組み合わせる
 *
 * 設計方針:
 *  - 16:9 WIDE（13.33 x 7.5 in）
 *  - フォントは Meiryo UI（newDeck の font で変更可。サイトは Noto Sans JP）
 *  - 本文は 24pt 以上・黒（#000000）。四角囲み内も 24pt
 *  - 装飾は、見出し左の小さな棒グラフ記号と、表紙・扉の棒グラフモチーフに限る
 *
 * 執筆・運用ルール（checkText が機械的に検出するものを含む）:
 *  1. 「／」（全角スラッシュ）は使わない。列挙は「、」または「・」
 *  2. 手動改行（\n）は使わない（タイトルとタイル一覧の名称のみ許容）。改行後の行頭に禁則文字を置かない
 *  3. 丸数字（①②③…）は使わない。番号は各レイアウトの番号表示か (1), 1. を使う
 *  4. 箇条書きは1項目1行（全角25字程度まで）。収まらない場合は文章を短くする
 *  5. 出典は本文中に APA の著者年表記を入れ、完全な書誌情報を o.source に渡す
 *     （複数は配列。14pt、ぶら下げ約1cm、余白が足りない場合のみ 10pt まで縮小）
 *  6. 「続き：」のような分割表現は使わない
 *  7. 所属表記は JCHRES のみとする（大学等の所属は原則記載しない）
 *  8. 保存は必ず writeDeck(pres, ファイル名) を使う
 *  9. 生成後は PDF に変換して全ページを画像で目視確認する
 *     （はみ出し、出典との重なり、不自然な折返し）
 */

const path = require("path");

const FONT_DEFAULT = "Meiryo UI";
const LANG = "ja-JP";
const W = 13.33;
const H = 7.5;
const MARGIN = 0.7;
const LINE = 1.25;
const BULLET_INDENT = 28;
const BODY_TOP = 1.85;      // 本文領域の上端
const BODY_BOTTOM = 6.72;   // 本文領域の下端（フッターの上）
const ASSET_DIR = path.join(__dirname, "assets");

const COLORS = {
  navy: "17408C",     // メイン（見出し・図形）
  deep: "113069",     // 濃色背景（表紙パネル・扉・まとめ）
  steel: "1868A0",    // 中間色（英字小見出し・強調数値）
  sky: "2493CF",      // アクセント（モチーフ・番号）
  ink: "303048",      // ロゴ文字色（補助テキスト）
  text: "000000",     // 本文（必ず黒）
  sub: "5A5F6E",      // キャプション・出典・ページ番号
  tint: "EDF3FA",     // 薄色ボックス背景
  paper: "F7F7F7",    // サイトの淡背景（メッセージスライド）
  line: "D5DEEA",     // 罫線
  onDark: "D6E2F3",   // 濃色背景上の補助テキスト
  chart: ["17408C", "2493CF", "8DB9E3", "303048", "B7C2D0"],
};

const LOGO = {
  full: { file: "jchres_logo.png", ratio: 870 / 311 },
  fullWhite: { file: "jchres_logo_white.png", ratio: 870 / 311 },
  compact: { file: "jchres_logo_compact.png", ratio: 870 / 305 },
  compactWhite: { file: "jchres_logo_compact_white.png", ratio: 870 / 305 },
  mark: { file: "jchres_mark.png", ratio: 254 / 305 },
  markWhite: { file: "jchres_mark_white.png", ratio: 254 / 305 },
};

/* ---------- テキスト検査 ---------- */

const RE_ZEN_SLASH = /／/;
const RE_CIRCLED = /[①-⑳⓫-⓿㉑-㊿]/;
const RE_HEAD_PUNCT = /\n[、。）」』〕】｝〉》・,.)!?！？]/;

function textWidth(s) {
  let n = 0;
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    n += (c >= 0x20 && c <= 0x7e) || (ch >= "｡" && ch <= "ﾟ") ? 0.5 : 1;
  }
  return n;
}

function checkText(s, where, maxZen) {
  if (typeof s !== "string") return s;
  const warn = (m) => console.warn(`[jchres_theme] ${m}: ${where}: "${s}"`);
  if (RE_ZEN_SLASH.test(s)) warn("ルール違反(「／」使用禁止)");
  if (RE_CIRCLED.test(s)) warn("ルール違反(丸数字は使用禁止)");
  if (RE_HEAD_PUNCT.test(s)) warn("ルール違反(改行後の行頭に禁則文字)");
  if (maxZen && textWidth(s) > maxZen) warn(`長さ注意(全角${maxZen}字相当を超過。文章を短くする)`);
  return s;
}

/* ---------- 基本 ---------- */

const fontOf = (pres) => pres._jchres.font;
const img = (key) => path.join(ASSET_DIR, LOGO[key].file);

function logoBox(key, h) {
  return { w: h * LOGO[key].ratio, h };
}

/** 見出し左の棒グラフ記号（ロゴモチーフの縮小形） */
function glyphObjects(x, baseY) {
  const bw = 0.07, gap = 0.05;
  const hs = [0.13, 0.2, 0.28];
  const cs = [COLORS.sky, COLORS.steel, COLORS.navy];
  return hs.map((h, i) => ({
    rect: { x: x + i * (bw + gap), y: baseY - h, w: bw, h, fill: { color: cs[i] }, line: { type: "none" } },
  }));
}

function newDeck(meta = {}) {
  const pptxgen = require("pptxgenjs");
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = meta.author || "";
  pres.title = "";
  pres.subject = "";
  pres.company = "";
  const font = meta.font || FONT_DEFAULT;
  pres.theme = { headFontFace: font, bodyFontFace: font };
  pres._jchres = { font };

  const lg = logoBox("compact", 0.3);
  // 通常スライド用マスター（PowerPoint で「新しいスライド」から手作業でも使える）
  pres.defineSlideMaster({
    title: "JCHRES_CONTENT",
    background: { color: "FFFFFF" },
    objects: [
      ...glyphObjects(MARGIN, 0.78),
      { image: { x: W - MARGIN - lg.w, y: H - 0.5, w: lg.w, h: lg.h, path: img("compact") } },
      {
        placeholder: {
          options: {
            name: "title", type: "title", x: MARGIN, y: 0.84, w: W - MARGIN * 2, h: 0.8,
            fontFace: font, fontSize: 30, bold: true, color: COLORS.navy,
            align: "left", valign: "middle", margin: 0,
          },
          text: "",
        },
      },
      {
        placeholder: {
          options: {
            name: "body", type: "body", x: MARGIN, y: BODY_TOP, w: W - MARGIN * 2, h: BODY_BOTTOM - BODY_TOP,
            fontFace: font, fontSize: 24, color: COLORS.text, valign: "top",
          },
          text: "",
        },
      },
    ],
    slideNumber: { x: MARGIN, y: H - 0.5, w: 0.8, h: 0.3, fontFace: font, fontSize: 12, color: COLORS.sub, margin: 0 },
  });
  // 濃色スライド用マスター
  pres.defineSlideMaster({
    title: "JCHRES_DARK",
    background: { color: COLORS.deep },
    objects: [],
  });
  return pres;
}

/** 表紙・扉用の棒グラフ＋折れ線モチーフ（ロゴの意匠を抽象化） */
function barMotif(s, o) {
  const { x, base, bw, gap, heights, barColors, lineColor, transparency = 0, dots = true } = o;
  const tops = heights.map((h, i) => ({ cx: x + i * (bw + gap) + bw / 2, ty: base - h }));
  heights.forEach((h, i) => {
    s.addShape("rect", {
      x: x + i * (bw + gap), y: base - h, w: bw, h,
      fill: { color: barColors[i % barColors.length], transparency }, line: { type: "none" },
    });
  });
  if (!dots) return;
  // 折れ線は棒の上端より少し下を通り、2本目で一度下がる（ロゴと同じ流れ）
  const offs = [0.45, 0.25, 0.75, 0.2];
  const pts = tops.map((t, i) => ({ x: t.cx, y: t.ty + (offs[i % offs.length] || 0.3) }));
  pts.push({ x: pts[pts.length - 1].x + bw * 0.9, y: tops[tops.length - 1].ty - 0.45 });
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    s.addShape("line", {
      x: a.x, y: Math.min(a.y, b.y), w: b.x - a.x, h: Math.max(Math.abs(b.y - a.y), 0.001),
      flipV: b.y < a.y,
      line: { color: lineColor, width: 3 },
    });
  }
  const d = 0.22;
  pts.forEach((p) => {
    s.addShape("ellipse", {
      x: p.x - d / 2, y: p.y - d / 2, w: d, h: d,
      fill: { color: lineColor }, line: { type: "none" },
    });
  });
}

/** 出典の行数概算（フォントサイズ調整のみに使用） */
function estimateLines(text, widthIn, fontSize) {
  const em = fontSize / 72;
  return Math.max(1, Math.ceil((textWidth(text) * em) / (widthIn * 0.95)));
}

/** 出典の配置計算。{entries, fs, top, h} を返す（source が無ければ null） */
function layoutSource(source) {
  if (!source) return null;
  const entries = (Array.isArray(source) ? source : [source]).map((t, i) => checkText(t, `source[${i}]`));
  const maxH = 1.05;
  const width = W - MARGIN * 2;
  const lineH = (size) => (size / 72) * 1.22;
  let fs = 14, boxH;
  for (;;) {
    const lines = entries.reduce((a, t) => a + estimateLines(t, width, fs), 0);
    boxH = lines * lineH(fs) + (entries.length - 1) * (6 / 72);
    if (boxH <= maxH || fs <= 10) break;
    fs -= 1;
  }
  const h = Math.min(boxH, maxH);
  return { entries, fs, h, top: BODY_BOTTOM + 0.12 - h };
}

function drawSource(s, pres, src) {
  if (!src) return;
  s.addText(
    src.entries.map((t) => ({
      text: t,
      options: { breakLine: true, bullet: { code: "0020", indent: BULLET_INDENT }, paraSpaceAfter: 6 },
    })),
    {
      x: MARGIN, y: src.top, w: W - MARGIN * 2, h: src.h,
      fontFace: fontOf(pres), fontSize: src.fs, color: COLORS.sub, lang: LANG,
      align: "left", valign: "bottom", margin: 0,
    }
  );
}

/** 本文スライドの共通部（マスター・英字小見出し・タイトル・出典）。本文の下端を返す */
function contentBase(pres, o) {
  const s = pres.addSlide({ masterName: "JCHRES_CONTENT" });
  const font = fontOf(pres);
  if (o.eyebrow) {
    s.addText(checkText(String(o.eyebrow).toUpperCase(), "eyebrow"), {
      x: MARGIN + 0.42, y: 0.46, w: 8, h: 0.34,
      fontFace: font, fontSize: 14, bold: true, color: COLORS.steel, charSpacing: 2,
      lang: LANG, align: "left", valign: "bottom", margin: 0,
    });
  }
  s.addText(checkText(o.title, "title"), {
    placeholder: "title",
    fontFace: font, fontSize: 30, bold: true, color: COLORS.navy, lang: LANG,
  });
  const src = layoutSource(o.source);
  drawSource(s, pres, src);
  const bottom = src ? src.top - 0.2 : BODY_BOTTOM;
  if (o.notes) s.addNotes(o.notes);
  return { s, font, bottom };
}

/* ---------- レイアウト ---------- */

/** 1. 表紙  {title, subtitle?, eyebrow?, presenter?, affiliation?, date?} */
function addTitleSlide(pres, o) {
  const s = pres.addSlide();
  const font = fontOf(pres);
  s.background = { color: "FFFFFF" };
  const panelX = W - 4.35;
  s.addShape("rect", { x: panelX, y: 0, w: W - panelX, h: H, fill: { color: COLORS.deep }, line: { type: "none" } });
  barMotif(s, {
    x: panelX + 0.75, base: H - 0.9, bw: 0.52, gap: 0.26,
    heights: [1.5, 2.3, 3.2, 2.8],
    barColors: [COLORS.sky, COLORS.steel, COLORS.sky, COLORS.navy],
    lineColor: "FFFFFF",
  });
  const lg = logoBox("full", 0.72);
  s.addImage({ path: img("full"), x: MARGIN, y: 0.6, w: lg.w, h: lg.h });
  const tw = panelX - MARGIN - 0.6;
  if (o.eyebrow) {
    s.addText(checkText(String(o.eyebrow).toUpperCase(), "eyebrow"), {
      x: MARGIN, y: 2.05, w: tw, h: 0.4,
      fontFace: font, fontSize: 16, bold: true, color: COLORS.steel, charSpacing: 2, lang: LANG, margin: 0,
    });
  }
  s.addText(checkText(o.title, "title"), {
    x: MARGIN, y: 2.5, w: tw, h: 1.9,
    fontFace: font, fontSize: 38, bold: true, color: COLORS.navy, lang: LANG,
    align: "left", valign: "middle", margin: 0, lineSpacingMultiple: 1.1,
  });
  if (o.subtitle) {
    s.addText(checkText(o.subtitle, "subtitle"), {
      x: MARGIN, y: 4.5, w: tw, h: 0.9,
      fontFace: font, fontSize: 22, color: COLORS.ink, lang: LANG, valign: "top", margin: 0,
    });
  }
  const meta = [o.presenter, o.affiliation].filter(Boolean).join("　");
  if (meta) {
    s.addText(checkText(meta, "presenter"), {
      x: MARGIN, y: H - 1.45, w: tw, h: 0.45,
      fontFace: font, fontSize: 20, bold: true, color: COLORS.text, lang: LANG, valign: "middle", margin: 0,
    });
  }
  if (o.date) {
    s.addText(o.date, {
      x: MARGIN, y: H - 0.98, w: tw, h: 0.4,
      fontFace: font, fontSize: 16, color: COLORS.sub, lang: LANG, valign: "middle", margin: 0,
    });
  }
  if (o.notes) s.addNotes(o.notes);
  return s;
}

/** 2. 章扉  {number?, eyebrow?, title, note?} */
function addSectionSlide(pres, o) {
  const s = pres.addSlide({ masterName: "JCHRES_DARK" });
  const font = fontOf(pres);
  barMotif(s, {
    x: W - 4.2, base: H, bw: 0.62, gap: 0.3,
    heights: [2.0, 3.0, 4.2, 3.7],
    barColors: ["1C4A8E", "1A548F", "1C4A8E", "173F7F"],
    lineColor: "2E5C9E", dots: true,
  });
  if (o.number != null) {
    s.addText(String(o.number).padStart(2, "0"), {
      x: MARGIN, y: 1.6, w: 3, h: 1.5,
      fontFace: font, fontSize: 80, bold: true, color: COLORS.sky, lang: LANG, valign: "bottom", margin: 0,
    });
  }
  s.addText(checkText(String(o.eyebrow || "SECTION").toUpperCase(), "eyebrow"), {
    x: MARGIN, y: 3.25, w: 8, h: 0.4,
    fontFace: font, fontSize: 16, bold: true, color: COLORS.onDark, charSpacing: 2, lang: LANG, margin: 0,
  });
  s.addText(checkText(o.title, "section title"), {
    x: MARGIN, y: 3.7, w: 8.3, h: 1.4,
    fontFace: font, fontSize: 36, bold: true, color: "FFFFFF", lang: LANG, valign: "top", margin: 0,
  });
  if (o.note) {
    s.addText(checkText(o.note, "section note"), {
      x: MARGIN, y: 5.15, w: 8.3, h: 0.8,
      fontFace: font, fontSize: 20, color: COLORS.onDark, lang: LANG, valign: "top", margin: 0,
    });
  }
  const lg = logoBox("compactWhite", 0.34);
  s.addImage({ path: img("compactWhite"), x: MARGIN, y: H - 0.75, w: lg.w, h: lg.h });
  if (o.notes) s.addNotes(o.notes);
  return s;
}

/** 3. メッセージ（ミッション・主張を大きく示す）  {eyebrow?, message, body?} */
function addStatementSlide(pres, o) {
  const s = pres.addSlide();
  const font = fontOf(pres);
  s.background = { color: COLORS.paper };
  barMotif(s, {
    x: W - 3.3, base: H, bw: 0.45, gap: 0.2,
    heights: [1.2, 1.8, 2.6, 2.2],
    barColors: ["E1EAF5", "D7E3F1", "E1EAF5", "CFDDEE"],
    lineColor: "C4D5EA",
  });
  s.addShape("rect", { x: 0, y: 0, w: 0.18, h: H, fill: { color: COLORS.navy }, line: { type: "none" } });
  if (o.eyebrow) {
    s.addText(checkText(String(o.eyebrow).toUpperCase(), "eyebrow"), {
      x: MARGIN + 0.3, y: 1.35, w: 9, h: 0.4,
      fontFace: font, fontSize: 16, bold: true, color: COLORS.steel, charSpacing: 2, lang: LANG, margin: 0,
    });
  }
  s.addText(checkText(o.message, "message"), {
    x: MARGIN + 0.3, y: 1.85, w: 10.2, h: 1.9,
    fontFace: font, fontSize: 40, bold: true, color: COLORS.navy, lang: LANG,
    valign: "middle", margin: 0, lineSpacingMultiple: 1.1,
  });
  if (o.body) {
    s.addText(checkText(o.body, "statement body"), {
      x: MARGIN + 0.3, y: 4.0, w: 9.6, h: 2.3,
      fontFace: font, fontSize: 24, color: COLORS.text, lang: LANG,
      valign: "top", lineSpacingMultiple: LINE, margin: 0,
    });
  }
  const lg = logoBox("compact", 0.3);
  s.addImage({ path: img("compact"), x: W - MARGIN - lg.w, y: H - 0.5, w: lg.w, h: lg.h });
  if (o.notes) s.addNotes(o.notes);
  return s;
}

/** 4. 目次（セミナー・講義向け）  {eyebrow?, title?, items: string[], current?: 1始まり} */
function addAgendaSlide(pres, o) {
  const { s, font, bottom } = contentBase(pres, { eyebrow: "AGENDA", title: "本日の内容", ...o });
  const n = o.items.length;
  const top = BODY_TOP + 0.15;
  const step = Math.min(0.95, (bottom - top) / n);
  const d = 0.5;
  const cx = MARGIN + 0.1 + d / 2;
  if (n > 1) {
    s.addShape("line", {
      x: cx, y: top + d / 2, w: 0, h: step * (n - 1),
      line: { color: COLORS.line, width: 3 },
    });
  }
  o.items.forEach((t, i) => {
    const y = top + i * step;
    const active = !o.current || o.current === i + 1;
    s.addShape("ellipse", {
      x: cx - d / 2, y, w: d, h: d,
      fill: { color: active ? COLORS.navy : "B7C2D0" }, line: { color: "FFFFFF", width: 2 },
    });
    s.addText(String(i + 1), {
      x: cx - d / 2, y, w: d, h: d,
      fontFace: font, fontSize: 16, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0,
    });
    s.addText(checkText(t, `agenda[${i}]`, 30), {
      x: cx + 0.55, y: y - 0.1, w: W - MARGIN - cx - 0.55, h: d + 0.2,
      fontFace: font, fontSize: 24, bold: o.current === i + 1,
      color: active ? COLORS.text : "8A93A3", lang: LANG, valign: "middle", margin: 0,
    });
  });
  return s;
}

/** 5. 箇条書き（＋ポイント枠）  {eyebrow?, title, bullets, point?: {label, text}, source?} */
function addBulletSlide(pres, o) {
  const { s, font, bottom } = contentBase(pres, o);
  const hasPoint = !!o.point;
  const colW = hasPoint ? 7.3 : W - MARGIN * 2;
  s.addText(
    o.bullets.map((b, i) => ({
      text: checkText(b, `bullet[${i}]`, 25),
      options: {
        bullet: { code: "25A0", indent: BULLET_INDENT },
        breakLine: i < o.bullets.length - 1,
        paraSpaceAfter: 14,
      },
    })),
    {
      x: MARGIN, y: BODY_TOP, w: colW, h: bottom - BODY_TOP,
      fontFace: font, fontSize: 24, color: COLORS.text, lang: LANG,
      align: "left", valign: "top", lineSpacingMultiple: LINE,
    }
  );
  if (hasPoint) {
    const px = MARGIN + colW + 0.4;
    const pw = W - MARGIN - px;
    const ph = Math.min(4.5, bottom - BODY_TOP - 0.1);
    s.addShape("roundRect", {
      x: px, y: BODY_TOP + 0.05, w: pw, h: ph, rectRadius: 0.1,
      fill: { color: COLORS.tint }, line: { type: "none" },
    });
    s.addShape("rect", { x: px, y: BODY_TOP + 0.05, w: 0.1, h: ph, fill: { color: COLORS.sky }, line: { type: "none" } });
    s.addText(checkText(o.point.label || "Point", "point label"), {
      x: px + 0.4, y: BODY_TOP + 0.3, w: pw - 0.7, h: 0.55,
      fontFace: font, fontSize: 24, bold: true, color: COLORS.navy, lang: LANG, margin: 0,
    });
    s.addText(checkText(o.point.text, "point text"), {
      x: px + 0.4, y: BODY_TOP + 0.95, w: pw - 0.7, h: ph - 1.1,
      fontFace: font, fontSize: 24, color: COLORS.text, lang: LANG,
      valign: "top", lineSpacingMultiple: LINE, margin: 0,
    });
  }
  return s;
}

/** 6. カード（2〜3枚）  {eyebrow?, title, cards: [{header, text}], source?} */
function addCardSlide(pres, o) {
  const { s, font, bottom } = contentBase(pres, o);
  const n = o.cards.length;
  const gap = 0.35;
  const cw = (W - MARGIN * 2 - gap * (n - 1)) / n;
  const ch = bottom - BODY_TOP - 0.05;
  o.cards.forEach((c, i) => {
    const x = MARGIN + i * (cw + gap);
    const y = BODY_TOP + 0.05;
    s.addShape("roundRect", {
      x, y, w: cw, h: ch, rectRadius: 0.1, fill: { color: COLORS.tint }, line: { type: "none" },
    });
    s.addText(String(c.num != null ? c.num : i + 1).padStart(2, "0"), {
      x: x + 0.35, y: y + 0.3, w: 1.2, h: 0.5,
      fontFace: font, fontSize: 24, bold: true, color: COLORS.sky, lang: LANG, margin: 0,
    });
    s.addShape("line", {
      x: x + 0.35, y: y + 1.42, w: cw - 0.7, h: 0, line: { color: COLORS.line, width: 1 },
    });
    s.addText(checkText(c.header, `card[${i}] header`, Math.floor((cw - 0.7) / (24 / 72))), {
      x: x + 0.35, y: y + 0.85, w: cw - 0.7, h: 0.5,
      fontFace: font, fontSize: 24, bold: true, color: COLORS.navy, lang: LANG, valign: "top", margin: 0,
    });
    s.addText(checkText(c.text, `card[${i}] text`), {
      x: x + 0.35, y: y + 1.55, w: cw - 0.7, h: ch - 1.75,
      fontFace: font, fontSize: 24, color: COLORS.text, lang: LANG,
      valign: "top", lineSpacingMultiple: LINE, margin: 0,
    });
  });
  return s;
}

/** 7. タイル一覧（事業・サービスの一覧、最大8件）  {eyebrow?, title, items: string[], source?}
 *  4件以下は横並びのタイル、5〜8件は2列のリスト（各行全角14字程度まで）。
 *  長い名称に限り、意味の切れ目で手動改行（\n）を1回まで入れてよい */
function addGridSlide(pres, o) {
  const { s, font, bottom } = contentBase(pres, o);
  const items = o.items.map((t) => (typeof t === "string" ? { title: t } : t));
  const n = items.length;
  const gap = 0.25;
  const avail = bottom - BODY_TOP - 0.05;
  if (n <= 4) {
    const tw = (W - MARGIN * 2 - gap * (n - 1)) / n;
    const th = Math.min(2.6, avail);
    items.forEach((it, i) => {
      const x = MARGIN + i * (tw + gap), y = BODY_TOP + 0.05;
      s.addShape("roundRect", { x, y, w: tw, h: th, rectRadius: 0.08, fill: { color: COLORS.tint }, line: { type: "none" } });
      s.addText(String(i + 1).padStart(2, "0"), {
        x: x + 0.3, y: y + 0.25, w: 1, h: 0.5, fontFace: font, fontSize: 24, bold: true, color: COLORS.sky, margin: 0,
      });
      s.addText(checkText(it.title, `grid[${i}]`), {
        x: x + 0.3, y: y + 0.85, w: tw - 0.6, h: th - 1.0,
        fontFace: font, fontSize: 24, bold: true, color: COLORS.navy, lang: LANG, valign: "top", margin: 0,
      });
    });
    return s;
  }
  const cols = 2, rows = Math.ceil(n / 2);
  const tw = (W - MARGIN * 2 - gap) / cols;
  const th = Math.min(1.05, (avail - gap * (rows - 1)) / rows);
  items.forEach((it, i) => {
    const c = Math.floor(i / rows), r = i % rows;   // 縦方向に番号を振る
    const x = MARGIN + c * (tw + gap), y = BODY_TOP + 0.05 + r * (th + gap);
    s.addShape("roundRect", { x, y, w: tw, h: th, rectRadius: 0.08, fill: { color: COLORS.tint }, line: { type: "none" } });
    s.addText(String(i + 1).padStart(2, "0"), {
      x: x + 0.3, y, w: 0.8, h: th, fontFace: font, fontSize: 24, bold: true, color: COLORS.sky, valign: "middle", margin: 0,
    });
    it.title.split("\n").forEach((ln) => checkText(ln, `grid[${i}]`, 14));
    s.addText(checkText(it.title, `grid[${i}]`), {
      x: x + 1.15, y, w: tw - 1.35, h: th,
      fontFace: font, fontSize: 24, bold: true, color: COLORS.navy, lang: LANG, valign: "middle", margin: 0,
    });
  });
  return s;
}

/** 8. プロセス（段階・流れ、3〜5段階）  {eyebrow?, title, steps: [{header, text?}], source?} */
function addProcessSlide(pres, o) {
  const { s, font, bottom } = contentBase(pres, o);
  const n = o.steps.length;
  const sw = (W - MARGIN * 2) / n;
  const d = 0.62;
  const hasText = o.steps.some((st) => st.text);
  const blockH = hasText ? 3.4 : 1.9;
  const lineY = BODY_TOP + Math.max(0.5, (bottom - BODY_TOP - blockH) / 2) + d / 2;
  s.addShape("line", {
    x: MARGIN + sw / 2, y: lineY, w: sw * (n - 1), h: 0,
    line: { color: COLORS.line, width: 4 },
  });
  o.steps.forEach((st, i) => {
    const cx = MARGIN + sw * i + sw / 2;
    const last = i === n - 1;
    s.addShape("ellipse", {
      x: cx - d / 2, y: lineY - d / 2, w: d, h: d,
      fill: { color: last ? COLORS.sky : COLORS.navy }, line: { color: "FFFFFF", width: 3 },
    });
    s.addText(String(i + 1), {
      x: cx - d / 2, y: lineY - d / 2, w: d, h: d,
      fontFace: font, fontSize: 20, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0,
    });
    s.addText(checkText(st.header, `step[${i}] header`), {
      x: cx - sw / 2 + 0.12, y: lineY + 0.55, w: sw - 0.24, h: 1.0,
      fontFace: font, fontSize: 24, bold: true, color: COLORS.navy, lang: LANG,
      align: "center", valign: "top", margin: 0,
    });
    if (st.text) {
      s.addText(checkText(st.text, `step[${i}] text`), {
        x: cx - sw / 2 + 0.12, y: lineY + 1.45, w: sw - 0.24, h: Math.min(1.9, bottom - lineY - 1.45),
        fontFace: font, fontSize: 24, color: COLORS.text, lang: LANG,
        align: "center", valign: "top", lineSpacingMultiple: LINE, margin: 0,
      });
    }
  });
  return s;
}

/** 9. 表  {eyebrow?, title, header: string[], rows: string[][], colW?: number[], fontSize?: 18〜24, source?} */
function addTableSlide(pres, o) {
  const { s, font, bottom } = contentBase(pres, o);
  let fs = o.fontSize || 24;
  if (fs < 18) {
    console.warn("[jchres_theme] 表の文字は 18pt 未満にしない。18pt に補正");
    fs = 18;
  }
  const tw = W - MARGIN * 2;
  const cell = (t, extra) => ({ text: checkText(String(t), "table cell"), options: { ...extra } });
  const rows = [
    o.header.map((t) => cell(t, { bold: true, color: "FFFFFF", fill: { color: COLORS.navy } })),
    ...o.rows.map((r, ri) => r.map((t) => cell(t, { color: COLORS.text, fill: { color: ri % 2 ? COLORS.paper : "FFFFFF" } }))),
  ];
  s.addTable(rows, {
    x: MARGIN, y: BODY_TOP + 0.05, w: tw,
    colW: o.colW || o.header.map(() => tw / o.header.length),
    fontFace: font, fontSize: fs, lang: LANG, valign: "middle",
    border: { type: "solid", pt: 0.75, color: COLORS.line },
    margin: [0.06, 0.12, 0.06, 0.12],
    autoPage: false,
  });
  return s;
}

/** 10. グラフ＋数値  {eyebrow?, title, chart: {labels, values, seriesName?, type?: "bar"|"line"}, stat: {value, label}, source?} */
function addChartStatSlide(pres, o) {
  const { s, font, bottom } = contentBase(pres, o);
  const type = o.chart.type === "line" ? "line" : "bar";
  s.addChart(type, [{ name: o.chart.seriesName || "系列1", labels: o.chart.labels, values: o.chart.values }], {
    x: MARGIN, y: BODY_TOP, w: 7.7, h: bottom - BODY_TOP,
    barDir: "col", barGapWidthPct: 60,
    chartColors: [COLORS.navy], lineSize: 3, lineDataSymbol: "circle", lineDataSymbolSize: 9,
    showLegend: false, showTitle: false,
    showValue: true, dataLabelPosition: type === "bar" ? "outEnd" : "t",
    dataLabelColor: COLORS.text, dataLabelFontFace: font, dataLabelFontSize: 16,
    catAxisLabelColor: COLORS.sub, catAxisLabelFontFace: font, catAxisLabelFontSize: 16,
    valAxisLabelColor: COLORS.sub, valAxisLabelFontFace: font, valAxisLabelFontSize: 14,
    catGridLine: { style: "none" }, valGridLine: { color: "E3E8EF", size: 0.5 },
    catAxisLineColor: "B7C2D0",
  });
  const px = MARGIN + 8.1;
  const pw = W - MARGIN - px;
  const py = BODY_TOP + 0.35;
  const ph = Math.min(3.6, bottom - py - 0.2);
  s.addShape("roundRect", {
    x: px, y: py, w: pw, h: ph, rectRadius: 0.1, fill: { color: COLORS.tint }, line: { type: "none" },
  });
  s.addText(o.stat.value, {
    x: px + 0.25, y: py + 0.35, w: pw - 0.5, h: 1.4,
    fontFace: font, fontSize: 60, bold: true, color: COLORS.steel, lang: LANG,
    align: "center", valign: "middle", margin: 0,
  });
  s.addText(checkText(o.stat.label, "stat label"), {
    x: px + 0.25, y: py + 1.85, w: pw - 0.5, h: ph - 2.0,
    fontFace: font, fontSize: 24, color: COLORS.text, lang: LANG,
    align: "center", valign: "top", lineSpacingMultiple: LINE, margin: 0,
  });
  return s;
}

/** 11. メンバー紹介（2〜4名、2列）
 *  {eyebrow?, title, people: [{role, name, degree?, fields?: string[]}]}
 *  所属は JCHRES の役職のみを記載する */
function addPeopleSlide(pres, o) {
  const { s, font, bottom } = contentBase(pres, { eyebrow: "MEMBER", ...o });
  const n = o.people.length;
  const cols = 2, rows = Math.ceil(n / 2);
  const gap = 0.3;
  const cw = (W - MARGIN * 2 - gap) / cols;
  const ch = Math.min(2.3, (bottom - BODY_TOP - 0.05 - gap * (rows - 1)) / rows);
  o.people.forEach((p, i) => {
    const x = MARGIN + (i % cols) * (cw + gap);
    const y = BODY_TOP + 0.05 + Math.floor(i / cols) * (ch + gap);
    s.addShape("roundRect", { x, y, w: cw, h: ch, rectRadius: 0.08, fill: { color: COLORS.tint }, line: { type: "none" } });
    s.addShape("rect", { x, y, w: 0.1, h: ch, fill: { color: COLORS.navy }, line: { type: "none" } });
    s.addText(checkText(p.role || "", `people[${i}] role`), {
      x: x + 0.4, y: y + 0.2, w: cw - 0.6, h: 0.35,
      fontFace: font, fontSize: 16, bold: true, color: COLORS.steel, lang: LANG, valign: "middle", margin: 0,
    });
    s.addText([
      { text: checkText(p.name, `people[${i}] name`), options: { fontSize: 28, bold: true, color: COLORS.text } },
      ...(p.degree ? [{ text: "　" + checkText(p.degree, `people[${i}] degree`), options: { fontSize: 20, color: COLORS.sub } }] : []),
    ], {
      x: x + 0.4, y: y + 0.55, w: cw - 0.6, h: 0.6, fontFace: font, lang: LANG, valign: "middle", margin: 0,
    });
    if (p.fields && p.fields.length) {
      s.addText(checkText(p.fields.join("、"), `people[${i}] fields`), {
        x: x + 0.4, y: y + 1.25, w: cw - 0.6, h: ch - 1.35,
        fontFace: font, fontSize: 24, color: COLORS.text, lang: LANG, valign: "top", lineSpacingMultiple: 1.1, margin: 0,
      });
    }
  });
  return s;
}

/** 12. まとめ（濃色）  {eyebrow?, title?, items: string[]} */
function addSummarySlide(pres, o) {
  const s = pres.addSlide({ masterName: "JCHRES_DARK" });
  const font = fontOf(pres);
  s.addText(checkText(String(o.eyebrow || "SUMMARY").toUpperCase(), "eyebrow"), {
    x: MARGIN, y: 0.55, w: 8, h: 0.4,
    fontFace: font, fontSize: 16, bold: true, color: COLORS.onDark, charSpacing: 2, lang: LANG, margin: 0,
  });
  s.addText(checkText(o.title || "まとめ", "summary title"), {
    x: MARGIN, y: 0.95, w: W - MARGIN * 2, h: 0.85,
    fontFace: font, fontSize: 32, bold: true, color: "FFFFFF", lang: LANG, valign: "middle", margin: 0,
  });
  const step = Math.min(1.35, 4.6 / o.items.length);
  o.items.forEach((t, i) => {
    const y = 2.2 + i * step;
    s.addShape("ellipse", { x: MARGIN, y, w: 0.7, h: 0.7, fill: { color: COLORS.sky }, line: { type: "none" } });
    s.addText(String(i + 1), {
      x: MARGIN, y, w: 0.7, h: 0.7,
      fontFace: font, fontSize: 22, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0,
    });
    s.addText(checkText(t, `summary[${i}]`, 30), {
      x: MARGIN + 1.0, y: y - 0.15, w: W - MARGIN * 2 - 1.0, h: 1.0,
      fontFace: font, fontSize: 24, color: "FFFFFF", lang: LANG,
      valign: "middle", lineSpacingMultiple: LINE, margin: 0,
    });
  });
  const lg = logoBox("compactWhite", 0.34);
  s.addImage({ path: img("compactWhite"), x: W - MARGIN - lg.w, y: H - 0.72, w: lg.w, h: lg.h });
  if (o.notes) s.addNotes(o.notes);
  return s;
}

/** 13. 締め・連絡先（濃色）  {message?, lines?: string[]}
 *  既定値はサイト掲載のミッションと連絡先 */
function addClosingSlide(pres, o = {}) {
  const s = pres.addSlide({ masterName: "JCHRES_DARK" });
  const font = fontOf(pres);
  barMotif(s, {
    x: W - 4.2, base: H, bw: 0.62, gap: 0.3,
    heights: [2.0, 3.0, 4.2, 3.7],
    barColors: ["1C4A8E", "1A548F", "1C4A8E", "173F7F"],
    lineColor: "2E5C9E",
  });
  const lg = logoBox("fullWhite", 1.25);
  s.addImage({ path: img("fullWhite"), x: MARGIN, y: 1.35, w: lg.w, h: lg.h });
  s.addText(checkText(o.message || "エビデンスに、道をつくる。", "closing message"), {
    x: MARGIN, y: 3.05, w: 8.4, h: 0.9,
    fontFace: font, fontSize: 32, bold: true, color: "FFFFFF", lang: LANG, valign: "middle", margin: 0,
  });
  const lines = o.lines || ["一般社団法人ヘルスケア研究・教育支援機構", "info@jchres.jp　https://jchres.jp"];
  s.addText(lines.map((t, i) => ({ text: checkText(t, `closing[${i}]`), options: { breakLine: i < lines.length - 1 } })), {
    x: MARGIN, y: 4.3, w: 8.4, h: 1.6,
    fontFace: font, fontSize: 18, color: COLORS.onDark, lang: LANG, valign: "top",
    lineSpacingMultiple: 1.4, margin: 0,
  });
  if (o.notes) s.addNotes(o.notes);
  return s;
}

/** 保存（出典のぶら下げインデントを確定させる後処理を含む） */
async function writeDeck(pres, fileName) {
  const JSZip = require("jszip");
  const fs = require("fs");
  const buf = await pres.write({ outputType: "nodebuffer" });
  const zip = await JSZip.loadAsync(buf);
  const names = Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n));
  for (const n of names) {
    let xml = await zip.file(n).async("string");
    xml = xml
      .replace(/<a:buSzPct val="100000"\/><a:buChar char="&#x0020;"\/>/g, "<a:buNone/>")
      .replace(/<a:buSzPct val="100000"\/><a:buChar char=" "\/>/g, "<a:buNone/>")
      // 箇条書き記号（■）をアクセント色・やや小さめにする
      .replace(/<a:buSzPct val="100000"\/><a:buChar char="&#x25A0;"\/>/g,
        `<a:buClr><a:srgbClr val="${COLORS.sky}"/></a:buClr><a:buSzPct val="75000"/><a:buChar char="&#x25A0;"/>`);
    zip.file(n, xml);
  }
  const out = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  fs.writeFileSync(fileName, out);
  return fileName;
}

module.exports = {
  COLORS, LOGO, ASSET_DIR, FONT_DEFAULT, LANG, W, H, MARGIN, LINE, BODY_TOP, BODY_BOTTOM,
  newDeck, checkText, writeDeck,
  addTitleSlide, addSectionSlide, addStatementSlide, addAgendaSlide,
  addBulletSlide, addCardSlide, addGridSlide, addProcessSlide,
  addTableSlide, addChartStatSlide, addPeopleSlide, addSummarySlide, addClosingSlide,
};
