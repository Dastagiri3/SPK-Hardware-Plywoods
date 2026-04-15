export const CATEGORIES = [
  { id: 'cat-plywood', name: 'Plywood & Boards', slug: 'plywood-boards' },
  { id: 'cat-hardware', name: 'Hardware Fittings', slug: 'hardware-fittings' },
  { id: 'cat-laminates', name: 'Laminates & Veneers', slug: 'laminates-veneers' },
  { id: 'cat-doors', name: 'Doors & Frames', slug: 'doors-frames' },
  { id: 'cat-adhesives', name: 'Adhesives & Sealants', slug: 'adhesives-sealants' },
  { id: 'cat-modular', name: 'Modular Kitchen & Wardrobe', slug: 'modular-interior' },
];

export const PRODUCTS = [
  // Plywood & Boards
  {
    id: 'p1',
    name: 'Commercial Plywood Sheet',
    categoryId: 'cat-plywood',
    companyId: 'century',
    price: 2500,
    unit: 'Sheet',
    description: 'High-quality commercial grade plywood for general furniture use.',
    images: ['https://picsum.photos/seed/plywood1/400/400'],
    specs: { thickness: '18mm', grade: 'Commercial' }
  },
  {
    id: 'p2',
    name: 'Marine Grade Plywood',
    categoryId: 'cat-plywood',
    companyId: 'greenply',
    price: 3800,
    unit: 'Sheet',
    description: 'Waterproof marine grade plywood for high-moisture areas.',
    images: ['https://picsum.photos/seed/plywood2/400/400'],
    specs: { thickness: '19mm', grade: 'Marine' }
  },
  {
    id: 'p3',
    name: 'BWR Grade Plywood',
    categoryId: 'cat-plywood',
    companyId: 'century',
    price: 3200,
    unit: 'Sheet',
    description: 'Boiling Water Resistant plywood for kitchen and bathroom cabinets.',
    images: ['https://picsum.photos/seed/plywood3/400/400'],
    specs: { thickness: '18mm', grade: 'BWR' }
  },
  {
    id: 'p4',
    name: 'MDF Board (Medium Density Fiberboard)',
    categoryId: 'cat-plywood',
    companyId: 'merino',
    price: 1800,
    unit: 'Sheet',
    description: 'Smooth surface MDF board for interior paneling and furniture.',
    images: ['https://picsum.photos/seed/mdf/400/400'],
    specs: { thickness: '12mm', type: 'MDF' }
  },
  
  // Hardware Fittings
  {
    id: 'p5',
    name: 'Soft Close Cabinet Hinges',
    categoryId: 'cat-hardware',
    companyId: 'hettich',
    price: 450,
    unit: 'Pair',
    description: 'Premium soft-close hinges for kitchen and wardrobe doors.',
    images: ['https://picsum.photos/seed/hinge/400/400'],
    specs: { type: 'Soft Close', brand: 'Hettich' }
  },
  {
    id: 'p6',
    name: 'Telescopic Drawer Channels',
    categoryId: 'cat-hardware',
    companyId: 'ebco',
    price: 850,
    unit: 'Set',
    description: 'Heavy-duty drawer slides for smooth operation.',
    images: ['https://picsum.photos/seed/channel/400/400'],
    specs: { size: '18 inch', load: '45kg' }
  },
  {
    id: 'p7',
    name: 'Designer Door Handle',
    categoryId: 'cat-hardware',
    companyId: 'hafele',
    price: 1200,
    unit: 'Piece',
    description: 'Elegant stainless steel door handle for main doors.',
    images: ['https://picsum.photos/seed/handle/400/400'],
    specs: { material: 'SS 304', finish: 'Satin' }
  },
  
  // Laminates
  {
    id: 'p8',
    name: 'High Gloss Mica Sheet',
    categoryId: 'cat-laminates',
    companyId: 'merino',
    price: 1500,
    unit: 'Sheet',
    description: 'Vibrant high-gloss laminate for a modern look.',
    images: ['https://picsum.photos/seed/mica/400/400'],
    specs: { thickness: '1mm', finish: 'Gloss' }
  },
  {
    id: 'p9',
    name: 'Natural Wood Veneer',
    categoryId: 'cat-laminates',
    companyId: 'greenply',
    price: 4500,
    unit: 'Sheet',
    description: 'Premium natural wood veneer for luxury interiors.',
    images: ['https://picsum.photos/seed/veneer/400/400'],
    specs: { wood: 'Teak', type: 'Natural' }
  },
  
  // Doors
  {
    id: 'p10',
    name: 'Solid Flush Door',
    categoryId: 'cat-doors',
    companyId: 'century',
    price: 6500,
    unit: 'Piece',
    description: 'Durable and strong flush door for internal rooms.',
    images: ['https://picsum.photos/seed/door/400/400'],
    specs: { size: '80x32 inch', core: 'Solid' }
  },
  
  // Adhesives
  {
    id: 'p11',
    name: 'Fevicol SH Wood Adhesive',
    categoryId: 'cat-adhesives',
    companyId: 'fevicol',
    price: 450,
    unit: '1kg',
    description: 'The ultimate wood adhesive for all carpentry work.',
    images: ['https://picsum.photos/seed/glue/400/400'],
    specs: { weight: '1kg', type: 'PVA' }
  },

  // Modular
  {
    id: 'p12',
    name: 'Modular Kitchen Pull-out Basket',
    categoryId: 'cat-modular',
    companyId: 'ebco',
    price: 3500,
    unit: 'Piece',
    description: 'Stainless steel wire basket for modular kitchen storage.',
    images: ['https://picsum.photos/seed/basket/400/400'],
    specs: { material: 'SS 202', size: '15x20 inch' }
  },
  
  // Fasteners
  {
    id: 'p13',
    name: 'Wood Screws (Box of 100)',
    categoryId: 'cat-hardware',
    companyId: 'stanlee',
    price: 250,
    unit: 'Box',
    description: 'High-quality wood screws for furniture assembly.',
    images: ['https://picsum.photos/seed/screws/400/400'],
    specs: { size: '1.5 inch', material: 'Steel' }
  },
  {
    id: 'p14',
    name: 'Self-Tapping Screws',
    categoryId: 'cat-hardware',
    companyId: 'stanlee',
    price: 350,
    unit: 'Box',
    description: 'Self-tapping screws for metal and wood applications.',
    images: ['https://picsum.photos/seed/selftap/400/400'],
    specs: { size: '1 inch', type: 'Self-tap' }
  },
  
  // Adhesives & Sealants
  {
    id: 'p15',
    name: 'Silicone Sealant (Clear)',
    categoryId: 'cat-adhesives',
    companyId: 'fevicol',
    price: 280,
    unit: 'Tube',
    description: 'Waterproof silicone sealant for glass and bathroom joints.',
    images: ['https://picsum.photos/seed/silicone/400/400'],
    specs: { color: 'Clear', volume: '300ml' }
  },
  
  // Doors & Frames
  {
    id: 'p16',
    name: 'PVC Board (Waterproof)',
    categoryId: 'cat-plywood',
    companyId: 'action-tesa',
    price: 2200,
    unit: 'Sheet',
    description: '100% waterproof PVC board for bathroom and outdoor use.',
    images: ['https://picsum.photos/seed/pvc/400/400'],
    specs: { thickness: '12mm', density: '0.50' }
  },
  {
    id: 'p17',
    name: 'WPC Door Frame',
    categoryId: 'cat-doors',
    companyId: 'action-tesa',
    price: 1800,
    unit: 'Piece',
    description: 'Termite-proof and waterproof WPC door frame.',
    images: ['https://picsum.photos/seed/wpc/400/400'],
    specs: { size: '3x4 inch', material: 'WPC' }
  },
  
  // Interior Items
  {
    id: 'p18',
    name: 'Edge Banding Tape',
    categoryId: 'cat-modular',
    companyId: 'rehau',
    price: 15,
    unit: 'Meter',
    description: 'PVC edge banding for finishing plywood and MDF edges.',
    images: ['https://picsum.photos/seed/edge/400/400'],
    specs: { width: '22mm', thickness: '0.8mm' }
  }
];
