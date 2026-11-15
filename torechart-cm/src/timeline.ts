import { LINES } from './script';
import voice from './voice.json';
import clips from './clips.json';

export const FPS = 30;
export const LEAD = 0.5; // 冒頭の間（秒）
export const GAP = 0.25; // 行間（秒）
export const TAIL = 1.2; // 最後の余韻（秒）

export type TimedLine = (typeof LINES)[number] & { from: number; dur: number; audioDur: number };
export type ClipGroup = { clip: string; from: number; dur: number; clipLen: number; rate: number };

const durs = (voice as { durations: Record<string, number> }).durations;
export const HAS_AUDIO = (voice as { hasAudio: boolean }).hasAudio;

const f = (s: number) => Math.round(s * FPS);

export const timeline = (() => {
  let t = f(LEAD);
  const lines: TimedLine[] = LINES.map((l) => {
    const a = durs[l.id] ?? 3;
    const dur = f(a + GAP);
    const tl = { ...l, from: t, dur, audioDur: f(a) };
    t += dur;
    return tl;
  });
  const total = t + f(TAIL);

  // 同じクリップが続く行をまとめる
  const groups: ClipGroup[] = [];
  for (const l of lines) {
    const last = groups[groups.length - 1];
    if (last && last.clip === l.clip) last.dur = l.from + l.dur - last.from;
    else groups.push({ clip: l.clip, from: l.from === f(LEAD) ? 0 : l.from, dur: l.dur + (l.from === f(LEAD) ? f(LEAD) : 0), clipLen: 0, rate: 1 });
  }
  groups[groups.length - 1].dur = total - groups[groups.length - 1].from;
  for (const g of groups) {
    const len = (clips as Record<string, number>)[g.clip] ?? 10;
    g.clipLen = f(len);
    // 録画の操作がナレーションの尺に収まるよう再生速度を調整（0.8〜1.6倍）。足りない分は最終フレームで静止。
    g.rate = Math.min(1.6, Math.max(0.8, len / (g.dur / FPS)));
  }
  return { lines, groups, total };
})();
