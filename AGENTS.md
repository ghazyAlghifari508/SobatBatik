# AGENTS.md — SobatBatik Development Rules

Dokumen ini adalah instruksi wajib untuk semua AI agent yang bekerja pada proyek **SobatBatik**. Tujuannya agar agent tidak halusinasi, tidak melewatkan requirement PRD, tidak membuat asumsi liar, dan benar-benar menggunakan skill yang sudah diinstall.

> PRIORITAS TERTINGGI: Ikuti PRD SobatBatik secara menyeluruh. Jangan mengubah, mengurangi, menambah fitur besar, atau mengabaikan detail PRD tanpa instruksi eksplisit dari user.

---

## 1. Core Project Context

SobatBatik adalah platform e-commerce berbasis web untuk penjualan produk batik Indonesia secara digital. Platform ini menghubungkan tiga role utama:

1. **User / Pembeli**
2. **Toko / Penjual**
3. **Administrator**

Tujuan utama sistem adalah membantu pembeli menemukan produk batik autentik, membantu toko/penjual mengelola produk dan pesanan, serta membantu administrator memantau ekosistem platform dan melakukan approval pendaftaran toko.

---

## 2. Mandatory PRD Reading Protocol

Sebelum menulis kode, mengubah file, membuat struktur folder, membuat schema, membuat API, atau mengubah UI, agent WAJIB melakukan langkah berikut:

1. **Baca PRD SobatBatik dari awal sampai akhir.**
2. **Jangan skip bagian mana pun**, termasuk Overview, Requirements, Core Features, User Flow, Architecture, Database Schema, dan Design & Technical Constraints.
3. **Buat ringkasan internal requirement** sebelum implementasi.
4. **Petakan setiap task ke bagian PRD yang relevan.**
5. **Jika ada konflik antara request user dan PRD**, tanyakan atau jelaskan konflik tersebut. Jangan diam-diam memilih sendiri.
6. **Jika ada requirement yang belum jelas**, jangan mengarang. Beri catatan asumsi secara eksplisit dan pilih solusi paling aman.
7. **Jangan menganggap requirement tidak penting hanya karena terlihat kecil.** Semua detail PRD dianggap wajib kecuali user menyatakan sebaliknya.

Agent DILARANG:

- Mengimplementasikan fitur yang tidak ada di PRD tanpa izin.
- Menghapus requirement PRD.
- Mengubah role, flow, schema, endpoint convention, atau tech stack tanpa izin.
- Mengganti MongoDB menjadi database lain.
- Mengganti Express.js menjadi framework backend lain.
- Mengganti React + Vite menjadi Next.js kecuali user menyuruh.
- Mengganti Tailwind CSS v4 + shadcn/ui dengan UI library lain.
- Mengubah JWT auth menjadi session-based auth tanpa izin.
- Membuat payment gateway real jika user hanya meminta simulasi MVP.
- Mengarang business logic yang tidak dijelaskan PRD.

---

## 3. Installed Skills Usage Is Mandatory

Skill yang sudah diinstall **wajib digunakan**, bukan hanya dipajang. Sebelum bekerja, agent harus mencari dan membaca instruksi skill yang relevan, lalu menerapkannya pada task.

### Installed Skills

1. **Express REST API Skill**
   - URL referensi: https://www.skills.sh/pluginagentmarketplace/custom-plugin-nodejs/express-rest-api
   - Gunakan untuk desain backend Node.js + Express.js, REST routing, middleware, controller, service, error handling, dan response API.

2. **Vercel React Best Practices Skill**
   - URL referensi: https://www.skills.sh/vercel-labs/agent-skills/vercel-react-best-practices
   - Gunakan untuk frontend React, struktur komponen, state management, data fetching, form handling, accessibility, dan best practice UI.

3. **MongoDB Schema Design Skill**
   - URL referensi: https://www.skills.sh/mongodb/agent-skills/mongodb-schema-design
   - Gunakan untuk desain collection, Mongoose schema, relasi antar dokumen, index, validasi, dan transaksi/stok.

