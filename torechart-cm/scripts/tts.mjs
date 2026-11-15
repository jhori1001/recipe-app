// VOICEVOX ENGINE（春日部つむぎ）で台本を音声化し、public/voice/*.wav と src/voice.json（各行の秒数）を作る
// 事前に VOICEVOX ENGINE を起動しておくこと（既定: http://127.0.0.1:50021）
//   node scripts/tts.mjs            … 音声生成
//   node scripts/tts.mjs --estimate … エンジン無しで尺だけ概算（プレビュー用）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LINES } from '../src/script.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENGINE = process.env.VOICEVOX_URL || 'http://127.0.0.1:50021';
const SPEAKER = Number(process.env.SPEAKER || 8); // 8 = 春日部つむぎ（ノーマル）
const OUTDIR = path.join(ROOT, 'public', 'voice');
fs.mkdirSync(OUTDIR, { recursive: true });

const durations = {};
const estimate = process.argv.includes('--estimate');

for (const line of LINES) {
  const text = line.speak ?? line.text;
  if (estimate) {
    // 句読点を除いた文字数から概算（つむぎ・話速1.15 で 1秒 ≒ 8.5文字）
    durations[line.id] = +(text.replace(/[、。！？!?「」]/g, '').length / 8.5 + 0.4).toFixed(2);
    continue;
  }
  const q = await fetch(`${ENGINE}/audio_query?speaker=${SPEAKER}&text=${encodeURIComponent(text)}`, { method: 'POST' });
  if (!q.ok) throw new Error(`audio_query failed (${q.status}) for ${line.id}`);
  const query = await q.json();
  Object.assign(query, { speedScale: 1.15, pitchScale: 0.0, intonationScale: 1.25, volumeScale: 1.0, prePhonemeLength: 0.05, postPhonemeLength: 0.12, outputSamplingRate: 48000 });
  const s = await fetch(`${ENGINE}/synthesis?speaker=${SPEAKER}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(query) });
  if (!s.ok) throw new Error(`synthesis failed (${s.status}) for ${line.id}`);
  const wav = Buffer.from(await s.arrayBuffer());
  fs.writeFileSync(path.join(OUTDIR, `${line.id}.wav`), wav);
  // WAV ヘッダから長さを算出
  const byteRate = wav.readUInt32LE(28);
  let off = 12, dataLen = 0;
  while (off < wav.length) { const id = wav.toString('ascii', off, off + 4); const len = wav.readUInt32LE(off + 4); if (id === 'data') { dataLen = len; break; } off += 8 + len; }
  durations[line.id] = +(dataLen / byteRate).toFixed(3);
  console.log(`✔ ${line.id} ${durations[line.id]}s  ${text}`);
}

fs.writeFileSync(path.join(ROOT, 'src', 'voice.json'), JSON.stringify({ hasAudio: !estimate, durations }, null, 2));
console.log(estimate ? '概算の尺を src/voice.json に書き込みました' : '音声を public/voice に書き出しました');
