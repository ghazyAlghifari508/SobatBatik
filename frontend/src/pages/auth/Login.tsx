import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import type { Role } from '@/store/useAuthStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Store } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('user')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    login(email, role)
    if (role === 'admin') navigate('/admin')
    else if (role === 'store') navigate('/store')
    else navigate('/')
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Masuk ke SobatBatik</CardTitle>
          <CardDescription>Pilih role untuk mensimulasikan login</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="nama@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Simulasi Role</Label>
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={role}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value as Role)}
              >
                <option value="user">Pembeli (User)</option>
                <option value="store">Penjual (Store)</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Login Simulasi</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
