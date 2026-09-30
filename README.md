# JCHRES Slide Template

一般社団法人ヘルスケア研究・教育支援機構（JCHRES）の PowerPoint を PptxGenJS で作るための、法人テンプレートとレイアウト関数です。法人紹介・営業資料、セミナー・研修、学術発表・報告に使います。

配色・ロゴ・モチーフは法人サイト（https://jchres.jp）から採っています。

## デザインの要点

| 要素 | 内容 |
|---|---|
| メインカラー | `#17408C`（サイトの見出し・ボタン色） |
| 濃色 | `#113069`（表紙パネル、章扉、まとめ、締め） |
| アクセント | `#2493CF`（ロゴの棒グラフの水色。番号・記号に使用） |
| 中間色 | `#1868A0`（英字の小見出し、強調数値） |
| 補助 | `#303048`（ロゴ文字色）、`#F7F7F7`（サイトの淡背景）、`#EDF3FA`（ボックス背景） |
| 本文 | `#000000`、24pt 以上 |
| フォント | Meiryo UI（`newDeck({ font: "Noto Sans JP" })` でサイトと同じ書体に変更可） |
| モチーフ | ロゴの「右肩上がりの棒グラフと折れ線」。表紙・章扉・メッセージ・締めに配置し、本文スライドでは見出し左の小さな棒グラフ記号に留める |
| 見出し | サイトに倣い、英字の小見出し（`eyebrow`、例: MISSION）と日本語タイトルを組み合わせる |

## ファイル構成

```
jchres_theme.js          テンプレート本体（レイアウト関数）
assets/                  ロゴ（カラー、白抜き、サブタイトルなし、マークのみ）
examples/company_profile.js  法人紹介資料の見本（サイト掲載情報のみ使用）
examples/layout_catalog.js   全レイアウトの見本（文言はダミー）
dist/*.pptx              上記見本の出力。PowerPoint で手作業の雛形としても使える
AGENTS.md                AI に作成させるときの指示
```

## セットアップ

```bash
npm install
npm run example   # dist/ に見本の .pptx を出力
```

Node.js 18 以上、PptxGenJS 4.0.1、JSZip 3.10.1 を使います。

## 使い方

```js
const J = require("./jchres_theme");

async function main() {
  const pres = J.newDeck({ author: "作成者名" });

  J.addTitleSlide(pres, {
    eyebrow: "Seminar",
    title: "セミナータイトル",
    subtitle: "副題",
    presenter: "発表者名",
    affiliation: "JCHRES",
    date: "2026年10月1日",
  });

  J.addBulletSlide(pres, {
    eyebrow: "Background",
    title: "研究の背景",
    bullets: ["1項目1行、全角25字程度まで", "収まらない場合は文章を短くする"],
    point: { label: "Point", text: "最も伝えたい内容" },
    source: "Author, A. A. (2026). Article title. Journal Name, 1(1), 1–10.",
  });

  J.addClosingSlide(pres);
  await J.writeDeck(pres, "presentation.pptx");
}

main();
```

## レイアウト一覧

| 関数 | 用途 | 主な引数 |
|---|---|---|
| `addTitleSlide` | 表紙 | `title, subtitle, eyebrow, presenter, affiliation, date` |
| `addSectionSlide` | 章扉（濃色） | `number, eyebrow, title, note` |
| `addStatementSlide` | ミッション・主張を大きく示す | `eyebrow, message, body` |
| `addAgendaSlide` | 目次。`current` で現在の章を強調 | `items, current` |
| `addBulletSlide` | 箇条書き＋ポイント枠 | `bullets, point, source` |
| `addCardSlide` | 2〜3枚のカード | `cards: [{header, text}]` |
| `addGridSlide` | 事業・サービスの一覧（最大8件） | `items` |
| `addProcessSlide` | 段階・流れ（3〜5段階） | `steps: [{header, text}]` |
| `addTableSlide` | 表（文字は18〜24pt） | `header, rows, colW, fontSize` |
| `addChartStatSlide` | 棒・折れ線グラフ＋数値 | `chart, stat, source` |
| `addPeopleSlide` | メンバー紹介（2〜4名） | `people: [{role, name, degree, fields}]` |
| `addSummarySlide` | まとめ（濃色） | `items` |
| `addClosingSlide` | 締め・連絡先（濃色） | `message, lines`（省略時はサイトのミッションと連絡先） |

本文スライドには共通で `eyebrow`（英字小見出し）、`title`、`source`、`notes`（発表者ノート）を渡せます。

生成したファイルには2種類のスライドマスター（`JCHRES_CONTENT`、`JCHRES_DARK`）が入っています。PowerPoint の「新しいスライド」からこのレイアウトを選べば、手作業で追加したスライドにもロゴ・ページ番号・見出し記号が付きます。

## 執筆ルール

`checkText` が一部を自動で検出し、違反があれば警告を出します。

1. 「／」（全角スラッシュ）は使わない。列挙は「、」または「・」
2. 手動改行（`\n`）は使わない。例外はタイトルと、タイル一覧の長い名称（意味の切れ目で1回まで）
3. 丸数字（①②③…）は使わない
4. 箇条書きは1項目1行（全角25字程度まで）。収まらない場合は文章を短くする
5. 出典は本文中に APA の著者年表記を入れ、完全な書誌情報を `source` に渡す（複数は配列）
6. 「続き：」のような分割表現は使わない
7. 所属表記は JCHRES のみとする
8. 保存は `pres.writeFile` ではなく `writeDeck` を使う（出典のぶら下げインデントと箇条書き記号の色を後処理で確定させるため）
9. 生成後は PDF に変換し、全ページを画像で確認する（はみ出し、出典との重なり、不自然な折返し）

## ロゴの扱い

- `assets/` のロゴは法人サイト掲載の画像から余白を除き、背景を透過したものです。原本データを入手した場合は同じファイル名で差し替えてください（縦横比が変わる場合は `jchres_theme.js` の `LOGO` の比率も更新します）。
- 濃色背景には白抜き（`*_white.png`）、白背景にはカラー版を使います。
- ロゴの変形、再配色、影や枠の追加はしません。

## ライセンス

ロゴと法人名は JCHRES に帰属します。リポジトリは非公開（Private）での管理を想定しています。