4. **Tailwind v4 + shadcn Skill**
   - URL referensi: https://www.skills.sh/secondsky/claude-skills/tailwind-v4-shadcn
   - Gunakan untuk styling Tailwind CSS v4, shadcn/ui components, CSS variables, typography, responsive design, dan konsistensi UI.

### Skill Enforcement Rules

Sebelum implementasi, agent wajib menyebutkan secara singkat:

- Skill apa yang digunakan.
- Kenapa skill tersebut relevan.
- Bagian task mana yang dipengaruhi skill tersebut.

Contoh format singkat:

```md
Skills used:
- express-rest-api: untuk desain endpoint /api/v1, middleware JWT, controller, dan error response.
- mongodb-schema-design: untuk validasi Mongoose schema dan relasi users, stores, products, orders.
- vercel-react-best-practices: untuk struktur halaman React dan state management.
- tailwind-v4-shadcn: untuk UI konsisten sesuai design system PRD.
```

Jika agent tidak memakai skill yang relevan, hasil kerja dianggap belum valid.

---

## 4. Required Technology Stack

Gunakan stack berikut sesuai PRD:

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite |
| Backend | Node.js + Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT |
| UI Framework | Tailwind CSS v4 + shadcn/ui |
| State Management | Context API atau Zustand |

Dilarang mengganti stack tanpa instruksi eksplisit dari user.

---

## 5. Required API Standards

Semua API wajib mengikuti aturan berikut:

1. Semua endpoint menggunakan prefix:

```txt
/api/v1/
```

2. Semua response JSON menggunakan format standar:

```json
{
  "success": true,
  "message": "Readable message",
  "data": {}
}
```

3. Gunakan HTTP status code standar:

- `200` untuk request sukses umum.
- `201` untuk resource berhasil dibuat.
- `400` untuk input tidak valid.
- `401` untuk belum login/token invalid.
- `403` untuk role tidak punya akses.
- `404` untuk data tidak ditemukan.
- `500` untuk server error.

4. Semua route sensitif wajib dilindungi middleware JWT.
5. Semua route yang role-specific wajib memakai role authorization.
6. Role harus berasal dari payload JWT dan/atau database user yang valid.

---

## 6. Required Roles and Permissions

Sistem wajib mendukung tiga role:

```txt
user
store
admin
```

### User / Pembeli

User dapat:

- Register dan login.
- Melihat produk dari semua toko aktif.
- Mencari produk berdasarkan nama produk, asal daerah, atau nama toko.
- Memfilter produk berdasarkan kategori, harga, dan rating.
- Melihat detail produk.
- Menambahkan produk ke cart.
- Mengubah jumlah item di cart.
- Menghapus item dari cart.
- Checkout.
- Input alamat pengiriman.
- Melihat ringkasan pesanan.
- Melakukan simulasi pembayaran jika payment gateway belum dibuat.
- Melihat riwayat pesanan dan status pesanan.
- Mengajukan diri menjadi toko/penjual.
- Melihat status pengajuan toko.
- Melihat alasan penolakan jika pengajuan toko ditolak.

### Store / Penjual

Store dapat:

- Mengakses dashboard toko setelah disetujui admin.
- CRUD produk miliknya sendiri.
- Mengelola status produk aktif/nonaktif.
- Melihat pesanan masuk untuk toko tersebut.
- Update status pesanan: Dikemas, Dikirim, Selesai.
- Melihat dashboard analitik toko:
  - Produk terlaris.
  - Tren pendapatan.
  - Ringkasan pesanan berdasarkan status.
  - Statistik produk aktif dan stok tersedia.

Store DILARANG:

- Mengedit produk toko lain.
- Melihat data sensitif toko lain.
- Mengubah transaksi secara langsung di luar status pesanan yang diizinkan.
- Mengakses dashboard admin.

### Administrator

Admin dapat:

