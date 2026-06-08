import { useState } from 'react'
import { api } from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MessageSquare, Send, Loader2, HelpCircle, ShoppingBag, Bug, Handshake, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

const subjects = [
  'Saran & Masukan',
  'Masalah Pesanan',
  'Laporan Bug',
  'Lainnya',
]

const faqTopics = [
  {
    Icon: ShoppingBag,
    title: 'Masalah Pesanan',
    desc: 'Kendala dengan pesanan, pengiriman, atau pembayaran? Sampaikan detail pesanan Anda.',
  },
  {
    Icon: Handshake,
    title: 'Kemitraan Toko',
    desc: 'Ingin menjadi penjual di SobatBatik? Ceritakan tentang toko batik Anda.',
  },
  {
    Icon: Bug,
    title: 'Laporan Bug',
    desc: 'Menemukan error atau masalah teknis? Bantu kami memperbaikinya.',
  },
  {
    Icon: HelpCircle,
    title: 'Pertanyaan Lainnya',
    desc: 'Pertanyaan umum seputar platform, akun, atau fitur SobatBatik.',
  },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: subjects[0], message: '' })
  const [customSubject, setCustomSubject] = useState('')
  const [loading, setLoading] = useState(false)

  const isCustom = form.subject === 'Lainnya'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isCustom && !customSubject.trim()) {
      toast.error('Silakan isi subjek Anda.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...form,
        subject: isCustom ? customSubject.trim() : form.subject
      }
      const res = await api.post('/feedback', payload)
      if (res.data.success) {
        toast.success('Feedback berhasil dikirim! Tim kami akan meninjau pesan Anda.')
        setForm({ name: '', email: '', subject: subjects[0], message: '' })
        setCustomSubject('')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengirim pesan. Coba lagi nanti.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <section className="relative py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 batik-pattern opacity-15" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-6">
            <MessageSquare className="h-4 w-4" /> Feedback & Bantuan
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Sampaikan Masukan Anda</h1>
          <p className="text-white/80 text-xl max-w-xl mx-auto">
            Kami menghargai setiap masukan dari Anda untuk membuat SobatBatik lebih baik.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Left: Info & Topics */}
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold mb-2">Topik Bantuan</h2>
              <p className="text-muted-foreground text-sm">Pilih topik yang sesuai agar kami bisa membantu lebih cepat.</p>
            </div>

            <div className="space-y-3">
              {faqTopics.map(({ Icon, title, desc }) => (
                <div key={title} className="glass-card rounded-2xl p-4 flex gap-4 card-hover">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Response Info */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-sm">Bagaimana Ini Bekerja?</h3>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-bold text-primary">1.</span>
                  Isi form feedback di samping dengan lengkap.
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">2.</span>
                  Pesan Anda akan langsung diterima oleh tim Admin.
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">3.</span>
                  Tim kami akan meninjau dan menindaklanjuti masukan Anda.
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">Kirim Feedback</h2>
                <p className="text-muted-foreground text-sm">Sampaikan pertanyaan, saran, atau keluhan Anda melalui form di bawah ini.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name">Nama Lengkap</Label>
                    <Input
                      id="contact-name"
                      placeholder="Masukkan nama Anda"
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
                    onChange={(e) => {
                      setForm({ ...form, subject: e.target.value })
                      if (e.target.value !== 'Lainnya') setCustomSubject('')
                    }}
                    className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    {subjects.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                {isCustom && (
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-custom-subject">Tulis Subjek Anda</Label>
                    <Input
                      id="contact-custom-subject"
                      placeholder="Contoh: Pertanyaan tentang fitur baru"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      required
                      className="h-11 rounded-xl"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="contact-message">Pesan</Label>
                  <textarea
                    id="contact-message"
                    placeholder="Jelaskan pertanyaan, saran, atau masalah Anda secara detail..."
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
                    <><Send className="h-4 w-4" />Kirim Feedback</>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Feedback Anda akan dikirim langsung ke tim Admin SobatBatik.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
