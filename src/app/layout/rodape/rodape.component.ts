/* =====================================================================
   RODAPÉ — fecha a página com o nome da Laura em letras grandes.
   ===================================================================== */
import { Component, ElementRef, ViewEncapsulation, afterNextRender, inject } from '@angular/core';
import { gsap, SplitText, movimentoReduzido } from '../../core/animacao/gsap';

@Component({
  selector: 'app-rodape',
  templateUrl: './rodape.component.html',
  styleUrl: './rodape.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class RodapeComponent {
  private el = inject(ElementRef<HTMLElement>);

  constructor() {
    afterNextRender(() => {
      if (movimentoReduzido()) return;
      const nome = this.el.nativeElement.querySelector('.rodape__nome');
      const letras = SplitText.create(nome, { type: 'chars', mask: 'chars' }).chars;
      gsap.from(letras, {
        yPercent: 110, stagger: .04, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: nome, start: 'top 92%' },
      });
    });
  }
}
