Deskripsi Singkat
MoneyMate adalah aplikasi web manajemen keuangan pribadi (Personal Finance Management) yang dirancang dengan antarmuka modern dan intuitif. Dibangun menggunakan arsitektur Multi-Page Application (MPA) dengan HTML, Vanilla JavaScript, dan Tailwind CSS, aplikasi ini memungkinkan pengguna untuk memantau saldo, mencatat arus kas (pemasukan dan pengeluaran), merencanakan tabungan, serta mengelola hutang dan piutang dalam satu ekosistem yang terintegrasi.

Aplikasi ini beroperasi sepenuhnya di sisi klien (Client-Side) menggunakan localStorage, sehingga menjamin kecepatan akses dan privasi data pengguna 100% tanpa memerlukan database server pihak ketiga.

Fitur Utama:
1. Sistem Autentikasi (Simulasi): Proteksi halaman Dashboard dan Features menggunakan sesi login.
2. Dashboard Interaktif: Menampilkan metrik keuangan utama (Saldo, Pemasukan, Pengeluaran, Tabungan) secara real-time.
3. Filter Riwayat Transaksi: Memudahkan analisis pengeluaran berdasarkan kategori spesifik atau bulan tertentu.
4. Pencatatan Multi-Kategori: Formulir input yang dipisahkan rapi menggunakan sistem Tab untuk Pemasukan, Pengeluaran, Tabungan, dan Hutang.

_Unique Selling Point_ (USP)

Logika Akuntansi Hutang & Piutang yang Realistis (Deferred Settlement)

  Aplikasi biasa: Saat mencatat hutang, saldo utama langsung bertambah/berkurang secara otomatis, yang seringkali membuat pencatatan kas berantakan.
  
  MoneyMate: Menggunakan logika akuntansi dunia nyata. Mencatat hutang/piutang tidak akan mengubah saldo utama sampai pengguna secara eksplisit menekan tombol "Bayar Hutang" atau "Terima Bayaran" di Dashboard. Sistem ini menjaga data uang kas (cash on hand) tetap akurat dengan uang yang benar-benar ada di dompet fisik pengguna.
