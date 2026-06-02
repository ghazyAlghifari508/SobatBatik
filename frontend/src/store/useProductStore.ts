import { create } from 'zustand'

export interface Product {
  _id: string
  store_id: string
  store_name: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  origin_region: string
  image_urls: string[]
  is_active: boolean
  rating: number
  reviews_count: number
  material: string
  pattern: string
  is_new?: boolean
  is_featured?: boolean
  discount_percent?: number
}

interface ProductState {
  products: Product[]
  setProducts: (products: Product[]) => void
  addProduct: (product: Omit<Product, '_id' | 'is_active'>) => void
  updateProduct: (id: string, data: Partial<Product>) => void
  deleteProduct: (id: string) => void
  toggleProductStatus: (id: string) => void
}

const mockProducts: Product[] = [
  {
    _id: "p1",
    store_id: "s1",
    store_name: "Batik Kencana",
    name: "Batik Tulis Lasem Merah",
    description: "Batik tulis asli dari Lasem dengan motif klasik Tiga Negeri. Dibuat oleh pengrajin berpengalaman menggunakan malam asli dan pewarna alami. Setiap lembar adalah karya seni yang unik dengan detail halus yang menunjukkan keahlian tinggi.",
    price: 350000,
    stock: 10,
    category: "Pria",
    origin_region: "Lasem",
    image_urls: [
      "https://images.unsplash.com/photo-1605808892462-8178a9cbbff4?w=800&q=85",
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=85",
    ],
    is_active: true,
    rating: 4.8,
    reviews_count: 124,
    material: "Katun Prima 100%",
    pattern: "Tiga Negeri",
    is_featured: true,
  },
  {
    _id: "p2",
    store_id: "s2",
    store_name: "Griya Batik Solo",
    name: "Kemeja Batik Solo Modern",
    description: "Kemeja batik Solo dengan desain modern cocok untuk kerja maupun casual. Motif kawung yang elegan dipadukan dengan warna netral sehingga mudah dipadukan dengan berbagai outfit.",
    price: 250000,
    stock: 25,
    category: "Pria",
    origin_region: "Solo",
    image_urls: [
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=85",
      "https://images.unsplash.com/photo-1605808892462-8178a9cbbff4?w=800&q=85",
    ],
    is_active: true,
    rating: 4.6,
    reviews_count: 89,
    material: "Katun Dobi",
    pattern: "Kawung",
    is_featured: true,
  },
  {
    _id: "p3",
    store_id: "s1",
    store_name: "Batik Kencana",
    name: "Kain Batik Pekalongan Pesisir",
    description: "Kain batik Pekalongan motif pesisir warna cerah khas pantai utara Jawa. Cocok untuk dijahit menjadi berbagai pakaian atau sebagai hiasan dinding.",
    price: 150000,
    stock: 50,
    category: "Kain",
    origin_region: "Pekalongan",
    image_urls: [
      "https://images.unsplash.com/photo-1592881180860-6b2cba50bd07?w=800&q=85",
    ],
    is_active: true,
    rating: 4.5,
    reviews_count: 67,
    material: "Mori Prima",
    pattern: "Buketan",
    is_new: true,
  },
  {
    _id: "p4",
    store_id: "s3",
    store_name: "Warisan Batik Yogya",
    name: "Dress Batik Yogyakarta Klasik",
    description: "Dress batik Yogyakarta dengan motif parang rusak yang penuh makna filosofis. Jahitan premium dengan potongan A-line yang feminin dan elegan.",
    price: 485000,
    stock: 15,
    category: "Wanita",
    origin_region: "Yogyakarta",
    image_urls: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=85",
    ],
    is_active: true,
    rating: 4.9,
    reviews_count: 203,
    material: "Sutra ATBM",
    pattern: "Parang Rusak",
    is_featured: true,
    is_new: true,
  },
  {
    _id: "p5",
    store_id: "s4",
    store_name: "Canting Indah",
    name: "Blus Batik Cap Madura",
    description: "Blus batik cap dari Madura dengan motif bunga khas yang cerah dan enerjik. Bahan nyaman untuk dipakai sehari-hari di cuaca tropis Indonesia.",
    price: 185000,
    stock: 30,
    category: "Wanita",
    origin_region: "Madura",
    image_urls: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=85",
    ],
    is_active: true,
    rating: 4.4,
    reviews_count: 45,
    material: "Katun Rayon",
    pattern: "Ranting Bunga",
    discount_percent: 15,
  },
  {
    _id: "p6",
    store_id: "s2",
    store_name: "Griya Batik Solo",
    name: "Sarung Batik Truntum Solo",
    description: "Sarung batik motif Truntum khas Surakarta yang melambangkan kasih sayang. Sering digunakan dalam upacara pernikahan adat Jawa.",
    price: 320000,
    stock: 20,
    category: "Kain",
    origin_region: "Solo",
    image_urls: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=85",
    ],
    is_active: true,
    rating: 4.7,
    reviews_count: 156,
    material: "Katun Prima",
    pattern: "Truntum",
  },
  {
    _id: "p7",
    store_id: "s5",
    store_name: "Batik Bali Asri",
    name: "Kemeja Batik Bali Barong",
    description: "Kemeja batik Bali dengan motif Barong yang ikonik. Memadukan tradisi seni ukir Bali dengan teknik batik modern untuk hasil yang memukau.",
    price: 420000,
    stock: 8,
    category: "Pria",
    origin_region: "Bali",
    image_urls: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85",
    ],
    is_active: true,
    rating: 4.8,
    reviews_count: 91,
    material: "Katun Twill",
    pattern: "Barong",
    is_new: true,
    discount_percent: 10,
  },
  {
    _id: "p8",
    store_id: "s3",
    store_name: "Warisan Batik Yogya",
    name: "Set Kebaya Batik Sekar Jagad",
    description: "Set kebaya dan kain batik Sekar Jagad yang mewah untuk acara spesial. Motif bunga-bunga yang tersebar merata melambangkan keragaman yang indah.",
    price: 850000,
    stock: 5,
    category: "Wanita",
    origin_region: "Yogyakarta",
    image_urls: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=85",
    ],
    is_active: true,
    rating: 5.0,
    reviews_count: 38,
    material: "Brokat + Sutra",
    pattern: "Sekar Jagad",
    is_featured: true,
  },
  {
    _id: "p9",
    store_id: "s6",
    store_name: "Aksesori Batik Nusantara",
    name: "Tas Batik Tenun Dayak",
    description: "Tas hand-made dengan kombinasi batik dan tenun Dayak Kalimantan. Setiap tas adalah karya seni unik yang memperkenalkan kekayaan budaya Borneo.",
    price: 275000,
    stock: 12,
    category: "Aksesori",
    origin_region: "Kalimantan",
    image_urls: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=85",
    ],
    is_active: true,
    rating: 4.6,
    reviews_count: 72,
    material: "Tenun Ikat",
    pattern: "Dayak Geometrik",
    is_new: true,
  },
  {
    _id: "p10",
    store_id: "s1",
    store_name: "Batik Kencana",
    name: "Selendang Batik Mega Mendung",
    description: "Selendang batik Mega Mendung khas Cirebon dengan warna gradasi biru yang memukau. Motif awan yang mengalir melambangkan kesabaran dan kedamaian.",
    price: 195000,
    stock: 35,
    category: "Aksesori",
    origin_region: "Cirebon",
    image_urls: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=85",
    ],
    is_active: true,
    rating: 4.7,
    reviews_count: 118,
    material: "Sutra Halus",
    pattern: "Mega Mendung",
    discount_percent: 20,
  },
  {
    _id: "p11",
    store_id: "s4",
    store_name: "Canting Indah",
    name: "Rok Batik Sidomukti",
    description: "Rok midi batik dengan motif Sidomukti yang megah. Potongan modern memudahkan pergerakan sambil tetap tampil anggun dan profesional.",
    price: 310000,
    stock: 18,
    category: "Wanita",
    origin_region: "Solo",
    image_urls: [
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=85",
    ],
    is_active: true,
    rating: 4.5,
    reviews_count: 63,
    material: "Katun Satin",
    pattern: "Sidomukti",
  },
  {
    _id: "p12",
    store_id: "s5",
    store_name: "Batik Bali Asri",
    name: "Kemeja Batik Endek Bali",
    description: "Kemeja premium berbahan Endek Bali (tenun ikat) dengan paduan motif batik kontemporer. Cocok untuk acara formal maupun semi-formal.",
    price: 550000,
    stock: 7,
    category: "Pria",
    origin_region: "Bali",
    image_urls: [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=85",
    ],
    is_active: true,
    rating: 4.9,
    reviews_count: 47,
    material: "Endek Bali",
    pattern: "Kontemporer",
    is_featured: true,
  },
]

export const useProductStore = create<ProductState>((set) => ({
  products: mockProducts,
  setProducts: (products) => set({ products }),
  addProduct: (product) => set((state) => ({
    products: [...state.products, {
      ...product,
      _id: Math.random().toString(36).substr(2, 9),
      is_active: true
    }]
  })),
  updateProduct: (id, data) => set((state) => ({
    products: state.products.map(p => p._id === id ? { ...p, ...data } : p)
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p._id !== id)
  })),
  toggleProductStatus: (id) => set((state) => ({
    products: state.products.map(p => p._id === id ? { ...p, is_active: !p.is_active } : p)
  }))
}))