- Melihat dashboard monitoring platform.
- Melihat total pengguna, total toko aktif, dan total transaksi.
- Melihat grafik pertumbuhan pengguna dan transaksi.
- Melihat daftar pengajuan toko berstatus Menunggu.
- Menyetujui pengajuan toko.
- Menolak pengajuan toko dengan alasan penolakan wajib.
- Melihat seluruh pengguna beserta role dan status akun.
- Melihat seluruh toko aktif beserta statistik ringkas.
- Melihat log transaksi platform secara read-only.

Admin DILARANG:

- Mengintervensi data transaksi tanpa requirement eksplisit.
- Mengubah detail transaksi pembeli/toko jika PRD hanya menyebut monitoring read-only.

---

## 7. Store Application Approval Rules

Flow pendaftaran toko wajib mengikuti PRD:

1. User mengisi form pendaftaran toko:
   - Nama toko.
   - Deskripsi.
   - Alamat.
2. Sistem membuat pengajuan dengan status:

```txt
pending / Menunggu
```

3. Admin meninjau pengajuan.
4. Jika disetujui:
   - Status pengajuan menjadi approved/disetujui.
   - Role user berubah menjadi `store`.
   - Data toko dibuat di collection `stores`.
   - Dashboard toko terbuka.
5. Jika ditolak:
   - Status pengajuan menjadi rejected/ditolak.
   - Admin wajib mengisi `rejection_reason`.
   - User wajib bisa melihat alasan penolakan.

Agent wajib memastikan penolakan tanpa alasan tidak bisa terjadi.

---

## 8. Checkout and Stock Rules

Checkout wajib mengikuti alur PRD:

1. User konfirmasi checkout dari cart.
2. Backend menerima request `POST /api/v1/orders` dengan JWT.
3. Backend validasi stok produk.
4. Backend membuat dokumen order.
5. Backend membuat order_items.
6. Backend mengurangi stok produk.
7. Backend mengembalikan response `201 Order Created`.
8. Frontend menampilkan halaman konfirmasi pesanan.

Agent wajib memperhatikan:

- Harga item harus disimpan sebagai snapshot `price_at_purchase`.
- Stok tidak boleh menjadi negatif.
- Produk nonaktif tidak boleh dibeli.
- Produk dari toko nonaktif tidak boleh dibeli.
- Validasi stok wajib dilakukan di backend, bukan hanya frontend.
- Jika memungkinkan, gunakan pendekatan transaksi MongoDB/session untuk menjaga konsistensi order dan stok.

---

## 9. Required MongoDB Collections

Gunakan collection utama berikut:

1. `users`
2. `store_applications`
3. `stores`
4. `products`
5. `orders`
6. `order_items`

### users

Field minimal:

```txt
_id
name
email
password_hash
role
created_at
```

Rules:

- `email` harus unique.
- `password_hash` tidak boleh menyimpan plain password.
- `role` hanya boleh `user`, `store`, atau `admin`.

### store_applications

Field minimal:

```txt
_id
user_id
store_name
description
address
status
rejection_reason
applied_at
reviewed_at
```

Rules:

- `status` harus pending/approved/rejected atau padanan yang konsisten.
- `rejection_reason` wajib diisi jika status rejected.
- Satu user tidak boleh membuat banyak pengajuan aktif secara tidak terkendali.

### stores

Field minimal:

```txt
_id
owner_id
store_name
description
address
is_active
created_at
```

Rules:

- `owner_id` mengarah ke user pemilik toko.
- Satu toko dimiliki oleh satu user.
- Toko hanya dibuat setelah approval admin.

### products

Field minimal:

```txt
_id
store_id
name
description
price
stock
category
origin_region
image_urls
is_active
created_at
updated_at
```

Rules:

- Product harus milik satu store.
- Store hanya boleh CRUD produk miliknya sendiri.
- `price` tidak boleh negatif.
- `stock` tidak boleh negatif.
- `image_urls` berupa array string.

