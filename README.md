Latar Belakang Proyek

Pengembangan aplikasi MoneyMate didasari oleh tantangan riil yang dihadapi mahasiswa dalam mengelola keuangan pribadi. Kesulitan dalam melakukan pencatatan yang sistematis sering kali berdampak pada pengelolaan pengeluaran yang tidak terkontrol. Selain itu, pengelolaan piutang dan kewajiban hutang yang tidak terdokumentasi dengan baik menjadi salah satu pemicu utama ketidakstabilan arus kas mahasiswa. Proyek ini hadir sebagai solusi praktis untuk memfasilitasi pencatatan keuangan yang lebih disiplin, transparan, dan terintegrasi dalam satu platform digital.

Deskripsi Teknis

MoneyMate merupakan aplikasi manajemen keuangan berbasis web yang dikembangkan menggunakan arsitektur Multi-Page Application (MPA). Teknologi utama yang digunakan mencakup HTML, JavaScript murni (Vanilla JS), dan Tailwind CSS. Aplikasi ini mengimplementasikan sistem penyimpanan data di sisi klien (Client-Side) melalui fitur localStorage, yang memastikan kecepatan pemrosesan data serta menjaga privasi pengguna tanpa ketergantungan pada server eksternal.  

Fitur Unggulan dan Inovasi:

1. Logika Pelunasan Hutang yang Akurat: Berbeda dengan aplikasi pada umumnya, MoneyMate tidak melakukan penyesuaian saldo utama secara otomatis saat kewajiban hutang dicatat. Penyesuaian saldo baru akan terjadi setelah pengguna mengonfirmasi pelunasan secara manual, guna menjaga akurasi laporan uang kas yang tersedia.

2. Privasi Antarmuka (Toggle View): Aplikasi dilengkapi dengan fitur keamanan antarmuka berupa tombol Hide/Show pada panel hutang aktif untuk melindungi data sensitif saat aplikasi digunakan di area publik.

3. Manajemen Arus Kas Terstruktur: Pengguna dapat mengategorikan setiap transaksi ke dalam Pemasukan, Pengeluaran, Tabungan, atau Hutang melalui formulir input yang dipisahkan secara sistematis untuk memudahkan navigasi.
  
4. Integrasi Data Dinamis (Fetch API): Aplikasi memanfaatkan API publik untuk menyajikan kutipan motivasi keuangan secara dinamis pada Dashboard, yang berfungsi sebagai stimulus psikologis bagi pengguna agar tetap konsisten dalam mencatat keuangan.
