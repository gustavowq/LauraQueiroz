/* =====================================================================
   LINHA DO TEMPO — o roteiro da animação.
   Cada capítulo ocupa 1 unidade de tempo (0 a 8). A rolagem da página
   "arrasta" esta linha do tempo para frente e para trás.
     0 terreno · 1 planta · 2 volume · 3 matéria · 4 água
     5 transparência · 6 luz (entardecer) · 7 enquadramento final
   ===================================================================== */
import * as THREE from 'three';
import { gsap } from '../../../core/animacao/gsap';
import { Palco3D } from './palco-3d';
import { MateriaisMaquete } from './materiais-3d';
import { criarTerrenoEPlanta } from './terreno-e-planta';
import { criarCasa } from './casa';
import { criarPaisagem } from './paisagem';
import { Quadro, QUADROS } from './camera';

interface Pecas {
  palco: Palco3D;
  materiais: MateriaisMaquete;
  planta: ReturnType<typeof criarTerrenoEPlanta>;
  casa: ReturnType<typeof criarCasa>;
  paisagem: ReturnType<typeof criarPaisagem>;
  /** posição atual da câmera (lida a cada quadro pelo loop de render) */
  camera: Quadro;
}

interface Interface {
  legendas: HTMLElement[];
  trilho: HTMLElement[];
  escala: HTMLElement;
  secao: HTMLElement;
}

