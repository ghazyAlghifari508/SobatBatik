// Centralized static dummy data for SobatBatik UI
import { Shirt, ShoppingBag, Scissors, Briefcase, ShieldCheck, Truck, RotateCcw, Lock, Landmark, Smartphone, Banknote, Camera, Layers, Music, Play, Send } from 'lucide-react'

export const categories = [
  {
    id: "batik-cap",
    label: "Batik Cap",
    icon: <Briefcase className="w-8 h-8" />,
    count: 48,
    description: "Koleksi batik cap autentik",
    color: "from-amber-800 to-amber-600",
  },
  {
    id: "batik-tulis",
    label: "Batik Tulis",
    icon: <Shirt className="w-8 h-8" />,
    count: 65,
    description: "Koleksi batik tulis premium",
    color: "from-rose-800 to-rose-600",
  },
  {
    id: "batik-kombinasi",
    label: "Batik Kombinasi",
    icon: <Layers className="w-8 h-8" />,
    count: 32,
    description: "Perpaduan motif klasik dan modern",
    color: "from-yellow-800 to-yellow-600",
  },
  {
    id: "pakaian",
    label: "Pakaian",
    icon: <ShoppingBag className="w-8 h-8" />,
    count: 27,
    description: "Pakaian pria dan wanita bermotif batik",
    color: "from-stone-800 to-stone-600",
  },
]

export const testimonials = [
  {
    id: "t1",
    name: "Siti Rahayu",
    avatar: "SR",
    location: "Jakarta",
    rating: 5,
    comment:
      "Kualitas batiknya luar biasa! Warna tidak luntur meski sudah dicuci berkali-kali. Pengirimannya juga cepat. SobatBatik is the best!",
    product: "Batik Tulis Lasem Merah",
  },
  {
    id: "t2",
    name: "Budi Santoso",
    avatar: "BS",
    location: "Surabaya",
    rating: 5,
    comment:
      "Saya sudah berbelanja di SobatBatik lebih dari 10 kali. Selalu puas dengan kualitas dan autentisitas produknya. Recommended!",
    product: "Kemeja Batik Solo Modern",
  },
  {
    id: "t3",
    name: "Dewi Maharani",
    avatar: "DM",
    location: "Bandung",
    rating: 4,
    comment:
      "Dress batik Yogyakarta-nya cantik sekali! Bahan nyaman dan motifnya indah. Packaging juga rapih dan premium.",
    product: "Dress Batik Yogyakarta Klasik",
  },
  {
    id: "t4",
    name: "Rizky Pratama",
    avatar: "RP",
    location: "Medan",
    rating: 5,
    comment:
      "Terima kasih SobatBatik sudah membantu saya menemukan batik asli daerah untuk dibawa sebagai oleh-oleh ke luar negeri!",
    product: "Kain Batik Pekalongan",
  },
]

export const benefitItems = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "100% Autentik",
    description: "Setiap produk terverifikasi keasliannya langsung dari pengrajin batik Indonesia",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Pengiriman Cepat",
    description: "Estimasi 2-5 hari kerja ke seluruh Indonesia dengan kemasan aman",
  },
  {
    icon: <RotateCcw className="w-6 h-6" />,
    title: "Mudah Dikembalikan",
    description: "Tidak puas? Kembalikan produk dalam 14 hari tanpa pertanyaan",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Pembayaran Aman",
    description: "Transaksi dilindungi sistem enkripsi SSL terpercaya",
  },
]

export const regions = [
  "Semua Daerah",
  "Solo",
  "Yogyakarta",
  "Pekalongan",
  "Lasem",
  "Cirebon",
  "Madura",
  "Bali",
  "Kalimantan",
]

export const categoryOptions = [
  "Semua Kategori",
  "Pria",
  "Wanita",
  "Kain",
  "Aksesori",
]

export const sortOptions = [
  { value: "newest", label: "Terbaru" },
  { value: "price_asc", label: "Harga: Rendah ke Tinggi" },
  { value: "price_desc", label: "Harga: Tinggi ke Rendah" },
  { value: "rating", label: "Rating Tertinggi" },
  { value: "popular", label: "Terpopuler" },
]

export const shippingMethods = [
  {
    id: "reguler",
    name: "Reguler",
    provider: "JNE REG",
    duration: "3-5 hari kerja",
    price: 15000,
  },
  {
    id: "express",
    name: "Express",
    provider: "JNE YES",
    duration: "1-2 hari kerja",
    price: 35000,
  },
  {
    id: "same_day",
    name: "Same Day",
    provider: "GoSend",
    duration: "Hari ini (order sebelum 12:00)",
    price: 55000,
  },
]

export const paymentMethods = [
  { id: "cod", name: "Bayar di Tempat (COD)", icon: <Banknote className="w-5 h-5" /> },
]

export const dummyOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-11-20",
    total: 600000,
    status: "Selesai",
    items_count: 2,
    items: [
      { name: "Batik Tulis Lasem Merah", qty: 1, price: 350000 },
      { name: "Kain Batik Pekalongan", qty: 1, price: 150000 },
    ],
    shipping_address: "Jl. Mawar No. 12, Kebayoran Baru, Jakarta Selatan",
    shipping_method: "JNE REG",
    shipping_cost: 15000,
    payment_method: "Transfer Bank",
  },
  {
    id: "ORD-2024-002",
    date: "2024-11-28",
    total: 935000,
    status: "Dikirim",
    items_count: 1,
    items: [
      { name: "Dress Batik Yogyakarta Klasik", qty: 1, price: 485000 },
      { name: "Selendang Batik Mega Mendung", qty: 2, price: 195000 },
    ],
    shipping_address: "Jl. Anggrek No. 7, Menteng, Jakarta Pusat",
    shipping_method: "JNE YES",
    shipping_cost: 35000,
    payment_method: "E-Wallet",
  },
  {
    id: "ORD-2024-003",
    date: "2024-12-05",
    total: 275000,
    status: "Dikemas",
    items_count: 1,
    items: [
      { name: "Tas Batik Tenun Dayak", qty: 1, price: 275000 },
    ],
    shipping_address: "Jl. Melati No. 23, Sukajadi, Bandung",
    shipping_method: "GoSend",
    shipping_cost: 55000,
    payment_method: "Transfer Bank",
  },
]

export const socialLinks = [
  { name: "Instagram", icon: <Camera className="w-5 h-5" />, url: "#" },
  { name: "Facebook", icon: <Layers className="w-5 h-5" />, url: "#" },
  { name: "TikTok", icon: <Music className="w-5 h-5" />, url: "#" },
  { name: "YouTube", icon: <Play className="w-5 h-5" />, url: "#" },
  { name: "Twitter/X", icon: <Send className="w-5 h-5" />, url: "#" },
]

export const footerLinks = {
  belanja: [
    { label: "Semua Produk", to: "/shop" },
    { label: "Batik Pria", to: "/shop?category=Pria" },
    { label: "Batik Wanita", to: "/shop?category=Wanita" },
    { label: "Kain Batik", to: "/shop?category=Kain" },
    { label: "Aksesori", to: "/shop?category=Aksesori" },
  ],
  perusahaan: [
    { label: "Tentang Kami", to: "/about" },
    { label: "Blog", to: "#" },
    { label: "Karir", to: "#" },
    { label: "Kontak", to: "/contact" },
  ],
  bantuan: [
    { label: "FAQ", to: "#" },
    { label: "Cara Pembelian", to: "#" },
    { label: "Kebijakan Pengembalian", to: "#" },
    { label: "Kebijakan Privasi", to: "#" },
    { label: "Syarat & Ketentuan", to: "#" },
  ],
}
