/* =====================================================================
   GSAP — registra os plugins de animação uma única vez para o site todo.
   ScrollTrigger: animações ligadas à rolagem.
   SplitText: quebra títulos em linhas/palavras/letras.
   DrawSVG: faz linhas "se desenharem".
   MorphSVG: transforma uma forma em outra (os seixos do Mundinho).
   ===================================================================== */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MorphSVGPlugin);
gsap.defaults({ ease: 'power3.out', duration: 1 });

export { gsap, ScrollTrigger, SplitText };

/** true quando a pessoa pediu ao sistema para reduzir animações. */
export const movimentoReduzido = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
