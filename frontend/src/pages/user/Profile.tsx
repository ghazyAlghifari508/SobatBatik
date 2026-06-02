import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Camera, Edit2, Save, X, User, MapPin, Mail, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function Profile() {
  const { user } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '0812-3456-7890',
    birthdate: '1995-06-15',
    gender: 'Laki-laki',
  })
  const [address, setAddress] = useState({
    label: 'Rumah',
    name: user?.name || '',
    phone: '0812-3456-7890',
    address: 'Jl. Mawar No. 12',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    zip: '12180',
  })
  const [editingAddress, setEditingAddress] = useState(false)

  const handleSaveProfile = () => {
    setEditing(false)
    toast.success('Profil berhasil diperbarui!')
  }

  const handleSaveAddress = () => {
    setEditingAddress(false)
    toast.success('Alamat berhasil diperbarui!')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">Profil Saya</h1>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left — Profile Card */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-6 text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-5">
              <div className="w-24 h-24 rounded-full gradient-hero flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full gradient-gold flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                <Camera className="h-4 w-4 text-white" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-foreground">{profileData.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{profileData.email}</p>
            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Akun Aktif · Pembeli
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-xs text-muted-foreground">Total Pesanan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5</div>
                <div className="text-xs text-muted-foreground">Wishlist</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="lg:col-span-2 space-y-5">

          {/* Personal Info */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <User className="h-4 w-4 text-primary" />
                <h2 className="font-bold">Informasi Pribadi</h2>
              </div>
              {editing ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="rounded-xl h-8 gap-1.5"
                    onClick={() => setEditing(false)}>
                    <X className="h-3.5 w-3.5" /> Batal
                  </Button>
                  <Button size="sm" className="rounded-xl h-8 gap-1.5" onClick={handleSaveProfile}>
                    <Save className="h-3.5 w-3.5" /> Simpan
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="outline" className="rounded-xl h-8 gap-1.5"
                  onClick={() => setEditing(true)}>
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'profile-name', label: 'Nama Lengkap', key: 'name', icon: User },
                { id: 'profile-email', label: 'Email', key: 'email', icon: Mail, type: 'email' },
                { id: 'profile-phone', label: 'No. Telepon', key: 'phone', icon: Phone },
                { id: 'profile-birthdate', label: 'Tanggal Lahir', key: 'birthdate', type: 'date' },
              ].map(({ id, label, key, type }) => (
                <div key={id} className="space-y-1.5">
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    type={type || 'text'}
                    value={profileData[key as keyof typeof profileData]}
                    onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                    disabled={!editing}
                    className={cn('h-11 rounded-xl', !editing && 'opacity-70 cursor-not-allowed')}
                  />
                </div>
              ))}

              <div className="space-y-1.5">
                <Label htmlFor="profile-gender">Jenis Kelamin</Label>
                {editing ? (
                  <select
                    id="profile-gender"
                    value={profileData.gender}
                    onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option>Laki-laki</option>
                    <option>Perempuan</option>
                  </select>
                ) : (
                  <Input id="profile-gender" value={profileData.gender} disabled className="h-11 rounded-xl opacity-70" />
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-primary" />
                <h2 className="font-bold">Alamat Pengiriman</h2>
              </div>
              {editingAddress ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="rounded-xl h-8 gap-1.5" onClick={() => setEditingAddress(false)}>
                    <X className="h-3.5 w-3.5" /> Batal
                  </Button>
                  <Button size="sm" className="rounded-xl h-8 gap-1.5" onClick={handleSaveAddress}>
                    <Save className="h-3.5 w-3.5" /> Simpan
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="outline" className="rounded-xl h-8 gap-1.5" onClick={() => setEditingAddress(true)}>
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="profile-address">Alamat Lengkap</Label>
                <Input id="profile-address" value={address.address}
                  onChange={(e) => setAddress({ ...address, address: e.target.value })}
                  disabled={!editingAddress} className={cn('h-11 rounded-xl', !editingAddress && 'opacity-70')} />
              </div>
              {[
                { id: 'profile-city', label: 'Kota', key: 'city' },
                { id: 'profile-province', label: 'Provinsi', key: 'province' },
                { id: 'profile-zip', label: 'Kode Pos', key: 'zip' },
              ].map(({ id, label, key }) => (
                <div key={id} className="space-y-1.5">
                  <Label htmlFor={id}>{label}</Label>
                  <Input id={id} value={address[key as keyof typeof address]}
                    onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                    disabled={!editingAddress} className={cn('h-11 rounded-xl', !editingAddress && 'opacity-70')} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
