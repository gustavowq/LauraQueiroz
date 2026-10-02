/* =====================================================================
   PALCO 3D — o "estúdio fotográfico" da cena:
   renderizador, céu (degradê que vira entardecer), sol com sombras,
   luz ambiente, câmera e o brilho suave (bloom) das luzes à noite.
   ===================================================================== */
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export interface Palco3D {
  renderer: THREE.WebGLRenderer;
  cena: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  ceu: { topo: THREE.Color; base: THREE.Color };
  sol: THREE.DirectionalLight;
  ambiente: THREE.HemisphereLight;
  composer: EffectComposer;
  bloom: UnrealBloomPass;
}

/** Cria o palco. Devolve null se o aparelho não suportar WebGL. */
export function criarPalco3D(canvas: HTMLCanvasElement): Palco3D | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const cena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, .5, 600);

  // Céu: esfera com degradê vertical (cor do topo → cor do horizonte)
  const ceu = { topo: new THREE.Color('#EDE6DB'), base: new THREE.Color('#EDE6DB') };
  const ceuMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: { uTopo: { value: ceu.topo }, uBase: { value: ceu.base } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: 'uniform vec3 uTopo; uniform vec3 uBase; varying vec3 vP; void main(){ float h = smoothstep(-.05,.55,vP.y); gl_FragColor = vec4(mix(uBase,uTopo,h),1.); }',
  });
  cena.add(new THREE.Mesh(new THREE.SphereGeometry(300, 32, 16), ceuMat));
  cena.fog = new THREE.Fog(ceu.base.clone(), 90, 260);

  // Luzes: ambiente suave + sol com sombra
  const ambiente = new THREE.HemisphereLight('#fffaf2', '#b9ad9a', 1.15);
  cena.add(ambiente);
  const sol = new THREE.DirectionalLight('#fff4e4', 2.4);
  sol.position.set(-30, 46, -18);
  sol.castShadow = true;
  sol.shadow.mapSize.set(2048, 2048);
  const sombra = sol.shadow.camera as THREE.OrthographicCamera;
  sombra.left = -34; sombra.right = 34; sombra.top = 34; sombra.bottom = -34; sombra.near = 1; sombra.far = 140;
  sol.shadow.bias = -0.0004;
  sol.shadow.normalBias = 0.03;
  cena.add(sol);

  // Pós-processamento: brilho das luzes no entardecer
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(cena, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0, .5, .88);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  return { renderer, cena, camera, ceu, sol, ambiente, composer, bloom };
}
