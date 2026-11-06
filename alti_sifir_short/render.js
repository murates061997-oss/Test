// Kullanım: node render.js [cikti.mp4]            -> tam video
//           node render.js --stills 1,3,7 dir      -> belirli saniyelerden kare
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
  await page.goto('file://' + path.resolve(__dirname, 'index.html') + '?render=1');
  await page.waitForFunction(() => window.READY === true);
  const grab = async (t, q) => {
    const d = await page.evaluate(([t, q]) => { render(t); return cv.toDataURL('image/jpeg', q); }, [t, q]);
    return Buffer.from(d.split(',')[1], 'base64');
  };

  if (process.argv[2] === '--stills') {
    const times = process.argv[3].split(',').map(Number);
    const dir = process.argv[4];
    fs.mkdirSync(dir, { recursive: true });
    for (const t of times) fs.writeFileSync(path.join(dir, `t${String(t).padStart(5, '0')}.jpg`), await grab(t, 0.8));
    await browser.close();
    return;
  }

  const out = process.argv[2] || path.resolve(__dirname, 'alti_sifir_short.mp4');
  const FPS = 30;
  const N = Math.round((await page.evaluate(() => DUR)) * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < N; i++) {
    const buf = await grab(i / FPS, 0.95);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`kare ${i}/${N}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('bitti:', out);
})();
