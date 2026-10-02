/* =====================================================================
   PROCESSO — como a Laura trabalha, em quatro etapas.
   A linha ondulada se desenha com a rolagem e cada etapa aparece em
   sequência.
   ===================================================================== */
import { Component, ElementRef, ViewEncapsulation, afterNextRender, inject } from '@angular/core';
import { gsap, movimentoReduzido } from '../../core/animacao/gsap';
import { revelar } from '../../core/animacao/revelar';

@Component({
  selector: 'app-processo',
  templateUrl: './processo.component.html',
  styleUrl: './processo.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ProcessoComponent {
  private el = inject(ElementRef<HTMLElement>);
  protected etapas = [
    { n: 'i.', t: 'Escuta', d: 'Visita, briefing e tudo o que faz a sua família ou o seu negócio ser único.' },
    { n: 'ii.', t: 'Conceito', d: 'Moodboard de materiais, luz e o partido do projeto, apresentados lado a lado.' },
    { n: 'iii.', t: 'Projeto 3D', d: 'Imagens realistas para caminhar pelo espaço antes de a obra começar.' },
    { n: 'iv.', t: 'Obra e entrega', d: 'Detalhamento executivo e acompanhamento com parceiros de confiança.' },
  ];

  constructor() {
    afterNextRender(() => {
      const raiz: HTMLElement = this.el.nativeElement;
      revelar(raiz);
      if (movimentoReduzido()) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: raiz.querySelector('.processo__linha'), start: 'top 80%', end: 'bottom 50%', scrub: 1 },
      });
      tl.from(raiz.querySelector('.fio path'), { drawSVG: 0, ease: 'none', duration: 4 }, 0);
      raiz.querySelectorAll('.etapa').forEach((e, i) => tl.from(e, { opacity: 0, y: 30, duration: .8 }, i * .9));
    });
  }
}
