/* =====================================================================
   APP — componente raiz. Só monta a página (ver app.component.html)
   e recalcula as animações de rolagem quando as fontes terminam de
   carregar (as fontes mudam a altura dos textos).
   ===================================================================== */
import { Component, afterNextRender } from '@angular/core';
import { ScrollTrigger } from './core/animacao/gsap';
import { TexDefsComponent } from './shared/tex-defs/tex-defs.component';
import { LoaderComponent } from './layout/loader/loader.component';
import { CursorComponent } from './layout/cursor/cursor.component';
import { NavComponent } from './layout/nav/nav.component';
import { RodapeComponent } from './layout/rodape/rodape.component';
import { HeroComponent } from './sections/hero/hero.component';
import { PrincipiosComponent } from './sections/principios/principios.component';
import { ObraComponent } from './sections/obra/obra.component';
import { ProjetosComponent } from './sections/projetos/projetos.component';
import { MundinhoComponent } from './sections/mundinho/mundinho.component';
import { ProcessoComponent } from './sections/processo/processo.component';
import { TracoComponent } from './sections/traco/traco.component';
import { EstudioComponent } from './sections/estudio/estudio.component';
import { BeloComponent } from './sections/belo/belo.component';
import { ContatoComponent } from './sections/contato/contato.component';

@Component({
  selector: 'app-root',
  imports: [
    TexDefsComponent, LoaderComponent, CursorComponent, NavComponent, RodapeComponent,
    HeroComponent, PrincipiosComponent, ObraComponent, ProjetosComponent, MundinhoComponent,
    ProcessoComponent, TracoComponent, EstudioComponent, BeloComponent, ContatoComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor() {
    document.documentElement.lang = 'pt-BR';
    afterNextRender(() => {
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      addEventListener('load', () => ScrollTrigger.refresh());
    });
  }
}
