/**
 * Opções do configurador — fonte única.
 *
 * A página do configurador renderiza estas listas e o mapeamento de
 * pré-preenchimento (`configuratorPrefill.ts`) escolhe de entre estas mesmas
 * constantes. Assim é impossível pré-selecionar um valor que não exista como
 * opção real no formulário.
 *
 * As listas e os textos são exatamente os que já estavam no configurador.
 */

export const TIPO_VOLANTE = {
  ORIGINAL: "Original (retrim)",
  FLAT_BOTTOM: "Achatado em baixo (flat bottom)",
  FLAT_TOP_BOTTOM: "Achatado em cima e baixo",
  RACING: "Racing / GT",
  OEM_PLUS: "OEM+",
} as const;

export const MATERIAL = {
  ALCANTARA: "Alcântara",
  PELE_PERFURADA: "Pele perfurada",
  PELE_LISA: "Pele lisa (nappa)",
  ALCANTARA_PELE: "Combinação Alcântara + Pele",
  ALCANTARA_CARBONO: "Combinação Alcântara + Carbono",
} as const;

export const CARBONO = {
  SEM: "Sem carbono",
  TWILL: "Carbono twill 2x2",
  FORGED: "Carbono forged",
  COM_ALCANTARA: "Carbono + Alcântara",
} as const;

export const COR_COSTURAS = {
  VERMELHO: "Vermelho",
  PRETO: "Preto",
  BRANCO: "Branco",
  CINZA: "Cinza",
  AZUL: "Azul",
  AMARELO: "Amarelo",
  TOM_SOBRE_TOM: "Tom-sobre-tom",
  TRICOLOR: "Tricolor M",
  OUTRA: "Outra",
} as const;

export const COR_FAIXA = {
  SEM: "Sem faixa",
  VERMELHO: "Vermelho",
  BRANCO: "Branco",
  AZUL: "Azul",
  AMARELO: "Amarelo",
  TRICOLOR: "Tricolor M",
  VERDE_AMG: "Verde AMG",
  OUTRA: "Outra",
} as const;

export const EXTRAS = {
  LED: "Indicador LED de mudança",
  PATILHAS: "Patilhas de velocidade em alumínio",
  AQUECIMENTO: "Aquecimento do volante",
  LOGOTIPO: "Logótipo personalizado gravado",
  AIRBAG: "Airbag retrimado a condizer",
  APOIO_BRACO: "Apoio de braço a condizer",
  MANIPULO: "Manípulo da caixa a condizer",
  FOLE: "Fole da caixa a condizer",
} as const;

/** Ordem de apresentação no formulário — igual à que já existia. */
export const TIPO_VOLANTE_LIST: string[] = [
  TIPO_VOLANTE.ORIGINAL,
  TIPO_VOLANTE.FLAT_BOTTOM,
  TIPO_VOLANTE.FLAT_TOP_BOTTOM,
  TIPO_VOLANTE.RACING,
  TIPO_VOLANTE.OEM_PLUS,
];

export const MATERIAL_LIST: string[] = [
  MATERIAL.ALCANTARA,
  MATERIAL.PELE_PERFURADA,
  MATERIAL.PELE_LISA,
  MATERIAL.ALCANTARA_PELE,
  MATERIAL.ALCANTARA_CARBONO,
];

export const CARBONO_LIST: string[] = [CARBONO.SEM, CARBONO.TWILL, CARBONO.FORGED, CARBONO.COM_ALCANTARA];

export const COR_COSTURAS_LIST: string[] = [
  COR_COSTURAS.VERMELHO,
  COR_COSTURAS.PRETO,
  COR_COSTURAS.BRANCO,
  COR_COSTURAS.CINZA,
  COR_COSTURAS.AZUL,
  COR_COSTURAS.AMARELO,
  COR_COSTURAS.TOM_SOBRE_TOM,
  COR_COSTURAS.TRICOLOR,
  COR_COSTURAS.OUTRA,
];

export const COR_FAIXA_LIST: string[] = [
  COR_FAIXA.SEM,
  COR_FAIXA.VERMELHO,
  COR_FAIXA.BRANCO,
  COR_FAIXA.AZUL,
  COR_FAIXA.AMARELO,
  COR_FAIXA.TRICOLOR,
  COR_FAIXA.VERDE_AMG,
  COR_FAIXA.OUTRA,
];

export const EXTRAS_LIST: string[] = [
  EXTRAS.LED,
  EXTRAS.PATILHAS,
  EXTRAS.AQUECIMENTO,
  EXTRAS.LOGOTIPO,
  EXTRAS.AIRBAG,
  EXTRAS.APOIO_BRACO,
  EXTRAS.MANIPULO,
  EXTRAS.FOLE,
];
