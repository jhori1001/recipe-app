# トレチャ 案件CM（Remotion）

トレチャ（https://torechart.com/onepiece）の実際のスマホ画面を録画し、
VOICEVOX「春日部つむぎ」のナレーション＋字幕＋テロップを付けた 1920×1080 のCM動画です。

## 構成

| パス | 内容 |
| --- | --- |
| `src/script.ts` | 台本（字幕文・読み上げ用の読み・テロップ・使うクリップ） |
| `scripts/record.cjs` | Playwright でトレチャを iPhone サイズで操作・録画（タップ・入力・スクロール・ハイライト付き）→ `public/clips/*.mp4` |
| `scripts/tts.mjs` | VOICEVOX ENGINE で台本を音声化 → `public/voice/*.wav`、各行の尺を `src/voice.json` へ |
| `scripts/probe.mjs` | 録画クリップの長さを `src/clips.json` へ |
| `src/CM.tsx` | 動画本体（スマホ枠・テロップ・字幕・音声） |

## 作り方

```bash
npm install

# 1) サイトを録画（約10分）
NODE_PATH=$(npm root -g) node scripts/record.cjs        # 一部だけ撮り直す場合: node scripts/record.cjs graph status
node scripts/probe.mjs

# 2) VOICEVOX ENGINE を起動した状態で音声生成（春日部つむぎ = speaker 8）
node scripts/tts.mjs
#   エンジンが無い場合の仮尺: node scripts/tts.mjs --estimate

# 3) 書き出し
npx remotion render src/index.ts TorechaCM out/torecha-cm.mp4
#   プレビュー: npx remotion studio src/index.ts
```

台本を直したら `node scripts/tts.mjs` → 書き出し、の順で再実行すれば尺も自動で合います。

## メモ

- 掲載枚数は 2026/11/15 時点で、トレチャの検索で全収録商品の件数を合計した値です
  （ワンピース 5,278 件 / ポケカ 25,276 件 / 合計 30,554 件）。公式発表の数字があればそちらに差し替えてください（`src/script.ts` 先頭）。
- クレジット「VOICEVOX:春日部つむぎ」を画面右下に表示しています（VOICEVOX・春日部つむぎ利用規約に基づく表記）。
- 動画右上に「PR」表記を入れています。
