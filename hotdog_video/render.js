// Kullanım: node render.js                 -> tam video (paralel parçalar + ses + müzik) -> hotdog_cart.mp4
//           node render.js --stills 1,3,7 dir -> belirli saniyelerden kontrol kareleri
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const FPS = 24, WORKERS = +(process.env.WORKERS || 4);
async function open(browser) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.log('PAGE ERR', e.message));
  await page.goto('file://' + path.resolve(__dirname, 'index.html') + '?render=1');
  await page.waitForFunction(() => window.READY === true);
  return page;
}
const grab = async (page, t, q) => Buffer.from((await page.evaluate(([t, q]) => { render(t); return cv.toDataURL('image/jpeg', q); }, [t, q])).split(',')[1], 'base64');
(async () => {
  const browser = await chromium.launch({ args: ['--disable-gpu-vsync'] });
  if (process.argv[2] === '--stills') {
    const page = await open(browser); const dir = process.argv[4]; fs.mkdirSync(dir, { recursive: true });
    for (const t of process.argv[3].split(',').map(Number)) fs.writeFileSync(path.join(dir, `t${t.toFixed(2).padStart(7, '0')}.jpg`), await grab(page, t, .82));
    await browser.close(); return;
  }
  const out = process.argv[2] || path.resolve(__dirname, 'hotdog_cart.mp4');
  const tmp = path.resolve(__dirname, '_parts'); fs.mkdirSync(tmp, { recursive: true });
  const dur = await (await open(browser)).evaluate(() => DUR);
  const N = Math.round(dur * FPS), per = Math.ceil(N / WORKERS);
  const t0 = Date.now();
  await Promise.all([...Array(WORKERS).keys()].map(async w => {
    const page = await open(browser); const a = w * per, b = Math.min(N, a + per);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19', '-preset', 'medium', path.join(tmp, `p${w}.mp4`)], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = a; i < b; i++) {
      const buf = await grab(page, i / FPS, .93);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (w === 0 && (i - a) % 240 === 0) console.log(`~${Math.round((i - a) / (b - a) * 100)}%  ${((Date.now() - t0) / 1000).toFixed(0)} sn`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }));
  await browser.close();
  fs.writeFileSync(path.join(tmp, 'list.txt'), [...Array(WORKERS).keys()].map(w => `file 'p${w}.mp4'`).join('\n'));
  const silent = path.join(tmp, 'video.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'list.txt'), '-c', 'copy', silent], { stdio: 'inherit' });
  const A = path.resolve(__dirname, 'audio');
  // anlatım zaten ~-14.6 LUFS; müzik konuşma altında kısılır (sidechain)
  const fc = [`[1:a]aformat=channel_layouts=stereo,apad=whole_dur=${dur},asplit=2[v1][v2]`, '[2:a]volume=0.16[m]',
    '[m][v2]sidechaincompress=threshold=0.03:ratio=5:attack=30:release=500[md]',
    '[v1][md]amix=inputs=2:normalize=0:duration=longest,alimiter=limit=0.89,aresample=48000[a]'].join(';');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, '-i', path.join(A, 'voice.mp3'), '-i', path.join(A, 'music.wav'),
    '-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', String(dur), '-movflags', '+faststart', out], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('bitti:', out, ((Date.now() - t0) / 1000).toFixed(0), 'sn');
})();
