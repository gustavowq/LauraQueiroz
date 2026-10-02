/* =====================================================================
   OBRA — "A construção da Casa do Lago".
   Junta as peças da pasta ./cena (palco, terreno, casa, paisagem,
   câmera e linha do tempo), liga a animação à rolagem e só desenha
   a cena enquanto ela está visível na tela (economiza bateria).
   ===================================================================== */
import { Component, ElementRef, OnDestroy, ViewEncapsulation, afterNextRender, inject } from '@angular/core';
import * as THREE from 'three';
import { gsap, ScrollTrigger, movimentoReduzido } from '../../core/animacao/gsap';
import { CAPITULOS } from './obra.capitulos';
import { criarPalco3D } from './cena/palco-3d';
import { MateriaisMaquete } from './cena/materiais-3d';
import { contornoDoLago, criarTerrenoEPlanta } from './cena/terreno-e-planta';
import { criarCasa } from './cena/casa';
import { criarPaisagem } from './cena/paisagem';
import { QUADROS } from './cena/camera';
import { montarLinhaDoTempo } from './cena/linha-do-tempo';

@Component({
  selector: 'app-obra',
  templateUrl: './obra.component.html',
  styleUrl: './obra.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ObraComponent implements OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  protected capitulos = CAPITULOS;
  private desmontar: (() => void) | null = null;

  constructor() {
    afterNextRender(() => this.montar());
  }

  ngOnDestroy() {
    this.desmontar?.();
  }

  private montar() {
    const raiz: HTMLElement = this.el.nativeElement;
    const secao = raiz.querySelector('.obra') as HTMLElement;
    const tela = raiz.querySelector('.obra__palco') as HTMLElement;

    // 1. Palco e peças da cena
    const palco = criarPalco3D(raiz.querySelector('canvas') as HTMLCanvasElement);
    if (!palco) { tela.classList.add('tx', 'tx-pedra'); return; } // sem WebGL: mostra só a textura
    const materiais = new MateriaisMaquete();
    const lago = contornoDoLago();
    const planta = criarTerrenoEPlanta(palco.cena, lago);
    const casa = criarCasa(palco.cena, materiais);
    const paisagem = criarPaisagem(palco.cena, materiais, lago);
    const camera = { ...QUADROS[0] };

    // 2. Tamanho: acompanha a tela (em pé, a câmera abre mais o ângulo)
    const emPe = () => tela.clientWidth / tela.clientHeight < .9;
    const redimensionar = () => {
      const w = tela.clientWidth, h = tela.clientHeight;
      palco.renderer.setSize(w, h, false);
      palco.composer.setSize(w, h);
      palco.camera.aspect = w / h;
      palco.camera.fov = emPe() ? 52 : 32;
      palco.camera.updateProjectionMatrix();
    };
    redimensionar();
    const observador = new ResizeObserver(redimensionar);
    observador.observe(tela);

    // 3. Loop de desenho — roda só enquanto a seção está na tela
    let ligado = false, quadro = 0;
    const inicio = performance.now();
    const alvo = new THREE.Vector3();
    const desenhar = () => {
      quadro = requestAnimationFrame(desenhar);
      const t = (performance.now() - inicio) / 1000;
      const k = emPe() ? 1.35 : 1;
      palco.camera.position.set(camera.x * k + Math.sin(t * .25) * .3, camera.y * (k > 1 ? 1.15 : 1), camera.z * k);
      alvo.set(camera.tx, camera.ty, camera.tz);
      palco.camera.lookAt(alvo);
      paisagem.agua.position.y = .03 + Math.sin(t * 1.3) * .01; // água "respirando"
      palco.composer.render();
    };
    const ligar = (sim: boolean) => {
      if (sim === ligado) return;
      ligado = sim;
      if (sim) desenhar(); else cancelAnimationFrame(quadro);
    };

    // 4. Roteiro da animação
    const legendas = Array.from(raiz.querySelectorAll<HTMLElement>('.capitulo'));
    const tl = montarLinhaDoTempo({ palco, materiais, planta, casa, paisagem, camera }, {
      legendas,
      trilho: Array.from(raiz.querySelectorAll<HTMLElement>('.obra__trilho b')),
      escala: raiz.querySelector('.obra__escala') as HTMLElement,
      secao,
    });

    // 5. Ligação com a rolagem
    if (movimentoReduzido()) {
      // Sem animação: mostra direto a casa pronta ao entardecer
      tl.progress(1);
      legendas.forEach((c, i) => gsap.set(c, { autoAlpha: i === legendas.length - 1 ? 1 : 0 }));
      ScrollTrigger.create({ trigger: tela, start: 'top bottom', end: 'bottom top', onToggle: (s) => ligar(s.isActive) });
    } else {
      tl.progress(0.0001);
      // fixa o palco por 7,5 telas de rolagem e "arrasta" a linha do tempo
      ScrollTrigger.create({
        trigger: tela, start: 'top top', end: '+=750%', pin: true, scrub: 1.2,
        animation: tl,
        onToggle: (s) => s.isActive && ligar(true),
      });
      ScrollTrigger.create({ trigger: secao, start: 'top bottom', end: 'bottom top', onToggle: (s) => ligar(s.isActive) });
      // transição de entrada: o palco se abre em arco vindo do manifesto
      gsap.fromTo(tela, { clipPath: 'inset(18% 22% 0% 22% round 40vw 40vw 0vw 0vw)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 0vw 0vw 0vw 0vw)', ease: 'none',
        scrollTrigger: { trigger: secao, start: 'top bottom', end: 'top top', scrub: true },
      });
    }

    this.desmontar = () => {
      cancelAnimationFrame(quadro);
      observador.disconnect();
      palco.renderer.dispose();
    };
  }
}
