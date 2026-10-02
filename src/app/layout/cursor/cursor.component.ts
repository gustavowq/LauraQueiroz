/* =====================================================================
   CURSOR — círculo que acompanha o mouse com um leve atraso.
   Cresce sobre links e mostra "ver" sobre elementos com data-cursor="ver".
   Desligado em telas de toque.
   ===================================================================== */
import { Component, ElementRef, ViewEncapsulation, afterNextRender, inject } from '@angular/core';
import { gsap } from '../../core/animacao/gsap';

@Component({
  selector: 'app-cursor',
  templateUrl: './cursor.component.html',
  styleUrl: './cursor.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class CursorComponent {
  private el = inject(ElementRef<HTMLElement>);

  constructor() {
    afterNextRender(() => {
      if (matchMedia('(pointer: coarse)').matches) return;
      const c = this.el.nativeElement.querySelector('.cursor') as HTMLElement;
      const x = gsap.quickTo(c, 'x', { duration: .45, ease: 'power3' });
      const y = gsap.quickTo(c, 'y', { duration: .45, ease: 'power3' });
      addEventListener('pointermove', (e) => {
        x(e.clientX); y(e.clientY);
        const alvo = e.target as HTMLElement;
        c.classList.toggle('is-ver', !!alvo.closest?.('[data-cursor="ver"]'));
        c.classList.toggle('is-link', !!alvo.closest?.('a,button,input,select,textarea,label'));
      });
    });
  }
}
