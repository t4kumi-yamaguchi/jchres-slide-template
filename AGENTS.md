# AGENTS.md

このリポジトリで JCHRES のスライドを作成する AI への指示です。

- スライドは `jchres_theme.js` の関数だけで作る。色・フォント・ロゴ位置を個別に指定しない。
- 保存は必ず `writeDeck(pres, ファイル名)` を使う。
- README の「執筆ルール」を守る。特に、箇条書きは1項目全角25字程度まで、本文24pt以上、「／」と丸数字は使わない。
- 所属表記は JCHRES のみとする。
- 不明な内容（数値、氏名、日付、出典など）は推測で埋めず、依頼者に確認する。
- 生成後は PDF に変換し、全ページを画像で確認してから納品する。
  - 例: `soffice --headless --convert-to pdf out.pptx && pdftoppm -r 60 -png out.pdf page`
- 説明用のイラストが必要な場合は https://github.com/t4kumi-yamaguchi/make-research-diagram の表現（白背景、グレーの細い線画、文字なし）に合わせ、文字や矢印は PowerPoint 上の別要素として置く。
