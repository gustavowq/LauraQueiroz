/* =====================================================================
   PROJETOS — portfólio com filtro por categoria.
   Computador: a seção fica fixa e a faixa de cartões corre para o lado
   conforme a rolagem; cada imagem se abre em arco ao entrar na tela.
   Celular: cartões empilhados, abrindo em arco um a um.
   ===================================================================== */
import { Component, ElementRef, ViewEncapsulation, afterNextRender, computed, inject, signal } from '@angular/core';
import { gsap, movimentoReduzido } from '../../core/animacao/gsap';
import { revelar } from '../../core/animacao/revelar';
import { IlustracaoComponent } from '../../shared/ilustracao/ilustracao.component';
import { CATEGORIAS, PROJETOS, Projeto } from './projetos.data';

@Component({
  selector: 'app-projetos',
  imports: [IlustracaoComponent],
  templateUrl: './projetos.component.html',
  styleUrl: './projetos.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ProjetosComponent {
  private el = inject(ElementRef<HTMLElement>);
  protected categorias = CATEGORIAS;
  protected projetos = PROJETOS;
  protected filtro = signal('Todos');
  protected visiveis = computed(() => this.projetos.filter((p) => this.ativo(p)).length);

  protected ativo(p: Projeto) { return this.filtro() === 'Todos' || p.categoria === this.filtro(); }
  protected filtrar(c: string) { this.filtro.set(c); }
  protected numero(i: number) { return String(i + 1).padStart(2, '0'); }
  protected listaDeMateriais(p: Projeto) { return p.materiais.map((m) => m.nome).join(' · '); }

  constructor() {
    afterNextRender(() => this.animar());
  }

  private animar() {
    const raiz: HTMLElement = this.el.nativeElement;
    revelar(raiz);
    if (movimentoReduzido()) return;

    const secao = raiz.querySelector('.projetos') as HTMLElement;
    const trilho = raiz.querySelector('.trilho') as HTMLElement;
    const imagens = trilho.querySelectorAll<HTMLElement>('.cartao__img');
    const telas = gsap.matchMedia();

    // Computador: rolagem horizontal
    telas.add('(min-width: 801px)', () => {
      const distancia = () => Math.max(0, trilho.scrollWidth - innerWidth);
      const correr = gsap.to(trilho, {
        x: () => -distancia(), ease: 'none',
        scrollTrigger: { trigger: secao, start: 'top top', end: () => '+=' + distancia(), pin: true, scrub: 1, invalidateOnRefresh: true },
      });
      imagens.forEach((img) => {
        // abre em arco ao entrar pela direita
        gsap.fromTo(img, { clipPath: 'inset(60% 0% 0% 0% round 50% 50% 0% 0%)' }, {
          clipPath: 'inset(0% 0% 0% 0% round 50% 50% 0% 0%)', ease: 'none',
          scrollTrigger: { trigger: img, containerAnimation: correr, start: 'left 100%', end: 'left 55%', scrub: true },
        });
        // paralaxe da ilustração dentro do arco
        gsap.fromTo(img.querySelector('svg'), { xPercent: 12 }, {
          xPercent: -12, ease: 'none',
          scrollTrigger: { trigger: img, containerAnimation: correr, start: 'left right', end: 'right left', scrub: true },
        });
      });
    });

    // Celular: cartões empilhados
    telas.add('(max-width: 800px)', () => {
      imagens.forEach((img) => gsap.fromTo(img, { clipPath: 'inset(100% 0% 0% 0% round 50% 50% 0% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 50% 50% 0% 0%)', duration: 1.4, ease: 'expo.inOut',
        scrollTrigger: { trigger: img, start: 'top 85%' },
      }));
    });
  }
}
