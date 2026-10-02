/* =====================================================================
   MATERIAIS 3D — o truque "maquete → matéria".
   Todo material começa branco como uma maquete de papel. Quando a
   animação chega ao capítulo "Matéria", um único valor (0 → 1) faz
   todos ganharem textura e cor reais ao mesmo tempo.
   ===================================================================== */
import * as THREE from 'three';
import { texCanvas, TexName } from '../../../core/materiais/texturas';

export const BRANCO_MAQUETE = new THREE.Color('#F4F0EA');

export class MateriaisMaquete {
  /** 0 = maquete branca, 1 = materiais reais */
  readonly mistura = { value: 0 };
  private lista: { m: THREE.MeshStandardMaterial; alvo: THREE.Color }[] = [];

  /** Textura repetida (rx × ry vezes) a partir da biblioteca de materiais. */
  textura(nome: TexName, rx: number, ry: number) {
    const t = new THREE.CanvasTexture(texCanvas(nome));
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rx, ry);
    t.anisotropy = 4;
    return t;
  }

  /** Cria um material que participa da transição maquete → matéria. */
  criar(corFinal: string, mapa?: THREE.Texture, aspereza = .85, metal = 0) {
    const m = new THREE.MeshStandardMaterial({ color: BRANCO_MAQUETE.clone(), map: mapa ?? null, roughness: aspereza, metalness: metal });
    m.onBeforeCompile = (shader) => {
      shader.uniforms['uMat'] = this.mistura;
      shader.fragmentShader = 'uniform float uMat;\n' + shader.fragmentShader.replace(
        '#include <map_fragment>',
        '#ifdef USE_MAP\n vec4 sampledDiffuseColor = texture2D( map, vMapUv );\n diffuseColor *= mix( vec4(1.0), sampledDiffuseColor, uMat );\n#endif',
      );
    };
    this.lista.push({ m, alvo: new THREE.Color(corFinal) });
    return m;
  }

  /** Aplica a mistura (0 → 1) em todos os materiais. */
  aplicar(t: number) {
    this.mistura.value = t;
    this.lista.forEach(({ m, alvo }) => m.color.lerpColors(BRANCO_MAQUETE, alvo, t));
  }
}

/** Caixa básica da arquitetura (parede, laje, pilar). Por padrão "cresce" a partir do chão. */
export function caixa(l: number, a: number, p: number, mat: THREE.Material, x: number, y: number, z: number, apoiadaNoChao = true) {
  const g = new THREE.BoxGeometry(l, a, p);
  if (apoiadaNoChao) g.translate(0, a / 2, 0);
  const malha = new THREE.Mesh(g, mat);
  malha.position.set(x, y, z);
  malha.castShadow = true;
  malha.receiveShadow = true;
  return malha;
}
