import React from 'react';
import {
  AbsoluteFill, Audio, Freeze, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { HAS_AUDIO, timeline, type ClipGroup, type TimedLine } from './timeline';

const FONT = 'Rounded';
const BLUE = '#0d5bb5';
const BLUE_DARK = '#063a78';
const YELLOW = '#ffd23f';

const fontFace = `
@font-face{font-family:${FONT};font-weight:800;src:url(${staticFile('fonts/m-plus-rounded-1c-japanese-800-normal.woff2')}) format('woff2');}
@font-face{font-family:${FONT};font-weight:900;src:url(${staticFile('fonts/m-plus-rounded-1c-japanese-900-normal.woff2')}) format('woff2');}
@font-face{font-family:${FONT}L;font-weight:900;src:url(${staticFile('fonts/m-plus-rounded-1c-latin-900-normal.woff2')}) format('woff2');}
`;

// ---------- 背景 ----------
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = (frame * 0.6) % 80;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, #1f8bff 0%, ${BLUE} 55%, ${BLUE_DARK} 100%)` }}>
      <AbsoluteFill style={{
        backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,.06) 0 20px, transparent 20px 40px)',
        backgroundPosition: `${shift}px 0`,
      }} />
      {/* ぼんやりした光 */}
      <div style={{ position: 'absolute', left: 1180, top: -260, width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,.22), transparent 65%)' }} />
      <div style={{ position: 'absolute', left: -300, top: 600, width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,210,63,.18), transparent 65%)' }} />
    </AbsoluteFill>
  );
};

// ---------- スマホ ----------
const PHONE = { x: 190, y: 50, h: 980 };
const SCREEN_H = PHONE.h - 40;
const SCREEN_W = Math.round((SCREEN_H * 390) / 844);
const STATUS_H = Math.round((SCREEN_H * 47) / 844); // ステータスバー
const VIDEO_H = SCREEN_H - STATUS_H;

const ClipView: React.FC<{ g: ClipGroup }> = ({ g }) => {
  const frame = useCurrentFrame();
  const src = staticFile(`clips/${g.clip}.mp4`);
  const playable = Math.floor(g.clipLen / g.rate) - 2; // 実時間に換算した再生可能フレーム数
  const fade = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  const style: React.CSSProperties = { width: SCREEN_W, height: VIDEO_H, objectFit: 'cover' };
  return (
    <AbsoluteFill style={{ opacity: fade, background: '#fff', top: STATUS_H, height: VIDEO_H }}>
      {frame < playable ? (
        <OffthreadVideo src={src} playbackRate={g.rate} muted style={style} />
      ) : (
        <Freeze frame={g.clipLen - 2}>
          <OffthreadVideo src={src} muted style={style} />
        </Freeze>
      )}
    </AbsoluteFill>
  );
};

const StatusBar: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: SCREEN_W, height: STATUS_H, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 34px 0', boxSizing: 'border-box', fontFamily: `${FONT}L, ${FONT}`, fontWeight: 900, fontSize: 21, color: '#111' }}>
    <span>9:41</span>
    <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <span style={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>{[6, 9, 12, 15].map((h) => <span key={h} style={{ width: 4, height: h, background: '#111', borderRadius: 1 }} />)}</span>
      <span style={{ width: 30, height: 14, border: '2px solid #111', borderRadius: 4, padding: 1, boxSizing: 'border-box' }}><span style={{ display: 'block', width: '80%', height: '100%', background: '#111', borderRadius: 2 }} /></span>
    </span>
  </div>
);

const Phone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 14, mass: 0.9 } });
  const y = interpolate(enter, [0, 1], [700, 0]);
  const bob = Math.sin(frame / 45) * 4;
  return (
    <div style={{
      position: 'absolute', left: PHONE.x, top: PHONE.y + y + bob, width: SCREEN_W + 40, height: PHONE.h,
      borderRadius: 64, background: '#111', boxShadow: '0 30px 60px rgba(0,0,0,.45), inset 0 0 0 3px #3a3a3a',
      transform: `rotate(${interpolate(enter, [0, 1], [-8, 0])}deg)`,
    }}>
      <div style={{ position: 'absolute', left: 20, top: 20, width: SCREEN_W, height: SCREEN_H, borderRadius: 46, overflow: 'hidden', background: '#fff' }}>
        {timeline.groups.map((g, i) => (
          <Sequence key={i} from={g.from} durationInFrames={g.dur + (i < timeline.groups.length - 1 ? 8 : 0)} layout="none">
            <ClipView g={g} />
          </Sequence>
        ))}
        <StatusBar />
        {/* ダイナミックアイランド */}
        <div style={{ position: 'absolute', left: SCREEN_W / 2 - 62, top: 12, width: 124, height: 34, borderRadius: 20, background: '#000' }} />
      </div>
    </div>
  );
};

