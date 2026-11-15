// トレチャ（https://torechart.com/onepiece）の実画面をスマホサイズで録画するスクリプト
// CDP screencast でフレームを取得し、ffmpeg で 30fps の mp4 に変換して public/clips/ に保存する。
// 使い方: node scripts/record.cjs [clip名 ...]   （省略時は全クリップ）
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'clips');
const TMP = path.join(ROOT, '.frames');
const BASE = 'https://torechart.com';
const SCALE = 3;
const VW = 390, VH = 797; // iPhone 13 の画面からステータスバー分（47px）を除いた表示領域。ステータスバーは Remotion 側で描画
fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ページ内に注入する演出（タップの波紋・ハイライト枠・なめらかスクロール）
const INIT = () => {
  const css = `
  ::-webkit-scrollbar{display:none}
  .__tap{position:fixed;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;
    background:rgba(255,255,255,.55);border:3px solid rgba(40,120,255,.9);pointer-events:none;z-index:2147483647;
    animation:__tapA .6s ease-out forwards;box-shadow:0 0 12px rgba(0,0,0,.35)}
  @keyframes __tapA{0%{transform:scale(.4);opacity:1}70%{transform:scale(1.1);opacity:.9}100%{transform:scale(1.5);opacity:0}}
  .__hl{position:absolute;border:4px solid #ff2d55;border-radius:10px;pointer-events:none;z-index:2147483646;
    box-shadow:0 0 0 4px rgba(255,45,85,.25),0 0 18px rgba(255,45,85,.6);animation:__hlA 1s ease-in-out infinite alternate}
  @keyframes __hlA{from{box-shadow:0 0 0 2px rgba(255,45,85,.2),0 0 8px rgba(255,45,85,.4)}to{box-shadow:0 0 0 7px rgba(255,45,85,.3),0 0 22px rgba(255,45,85,.8)}}`;
  const add = () => { if (document.getElementById('__cmstyle')) return; const s = document.createElement('style'); s.id = '__cmstyle'; s.textContent = css; document.head.appendChild(s); };
  document.addEventListener('DOMContentLoaded', add);
  window.__tap = (x, y) => { add(); const d = document.createElement('div'); d.className = '__tap'; d.style.left = x + 'px'; d.style.top = y + 'px'; document.body.appendChild(d); setTimeout(() => d.remove(), 700); };
  window.__hl = (el, pad = 6) => { add(); const r = el.getBoundingClientRect(); const d = document.createElement('div'); d.className = '__hl';
    d.style.left = (r.left + scrollX - pad) + 'px'; d.style.top = (r.top + scrollY - pad) + 'px'; d.style.width = (r.width + pad * 2) + 'px'; d.style.height = (r.height + pad * 2) + 'px';
    document.body.appendChild(d); return true; };
  window.__clearHl = () => document.querySelectorAll('.__hl').forEach((e) => e.remove());
  window.__scrollTo = (y, ms) => new Promise((res) => { const s = scrollY, t0 = performance.now(); const e = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const step = (now) => { const t = Math.min(1, (now - t0) / ms); scrollTo(0, s + (y - s) * e(t)); t < 1 ? requestAnimationFrame(step) : res(); }; requestAnimationFrame(step); });
};

