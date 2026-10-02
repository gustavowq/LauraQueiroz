/* =====================================================================
   PAISAGEM — o lago (espelho d'água com borda de pedra) e as árvores
   que brotam ao redor da casa.
   ===================================================================== */
import * as THREE from 'three';
import { MateriaisMaquete } from './materiais-3d';

export function criarPaisagem(cena: THREE.Scene, mat: MateriaisMaquete, lago: [number, number][]) {
  // Lago
  const forma = new THREE.Shape(lago.map(([x, z]) => new THREE.Vector2(x - 5, -(z + 6.8))));
  const aguaMat = new THREE.MeshStandardMaterial({ color: '#5f7f7d', roughness: .08, metalness: .25, transparent: true, opacity: .94 });
  const agua = new THREE.Mesh(new THREE.ShapeGeometry(forma, 48), aguaMat);
  agua.rotation.x = -Math.PI / 2;
  agua.position.set(5, .03, -6.8);
  agua.receiveShadow = true;
  agua.scale.setScalar(.001);
  cena.add(agua);

  // Borda clara de pedra em volta do lago
  const borda = new THREE.Mesh(new THREE.ShapeGeometry(forma, 48), mat.criar('#ffffff', mat.textura('cimento', 3, 3), .9));
  borda.rotation.x = -Math.PI / 2;
  borda.position.set(5, .015, -6.8);
  borda.scale.set(1.07, 1.1, 1);
  borda.receiveShadow = true;
  borda.visible = false;
  cena.add(borda);

  // Árvores: tronco + duas copas facetadas (x, z, tamanho)
  const copa = mat.criar('#4b5a3e', undefined, .9);
  const tronco = mat.criar('#5a4636', undefined, .9);
  copa.flatShading = true;
  const arvores: THREE.Group[] = [];
  [[-16, -7, 1.1], [-16.5, 2, .9], [-15.5, 9, 1], [17.5, 4.5, 1], [-2, 11.5, .85], [8, 12, 1.1], [16, 10.5, .8], [-9, 13, .75]]
    .forEach(([x, z, tamanho]) => {
      const g = new THREE.Group();
      const t = new THREE.Mesh(new THREE.CylinderGeometry(.12, .2, 3, 6), tronco);
      t.position.y = 1.5; t.castShadow = true;
      const c1 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 1), copa);
      c1.position.y = 3.6; c1.scale.set(1, .9, 1); c1.castShadow = true;
      const c2 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 1), copa);
      c2.position.set(.9, 4.4, .3); c2.castShadow = true;
      g.add(t, c1, c2);
      g.position.set(x, 0, z);
      g.userData['tamanho'] = tamanho;
      g.scale.setScalar(.001);
      arvores.push(g);
      cena.add(g);
    });

  return { agua, aguaMat, borda, arvores };
}
