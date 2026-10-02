/* =====================================================================
   TERRENO E PLANTA — o "papel" do projeto:
   chão, grade milimetrada, curvas de nível, a planta em L com as
   divisões internas, o contorno do lago, as cotas e os rótulos.
   As linhas usam um traço tracejado que cresce, como se fossem
   desenhadas à mão.
   ===================================================================== */
import * as THREE from 'three';

export interface Traco { m: THREE.LineDashedMaterial; comprimento: number; }

/** Contorno orgânico do lago (pontos x, z em metros). */
export function contornoDoLago(): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const r = 1 + .08 * Math.sin(a * 3 + 1) + .05 * Math.cos(a * 5);
    pts.push([5 + Math.cos(a) * 8.2 * r, -6.8 + Math.sin(a) * 5.0 * r]);
  }
  return pts;
}

function linhaTracejada(pontos: THREE.Vector3[], cor: string) {
  const g = new THREE.BufferGeometry().setFromPoints(pontos);
  const m = new THREE.LineDashedMaterial({ color: cor, dashSize: 0, gapSize: 9999, transparent: true });
  const linha = new THREE.Line(g, m);
  linha.computeLineDistances();
  const d = g.getAttribute('lineDistance');
  return { linha, traco: { m, comprimento: d.getX(d.count - 1) } as Traco };
}

function rotulo(texto: string, x: number, z: number, giro = 0) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.font = '500 56px "DM Mono", monospace';
  ctx.fillStyle = '#4a433c';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(texto, 256, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: 0, depthWrite: false });
  const placa = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.5), m);
  placa.rotation.x = -Math.PI / 2;
  placa.rotation.z = giro;
  placa.position.set(x, .05, z);
  return { placa, m };
}

export function criarTerrenoEPlanta(cena: THREE.Scene, lago: [number, number][]) {
  // Chão
  const chaoMat = new THREE.MeshStandardMaterial({ color: '#EAE3D8', roughness: 1 });
  const chao = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), chaoMat);
  chao.rotation.x = -Math.PI / 2;
  chao.receiveShadow = true;
  cena.add(chao);

  // Grade do papel
  const grade = new THREE.GridHelper(80, 80, '#9c9184', '#c9bfb1');
  const gradeMat = grade.material as THREE.Material;
  gradeMat.transparent = true;
  gradeMat.opacity = 0;
  grade.position.y = .01;
  cena.add(grade);

  // Curvas de nível
  const curvas: Traco[] = [];
  for (let k = 0; k < 6; k++) {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      const r = 20 + k * 6 + 2.2 * Math.sin(a * 3 + k) + 1.4 * Math.cos(a * 5 - k * .7);
      pts.push(new THREE.Vector3(1 + Math.cos(a) * r * 1.15, .03, -2 + Math.sin(a) * r * .85));
    }
    const { linha, traco } = linhaTracejada(pts, '#a39684');
    curvas.push(traco);
    cena.add(linha);
  }

  // Planta: tudo que é "desenho de projeto" fica neste grupo
  const desenho = new THREE.Group();
  cena.add(desenho);
  const linhas: Traco[] = [];
  const desenhar = (pts: [number, number][], fechado = false, cor = '#2a2622') => {
    const v = pts.map(([x, z]) => new THREE.Vector3(x, .04, z));
    if (fechado) v.push(v[0].clone());
    const { linha, traco } = linhaTracejada(v, cor);
    linhas.push(traco);
    desenho.add(linha);
  };
  desenhar([[-12, -12], [-5, -12], [-5, 0], [14, 0], [14, 7], [-12, 7]], true); // o L
  desenhar([[-12, -6], [-5, -6]]);                                               // divisões internas
  desenhar([[-12, -1], [-5, -1]]);
  desenhar([[3, 0], [3, 7]]);
  desenhar([[-5, 0], [-5, 7]]);
  desenhar(lago, true, '#3E5A63');                                                // lago
  desenhar([[-12, 9.5], [14, 9.5]], false, '#7a6f63');                            // cotas
  desenhar([[-14.5, -12], [-14.5, 7]], false, '#7a6f63');

  const rotulos = [
    rotulo('26,00 m', 1, 10.6),
    rotulo('19,00 m', -15.6, -2.5, Math.PI / 2),
    rotulo('quartos', -8.5, -3.4),
    rotulo('estar · lazer', 8.5, 3.5),
    rotulo('lago', 5, -7),
  ];
  rotulos.forEach((r) => desenho.add(r.placa));

  return { chaoMat, gradeMat, curvas, linhas, rotulos: rotulos.map((r) => r.m) };
}
