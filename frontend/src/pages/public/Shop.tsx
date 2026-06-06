import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, ChevronDown, X, Star, SearchX, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ProductCard from '@/components/ProductCard'
import { useProductStore } from '@/store/useProductStore'
import { categoryOptions, regions, sortOptions } from '@/data/dummyData'
import { cn } from '@/lib/utils'

const priceRanges = [
  { label: 'Semua Harga', min: 0, max: Infinity },
  { label: 'Di bawah Rp 200.000', min: 0, max: 200000 },
  { label: 'Rp 200.000 - 500.000', min: 200000, max: 500000 },
  { label: 'Di atas Rp 500.000', min: 500000, max: Infinity },
]

const ITEMS_PER_PAGE = 8

export default function Shop() {
  const { products, loading, fetchPublicProducts } = useProductStore()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    fetchPublicProducts()
  }, [fetchPublicProducts])

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'Semua Kategori')
  const [selectedRegion, setSelectedRegion] = useState('Semua Daerah')
  const [selectedPriceRange, setSelectedPriceRange] = useState(0)
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'newest')
  const [minRating, setMinRating] = useState(0)
  const [showFilter, setShowFilter] = useState(false)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = products.filter(p => p.is_active)

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.origin_region.toLowerCase().includes(q) ||
        p.store_name.toLowerCase().includes(q) ||
        p.pattern.toLowerCase().includes(q)
      )
    }

    if (selectedCategory !== 'Semua Kategori') {
      result = result.filter(p => p.category === selectedCategory)
    }

    if (selectedRegion !== 'Semua Daerah') {
      result = result.filter(p => p.origin_region === selectedRegion)
    }

    const range = priceRanges[selectedPriceRange]
    result = result.filter(p => p.price >= range.min && p.price <= range.max)

    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating)
    }

    switch (selectedSort) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break
      case 'price_desc': result.sort((a, b) => b.price - a.price); break
      case 'rating': result.sort((a, b) => b.rating - a.rating); break
      default: break
    }

    return result
  }, [products, searchQuery, selectedCategory, selectedRegion, selectedPriceRange, selectedSort, minRating])

  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE)
  const hasMore = paginated.length < filtered.length

  const activeFiltersCount = [
    selectedCategory !== 'Semua Kategori',
    selectedRegion !== 'Semua Daerah',
    selectedPriceRange !== 0,
    minRating > 0,
  ].filter(Boolean).length

  const clearFilters = () => {
    setSelectedCategory('Semua Kategori')
    setSelectedRegion('Semua Daerah')
    setSelectedPriceRange(0)
    setMinRating(0)
    setPage(1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Toko Batik</h1>
        <p className="text-muted-foreground">
          Menemukan {filtered.length} produk batik autentik untuk Anda
        </p>
      </div>

      {/* Search + Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama produk, motif, daerah..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
            id="shop-search-input"
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
          />
        </form>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={selectedSort}
            onChange={(e) => { setSelectedSort(e.target.value); setPage(1) }}
            id="shop-sort-select"
            className="h-11 pl-4 pr-8 rounded-xl border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer min-w-[180px]"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
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
              {categoryOptions.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setPage(1) }}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                    selectedCategory === cat
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
                value={selectedRegion}
                onChange={(e) => { setSelectedRegion(e.target.value); setPage(1) }}
                id="shop-region-select"
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {regions.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Harga</p>
              {priceRanges.map((range, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedPriceRange(i); setPage(1) }}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-xs transition-colors leading-snug',
                    selectedPriceRange === i
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-foreground/70 hover:bg-muted'
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Min Rating */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Rating Minimal</p>
              <div className="flex flex-wrap gap-1.5">
                {[0, 3, 4, 5].map(r => (
                  <button
                    key={r}
                    onClick={() => { setMinRating(r); setPage(1) }}
                    className={cn(
                      'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border',
                      minRating === r
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-foreground/70 hover:border-primary hover:text-primary'
                    )}
                  >
                    {r === 0 ? 'Semua' : (
                      <><Star className="h-3 w-3 fill-current" />{r}+</>
                    )}
                  </button>
                ))}
              </div>
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
              {/* Same filters as sidebar */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Kategori</p>
                  {categoryOptions.map(cat => (
                    <button key={cat} onClick={() => { setSelectedCategory(cat); setPage(1); setShowFilter(false) }}
                      className={cn('w-full text-left px-3 py-2 rounded-lg text-sm transition-colors', selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>
                      {cat}
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
          {/* Active Filter Tags */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {selectedCategory !== 'Semua Kategori' && (
                <Badge variant="secondary" className="gap-1.5 pr-1.5 rounded-full">
                  {selectedCategory}
                  <button onClick={() => { setSelectedCategory('Semua Kategori'); setPage(1) }} className="hover:text-destructive"><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {selectedRegion !== 'Semua Daerah' && (
                <Badge variant="secondary" className="gap-1.5 pr-1.5 rounded-full">
                  {selectedRegion}
                  <button onClick={() => { setSelectedRegion('Semua Daerah'); setPage(1) }} className="hover:text-destructive"><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {selectedPriceRange !== 0 && (
                <Badge variant="secondary" className="gap-1.5 pr-1.5 rounded-full">
                  {priceRanges[selectedPriceRange].label}
                  <button onClick={() => { setSelectedPriceRange(0); setPage(1) }} className="hover:text-destructive"><X className="h-3 w-3" /></button>
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
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-2xl">
              <SearchX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Produk tidak ditemukan</h3>
              <p className="text-muted-foreground mb-4">Coba ubah filter atau kata kunci pencarian</p>
              <Button variant="outline" onClick={clearFilters}>Reset Filter</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
                {paginated.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-10">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-2xl px-10"
                    onClick={() => setPage(p => p + 1)}
                  >
                    Muat Lebih Banyak ({filtered.length - paginated.length} lagi)
                  </Button>
                </div>
              )}

              <p className="text-center text-sm text-muted-foreground mt-6">
                Menampilkan {paginated.length} dari {filtered.length} produk
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
