// public/clips の各動画の長さ（秒）を src/clips.json に書き出す
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(ROOT, 'public', 'clips');
const out = {};
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.mp4')).sort()) {
  try { out[f.replace('.mp4', '')] = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path.join(dir, f)]).toString().trim(); } catch { console.warn('skip (未完成):', f); }
}
fs.writeFileSync(path.join(ROOT, 'src', 'clips.json'), JSON.stringify(out, null, 2));
console.log(out);