### orders

Field minimal:

```txt
_id
user_id
shipping_address
total_price
status
created_at
updated_at
```

Rules:

- Order dibuat oleh user pembeli.
- `total_price` dihitung dari order_items.
- Status harus konsisten.

### order_items

Field minimal:

```txt
_id
order_id
product_id
store_id
quantity
price_at_purchase
```

Rules:

- `price_at_purchase` menyimpan harga saat transaksi.
- Jangan hanya mengambil harga terbaru dari product ketika menampilkan history order.

---

## 10. Frontend Requirements

Frontend wajib memakai:

- React.js dengan Vite.
- Tailwind CSS v4.
- shadcn/ui.
- Context API atau Zustand untuk state management.
- JWT token pada request yang butuh auth.

Frontend wajib menyediakan halaman/fungsi berikut sesuai PRD:

### Public/Auth

- Register.
- Login.
- Homepage produk.
- Search produk.
- Filter produk.
- Detail produk.

### User

- Cart.
- Checkout.
- Order confirmation.
- Order history.
- Store application form.
- Store application status.
- Rejection reason notification/view.

### Store

- Store dashboard.
- Product list.
- Create product.
- Edit product.
- Delete product.
- Toggle active/nonactive product.
- Incoming orders.
- Update order status.
- Analytics:
  - Best-selling products bar chart.
  - Revenue trend line chart.
  - Order summary by status.
  - Active products and stock statistics.

### Admin

- Admin dashboard monitoring.
- Store application approval queue.
- Approve application.
- Reject application with required reason form.
- User monitoring.
- Store monitoring.
- Read-only transaction logs.

---

## 11. UI and Design System Rules

UI wajib mengikuti design constraints PRD:

### Typography

```txt
Sans: Geist, ui-sans-serif, system-ui, sans-serif
Serif: serif
Mono: JetBrains Mono, ui-monospace, monospace
```

### Color Palette

Gunakan palet batik Indonesia:

```txt
Brown earth: #8B4513
Cream: #F5F0E8
Gold accent: #D4A017
```

### Component Rules

- Gunakan shadcn/ui sebagai dasar komponen.
- Gunakan CSS Variables untuk theme Tailwind v4.
- Pastikan desain responsive untuk desktop dan mobile.
- Jangan membuat komponen custom yang mengabaikan aksesibilitas shadcn/ui.
- Pastikan form memiliki label, validation message, dan state loading/error.
- Pastikan tombol destructive seperti delete/reject memakai confirmation UI jika berisiko.

---

## 12. Backend Requirements

Backend wajib memakai:

- Node.js.
- Express.js.
- MongoDB.
- Mongoose.
- JWT.
- REST API convention `/api/v1/`.

Backend minimal memiliki struktur yang rapi, misalnya:

```txt
src/
  config/
  controllers/
  middlewares/
  models/
  routes/
  services/
  utils/
  app.js
  server.js
```

Agent boleh menyesuaikan struktur jika project sudah punya pola sendiri, tetapi jangan membuat struktur acak.

### Required Middleware

- JWT authentication middleware.
- Role authorization middleware.
- Error handling middleware.
- Request validation middleware jika diperlukan.

### Required Security Rules

- Password wajib di-hash.
- JWT secret tidak boleh hardcoded.
- Gunakan environment variables.
- Jangan commit `.env`.
- Validasi input backend wajib ada.
- Jangan percaya data role dari frontend.
- CORS dikonfigurasi sesuai kebutuhan.

---

## 13. API Endpoint Coverage Checklist

Endpoint dapat disesuaikan, tetapi harus mencakup kebutuhan berikut.

### Auth

