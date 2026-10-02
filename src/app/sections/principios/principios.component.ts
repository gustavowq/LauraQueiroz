/* =====================================================================
   PRINCÍPIOS — Matéria, Luz e Afeto: o que guia os projetos da Laura.
   ===================================================================== */
import { Component, ElementRef, ViewEncapsulation, afterNextRender, inject } from '@angular/core';
import { revelar } from '../../core/animacao/revelar';

@Component({
  selector: 'app-principios',
  templateUrl: './principios.component.html',
  styleUrl: './principios.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class PrincipiosComponent {
  private el = inject(ElementRef<HTMLElement>);
  protected principios = [
    { titulo: 'Matéria', texto: 'Pedra, madeira, linho e cimento queimado, escolhidos pela verdade de cada material e pelo toque.' },
    { titulo: 'Luz', texto: 'A iluminação é metade do projeto. Experimente o botão “Luz da noite” no topo da página.' },
    { titulo: 'Afeto', texto: 'Brasilidade, aconchego e a cara de quem mora. Nenhum projeto se parece com o anterior.' },
  ];

  constructor() {
    afterNextRender(() => revelar(this.el.nativeElement));
  }
}
