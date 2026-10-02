/* =====================================================================
   LOADER (abertura) — primeira tela do site.
   Desenha o arco do logo, conta a "escala" de 1:500 até 1:50 como uma
   prancha sendo ampliada e depois libera o site (EstudioService.marcarPronto).
   Também gera as texturas de materiais enquanto a abertura roda.
   ===================================================================== */
import { Component, ElementRef, ViewEncapsulation, afterNextRender, inject, signal } from '@angular/core';
import { gsap, movimentoReduzido } from '../../core/animacao/gsap';
import { EstudioService } from '../../core/estado/estudio.service';
import { instalarTexturasCss } from '../../core/materiais/texturas';
import { ARCO_LQA } from '../../core/materiais/arco-lqa';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
  // Estilos globais: as classes já são exclusivas da seção (padrão BEM)
  // e as animações precisam alcançar elementos criados em tempo real.
  encapsulation: ViewEncapsulation.None,
})
export class LoaderComponent {
  private el = inject(ElementRef<HTMLElement>);
  private estudio = inject(EstudioService);
  protected arco = ARCO_LQA;
  protected escala = signal(500);

  constructor() {
    afterNextRender(() => {
      instalarTexturasCss();
      const tela = this.el.nativeElement.querySelector('.loader') as HTMLElement;
      if (movimentoReduzido()) { tela.remove(); this.estudio.marcarPronto(); return; }

      const esc = { v: 500 };
      gsap.timeline({ onComplete: () => tela.remove() })
        .from('.l-base', { drawSVG: '50% 50%', duration: .8, ease: 'power2.inOut' })
        .from('.l-arco', { drawSVG: 0, duration: 1.3, ease: 'power2.inOut' }, '-=.3')
        .to(esc, { v: 50, duration: 1.5, ease: 'power2.inOut', onUpdate: () => this.escala.set(Math.round(esc.v / 10) * 10) }, 0)
        .from('.loader__letras', { opacity: 0, letterSpacing: '1.6em', duration: 1 }, '-=.6')
        .to('.loader__mark', { scale: 1.15, opacity: 0, duration: .7, ease: 'power2.in' }, '+=.2')
        .add(() => this.estudio.marcarPronto(), '-=.15')
        .to(tela, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '-=.25');
    });
  }
}
