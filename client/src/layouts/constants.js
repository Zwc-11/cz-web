export const LAYOUTS = {
  'tapestry-loom': {
    id: 'tapestry-loom',
    label: 'Loom',
    tagline: 'Woven threads · editorial columns · warm atelier',
    theme: 'loom',
    core: 'loom',
  },
  'tapestry-aurora': {
    id: 'tapestry-aurora',
    label: 'Halcyon',
    tagline: 'Soft glass · luminous violet · weightless type',
    theme: 'aurora',
    core: 'constellation',
  },
  'tapestry-gilded': {
    id: 'tapestry-gilded',
    label: 'Foundry',
    tagline: 'Brutalist steel · amber edges · hard light',
    theme: 'gilded',
    core: 'dial',
  },
  'tapestry-noir': {
    id: 'tapestry-noir',
    label: 'Eclipse',
    tagline: 'Monochrome · hairline rules · pure negative space',
    theme: 'noir',
    core: 'topo',
  },
  'tapestry-pulse': {
    id: 'tapestry-pulse',
    label: 'Synth',
    tagline: 'Neon terminal · green glow · scanline panels',
    theme: 'pulse',
    core: 'hex',
  },
};

export const LAYOUT_ORDER = [
  'tapestry-loom',
  'tapestry-aurora',
  'tapestry-gilded',
  'tapestry-noir',
  'tapestry-pulse',
];

/** Migrate legacy layout ids */
export function resolveLayoutId(id) {
  if (LAYOUTS[id]) return id;
  if (id === 'tapestry') return 'tapestry-loom';
  return 'tapestry-loom';
}
