/* =====================================================================
   REVELAR — animações de entrada reutilizadas pelas seções.
   Basta marcar o elemento no HTML:
     data-linhas  → título sobe linha por linha, saindo de uma máscara
     data-sobe    → bloco sobe e aparece
     data-arco    → imagem se abre de baixo para cima em formato de arco
   ===================================================================== */
import { gsap, SplitText, movimentoReduzido } from './gsap';

export function revelar(raiz: HTMLElement) {
  if (movimentoReduzido()) return;

  raiz.querySelectorAll<HTMLElement>('[data-linhas]').forEach((titulo) => {
    const s = SplitText.create(titulo, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
    gsap.from(s.lines, {
      yPercent: 105, duration: 1.2, stagger: .1, ease: 'expo.out',
      scrollTrigger: { trigger: titulo, start: 'top 88%' },
    });
  });

  raiz.querySelectorAll<HTMLElement>('[data-sobe]').forEach((el) => {
    gsap.from(el, { y: 40, opacity: 0, duration: 1.1, scrollTrigger: { trigger: el, start: 'top 92%' } });
  });

  raiz.querySelectorAll<HTMLElement>('[data-arco]').forEach((el) => {
    gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0% round 50% 50% 0% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 50% 50% 0% 0%)', duration: 1.6, ease: 'expo.inOut',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });
}