```txt
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

### Products

```txt
GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/products
PATCH  /api/v1/products/:id
DELETE /api/v1/products/:id
PATCH  /api/v1/products/:id/status
```

### Cart

Cart bisa disimpan di frontend, backend, atau kombinasi sesuai keputusan implementasi. Jika disimpan backend, gunakan endpoint yang konsisten.

### Orders

```txt
POST /api/v1/orders
GET  /api/v1/orders/my
GET  /api/v1/orders/store
PATCH /api/v1/orders/:id/status
GET  /api/v1/admin/transactions
```

### Store Applications

```txt
POST  /api/v1/store/apply
GET   /api/v1/store/application/status
GET   /api/v1/admin/store-applications
PATCH /api/v1/admin/store-applications/:id/approve
PATCH /api/v1/admin/store-applications/:id/reject
```

### Stores

```txt
GET /api/v1/stores
GET /api/v1/stores/:id
GET /api/v1/store/dashboard
GET /api/v1/admin/stores
```

### Admin

```txt
GET /api/v1/admin/dashboard
GET /api/v1/admin/users
GET /api/v1/admin/stores
GET /api/v1/admin/transactions
```

---

## 14. Anti-Hallucination Rules

Agent WAJIB mengikuti aturan ini:

1. Jika belum membaca file terkait, jangan mengklaim sudah paham.
2. Jika belum memeriksa codebase, jangan mengubah kode berdasarkan tebakan.
3. Jangan membuat file baru yang menduplikasi fungsi file lama tanpa mengecek struktur existing.
4. Jangan menghapus kode lama tanpa tahu dependensinya.
5. Jangan mengubah route, schema, atau UI flow tanpa mengecek penggunaan di frontend/backend.
6. Jangan menambahkan package baru tanpa alasan jelas.
7. Jangan membuat data dummy yang bertentangan dengan schema PRD.
8. Jangan mengubah nama role sembarangan.
9. Jangan mengubah field schema sembarangan.
10. Jangan menganggap payment gateway wajib untuk MVP; PRD menyebut simulasi pembayaran opsional untuk MVP dan integrasi payment gateway sebagai opsional.
11. Jangan menganggap admin boleh mengedit transaksi; PRD menyebut admin memantau transaksi secara read-only.
12. Jangan menghilangkan alasan penolakan toko; ini requirement wajib.
13. Jangan mengabaikan responsive mobile.
14. Jangan mengabaikan accessibility.
15. Jangan mengabaikan loading, empty, error, dan success state.

Jika agent tidak yakin, agent wajib menulis:

```txt
Saya belum yakin karena [alasan]. Saya akan mengecek [file/bagian] terlebih dahulu sebelum mengubah kode.
```

---

## 15. Codebase Inspection Protocol

Sebelum coding, agent wajib:

1. Melihat struktur folder project.
2. Membaca file package/config utama:
   - `package.json`
   - `vite.config.*`
   - `tailwind.config.*` jika ada
   - `src/main.*`
   - `src/App.*`
   - file route frontend
   - file server Express
   - file route backend
   - file model Mongoose
3. Mengecek pola existing sebelum membuat pola baru.
4. Mengecek naming convention existing.
5. Mengecek apakah project monorepo, frontend-only, backend-only, atau fullstack.
6. Mengecek apakah sudah ada shadcn/ui setup.
7. Mengecek apakah Tailwind v4 sudah benar.
8. Mengecek apakah MongoDB/Mongoose sudah terhubung.
9. Mengecek apakah auth JWT sudah ada.

Agent dilarang langsung coding sebelum inspeksi ini selesai.

---

## 16. Implementation Workflow

Gunakan workflow berikut untuk setiap task:

1. **Read**
   - Baca PRD.
   - Baca AGENTS.md.
   - Baca skill yang relevan.
   - Baca file codebase terkait.

2. **Plan**
   - Jelaskan file yang akan diubah.
   - Jelaskan alasan perubahan.
   - Petakan perubahan ke requirement PRD.

3. **Implement**
   - Ubah kode seminimal mungkin tetapi lengkap.
   - Ikuti pola existing.
   - Jangan membuat perubahan di luar scope.

4. **Verify**
   - Jalankan lint/test/build jika tersedia.
   - Jika tidak bisa menjalankan, jelaskan alasannya.
   - Cek manual alur utama yang terdampak.

5. **Report**
   - Ringkas perubahan.
   - Sebutkan file yang diubah.
   - Sebutkan requirement PRD yang terpenuhi.
   - Sebutkan sisa risiko atau hal yang belum diverifikasi.

---

## 17. Required Verification Checklist

Sebelum menyatakan task selesai, agent wajib cek:

### Functional

- Apakah fitur sesuai PRD?
- Apakah role access benar?
- Apakah JWT protection benar?
- Apakah response API `{ success, message, data }`?
- Apakah endpoint memakai `/api/v1/`?
- Apakah validasi input ada?
- Apakah error handling ada?

### Database

- Apakah schema sesuai PRD?
- Apakah relasi ObjectId benar?
- Apakah index/unique penting sudah ada?
- Apakah password di-hash?
- Apakah stok tidak bisa negatif?
- Apakah rejection reason wajib saat reject?

### Frontend

- Apakah UI responsive?
- Apakah menggunakan Tailwind v4 + shadcn/ui?
- Apakah warna dan typography sesuai PRD?
- Apakah loading state ada?
- Apakah empty state ada?
- Apakah error state ada?
- Apakah form validation jelas?

### Business Logic

- User tidak bisa akses dashboard store sebelum approval.
- Store tidak bisa CRUD produk toko lain.
- Admin reject toko wajib memberi alasan.
- Admin transaction monitoring read-only.
- Checkout mengurangi stok.
- Riwayat order memakai harga snapshot.

---

## 18. Git and Deployment Safety

Agent DILARANG:

- Commit tanpa instruksi eksplisit user.
- Push tanpa instruksi eksplisit user.
- Deploy tanpa instruksi eksplisit user.
- Menghapus branch tanpa izin.
- Menghapus file besar-besaran tanpa izin.
- Menjalankan command destructive tanpa menjelaskan dampaknya.

Command berisiko seperti berikut harus dihindari kecuali user jelas-jelas meminta:

```bash
rm -rf
git reset --hard
git clean -fd
git push --force
npm audit fix --force
```

---

## 19. Environment Variables

Gunakan environment variables untuk konfigurasi sensitif:

```txt
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
PORT=
CLIENT_URL=
```

Rules:

- Jangan commit `.env`.
- Sediakan `.env.example` jika belum ada.
- Jangan hardcode credential.
- Jangan menampilkan secret asli di output.

---

## 20. Final Output Rules for AI Agent

Saat selesai bekerja, agent wajib memberi laporan dengan format:

```md
## Summary
- ...

