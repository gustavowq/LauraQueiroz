/* =====================================================================
   TEXTURAS — biblioteca de materiais desenhados em código (canvas).
   Freijó ripado, pedra filetada, linho, cimento queimado, terracota,
   musgo… São usados como "fotos" nas ilustrações (CSS e SVG) e como
   materiais da casa em 3D. Para usar fotos reais, basta trocar as
   ilustrações; este arquivo continua servindo a cena 3D.
   ===================================================================== */

export type TexName =
  | 'ripado' | 'madeira' | 'pedra' | 'linho' | 'cimento'
  | 'terracota' | 'musgo' | 'pedraPreta' | 'offwhite' | 'azul' | 'mostarda';

function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function canvas(size = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return [c, c.getContext('2d')!] as const;
}

function noise(ctx: CanvasRenderingContext2D, size: number, amt: number, seed: number) {
  const r = rng(seed);
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (r() - 0.5) * amt;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

function grain(ctx: CanvasRenderingContext2D, x: number, w: number, h: number, base: string, seed: number) {
  const r = rng(seed);
  ctx.fillStyle = base;
  ctx.fillRect(x, 0, w, h);
  for (let i = 0; i < w * 1.6; i++) {
    const gx = x + r() * w;
    ctx.strokeStyle = `rgba(${r() > 0.5 ? '60,38,22' : '255,230,200'},${0.04 + r() * 0.09})`;
    ctx.lineWidth = 0.5 + r() * 1.4;
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    let yy = 0;
    while (yy < h) {
      yy += 20 + r() * 40;
      ctx.lineTo(gx + Math.sin(yy * 0.02 + i) * (1 + r() * 2), yy);
    }
    ctx.stroke();
  }
}

function solid(base: string, amt: number, seed: number) {
  const [c, ctx] = canvas(256);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 256, 256);
  const r = rng(seed);
  for (let i = 0; i < 90; i++) {
    ctx.fillStyle = `rgba(${r() > 0.5 ? '0,0,0' : '255,255,255'},${0.006 + r() * 0.012})`;
    ctx.beginPath();
    ctx.ellipse(r() * 256, r() * 256, 10 + r() * 34, 6 + r() * 22, r() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  noise(ctx, 256, amt, seed + 1);
  return c;
}

const makers: Record<TexName, () => HTMLCanvasElement> = {
  ripado: () => {
    const [c, ctx] = canvas(512);
    const slat = 40, gap = 8;
    for (let x = 0; x < 512; x += slat + gap) {
      ctx.fillStyle = '#3a2717';
      ctx.fillRect(x + slat, 0, gap, 512);
      grain(ctx, x, slat, 512, x % 96 === 0 ? '#9C7556' : '#A57D5B', x + 3);
      const g = ctx.createLinearGradient(x, 0, x + slat, 0);
      g.addColorStop(0, 'rgba(255,240,220,.10)');
      g.addColorStop(1, 'rgba(0,0,0,.18)');
      ctx.fillStyle = g;
      ctx.fillRect(x, 0, slat, 512);
    }
    noise(ctx, 512, 10, 7);
    return c;
  },
  madeira: () => {
    const [c, ctx] = canvas(512);
    grain(ctx, 0, 512, 512, '#A07A58', 11);
    noise(ctx, 512, 10, 12);
    return c;
  },
  pedra: () => {
    // pedra filetada: thin stacked stone strips of uneven length
    const [c, ctx] = canvas(512);
    const r = rng(21);
    ctx.fillStyle = '#5d564e';
    ctx.fillRect(0, 0, 512, 512);
    let y = 0;
    while (y < 512) {
      const h = 10 + r() * 14;
      let x = -r() * 80;
      while (x < 512) {
        const w = 40 + r() * 120;
        const t = 120 + r() * 50;
        ctx.fillStyle = `rgb(${t + 8},${t + 2},${t - 8})`;
        ctx.fillRect(x + 1.5, y + 1.5, w - 3, h - 3);
        ctx.fillStyle = 'rgba(255,255,255,.08)';
        ctx.fillRect(x + 1.5, y + 1.5, w - 3, 2);
        x += w;
      }
      y += h;
    }
    noise(ctx, 512, 26, 22);
    return c;
  },
  linho: () => {
    const [c, ctx] = canvas(256);
    ctx.fillStyle = '#E4DACB';
    ctx.fillRect(0, 0, 256, 256);
    const r = rng(31);
    for (let i = 0; i < 256; i += 2) {
      ctx.fillStyle = `rgba(120,100,80,${0.03 + r() * 0.05})`;
      ctx.fillRect(0, i, 256, 1);
      ctx.fillStyle = `rgba(255,255,255,${0.03 + r() * 0.05})`;
      ctx.fillRect(i, 0, 1, 256);
    }
    noise(ctx, 256, 14, 32);
    return c;
  },
  cimento: () => solid('#A9A39A', 22, 41),
  terracota: () => solid('#B0614A', 16, 51),
  musgo: () => solid('#4B5A3E', 12, 61),
  offwhite: () => solid('#E9E2D6', 8, 71),
  azul: () => solid('#3E5A63', 12, 81),
  mostarda: () => solid('#B8913E', 12, 91),
  pedraPreta: () => {
    const [c, ctx] = canvas(256);
    ctx.fillStyle = '#211e1b';
    ctx.fillRect(0, 0, 256, 256);
    const r = rng(101);
    for (let i = 0; i < 400; i++) {
      ctx.strokeStyle = `rgba(255,255,255,${r() * 0.05})`;
      ctx.beginPath();
      const yy = r() * 256;
      ctx.moveTo(0, yy);
      ctx.lineTo(256, yy + (r() - 0.5) * 6);
      ctx.stroke();
    }
    noise(ctx, 256, 10, 102);
    return c;
  },
};

const cacheCanvas = new Map<TexName, HTMLCanvasElement>();
const cacheUrl = new Map<TexName, string>();

export function texCanvas(name: TexName): HTMLCanvasElement {
  if (!cacheCanvas.has(name)) cacheCanvas.set(name, makers[name]());
  return cacheCanvas.get(name)!;
}

export function texUrl(name: TexName): string {
  if (!cacheUrl.has(name)) cacheUrl.set(name, texCanvas(name).toDataURL('image/jpeg', 0.86));
  return cacheUrl.get(name)!;
}

/** Publica cada textura como variável CSS: background: var(--tx-pedra) */
export function instalarTexturasCss() {
  const root = document.documentElement;
  (Object.keys(makers) as TexName[]).forEach((n) => root.style.setProperty(`--tx-${n}`, `url(${texUrl(n)})`));
}
