/* =====================================================================
   DO TRAÇO AO ESPAÇO — comparador "antes × depois".
   Ao aparecer, o desenho técnico se traça linha por linha e o divisor
   desliza até o meio. Depois a pessoa arrasta para comparar.
   ===================================================================== */
import { Component, ElementRef, ViewEncapsulation, afterNextRender, inject, signal } from '@angular/core';
import { gsap, movimentoReduzido } from '../../core/animacao/gsap';
import { revelar } from '../../core/animacao/revelar';

@Component({
  selector: 'app-traco',
  templateUrl: './traco.component.html',
  styleUrl: './traco.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TracoComponent {
  private el = inject(ElementRef<HTMLElement>);
  /** posição do divisor, em % da largura (0 = só desenho, 100 = só espaço pronto) */
  protected corte = signal(50);

  /** Arrastar com mouse ou dedo em qualquer ponto do comparador. */
  protected arrastar(ev: PointerEvent) {
    const caixa = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    const mover = (x: number) => this.corte.set(Math.min(100, Math.max(0, ((x - caixa.left) / caixa.width) * 100)));
    mover(ev.clientX);
    const aoMover = (e: PointerEvent) => mover(e.clientX);
    const aoSoltar = () => { removeEventListener('pointermove', aoMover); removeEventListener('pointerup', aoSoltar); };
    addEventListener('pointermove', aoMover);
    addEventListener('pointerup', aoSoltar);
  }

  constructor() {
    afterNextRender(() => {
      const raiz: HTMLElement = this.el.nativeElement;
      revelar(raiz);
      if (movimentoReduzido()) return;
      const valor = { v: 100 };
      this.corte.set(100);
      gsap.timeline({ scrollTrigger: { trigger: raiz.querySelector('.comparador'), start: 'top 75%' } })
        .from(raiz.querySelectorAll('.desenho path'), { drawSVG: 0, duration: 1.6, stagger: .06, ease: 'power2.inOut' })
        .to(valor, { v: 50, duration: 1.6, ease: 'expo.inOut', onUpdate: () => this.corte.set(valor.v) }, '-=.6');
    });
  }
}
