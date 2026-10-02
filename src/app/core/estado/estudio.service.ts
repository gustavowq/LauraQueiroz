/* =====================================================================
   ESTADO DO SITE — informações compartilhadas entre as seções:
   • noite  → se o site está em "luz do dia" ou "luz da noite"
   • pronto → avisa quando a abertura (loader) terminou, para o hero
              começar a sua animação de entrada.
   ===================================================================== */
import { Injectable, signal } from '@angular/core';
import { ScrollTrigger, movimentoReduzido } from '../animacao/gsap';

@Injectable({ providedIn: 'root' })
export class EstudioService {
  readonly noite = signal(this.luzInicial());
  readonly pronto = signal(false);
  private aoFicarPronto: (() => void)[] = [];

  constructor() {
    this.aplicar(this.noite());
  }

  /** Começa no tema do sistema (claro/escuro) de quem está visitando. */
  private luzInicial() {
    const tema = document.documentElement.getAttribute('data-theme');
    if (tema === 'dark') return true;
    if (tema === 'light') return false;
    return matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private aplicar(noite: boolean) {
    document.documentElement.setAttribute('data-luz', noite ? 'noite' : 'dia');
  }

  /** "Dimmer": a nova luz se espalha em círculo a partir do botão clicado. */
  alternarLuz(origem?: { x: number; y: number }) {
    const proxima = !this.noite();
    const trocar = () => { this.noite.set(proxima); this.aplicar(proxima); };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (!doc.startViewTransition || movimentoReduzido()) { trocar(); return; }

    const x = origem?.x ?? innerWidth - 80, y = origem?.y ?? 40;
    const raio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    doc.startViewTransition(trocar).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${raio}px at ${x}px ${y}px)`] },
        { duration: 1100, easing: 'cubic-bezier(.7,0,.2,1)', pseudoElement: '::view-transition-new(root)' },
      );
    }).catch(() => {});
  }

  marcarPronto() {
    this.pronto.set(true);
    this.aoFicarPronto.splice(0).forEach((fn) => fn());
    ScrollTrigger.refresh();
  }

  quandoPronto(fn: () => void) {
    if (this.pronto()) fn(); else this.aoFicarPronto.push(fn);
  }
}
