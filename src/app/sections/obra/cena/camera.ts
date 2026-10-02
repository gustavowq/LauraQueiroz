/* =====================================================================
   CÂMERA — os enquadramentos de cada capítulo.
   A câmera viaja de uma vista de cima (planta) para a axonometria
   (maquete) e termina na altura dos olhos, do outro lado do lago.
   x/y/z = posição da câmera · tx/ty/tz = ponto para onde ela olha.
   ===================================================================== */
export interface Quadro { x: number; y: number; z: number; tx: number; ty: number; tz: number; }

export const QUADROS: Quadro[] = [
  { x: 0, y: 92, z: .6, tx: 1, ty: 0, tz: -2 },      // i.   terreno (vista de cima)
  { x: 2, y: 62, z: 8, tx: 1, ty: 0, tz: -2 },       // ii.  planta
  { x: 40, y: 36, z: 40, tx: 0, ty: 0, tz: -2 },     // iii. volume (axonometria)
  { x: 26, y: 15, z: 32, tx: -3, ty: 2, tz: 0 },     // iv.  matéria
  { x: 34, y: 11, z: -32, tx: 0, ty: 1, tz: -2 },    // v.   água
  { x: 24, y: 6, z: -25, tx: -3, ty: 2, tz: 1 },     // vi.  transparência
  { x: 16, y: 3.4, z: -23, tx: -4, ty: 2.4, tz: 2 }, // vii. luz
  { x: 11, y: 3, z: -19, tx: -5, ty: 2.6, tz: 2 },   // fim
];