export function montarLinhaDoTempo({ palco, materiais, planta, casa, paisagem, camera }: Pecas, ui: Interface) {
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut', duration: 1 }, paused: true });
  const irPara = (i: number, quando: number, dur = 1) => tl.to(camera, { ...QUADROS[i], duration: dur }, quando);

  // Valores animados (o GSAP mexe neles; o onUpdate lá embaixo aplica na cena)
  const luz = { x: -30, y: 46, z: -18, sol: 2.4, ambiente: 1.15, bloom: 0, interior: 0, materia: 0, exposicao: 1.05 };
  const cores = {
    ceuTopo: new THREE.Color('#EDE6DB'), ceuBase: new THREE.Color('#EDE6DB'),
    chao: new THREE.Color('#EAE3D8'), sol: new THREE.Color('#fff4e4'),
  };
  const desenho = { grade: 0, curvas: 0, curvasOpacidade: 1, linhas: 0, rotulos: 0 };
  const aplicarDesenho = () => {
    planta.gradeMat.opacity = desenho.grade;
    planta.curvas.forEach((c) => { c.m.dashSize = desenho.curvas * c.comprimento; c.m.opacity = desenho.curvasOpacidade; });
    planta.linhas.forEach((l) => (l.m.dashSize = desenho.linhas * l.comprimento));
    planta.rotulos.forEach((m) => (m.opacity = desenho.rotulos));
  };

  // ---- Legendas e trilho de progresso (HTML) ----
  ui.legendas.forEach((c, i) => {
    tl.fromTo(c, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: .25, ease: 'power3.out' }, i + .05);
    if (i < ui.legendas.length - 1) tl.to(c, { autoAlpha: 0, y: -20, duration: .2, ease: 'power2.in' }, i + .9);
    tl.fromTo(ui.trilho[i], { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'none' }, i);
  });

  // ---- i. Terreno: grade e curvas de nível se desenham ----
  tl.to(desenho, { grade: .55, duration: .6, onUpdate: aplicarDesenho }, 0);
  tl.to(desenho, { curvas: 1, duration: .9, ease: 'power1.inOut', onUpdate: aplicarDesenho }, 0);

  // ---- ii. Planta: o L, as divisões e o lago são traçados ----
  irPara(1, .4, 1.4);
  tl.to(desenho, { linhas: 1, duration: 1.1, ease: 'power1.inOut', onUpdate: aplicarDesenho }, 1);
  tl.to(desenho, { rotulos: 1, duration: .4, onUpdate: aplicarDesenho }, 1.6);

  // ---- iii. Volume: maquete branca sobe do chão, lajes descem, sombra gira ----
  tl.set(casa.grupo, { visible: true }, 2);
  tl.set(ui.escala, { textContent: 'axonometria · maquete' }, 2.1);
  irPara(2, 1.9, 1.3);
  tl.to(desenho, { grade: 0, rotulos: 0, curvasOpacidade: .25, duration: .5, onUpdate: aplicarDesenho }, 2.2);
  casa.sobe.forEach((o, i) => tl.to(o.scale, { y: 1, duration: .55, ease: 'power3.out' }, 2.1 + (i % 12) * .035));
  casa.tetos.forEach((o, i) => {
    tl.set(o, { visible: true }, 2.45);
    tl.to(o.position, { y: '-=14', duration: .45, ease: 'power2.out' }, 2.55 + i * .1);
  });
  tl.to(luz, { x: 26, z: -34, duration: .9, ease: 'sine.inOut' }, 2.1);

  // ---- iv. Matéria: pedra, freijó e metal substituem o branco ----
  irPara(3, 3, 1);
  tl.set(ui.escala, { textContent: 'materiais · pedra, freijó, metal' }, 3.1);
  tl.to(luz, { x: -30, z: -18, duration: .8, ease: 'sine.inOut' }, 3.1);
  tl.to(luz, { materia: 1, duration: .8, onUpdate: () => materiais.aplicar(luz.materia) }, 3.1);
  tl.to(desenho, { linhas: 0, duration: .4, onUpdate: aplicarDesenho }, 3.1);
  tl.to(cores.chao, { r: .80, g: .78, b: .69, duration: .8, onUpdate: () => planta.chaoMat.color.copy(cores.chao) }, 3.1);
  casa.brises.forEach((o, i) => tl.to(o.scale, { y: 1, duration: .4, ease: 'power3.out' }, 3.35 + i * .025));

  // ---- v. Água: a borda aparece e o lago se enche ----
  irPara(4, 4, 1);
  tl.set(ui.escala, { textContent: 'espelho d’água no centro do L' }, 4.1);
  tl.set(paisagem.borda, { visible: true }, 4.1);
  tl.fromTo(paisagem.borda.scale, { x: .001, y: .001 }, { x: 1.07, y: 1.1, duration: .5, ease: 'power3.out' }, 4.1);
  tl.to(paisagem.agua.scale, { x: 1, y: 1, z: 1, duration: .7, ease: 'expo.out' }, 4.25);

  // ---- vi. Transparência: vidros sobem, móveis e árvores aparecem ----
  irPara(5, 5, 1);
  tl.set(ui.escala, { textContent: 'vista do lago · nível dos olhos' }, 5.1);
  casa.vidros.forEach((o, i) => tl.to(o.scale, { y: 1, duration: .5, ease: 'power3.inOut' }, 5.1 + i * .12));
  casa.moveis.forEach((o, i) => tl.to(o.scale, { x: 1, y: 1, z: 1, duration: .35, ease: 'back.out(2)' }, 5.3 + i * .05));
  paisagem.arvores.forEach((g, i) => {
    const s = g.userData['tamanho'];
    tl.to(g.scale, { x: s, y: s, z: s, duration: .5, ease: 'back.out(1.6)' }, 5.2 + i * .06);
  });

  // ---- vii. Luz: o sol se põe e a casa acende por dentro ----
  irPara(6, 6, 1.1);
  tl.set(ui.escala, { textContent: 'entardecer · luzes acesas' }, 6.1);
  tl.to(luz, { x: 40, y: 4, z: 18, sol: .3, ambiente: .2, exposicao: .95, duration: 1 }, 6);
  tl.to(cores.sol, { r: 1, g: .55, b: .3, duration: .8 }, 6);
  tl.to(cores.ceuTopo, { r: .13, g: .13, b: .19, duration: 1 }, 6);
  tl.to(cores.ceuBase, { r: .62, g: .43, b: .33, duration: 1 }, 6);
  tl.to(cores.chao, { r: .42, g: .40, b: .36, duration: 1, onUpdate: () => planta.chaoMat.color.copy(cores.chao) }, 6);
  tl.to(paisagem.aguaMat.color, { r: .16, g: .2, b: .24, duration: 1 }, 6);
  tl.to(luz, { interior: 1, bloom: 1, duration: .7 }, 6.35);

  // ---- Enquadramento final ----
  irPara(7, 7.05, .95);

  // A cada passo da linha do tempo, aplica luz e cor na cena
  tl.eventCallback('onUpdate', () => {
    const { sol, ambiente, renderer, ceu, cena, bloom } = palco;
    sol.position.set(luz.x, luz.y, luz.z);
    sol.intensity = luz.sol;
    sol.color.copy(cores.sol);
    ambiente.intensity = luz.ambiente;
    renderer.toneMappingExposure = luz.exposicao;
    ceu.topo.copy(cores.ceuTopo);
    ceu.base.copy(cores.ceuBase);
    (cena.fog as THREE.Fog).color.copy(cores.ceuBase);
    casa.sanca.emissiveIntensity = luz.interior * 2.2;
    casa.pendente.emissiveIntensity = luz.interior * 1.8;
    casa.vidro.emissiveIntensity = luz.interior * .32;
    casa.vidro.opacity = .26 + luz.interior * .3;
    casa.luzes.forEach((l) => (l.intensity = luz.interior * 9));
    bloom.strength = luz.bloom * .55;
    ui.secao.classList.toggle('is-noite', tl.time() > 6.3);
  });

  return tl;
}
