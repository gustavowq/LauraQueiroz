/* =====================================================================
   CASA — a geometria da Casa do Lago, em metros.
   Ala A (quartos) + Ala B (estar/lazer, mais alta) formando um L,
   paredes de pedra, pilares de metal, lajes com beiral, brises de
   freijó, deck, vidros, móveis e a iluminação interna (sancas,
   pendentes e pontos de luz que acendem no entardecer).
   Cada peça é guardada num grupo de animação (sobe, tetos, vidros…).
   ===================================================================== */
import * as THREE from 'three';
import { MateriaisMaquete, caixa } from './materiais-3d';

export function criarCasa(cena: THREE.Scene, mat: MateriaisMaquete) {
  const grupo = new THREE.Group();
  cena.add(grupo);

  // Grupos que a linha do tempo anima separadamente
  const sobe: THREE.Object3D[] = [];    // paredes, lajes e pilares que crescem do chão
  const tetos: THREE.Object3D[] = [];   // lajes de cobertura que descem
  const brises: THREE.Object3D[] = [];  // brises e deck
  const vidros: THREE.Object3D[] = [];
  const moveis: THREE.Object3D[] = [];

  // Materiais
  const pedra = (comp: number, alt: number) => mat.criar('#ffffff', mat.textura('pedra', comp / 2.4, alt / 2.4), .95);
  const concreto = mat.criar('#ffffff', mat.textura('cimento', 6, 2), .9);
  const metal = mat.criar('#1f1c19', undefined, .45, .6);
  const madeira = mat.criar('#ffffff', mat.textura('madeira', 4, 1), .75);
  const ripado = mat.criar('#ffffff', mat.textura('ripado', 1, 1), .7);
  const linho = mat.criar('#ffffff', mat.textura('linho', 2, 2), 1);
  const deck = mat.criar('#ffffff', mat.textura('ripado', 6, 1), .8);

  const altA = 3.3, altB = 4.3;

  // Pisos elevados
  sobe.push(caixa(7.6, .35, 19.6, concreto, -8.5, 0, -2.5));
  sobe.push(caixa(19.6, .35, 7.6, concreto, 4.5, 0, 3.5));
  // Ala A — quartos
  sobe.push(caixa(.45, altA, 19, pedra(19, altA), -11.8, .35, -2.5));
  sobe.push(caixa(7, altA, .45, pedra(7, altA), -8.5, .35, -11.8));
  sobe.push(caixa(7, altA, .3, concreto, -8.5, .35, -6));
  sobe.push(caixa(7, altA, .3, concreto, -8.5, .35, -1));
  // Ala B — estar e lazer
  sobe.push(caixa(19, altB, .45, pedra(19, altB), 4.5, .35, 6.8));
  sobe.push(caixa(.45, altB, 7, pedra(7, altB), 13.8, .35, 3.5));
  sobe.push(caixa(.3, altB, 7, concreto, 3, .35, 3.5));
  // Pilares ao longo das fachadas de vidro
  for (let z = -11.5; z <= -.5; z += 2.75) sobe.push(caixa(.16, altA, .16, metal, -5.1, .35, z));
  for (let x = -4.6; x <= 13.6; x += 3.05) sobe.push(caixa(.16, altB, .16, metal, x, .35, .1));

  // Coberturas finas com beiral profundo voltado para o lago
  const tetoA = caixa(9.2, .38, 21.4, concreto, -8.1, altA + .35, -2.6, false); tetoA.geometry.translate(0, .19, 0);
  const tetoB = caixa(21.4, .38, 9.6, concreto, 4.7, altB + .35, 2.9, false); tetoB.geometry.translate(0, .19, 0);
  tetos.push(tetoA, tetoB);

  // Brises de freijó em parte da fachada do estar + deck na beira d'água
  for (let i = 0; i < 16; i++) brises.push(caixa(.12, altB - .2, .5, ripado, 7.4 + i * .38, .45, -.25));
  brises.push(caixa(18, .2, 1.8, deck, 4.3, 0, -.9));
  brises.push(caixa(1.8, .2, 11, deck, -4.1, 0, -6.3));

  // Vidros (ganham um leve brilho âmbar quando as luzes acendem)
  const vidro = new THREE.MeshPhysicalMaterial({
    color: '#d7e2df', transparent: true, opacity: .26, roughness: .04, metalness: .1,
    emissive: new THREE.Color('#ffb767'), emissiveIntensity: 0, depthWrite: false,
  });
  const vA = caixa(.06, altA - .05, 11.6, vidro, -5.1, .35, -6.1);
  const vB = caixa(11.2, altB - .05, .06, vidro, 1.3, .35, .12);
  vA.castShadow = vB.castShadow = false;
  vidros.push(vA, vB);

  // Móveis vistos através do vidro
  moveis.push(caixa(3.2, .75, 1.1, linho, -1.5, .35, 4.8));    // sofá
  moveis.push(caixa(1.1, .75, 2.2, linho, -3.5, .35, 3.4));    // poltrona
  moveis.push(caixa(2.4, .42, 1.2, madeira, -1.5, .35, 2.6));  // mesa de centro
  moveis.push(caixa(3.2, .78, 1.2, madeira, 9.5, .35, 4.5));   // mesa de jantar
  moveis.push(caixa(2.2, .55, 2.6, linho, -9.8, .35, -9.2));   // camas
  moveis.push(caixa(2.2, .55, 2.6, linho, -9.8, .35, -3.6));

  [...sobe, ...tetos, ...brises, ...vidros, ...moveis].forEach((o) => grupo.add(o));

  // Iluminação: sancas sob as lajes, pendentes e pontos de luz quentes
  const sanca = new THREE.MeshStandardMaterial({ color: '#2a2622', emissive: new THREE.Color('#ffc27a'), emissiveIntensity: 0 });
  const s1 = caixa(.08, .06, 19.6, sanca, -5.4, altA + .28, -2.6, false);
  const s2 = caixa(19, .06, .08, sanca, 4.5, altB + .28, .4, false);
  s1.castShadow = s2.castShadow = false;
  grupo.add(s1, s2);

  const pendente = new THREE.MeshStandardMaterial({ color: '#f7e7cf', emissive: new THREE.Color('#ffcf8f'), emissiveIntensity: 0 });
  [[-1.5, 2.6], [.2, 2.6], [9.5, 4.5], [-8.6, -9], [-8.6, -3.6]].forEach(([x, z]) => {
    const p = new THREE.Mesh(new THREE.SphereGeometry(.28, 20, 12), pendente);
    p.position.set(x, 2.5, z);
    grupo.add(p);
  });

  const luzes: THREE.PointLight[] = [];
  [[-1, 2.6, 3.4], [8.5, 2.8, 3.6], [-8.5, 2.2, -8], [-8.5, 2.2, -3.4], [4, 3.2, -.4]].forEach(([x, y, z]) => {
    const l = new THREE.PointLight('#ffb766', 0, 16, 1.6);
    l.position.set(x, y, z);
    luzes.push(l);
    grupo.add(l);
  });

  // Estado inicial: nada construído ainda
  sobe.forEach((o) => (o.scale.y = .001));
  tetos.forEach((o) => { o.position.y += 14; o.visible = false; });
  brises.forEach((o) => (o.scale.y = .001));
  vidros.forEach((o) => (o.scale.y = .001));
  moveis.forEach((o) => o.scale.setScalar(.001));
  grupo.visible = false;

  return { grupo, sobe, tetos, brises, vidros, moveis, vidro, sanca, pendente, luzes };
}
