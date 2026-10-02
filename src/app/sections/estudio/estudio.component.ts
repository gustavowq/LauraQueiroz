/* =====================================================================
   O ESTÚDIO — quem é a Laura. Os números contam de zero até o valor
   quando aparecem na tela.
   ===================================================================== */
import { Component, ElementRef, ViewEncapsulation, afterNextRender, inject } from '@angular/core';
import { gsap, movimentoReduzido } from '../../core/animacao/gsap';
import { revelar } from '../../core/animacao/revelar';

@Component({
  selector: 'app-estudio',
  templateUrl: './estudio.component.html',
  styleUrl: './estudio.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class EstudioComponent {
  private el = inject(ElementRef<HTMLElement>);

  constructor() {
    afterNextRender(() => {
      const raiz: HTMLElement = this.el.nativeElement;
      revelar(raiz);
      if (movimentoReduzido()) return;
      // <b class="conta" data-alvo="10" data-sufixo="+"> conta 0 → 10+
      raiz.querySelectorAll<HTMLElement>('.conta').forEach((b) => {
        const n = { v: 0 }, alvo = Number(b.dataset['alvo']), sufixo = b.dataset['sufixo'] ?? '';
        gsap.to(n, {
          v: alvo, duration: 2, ease: 'power2.out',
          scrollTrigger: { trigger: b, start: 'top 90%' },
          onUpdate: () => (b.textContent = Math.round(n.v) + sufixo),
        });
      });
    });
  }
}
