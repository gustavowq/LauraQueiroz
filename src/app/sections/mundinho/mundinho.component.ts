/* =====================================================================
   MUNDINHO ENCANTADO — arquitetura infantil, um nicho forte da Laura.
   Os seixos do fundo (inspirados nos ícones dos destaques do Instagram
   dela) mudam de forma devagar e flutuam com a rolagem.
   ===================================================================== */
import { Component, ElementRef, ViewEncapsulation, afterNextRender, inject } from '@angular/core';
import { gsap, movimentoReduzido } from '../../core/animacao/gsap';
import { revelar } from '../../core/animacao/revelar';
import { IlustracaoComponent } from '../../shared/ilustracao/ilustracao.component';

/** Três desenhos de seixo; cada seixo alterna entre eles. */
const FORMAS_DE_SEIXO = [
  'M60 20C88 10 118 30 116 60C114 92 82 108 54 100C26 92 6 70 14 46C20 30 36 26 60 20Z',
  'M66 14C98 18 120 46 110 74C100 102 64 112 38 98C12 84 8 52 24 34C34 22 46 12 66 14Z',
  'M58 12C84 6 116 22 118 52C120 84 96 108 62 106C30 104 6 82 10 54C12 30 34 18 58 12Z',
];

@Component({
  selector: 'app-mundinho',
  imports: [IlustracaoComponent],
  templateUrl: './mundinho.component.html',
  styleUrl: './mundinho.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class MundinhoComponent {
  private el = inject(ElementRef<HTMLElement>);
  protected formas = FORMAS_DE_SEIXO;
  /** posição (x, y), tamanho (w) e cor (c) de cada seixo decorativo */
  protected seixos = [
    { x: '4%', y: '8%', w: 120, c: 'var(--terracota)' }, { x: '44%', y: '4%', w: 70, c: 'var(--acento)' },
    { x: '88%', y: '12%', w: 96, c: 'var(--freijo)' }, { x: '38%', y: '82%', w: 110, c: 'var(--freijo)' },
    { x: '92%', y: '78%', w: 64, c: 'var(--terracota)' }, { x: '2%', y: '70%', w: 80, c: 'var(--acento)' },
  ];

  constructor() {
    afterNextRender(() => {
      const raiz: HTMLElement = this.el.nativeElement;
      revelar(raiz);
      if (movimentoReduzido()) return;

      raiz.querySelectorAll<SVGPathElement>('.mundinho__seixos path').forEach((p, i) => {
        gsap.to(p, { morphSVG: FORMAS_DE_SEIXO[(i + 1) % 3], duration: 3 + i * .4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to(p.ownerSVGElement, {
          y: -30 - i * 6, rotation: i % 2 ? 14 : -14, ease: 'none',
          scrollTrigger: { trigger: raiz, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      // a palavra "encantado" ganha a cor terracota ao aparecer
      const destaque = raiz.querySelector('h2 em');
      if (destaque) gsap.fromTo(destaque, { color: 'var(--texto)' }, { color: 'var(--terracota)', duration: 1.4, scrollTrigger: { trigger: destaque, start: 'top 70%' } });
    });
  }
}
