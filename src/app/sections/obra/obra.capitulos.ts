/* =====================================================================
   CAPÍTULOS — os textos que aparecem no canto da tela durante a
   construção da Casa do Lago. Um capítulo por etapa da animação 3D.
   ===================================================================== */
export interface Capitulo { n: string; titulo: string; texto: string; }

export const CAPITULOS: Capitulo[] = [
  { n: 'i.', titulo: 'Terreno', texto: 'Tudo começa pelo lugar: o sol, as vistas e a água que Victor e Ju sonhavam ter em casa.' },
  { n: 'ii.', titulo: 'Planta em L', texto: 'Os dois braços da casa abraçam o lago. Quartos de um lado, estar e lazer do outro.' },
  { n: 'iii.', titulo: 'Volume', texto: 'A casa ganha corpo como uma maquete branca: cheios, vazios e a sombra que eles desenham.' },
  { n: 'iv.', titulo: 'Matéria', texto: 'Pedra filetada ancora a casa no terreno. O freijó aquece. O metal preto desenha as linhas.' },
  { n: 'v.', titulo: 'Água', texto: 'O lago é o centro do projeto. Todos os quartos e áreas de lazer se voltam para ele.' },
  { n: 'vi.', titulo: 'Transparência', texto: 'Vedações em vidro trazem o entorno para dentro. A paisagem entra pela sala.' },
  { n: 'vii.', titulo: 'Luz', texto: 'Ao entardecer, a iluminação assume a cena. A luz é metade do projeto.' },
];
