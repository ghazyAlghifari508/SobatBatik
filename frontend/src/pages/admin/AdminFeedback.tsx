import { useState, useEffect } from 'react'
import { api } from '@/lib/axios'
import { Card } from '../../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Loader2, Trash2, Eye, Mail, MailOpen } from 'lucide-react'
import { toast } from 'sonner'

interface Feedback {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // View dialog
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)

  // Delete dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null)

  const fetchFeedbacks = async () => {
    try {
      const res = await api.get('/feedback')
      if (res.data.success) {
        setFeedbacks(res.data.data)
      }
    } catch (err) {
      console.error('Failed to fetch feedbacks:', err)
      toast.error('Gagal memuat feedback')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const handleView = async (feedback: Feedback) => {
    setSelectedFeedback(feedback)
    setIsViewOpen(true)

    // Mark as read if not already
    if (!feedback.is_read) {
      try {
        await api.patch(`/feedback/${feedback._id}/read`)
        fetchFeedbacks()
      } catch (err) {
        console.error('Failed to mark as read:', err)
      }
    }
  }

  const handleDeleteClick = (id: string) => {
    setSelectedDeleteId(id)
    setIsDeleteOpen(true)
  }

  const submitDelete = async () => {
    if (!selectedDeleteId) return

    setActionLoading(selectedDeleteId)
    try {
      const res = await api.delete(`/feedback/${selectedDeleteId}`)
      if (res.data.success) {
        toast.success('Feedback berhasil dihapus')
        fetchFeedbacks()
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menghapus feedback')
    } finally {
      setActionLoading(null)
      setIsDeleteOpen(false)
    }
  }

  const unreadCount = feedbacks.filter(f => !f.is_read).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feedback Pengguna</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Pesan dan masukan dari pengunjung melalui halaman Kontak
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-sm px-3 py-1">
            {unreadCount} belum dibaca
          </Badge>
        )}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[180px]">Pengirim</TableHead>
              <TableHead className="w-[180px]">Subjek</TableHead>
              <TableHead>Pesan</TableHead>
              <TableHead className="w-[130px]">Tanggal</TableHead>
              <TableHead className="text-right w-[120px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                  Belum ada feedback dari pengguna.
                </TableCell>
              </TableRow>
            ) : (
              feedbacks.map(fb => (
                <TableRow key={fb._id} className={!fb.is_read ? 'bg-primary/5' : ''}>
                  <TableCell>
                    {fb.is_read ? (
                      <MailOpen className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Mail className="w-4 h-4 text-primary" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className={`text-sm ${!fb.is_read ? 'font-bold' : 'font-medium'}`}>{fb.name}</div>
                      <div className="text-xs text-muted-foreground">{fb.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className={`text-sm ${!fb.is_read ? 'font-semibold' : ''}`}>
                    {fb.subject}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs">
                    <span className="line-clamp-1">{fb.message}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(fb.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-primary hover:bg-primary/10"
                        onClick={() => handleView(fb)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDeleteClick(fb._id)}
                        disabled={actionLoading === fb._id}
                      >
                        {actionLoading === fb._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* View Feedback Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              {selectedFeedback?.subject}
            </DialogTitle>
            <DialogDescription>
              Dari {selectedFeedback?.name} ({selectedFeedback?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="text-xs text-muted-foreground">
              Dikirim pada {selectedFeedback && new Date(selectedFeedback.created_at).toLocaleString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </div>
            <div className="p-4 bg-muted/50 rounded-xl text-sm leading-relaxed whitespace-pre-wrap">
              {selectedFeedback?.message}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Feedback</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus feedback ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
            <Button
              variant="destructive"
              onClick={submitDelete}
              disabled={actionLoading !== null}
            >
              {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Hapus Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