// ---------- 右側：ロゴ・テロップ ----------
const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 6, fps, config: { damping: 12 } });
  return (
    <div style={{ position: 'absolute', left: 760, top: 70, display: 'flex', alignItems: 'center', gap: 24, transform: `scale(${s})`, transformOrigin: 'left center' }}>
      <div style={{ background: '#fff', borderRadius: 28, padding: '18px 34px', boxShadow: '0 10px 30px rgba(0,0,0,.25)' }}>
        <Img src={staticFile('img/torecha_yoko.png')} style={{ height: 78, display: 'block' }} />
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: BLUE_DARK, background: YELLOW, borderRadius: 14, padding: '8px 18px' }}>PR</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: '#fff' }}>torechart.com</div>
    </div>
  );
};

const outline = (c: string, w: number) => {
  const s: string[] = [];
  for (let a = 0; a < 360; a += 30) s.push(`${(Math.cos((a * Math.PI) / 180) * w).toFixed(1)}px ${(Math.sin((a * Math.PI) / 180) * w).toFixed(1)}px 0 ${c}`);
  return s.join(',');
};

const Telop: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 10, stiffness: 180 } });
  const size = Math.max(...text.split('\n').map((l) => l.length)) > 12 ? 80 : 88;
  return (
    <div style={{ position: 'absolute', left: 760, top: 260, width: 1100, height: 400, display: 'flex', alignItems: 'center' }}>
      <div style={{
        fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.25, color: '#fff', whiteSpace: 'pre-line',
        textShadow: `${outline(BLUE_DARK, 7)}, 0 12px 0 rgba(0,0,0,.25)`,
        transform: `scale(${interpolate(s, [0, 1], [0.6, 1])}) rotate(${interpolate(s, [0, 1], [-3, 0])}deg)`, opacity: Math.min(1, s * 1.5),
        transformOrigin: 'left center',
      }}>
        {text.split(/(「[^」]+」|！|!)/).map((p, i) =>
          p.startsWith('「') ? <span key={i} style={{ color: YELLOW }}>{p}</span> : <span key={i}>{p}</span>,
        )}
      </div>
    </div>
  );
};

const BigNumber: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = text.match(/^([0-9,]+)(.*)$/);
  const target = m ? parseInt(m[1].replace(/,/g, ''), 10) : 0;
  const p = interpolate(frame, [0, Math.min(dur * 0.6, 40)], [0, 1], { extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) });
  const shown = m ? Math.round(target * p).toLocaleString('ja-JP') + m[2] : text;
  const pop = spring({ frame, fps, config: { damping: 8 } });
  return (
    <div style={{ position: 'absolute', left: 760, top: 230, width: 1100, height: 460, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: '#fff', textShadow: outline(BLUE_DARK, 6) }}>その数なんと…</div>
      <div style={{
        fontFamily: `${FONT}L, ${FONT}`, fontWeight: 900, fontSize: 210, lineHeight: 1.1, color: YELLOW,
        textShadow: `${outline('#b4161b', 10)}, 0 16px 0 rgba(0,0,0,.3)`, transform: `scale(${interpolate(pop, [0, 1], [0.3, 1])})`, transformOrigin: 'left center',
      }}>{shown}</div>
    </div>
  );
};

// ---------- 字幕 ----------
const Subtitle: React.FC<{ line: TimedLine }> = ({ line }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 4], [0, 1], { extrapolateRight: 'clamp' });
  const len = line.text.length;
  const size = len > 70 ? 38 : len > 45 ? 42 : 48;
  return (
    <div style={{ position: 'absolute', left: 760, top: 720, width: 1100, height: 300, display: 'flex', alignItems: 'flex-end', opacity: o }}>
      <div style={{ position: 'relative', width: '100%', background: 'rgba(255,255,255,.96)', borderRadius: 28, padding: '34px 40px 30px', boxShadow: '0 14px 36px rgba(0,0,0,.3)', border: `5px solid ${YELLOW}` }}>
        <div style={{ position: 'absolute', top: -26, left: 30, background: '#e85d9f', color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 28, borderRadius: 999, padding: '4px 22px' }}>つむぎ</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1.45, color: '#1b2a3a' }}>{line.text}</div>
      </div>
    </div>
  );
};

// ---------- 全体 ----------
export const CM: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [timeline.total - 12, timeline.total], [0, 1], { extrapolateLeft: 'clamp' });
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <style>{fontFace}</style>
      <Background />
      <Phone />
      <Header />
      {timeline.lines.map((l) => (
        <Sequence key={l.id} from={l.from} durationInFrames={l.dur} layout="none">
          {l.big ? <BigNumber text={l.big} dur={l.dur} /> : l.telop ? <Telop text={l.telop} /> : null}
          <Subtitle line={l} />
          {HAS_AUDIO ? <Audio src={staticFile(`voice/${l.id}.wav`)} volume={1.4} /> : null}
        </Sequence>
      ))}
      <div style={{ position: 'absolute', right: 28, bottom: 14, fontFamily: FONT, fontWeight: 800, fontSize: 22, color: 'rgba(255,255,255,.85)' }}>VOICEVOX:春日部つむぎ</div>
      <AbsoluteFill style={{ background: '#000', opacity: fadeOut }} />
    </AbsoluteFill>
  );
};
