/* =====================================================================
   HERO — a primeira dobra do site e a primeira grande transição.
   Entrada: as brises descem uma a uma e o título sobe linha por linha.
   Rolagem (seção fica fixa): o arco cresce até ocupar a tela, as brises
   giram como uma fachada se abrindo e revelam o manifesto, que acende
   palavra por palavra.
   ===================================================================== */
import { Component, ElementRef, ViewEncapsulation, afterNextRender, inject } from '@angular/core';
import { gsap, SplitText, movimentoReduzido } from '../../core/animacao/gsap';
import { EstudioService } from '../../core/estado/estudio.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class HeroComponent {
  private el = inject(ElementRef<HTMLElement>);
  private estudio = inject(EstudioService);

  /** Sequência de materiais das brises, da esquerda para a direita. */
  protected brises = ['ripado', 'pedra', 'ripado', 'linho', 'ripado', 'pedra', 'musgo', 'ripado', 'pedra', 'ripado', 'linho', 'ripado', 'pedra', 'ripado'];

  constructor() {
    afterNextRender(() => this.animar());
  }

  private animar() {
    const raiz: HTMLElement = this.el.nativeElement;
    const hero = raiz.querySelector('.hero') as HTMLElement;
    const janela = raiz.querySelector('.hero__janela') as HTMLElement;
    const palco = raiz.querySelector('.brises') as HTMLElement;
    const tiras = Array.from(raiz.querySelectorAll<HTMLElement>('.brise'));
    const manifesto = raiz.querySelector('.hero__manifesto') as HTMLElement;
    const palavras = SplitText.create(raiz.querySelector('.manifesto-txt'), { type: 'words', wordsClass: 'palavra' }).words;

    // O arco é um recorte (clip-path) calculado a partir da posição do .hero__janela,
    // então ele se adapta sozinho a qualquer tamanho de tela.
    const recorteArco = () => {
      const h = hero.getBoundingClientRect(), j = janela.getBoundingClientRect();
      const topo = j.top - h.top, esq = j.left - h.left, dir = h.right - j.right, base = h.bottom - j.bottom, raio = j.width / 2;
      return `inset(${topo}px ${dir}px ${base}px ${esq}px round ${raio}px ${raio}px 0px 0px)`;
    };
    const telaCheia = 'inset(0px 0px 0px 0px round 0px 0px 0px 0px)';

    gsap.set(manifesto, { autoAlpha: 0 });
    gsap.set(palco, { clipPath: recorteArco() });
    if (movimentoReduzido()) { gsap.set(palavras, { opacity: 1 }); return; }

    // --- Entrada (depois da abertura) ---
    const titulo = SplitText.create(raiz.querySelector('.hero-titulo'), { type: 'lines', mask: 'lines', linesClass: 'split-line' });
    const entrada = gsap.timeline({ paused: true })
      .from(tiras, { yPercent: -102, duration: 1.4, stagger: { each: .05, from: 'end' }, ease: 'expo.out' })
      .from(titulo.lines, { yPercent: 105, duration: 1.3, stagger: .1, ease: 'expo.out' }, .15)
      .from(raiz.querySelectorAll('.hero-in'), { y: 24, opacity: 0, stagger: .08 }, .5)
      .from('.hero__legenda', { opacity: 0 }, 1);
    this.estudio.quandoPronto(() => entrada.play());

    // --- Paralaxe: a luz "desliza" pelas brises acompanhando o mouse ---
    const deslocar = gsap.quickTo(tiras, 'backgroundPositionX', { duration: 1.2, ease: 'power3' });
    hero.addEventListener('pointermove', (e) => deslocar((e.clientX / innerWidth - .5) * -40));

    // --- Rolagem: arco cresce → brises giram → manifesto acende ---
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: hero, start: 'top top', end: '+=260%', pin: true, scrub: 1, invalidateOnRefresh: true },
    })
      .to('.hero__texto', { yPercent: -18, opacity: 0, duration: .5 }, 0)
      .to('.hero__legenda', { opacity: 0, duration: .2 }, 0)
      .fromTo(palco, { clipPath: () => recorteArco() }, { clipPath: telaCheia, duration: 1, ease: 'power2.inOut' }, 0)
      .fromTo(tiras, { backgroundSize: '260px' }, { backgroundSize: '340px', duration: 1 }, 0)
      .set(manifesto, { autoAlpha: 1 }, 1)
      .to(tiras, { rotationY: 88, duration: 1, stagger: { each: .05, from: 'center' }, ease: 'power2.in' }, 1.05)
      .to(tiras, { opacity: 0, duration: .3, stagger: { each: .05, from: 'center' } }, 1.7)
      .to(palavras, { opacity: 1, duration: .3, stagger: .08 }, 1.6);
  }
}
