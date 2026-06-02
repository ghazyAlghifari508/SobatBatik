import { ArrowRight, Puzzle, PenTool, Globe, Heart, Landmark, HeartHandshake, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const values = [
  {
    title: 'Filosofi Batik',
    description: 'Setiap motif batik memiliki makna mendalam yang diwariskan selama berabad-abad. Dari motif kawung yang melambangkan kesempurnaan, hingga parang yang menggambarkan kekuatan dan keberanian.',
    icon: <Puzzle className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Teknik Pembuatan',
    description: 'Batik tulis dikerjakan dengan canting dan malam secara manual, membutuhkan keahlian dan kesabaran tinggi. Setiap lembar kain adalah mahakarya yang unik dan tak tertandingi.',
    icon: <PenTool className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Warisan UNESCO',
    description: 'Pada tahun 2009, UNESCO menetapkan batik Indonesia sebagai Warisan Kemanusiaan untuk Budaya Lisan dan Nonbendawi. Ini adalah pengakuan dunia atas kekayaan budaya Indonesia.',
    icon: <Globe className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Pelestarian Budaya',
    description: 'Dengan membeli batik autentik dari pengrajin lokal, Anda turut berpartisipasi dalam melestarikan warisan budaya dan meningkatkan kesejahteraan para pengrajin batik Indonesia.',
    icon: <Heart className="w-8 h-8 text-primary" />,
  },
]

const team = [
  { name: 'Andi Wijaya', role: 'Co-Founder & CEO', avatar: 'AW', bg: 'from-amber-700 to-amber-500' },
  { name: 'Sari Dewi', role: 'Co-Founder & CMO', avatar: 'SD', bg: 'from-rose-700 to-rose-500' },
  { name: 'Budi Santoso', role: 'Head of Curation', avatar: 'BS', bg: 'from-stone-700 to-stone-500' },
  { name: 'Melinda Putri', role: 'Product Director', avatar: 'MP', bg: 'from-amber-600 to-yellow-500' },
]

export default function About() {
  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 batik-pattern-dense opacity-15" />
        <div className="absolute -right-20 top-10 w-72 h-72 rounded-full bg-white/5 animate-float" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-8">
            <Landmark className="h-4 w-4" /> Tentang Kami
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Misi Kami Menghidupkan<br />
            <span style={{ background: 'linear-gradient(135deg, hsl(43 85% 68%) 0%, hsl(35 80% 78%) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Batik Indonesia
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            SobatBatik lahir dari kecintaan mendalam terhadap warisan budaya batik Indonesia dan keinginan untuk menghubungkan pengrajin lokal dengan dunia.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-[hsl(43_85%_42%)] uppercase tracking-widest mb-3">Cerita Kami</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">
                Berawal dari Satu Helai Kain Batik
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Pada tahun 2022, ketika kami mengunjungi workshop batik tulis di Lasem, kami terpesona oleh keindahan dan kerumitan proses pembuatan batik. Namun kami juga menyaksikan bagaimana para pengrajin berjuang memasarkan karya mereka di era digital.
              </p>
              <p>
                SobatBatik hadir sebagai jembatan antara kekayaan tradisi batik Indonesia dengan pasar modern. Kami percaya bahwa setiap lembar batik mengandung cerita, perjuangan, dan keindahan yang layak untuk dihargai dan dijangkau oleh semua orang.
              </p>
              <p>
                Hari ini, kami bangga telah membantu lebih dari 50 pengrajin batik dari berbagai penjuru Indonesia memasarkan karya mereka dan mendapatkan penghidupan yang layak.
              </p>
            </div>
            <Button size="lg" className="rounded-2xl gap-2" asChild>
              <Link to="/shop">Jelajahi Koleksi <ArrowRight className="h-5 w-5" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '500+', label: 'Produk Batik', desc: 'Dari seluruh nusantara' },
              { value: '50+', label: 'Pengrajin', desc: 'Mitra lokal terpilih' },
              { value: '10.000+', label: 'Pelanggan', desc: 'Di seluruh Indonesia' },
              { value: '15+', label: 'Daerah', desc: 'Asal batik autentik' },
            ].map(({ value, label, desc }) => (
              <div key={label} className="glass-card rounded-2xl p-5 text-center card-hover">
                <div className="text-3xl font-black text-primary mb-1">{value}</div>
                <div className="text-sm font-bold text-foreground">{label}</div>
                <div className="text-xs text-muted-foreground mt-1">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-[hsl(37_30%_91%)] relative">
        <div className="absolute inset-0 batik-pattern opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[hsl(43_85%_42%)] uppercase tracking-widest mb-3">Visi & Misi</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Tujuan Kami</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Melestarikan Budaya', icon: <Landmark className="w-12 h-12 mx-auto" />, desc: 'Menjaga keberlangsungan seni batik Indonesia sebagai warisan budaya yang hidup dan berkembang.' },
              { title: 'Memberdayakan Pengrajin', icon: <HeartHandshake className="w-12 h-12 mx-auto" />, desc: 'Memberikan platform digital yang memungkinkan pengrajin menjangkau pasar lebih luas dan mendapat penghasilan yang adil.' },
              { title: 'Mengedukasi Generasi', icon: <BookOpen className="w-12 h-12 mx-auto" />, desc: 'Memperkenalkan kekayaan filosofi dan nilai budaya batik kepada generasi muda Indonesia dan dunia.' },
            ].map(({ title, icon, desc }) => (
              <div key={title} className="glass-card rounded-2xl p-7 text-center card-hover">
                <div className="mb-5 text-primary">{icon}</div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Batik Values */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[hsl(43_85%_42%)] uppercase tracking-widest mb-3">Nilai Batik</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Kekayaan Budaya Batik</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Memahami lebih dalam tentang kekayaan filosofis dan budaya yang terkandung dalam setiap helai kain batik Indonesia</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 stagger-children">
          {values.map(({ title, description, icon }) => (
            <div key={title} className="glass-card rounded-2xl p-6 flex gap-4 card-hover">
              <div className="shrink-0">{icon}</div>
              <div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-[hsl(37_30%_91%)] relative">
        <div className="absolute inset-0 batik-dots opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[hsl(43_85%_42%)] uppercase tracking-widest mb-3">Tim Kami</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Orang-orang di Balik SobatBatik</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
            {team.map(({ name, role, avatar, bg }) => (
              <div key={name} className="glass-card rounded-2xl p-6 text-center card-hover">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${bg} flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-lg`}>
                  {avatar}
                </div>
                <h3 className="font-bold text-sm">{name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-12 text-center text-white">
          <div className="absolute inset-0 batik-pattern-dense opacity-10" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Bergabunglah Bersama Kami</h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Jadilah bagian dari komunitas yang melestarikan budaya batik Indonesia untuk generasi mendatang.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-2xl px-8" asChild>
                <Link to="/shop">Mulai Berbelanja</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-2xl px-8" asChild>
                <Link to="/contact">Hubungi Kami</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