// ---- 操作ヘルパー ----
async function tap(page, locator, { navigate = true } = {}) {
  const el = locator.first();
  await el.scrollIntoViewIfNeeded();
  const box = await el.boundingBox();
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  await page.evaluate(([x, y]) => window.__tap(x, y), [x, y]);
  await sleep(350);
  if (navigate) await el.click();
}
async function scrollToEl(page, locator, offset = 90, ms = 1600) {
  const y = await locator.first().evaluate((e, o) => e.getBoundingClientRect().top + scrollY - o, offset);
  await page.evaluate(([y, ms]) => window.__scrollTo(y, ms), [Math.max(0, y), ms]);
  await sleep(250);
}
async function scrollBy(page, dy, ms = 1600) {
  await page.evaluate(([dy, ms]) => window.__scrollTo(scrollY + dy, ms), [dy, ms]);
  await sleep(200);
}
async function hl(page, locator, pad) { await locator.first().evaluate((e, p) => window.__hl(e, p), pad ?? 6); }
async function clearHl(page) { await page.evaluate(() => window.__clearHl()); }
async function settle(page) { await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {}); await sleep(400); }
async function go(page, url) { await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {}); await sleep(600); }
// タブ切替でページが再読み込みされても、即座に「高騰カード」見出しの位置へ戻す
async function jumpAfterReload(page) {
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.locator('h3:has-text("高騰カード")').first().evaluate((e) => scrollTo(0, e.getBoundingClientRect().top + scrollY - 50)).catch(() => {});
  await page.waitForLoadState('load', { timeout: 8000 }).catch(() => {}); await sleep(300);
  await page.locator('h3:has-text("高騰カード")').first().evaluate((e) => scrollTo(0, e.getBoundingClientRect().top + scrollY - 50)).catch(() => {});
}
const searchBox = (page) => page.locator('input.searchword__input:visible');
const searchBtn = (page) => page.locator('button.searchword__button:visible');

// ---- 録画本体 ----
async function record(page, cdp, name, fn) {
  const dir = path.join(TMP, name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const frames = [];
  const onFrame = async ({ data, metadata, sessionId }) => {
    const f = path.join(dir, String(frames.length).padStart(5, '0') + '.jpg');
    fs.writeFileSync(f, Buffer.from(data, 'base64'));
    frames.push({ f, t: metadata.timestamp });
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  };
  cdp.on('Page.screencastFrame', onFrame);
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: VW * SCALE, maxHeight: VH * SCALE, everyNthFrame: 1 });
  const t0 = Date.now() / 1000;
  await sleep(300);
  await fn();
  await sleep(500);
  const tEnd = Date.now() / 1000;
  await cdp.send('Page.stopScreencast');
  cdp.off('Page.screencastFrame', onFrame);
  if (!frames.length) throw new Error('no frames for ' + name);
  // ffconcat（フレームごとの表示時間）を作成
  let list = 'ffconcat version 1.0\n';
  frames.forEach((fr, i) => {
    const next = i + 1 < frames.length ? frames[i + 1].t : tEnd;
    const start = i === 0 ? t0 : fr.t;
    list += `file '${fr.f}'\nduration ${Math.max(0.001, next - start).toFixed(4)}\n`;
  });
  list += `file '${frames[frames.length - 1].f}'\n`;
  fs.writeFileSync(path.join(dir, 'list.txt'), list);
  const out = path.join(OUT, name + '.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'list.txt'),
    '-vf', `scale=1170:2390:force_original_aspect_ratio=decrease:force_divisible_by=2,pad=1170:2390:(ow-iw)/2:0:white,fps=30,format=yuv420p`,
    '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-movflags', '+faststart', out]);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`✔ ${name}: ${(tEnd - t0).toFixed(1)}s, ${frames.length} frames`);
}