## PRD Coverage
- Requirement A: fulfilled by ...
- Requirement B: fulfilled by ...

## Skills Used
- skill-name: applied to ...

## Files Changed
- path/to/file: reason

## Verification
- Command run: ...
- Result: ...

## Notes / Risks
- ...
```

Jika ada hal yang belum bisa diverifikasi, agent wajib jujur. Jangan bilang selesai 100% jika belum diuji.

---

## 21. Absolute Non-Negotiables

1. PRD adalah sumber kebenaran utama.
2. Semua detail PRD harus dianggap penting.
3. Jangan halusinasi.
4. Jangan nebak-nebak tanpa membaca file terkait.
5. Gunakan skill yang sudah diinstall.
6. Gunakan React + Vite, Express.js, MongoDB, Mongoose, JWT, Tailwind v4, dan shadcn/ui.
7. Role wajib: user, store, admin.
8. API wajib prefix `/api/v1/`.
9. Response wajib `{ success, message, data }`.
10. Admin reject toko wajib menyertakan alasan.
11. Admin transaksi wajib read-only.
12. Store hanya boleh kelola produk miliknya sendiri.
13. Checkout wajib validasi stok dan mengurangi stok.
14. UI wajib responsive dan mengikuti design system batik.
15. Jangan commit/push/deploy tanpa instruksi eksplisit user.

