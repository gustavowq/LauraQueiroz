/* =====================================================================
   SOBRE O BELO — o jornal do site. As dicas que hoje ficam nos stories
   viram textos que podem ser encontrados no Google.
   ===================================================================== */
import { Component, ElementRef, ViewEncapsulation, afterNextRender, inject } from '@angular/core';
import { revelar } from '../../core/animacao/revelar';

@Component({
  selector: 'app-belo',
  templateUrl: './belo.component.html',
  styleUrl: './belo.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class BeloComponent {
  private el = inject(ElementRef<HTMLElement>);
  /** cat = categoria · tx = textura usada como imagem de capa */
  protected textos = [
    { cat: 'Iluminação', titulo: 'Por que a luz é metade do projeto', tx: 'pedraPreta' },
    { cat: 'Infantil', titulo: 'Cinco motivos para ter um beliche em casa', tx: 'linho' },
    { cat: 'Paisagismo', titulo: 'Trepadeiras: o verde que sobe pelas paredes', tx: 'musgo' },
  ];

  constructor() {
    afterNextRender(() => revelar(this.el.nativeElement));
  }
}
