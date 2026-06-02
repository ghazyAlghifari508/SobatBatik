import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Clock, Send, Loader2, Camera, Layers, Music } from 'lucide-react'
import { toast } from 'sonner'

const contactInfo = [
  { Icon: Mail, label: 'Email', value: 'halo@sobatbatik.id', sub: 'Kami membalas dalam 24 jam' },
  { Icon: Phone, label: 'Telepon', value: '+62 812-3456-7890', sub: 'Senin–Jumat, 09.00–17.00 WIB' },
  { Icon: MapPin, label: 'Alamat', value: 'Jl. Batik Nusantara No. 17', sub: 'Jakarta Selatan, DKI Jakarta 12180' },
  { Icon: Clock, label: 'Jam Kerja', value: 'Senin – Jumat', sub: '09.00 – 17.00 WIB' },
]

const subjects = [
  'Pertanyaan Produk',
  'Masalah Pesanan',
  'Kemitraan Toko',
  'Laporan Bug',
  'Lainnya',
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: subjects[0], message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Pesan berhasil dikirim! Kami akan membalas segera.')
    setForm({ name: '', email: '', subject: subjects[0], message: '' })
    setLoading(false)
  }

  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <section className="relative py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 batik-pattern opacity-15" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-6">
            <Mail className="h-4 w-4" /> Hubungi Kami
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Ada Pertanyaan?</h1>
          <p className="text-white/80 text-xl max-w-xl mx-auto">
            Tim kami siap membantu Anda. Kirimkan pesan dan kami akan merespons secepat mungkin.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Contact Info */}
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold mb-2">Informasi Kontak</h2>
              <p className="text-muted-foreground text-sm">Pilih cara yang paling nyaman untuk menghubungi kami.</p>
            </div>

            <div className="space-y-3">
              {contactInfo.map(({ Icon, label, value, sub }) => (
                <div key={label} className="glass-card rounded-2xl p-4 flex gap-4 card-hover">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-sm mb-4">Ikuti Kami</h3>
              <div className="flex gap-3">
                {[
                  { icon: Camera, label: 'Instagram', handle: '@sobatbatik' },
                  { icon: Layers, label: 'Facebook', handle: 'SobatBatik' },
                  { icon: Music, label: 'TikTok', handle: '@sobatbatik' },
                ].map(({ icon: Icon, label, handle }) => (
                  <a
                    key={label}
                    href="#"
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted transition-colors text-center flex-1"
                    aria-label={`${label} - ${handle}`}
                  >
                    <Icon className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{handle}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">Kirim Pesan</h2>
                <p className="text-muted-foreground text-sm">Lengkapi form di bawah dan kami akan menghubungi Anda.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name">Nama Lengkap</Label>
                    <Input
                      id="contact-name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="nama@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-subject">Subjek</Label>
                  <select
                    id="contact-subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    {subjects.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-message">Pesan</Label>
                  <textarea
                    id="contact-message"
                    placeholder="Tulis pesan Anda di sini..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring resize-none transition-all"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 rounded-2xl font-semibold gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Mengirim...</>
                  ) : (
                    <><Send className="h-4 w-4" />Kirim Pesan</>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Dengan mengirim pesan, Anda menyetujui{' '}
                  <a href="#" className="text-primary hover:underline">Kebijakan Privasi</a> kami.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>


    </div>
  )
}
