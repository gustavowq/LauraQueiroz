/* =====================================================================
   TEX-DEFS — registra as texturas de materiais como padrões SVG,
   uma vez só, para todas as ilustrações da página usarem.
   ===================================================================== */
import { Component } from '@angular/core';
import { texUrl, TexName } from '../../core/materiais/texturas';

@Component({
  selector: 'app-tex-defs',
  templateUrl: './tex-defs.component.html',
})
export class TexDefsComponent {
  /** nome da textura + tamanho do "azulejo" em pixels */
  protected lista = ([
    ['ripado', 150], ['madeira', 200], ['pedra', 180], ['linho', 120], ['cimento', 160], ['terracota', 160],
    ['musgo', 160], ['offwhite', 160], ['pedraPreta', 140], ['azul', 160], ['mostarda', 160],
  ] as [TexName, number][]).map(([n, s]) => ({ n, s, url: texUrl(n) }));
}
