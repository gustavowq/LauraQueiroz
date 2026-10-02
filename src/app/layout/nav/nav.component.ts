/* =====================================================================
   NAV (menu do topo) — fica fixo, ganha fundo depois que a página rola,
   se esconde ao descer e reaparece ao subir. No celular vira um menu
   que abre em tela cheia.
   ===================================================================== */
import { Component, ElementRef, ViewEncapsulation, afterNextRender, inject, signal } from '@angular/core';
import { gsap, ScrollTrigger } from '../../core/animacao/gsap';
import { EstudioService } from '../../core/estado/estudio.service';
import { ARCO_LQA } from '../../core/materiais/arco-lqa';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class NavComponent {
  protected estudio = inject(EstudioService);
  private el = inject(ElementRef<HTMLElement>);
  protected arco = ARCO_LQA;
  protected escondida = signal(false);
  protected solida = signal(false);
  protected aberto = signal(false);
  protected links = [
    { href: '#obra', texto: 'A construção' },
    { href: '#projetos', texto: 'Projetos' },
    { href: '#mundinho', texto: 'Mundinho Encantado' },
    { href: '#processo', texto: 'Processo' },
    { href: '#belo', texto: 'Sobre o Belo' },
  ];

  constructor() {
    afterNextRender(() => {
      const barra = this.el.nativeElement.querySelector('.progresso');
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: (s) => {
          gsap.set(barra, { scaleX: s.progress });
          this.solida.set(s.scroll() > 40);
          if (!this.aberto()) this.escondida.set(s.direction === 1 && s.scroll() > 400);
        },
      });
    });
  }

  protected alternarLuz(ev: MouseEvent) {
    const r = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    this.estudio.alternarLuz({ x: r.left + 20, y: r.top + r.height / 2 });
  }
}
