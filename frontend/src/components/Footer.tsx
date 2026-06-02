import { Link } from 'react-router-dom'
import { Camera, Play, Layers, Send, Mail, MapPin, Phone, Heart } from 'lucide-react'
import { footerLinks } from '@/data/dummyData'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/60 mt-20">
      {/* Background with batik pattern */}
      <div className="absolute inset-0 batik-pattern opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-background to-[hsl(25_30%_88%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-5 group">
              <div className="p-3 bg-[#FDFBF7] rounded-2xl shadow-sm border border-border/50 transition-all group-hover:shadow-md group-hover:-translate-y-1 inline-block">
                <img src="/logo.png" alt="SobatBatik Logo" className="h-14 w-auto object-contain mix-blend-multiply" />
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Platform e-commerce batik Indonesia yang menghubungkan pengrajin lokal dengan pecinta batik di seluruh nusantara.
            </p>

            {/* Contact Info */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary/70 shrink-0" />
                <span>halo@sobatbatik.id</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary/70 shrink-0" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary/70 shrink-0 mt-0.5" />
                <span>Jl. Batik Nusantara No. 17, Jakarta Selatan</span>
              </div>
            </div>
          </div>

          {/* Belanja Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-5 tracking-wide uppercase">Belanja</h4>
            <ul className="space-y-3">
              {footerLinks.belanja.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Perusahaan Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-5 tracking-wide uppercase">Perusahaan</h4>
            <ul className="space-y-3">
              {footerLinks.perusahaan.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan + Social */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-5 tracking-wide uppercase">Bantuan</h4>
            <ul className="space-y-3 mb-6">
              {footerLinks.bantuan.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Media */}
            <h4 className="text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">Ikuti Kami</h4>
            <div className="flex gap-2.5">
              {[
                { icon: Camera, label: 'Instagram' },
                { icon: Layers, label: 'Facebook' },
                { icon: Send, label: 'Twitter' },
                { icon: Play, label: 'YouTube' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 hover:scale-110"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SobatBatik. Hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Dibuat dengan</span>
            <span className="text-red-500 mx-1 flex items-center justify-center">
              <Heart className="h-3.5 w-3.5 fill-current" />
            </span>
            <span>untuk Batik Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