// ---- クリップ定義（台本の流れ順） ----
const CARD = '/onepiece/detail?cardid=1424'; // ボルサリーノ SPカード
const CLIPS = {
  // 冒頭：トップページをゆっくり見せる
  intro: async (page) => {
    await go(page, '/onepiece');
    return async () => { await sleep(1200); await scrollBy(page, 330, 2500); await sleep(1200); await scrollBy(page, 320, 2500); await sleep(1500); await page.evaluate(() => window.__scrollTo(0, 2000)); await sleep(1500); };
  },
  // 「価格ドットコム的なサイト」：価格推移グラフ
  about: async (page) => {
    await go(page, CARD);
    await page.evaluate(() => scrollTo(0, 0));
    return async () => { await sleep(600); await scrollToEl(page, page.locator('text=相場最安'), 140, 2200); await sleep(800); await hl(page, page.locator('.highcharts-container'), 2); await sleep(3500); await clearHl(page); await sleep(2000); };
  },
  // トップページへアクセス → 変動ランキング
  top: async (page) => {
    await page.goto('about:blank');
    return async () => {
      await go(page, '/onepiece'); await sleep(1500);
      await scrollToEl(page, page.locator('h3:has-text("変動ランキング")'), 70, 2200); await sleep(700);
      await hl(page, page.locator('h3:has-text("変動ランキング")'), 4); await sleep(1300);
      await hl(page, page.locator('text=/7日前/').first(), 4); await sleep(2600);
      await clearHl(page); await scrollBy(page, 420, 2200); await sleep(1500); await scrollBy(page, 420, 2200); await sleep(2500);
    };
  },
  // 検索：ボルサリーノ
  search: async (page) => {
    await go(page, '/onepiece');
    return async () => {
      await sleep(1000);
      await tap(page, searchBox(page)); await sleep(500);
      await searchBox(page).pressSequentially('ボルサリーノ', { delay: 260 }); await sleep(900);
      await tap(page, searchBtn(page)); await settle(page); await sleep(800);
      await scrollToEl(page, page.locator('h3:has-text("検索結果")'), 60, 2200); await sleep(800);
      await hl(page, page.locator('text=/件中/'), 4); await sleep(2000); await clearHl(page);
      await scrollBy(page, 500, 2600); await sleep(1500); await scrollBy(page, 500, 2600); await sleep(3000);
    };
  },
  // 黄猿では出てこない
  kizaru: async (page) => {
    await go(page, '/onepiece');
    return async () => {
      await sleep(800);
      await tap(page, searchBox(page)); await sleep(400);
      await searchBox(page).pressSequentially('黄猿', { delay: 350 }); await sleep(800);
      await tap(page, searchBtn(page)); await settle(page); await sleep(500);
      await scrollToEl(page, page.locator('h3:has-text("検索結果")'), 60, 1800); await sleep(500);
      await hl(page, page.locator('text=/件中/'), 6); await sleep(3000); await clearHl(page);
      await page.evaluate(() => window.__scrollTo(0, 1500)); await sleep(600);
      await tap(page, searchBox(page)); await searchBox(page).fill(''); await sleep(400);
      await searchBox(page).pressSequentially('ボルサリーノ', { delay: 220 }); await sleep(700);
      await tap(page, searchBtn(page)); await settle(page); await sleep(500);
      await scrollToEl(page, page.locator('h3:has-text("検索結果")'), 60, 1800); await sleep(3000);
    };
  },
  // 調べたいボルサリーノをタップ → 詳細ページ
  select: async (page) => {
    await go(page, '/onepiece/search?searchButton=1&cardName=' + encodeURIComponent('ボルサリーノ'));
    await page.evaluate(() => scrollTo(0, 0));
    return async () => {
      await sleep(500);
      const card = page.locator('a[href*="cardid=1424"]');
      await scrollToEl(page, card, 180, 2600); await sleep(600);
      await hl(page, card, 4); await sleep(1500); await clearHl(page);
      await tap(page, card); await settle(page); await sleep(800);
      await scrollToEl(page, page.locator('h3:has-text("ボルサリーノ")'), 60, 2000); await sleep(1500);
      await scrollToEl(page, page.locator('text=相場最安'), 140, 2000); await sleep(4000);
    };
  },
  // グラフ期間の切り替え
  graph: async (page) => {
    await go(page, CARD);
    await page.evaluate(() => window.__scrollTo(0, 1));
    const y = await page.locator('text=相場最安').first().evaluate((e) => e.getBoundingClientRect().top + scrollY - 140);
    await page.evaluate((y) => scrollTo(0, y), y); await sleep(500);
    return async () => {
      await sleep(1000);
      for (const d of ['30', '90', '180', '360']) { await tap(page, page.locator('#dailypricechartlabel' + d)); await sleep(2300); }
      await tap(page, page.locator('#dailypricechartlabel7')); await sleep(1500);
      await hl(page, page.locator('.highcharts-xaxis-labels'), 4); await sleep(3500); await clearHl(page); await sleep(1500);
    };
  },
  // ステータス
  status: async (page) => {
    await go(page, CARD);
    const y = await page.locator('text=相場最安').first().evaluate((e) => e.getBoundingClientRect().top + scrollY - 140);
    await page.evaluate((y) => scrollTo(0, y), y); await sleep(500);
    return async () => {
      await sleep(600);
      const st = page.locator('a.show0cardstatus');
      await scrollToEl(page, st, 260, 2400); await sleep(800);
      await tap(page, st); await sleep(1200);
      await scrollToEl(page, st, 120, 1500); await sleep(800);
      await page.evaluate(() => {
        const cell = [...document.querySelectorAll('*')].find((e) => e.children.length === 0 && e.textContent.trim() === '入手情報' && e.offsetParent);
        if (!cell) return; let el = cell.parentElement; while (el && el.getBoundingClientRect().height < 120) el = el.parentElement;
        window.__hl(el, 4);
      });
      await sleep(7000); await clearHl(page); await sleep(2000);
    };
  },
  // ショップ別価格情報（安い順）
  shops: async (page) => {
    await go(page, CARD);
    const y = await page.locator('a.show0cardstatus').first().evaluate((e) => e.getBoundingClientRect().top + scrollY - 300);
    await page.evaluate((y) => scrollTo(0, y), y); await sleep(500);
    return async () => {
      await sleep(800);
      const h = page.locator('h3:has-text("ショップ別価格情報")');
      await scrollToEl(page, h, 140, 2200); await sleep(800);
      await hl(page, h, 4); await sleep(1800); await clearHl(page);
      // 価格の列をハイライト
      await page.evaluate(() => {
        const h = [...document.querySelectorAll('h3')].find((e) => e.textContent.includes('ショップ別価格情報'));
        const prices = [...document.querySelectorAll('*')].filter((e) => e.children.length === 0 && /^[0-9,]+円$/.test(e.textContent.trim()) && e.getBoundingClientRect().top > h.getBoundingClientRect().top && e.offsetParent);
        if (!prices.length) return;
        const r = prices.slice(0, 6).map((p) => p.getBoundingClientRect()).filter((r, i, a) => i === 0 || r.top - a[i - 1].top < 80);
        const box = { getBoundingClientRect: () => ({ left: Math.min(...r.map((x) => x.left)), top: r[0].top, width: Math.max(...r.map((x) => x.right)) - Math.min(...r.map((x) => x.left)), height: r[r.length - 1].bottom - r[0].top }) };
        window.__hl(box, 8);
      });
      await sleep(9000); await clearHl(page); await sleep(2500);
    };
  },
  // ショップへそのまま飛べる（外部遷移はせず、タップ演出のみ）
  shoplink: async (page) => {
    await go(page, CARD);
    const h = page.locator('h3:has-text("ショップ別価格情報")');
    const y = await h.first().evaluate((e) => e.getBoundingClientRect().top + scrollY - 140);
    await page.evaluate((y) => scrollTo(0, y), y); await sleep(500);
    return async () => {
      await sleep(1000);
      const link = page.locator('h3:has-text("ショップ別価格情報") ~ * a, h3:has-text("ショップ別価格情報") + * a').filter({ hasNotText: '追加' });
      const target = (await link.count()) ? link.first() : page.locator('text=カードラッシュ').first();
      await hl(page, target, 6); await sleep(1500);
      await tap(page, target, { navigate: false }); await sleep(900);
      await tap(page, target, { navigate: false }); await sleep(2500); await clearHl(page);
      const more = page.locator('text=在庫切れショップを表示');
      if (await more.count()) { await tap(page, more); await sleep(1200); await scrollBy(page, 260, 1800); }
      await sleep(5000);
    };
  },
  // 高騰カード：1日〜90日の切り替え
  priceup: async (page) => {
    await go(page, '/onepiece');
    return async () => {
      await sleep(700);
      await tap(page, page.locator('a:visible:has-text("高騰カード")')); await settle(page); await sleep(800);
      await scrollToEl(page, page.locator('h3:has-text("高騰カード")'), 50, 1600); await sleep(700);
      for (const d of ['1', '7', '30', '60', '90']) { await tap(page, page.locator(`[data-dayType="${d}"]:visible`)); await jumpAfterReload(page); await sleep(1500); }
      await scrollBy(page, 500, 2200); await sleep(2000);
    };
  },
  // 変動率での比較 & ノーマルカードまで掲載
  rate: async (page) => {
    await go(page, '/onepiece/priceup?dayType=7&rankingType=0');
    await page.locator('h3:has-text("高騰カード")').first().evaluate((e) => scrollTo(0, e.getBoundingClientRect().top + scrollY - 50)); await sleep(500);
    return async () => {
      await sleep(800);
      const rate = page.locator('text=変動率').locator('visible=true');
      await tap(page, rate); await jumpAfterReload(page); await sleep(1200);
      await scrollToEl(page, page.locator('text=/1 位/'), 60, 1800); await sleep(800);
      await hl(page, page.locator('text=/レア度: ?(UC|C)$/').first(), 4); await sleep(1500);
      await hl(page, page.locator('text=/レア度: ?(UC|C|R)$/').nth(1), 4); await sleep(2500); await clearHl(page);
      await scrollBy(page, 700, 3000); await sleep(1500); await scrollBy(page, 700, 3000); await sleep(3000);
    };
  },
  // 大量のカード：検索結果を流し見
  many: async (page) => {
    await go(page, '/onepiece/search?searchButton=1&cardName=&seriesId=73&releaseDateFrom=&releaseDateTo=&cost=&categoryId=&cardFeatureId=&rarityId=&cardTypeId=&attributeId=');
    const y = await page.locator('h3:has-text("検索結果")').first().evaluate((e) => e.getBoundingClientRect().top + scrollY - 60);
    await page.evaluate((y) => scrollTo(0, y), y); await sleep(1500);
    return async () => { await sleep(600); await scrollBy(page, 2600, 9000); await sleep(1500); };
  },
  // ポケカも見られる
  pokemon: async (page) => {
    await go(page, '/onepiece');
    await page.evaluate(() => scrollTo(0, 0));
    return async () => {
      await sleep(800);
      const pk = page.locator('a:visible:has-text("ポケカ")');
      await hl(page, pk, 4); await sleep(1500); await clearHl(page);
      await tap(page, pk); await settle(page); await sleep(1500);
      await scrollBy(page, 700, 2800); await sleep(1500); await scrollBy(page, 700, 2800); await sleep(1500); await scrollBy(page, 700, 2800); await sleep(3000);
    };
  },
  // 締め：トップページ
  outro: async (page) => {
    await go(page, '/onepiece');
    await page.evaluate(() => scrollTo(0, 0));
    return async () => { await sleep(1500); await scrollBy(page, 900, 5000); await sleep(1000); await page.evaluate(() => window.__scrollTo(0, 3000)); await sleep(5000); };
  },
};

(async () => {
  const want = process.argv.slice(2);
  const names = want.length ? want : Object.keys(CLIPS);
  const browser = await chromium.launch();
  for (const name of names) {
    const ctx = await browser.newContext({ ...devices['iPhone 13'], viewport: { width: VW, height: VH }, screen: { width: 390, height: 844 }, deviceScaleFactor: SCALE, locale: 'ja-JP', timezoneId: 'Asia/Tokyo' });
    await ctx.addInitScript(INIT);
    // 広告・計測タグは録画に不要なのでブロック。外部ショップへの遷移もブロック。
    await ctx.route(/googlesyndication|googletagmanager|google-analytics|fundingchoices|doubleclick|adservice/, (r) => r.abort());
    const page = await ctx.newPage();
    page.setDefaultTimeout(12000);
    const cdp = await ctx.newCDPSession(page);
    try {
      const run = await CLIPS[name](page);
      await record(page, cdp, name, run);
    } catch (e) {
      console.error('✘ ' + name, e.message);
    }
    await ctx.close();
  }
  await browser.close();
})();
