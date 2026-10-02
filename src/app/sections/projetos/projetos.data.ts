/* =====================================================================
   DADOS DOS PROJETOS — lista do portfólio. Para adicionar um projeto,
   inclua um item aqui (e uma ilustração ou foto com o mesmo id).
   ===================================================================== */
export interface Material { nome: string; textura: string; }
export interface Projeto { id: string; nome: string; categoria: string; linha: string; materiais: Material[]; }

const M = {
  pedra: { nome: 'Pedra filetada', textura: 'pedra' },
  vidro: { nome: 'Vidro', textura: 'cimento' },
  freijo: { nome: 'Freijó', textura: 'ripado' },
  linho: { nome: 'Linho', textura: 'linho' },
  musgo: { nome: 'Laca musgo', textura: 'musgo' },
  cimento: { nome: 'Cimento queimado', textura: 'cimento' },
  terracota: { nome: 'Terracota', textura: 'terracota' },
  mostarda: { nome: 'Mostarda', textura: 'mostarda' },
  azul: { nome: 'Azul petróleo', textura: 'azul' },
  pedraPreta: { nome: 'Pedra preta escovada', textura: 'pedraPreta' },
  offwhite: { nome: 'Off-white', textura: 'offwhite' },
};

export const CATEGORIAS = ['Todos', 'Casas', 'Apartamentos', 'Infantil', 'Gastronomia'];

export const PROJETOS: Projeto[] = [
  { id: 'lago', nome: 'Casa do Lago', categoria: 'Casas', linha: 'Planta em L que emoldura o lago', materiais: [M.pedra, M.vidro, M.freijo] },
  { id: 'alive', nome: 'Ap Alive', categoria: 'Apartamentos', linha: 'Brasilidade em poucos metros, Setor Bueno', materiais: [M.azul, M.mostarda, M.freijo] },
  { id: 'miguel', nome: 'Quartinho do Miguel', categoria: 'Infantil', linha: 'Off-white, lambris de madeira e linho', materiais: [M.offwhite, M.freijo, M.linho] },
  { id: 'opera', nome: 'Ópera Café Bistrô', categoria: 'Gastronomia', linha: 'Um lugar de encontro, com Lara Alecrim', materiais: [M.terracota, M.cimento, M.musgo] },
  { id: 'verde', nome: 'Cozinha Verde', categoria: 'Apartamentos', linha: 'Provençal com olhar contemporâneo', materiais: [M.musgo, M.cimento, M.freijo] },
  { id: 'lavabo', nome: 'Lavabo Gourmet', categoria: 'Apartamentos', linha: 'Cimento queimado, ripado e pedra escovada', materiais: [M.cimento, M.freijo, M.pedraPreta] },
];
