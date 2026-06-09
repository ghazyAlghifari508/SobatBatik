import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, X, Star, SearchX, Loader2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ProductCard from '@/components/ProductCard'
import { useProductStore } from '@/store/useProductStore'
import { sortOptions } from '@/data/dummyData'
import { cn } from '@/lib/utils'

const priceRanges = [
  { label: 'Semua Harga', min: undefined, max: undefined },
  { label: 'Di bawah Rp 200.000', min: 0, max: 200000 },
  { label: 'Rp 200.000 - 500.000', min: 200000, max: 500000 },
  { label: 'Di atas Rp 500.000', min: 500000, max: undefined },
]

export default function Shop() {
  const { products, loading, pagination, fetchPublicProducts } = useProductStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Filter state dari URL (single source of truth untuk filter sidebar)
  const urlCategory = searchParams.get('category') || 'Semua Kategori'
  const urlRegion   = searchParams.get('region') || 'Semua Daerah'
  const urlSort     = searchParams.get('sort') || 'newest'
  const urlPage     = Number(searchParams.get('page')) || 1
  const urlPriceIdx = Number(searchParams.get('price_range')) || 0

  // Search query — LOCAL state, langsung fetch saat berubah (real-time)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [showFilter, setShowFilter] = useState(false)

  const [availableCategories, setAvailableCategories] = useState<string[]>(['Semua Kategori'])
  const [availableRegions, setAvailableRegions] = useState<string[]>(['Semua Daerah'])

  // Fungsi fetch utama
  const doFetch = useCallback((search: string) => {
    const priceRange = priceRanges[urlPriceIdx]
    fetchPublicProducts({
      search: search.trim() || undefined,
      category: urlCategory !== 'Semua Kategori' ? urlCategory : undefined,
      region: urlRegion !== 'Semua Daerah' ? urlRegion : undefined,
      min_price: priceRange.min,
      max_price: priceRange.max,
      sort: urlSort,
      page: urlPage,
      limit: 16,
    })
  }, [urlCategory, urlRegion, urlPriceIdx, urlSort, urlPage, fetchPublicProducts])

  // Ketika filter sidebar (kategori/region/harga/sort/page) berubah → fetch ulang
  useEffect(() => {
    doFetch(searchQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCategory, urlRegion, urlPriceIdx, urlSort, urlPage])

  // Real-time search dengan debounce 300ms — fetch saat user mengetik
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      doFetch(value)
    }, 300)
  }

  // Sinkronisasi dari navigasi Navbar (?search=...)
  useEffect(() => {
    const navSearch = searchParams.get('search') || ''
    if (navSearch !== searchQuery) {
      setSearchQuery(navSearch)
      doFetch(navSearch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('search')])

  // Fetch sidebar options sekali saat mount
  useEffect(() => {
    import('@/lib/axios').then(({ api }) => {
      api.get('/products?limit=200').then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          const data = res.data.data
          const cats = new Set<string>(data.map((p: { category: string }) => p.category).filter(Boolean))
          const regs = new Set<string>(data.map((p: { origin_region: string }) => p.origin_region).filter(Boolean))
          setAvailableCategories(['Semua Kategori', ...Array.from(cats).sort()])
          setAvailableRegions(['Semua Daerah', ...Array.from(regs).sort()])
        }
      }).catch(() => {})
    })
    // Initial fetch
    doFetch(searchParams.get('search') || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Helper: update URL param untuk filter sidebar
  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams)
    if (value === null || value === '') {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    next.delete('page')
    setSearchParams(next, { replace: true })
  }

  const handleCategoryChange = (cat: string) => {
    updateParam('category', cat === 'Semua Kategori' ? null : cat)
    setShowFilter(false)
  }

  const handleRegionChange = (region: string) => {
    updateParam('region', region === 'Semua Daerah' ? null : region)
  }

  const handlePriceChange = (idx: number) => {
    updateParam('price_range', idx === 0 ? null : String(idx))
  }

  const handleSortChange = (sort: string) => {
    updateParam('sort', sort)
  }

  const handlePageChange = (newPage: number) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(newPage))
    setSearchParams(next, { replace: true })
  }

  const clearFilters = () => {
    navigate('/shop', { replace: true })
    setSearchQuery('')
    doFetch('')
  }

  // activeFiltersCount hanya untuk filter sidebar (bukan search query)
  const activeFiltersCount = [
    urlCategory !== 'Semua Kategori',
    urlRegion !== 'Semua Daerah',
    urlPriceIdx !== 0,
  ].filter(Boolean).length

  const displayedProducts = products

  const total = pagination?.totalProducts ?? displayedProducts.length
  const totalPages = pagination?.totalPages ?? 1

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Toko Batik</h1>
        <p className="text-muted-foreground">
          {loading
            ? 'Memuat produk...'
            : searchQuery.trim()
              ? `Menampilkan ${total} hasil untuk "${searchQuery.trim()}"`
              : `Menemukan ${total} produk batik autentik untuk Anda`
          }
        </p>
      </div>

      {/* Search + Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search Input — real-time, tanpa tombol Cari */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama produk, motif, daerah asal, atau nama toko..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            id="shop-search-input"
            className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Hapus pencarian"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>



        {/* Filter Toggle (Mobile) */}
        <Button
          variant="outline"
          className="h-11 rounded-xl gap-2 sm:hidden"
          onClick={() => setShowFilter(!showFilter)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter
          {activeFiltersCount > 0 && (
            <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      <div className="flex gap-8">

        {/* Filter Sidebar — Desktop */}
        <aside className="hidden sm:block w-56 shrink-0">
          <div className="glass-card rounded-2xl p-5 sticky top-24 space-y-7">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Filter</h3>
              {activeFiltersCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-primary hover:underline">
                  Reset ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Kategori</p>
              {availableCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                    urlCategory === cat
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Region */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Daerah Asal</p>
              <select
                value={urlRegion}
                onChange={(e) => handleRegionChange(e.target.value)}
                id="shop-region-select"
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {availableRegions.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Harga</p>
              {priceRanges.map((range, i) => (
                <button
                  key={i}
                  onClick={() => handlePriceChange(i)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-xs transition-colors leading-snug',
                    urlPriceIdx === i
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-foreground/70 hover:bg-muted'
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Filter Panel */}
        {showFilter && (
          <div className="fixed inset-0 z-50 sm:hidden" onClick={() => setShowFilter(false)}>
            <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
            <div
              className="absolute right-0 top-0 bottom-0 w-72 glass-warm border-l border-border overflow-y-auto p-6 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Filter</h3>
                <button onClick={() => setShowFilter(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Kategori</p>
                  {availableCategories.map(cat => (
                    <button key={cat} onClick={() => handleCategoryChange(cat)}
                      className={cn('w-full text-left px-3 py-2 rounded-lg text-sm transition-colors', urlCategory === cat ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Daerah Asal</p>
                  {availableRegions.map(r => (
                    <button key={r} onClick={() => { handleRegionChange(r); setShowFilter(false) }}
                      className={cn('w-full text-left px-3 py-2 rounded-lg text-sm transition-colors', urlRegion === r ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>
                      {r}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Harga</p>
                  {priceRanges.map((range, i) => (
                    <button key={i} onClick={() => { handlePriceChange(i); setShowFilter(false) }}
                      className={cn('w-full text-left px-3 py-2 rounded-lg text-xs transition-colors', urlPriceIdx === i ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>
                      {range.label}
                    </button>
                  ))}
                </div>
                <Button className="w-full" onClick={() => setShowFilter(false)}>Terapkan Filter</Button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {/* Active Filter Tags — hanya untuk filter sidebar, BUKAN search */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {urlCategory !== 'Semua Kategori' && (
                <Badge variant="secondary" className="gap-1.5 pr-1.5 rounded-full">
                  {urlCategory}
                  <button onClick={() => updateParam('category', null)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {urlRegion !== 'Semua Daerah' && (
                <Badge variant="secondary" className="gap-1.5 pr-1.5 rounded-full">
                  {urlRegion}
                  <button onClick={() => updateParam('region', null)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {urlPriceIdx !== 0 && (
                <Badge variant="secondary" className="gap-1.5 pr-1.5 rounded-full">
                  {priceRanges[urlPriceIdx].label}
                  <button onClick={() => updateParam('price_range', null)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
                </Badge>
              )}
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin mb-4" />
              <p>Memuat produk...</p>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-2xl">
              <SearchX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Produk tidak ditemukan</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery.trim()
                  ? `Tidak ada produk yang cocok dengan "${searchQuery.trim()}"`
                  : 'Coba ubah filter atau kata kunci pencarian'
                }
              </p>
              <Button variant="outline" onClick={clearFilters}>Reset Filter</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
                {displayedProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    disabled={urlPage <= 1}
                    onClick={() => handlePageChange(urlPage - 1)}
                  >
                    ← Sebelumnya
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - urlPage) <= 1)
                    .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis')
                      acc.push(p)
                      return acc
                    }, [])
                    .map((p, i) => p === 'ellipsis' ? (
                      <span key={`e${i}`} className="text-muted-foreground px-1">…</span>
                    ) : (
                      <Button
                        key={p}
                        variant={urlPage === p ? 'default' : 'outline'}
                        size="sm"
                        className="rounded-xl w-9 h-9 p-0"
                        onClick={() => handlePageChange(p as number)}
                      >
                        {p}
                      </Button>
                    ))
                  }
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    disabled={urlPage >= totalPages}
                    onClick={() => handlePageChange(urlPage + 1)}
                  >
                    Berikutnya →
                  </Button>
                </div>
              )}

              <p className="text-center text-sm text-muted-foreground mt-6">
                Menampilkan {displayedProducts.length} dari {total} produk
                {searchQuery.trim() && ` untuk "${searchQuery.trim()}"`}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
