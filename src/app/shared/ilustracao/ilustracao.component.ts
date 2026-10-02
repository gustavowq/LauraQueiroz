/* =====================================================================
   ILUSTRAÇÃO — desenha um projeto em estilo de elevação arquitetônica
   (lago, alive, miguel, opera, verde, lavabo). Ocupa o lugar das fotos
   enquanto o site é um esboço.
   Uso: <app-ilustracao nome="lago" rotulo="Casa do Lago" />
   ===================================================================== */
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ilustracao',
  templateUrl: './ilustracao.component.html',
  styles: [':host{display:contents}'],
})
export class IlustracaoComponent {
  readonly nome = input.required<string>();
  readonly rotulo = input('');
}
