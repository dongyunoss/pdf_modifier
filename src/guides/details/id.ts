// Bahasa Indonesia: bagian "Lebih lanjut" di setiap alat. {tool:id} menjadi tautan dan {ui:…} menjadi teks antarmuka.
import type { ToolDetailSet } from '../types';

export const id: ToolDetailSet = {
  title: 'Lebih lanjut tentang {tool}',
  sections: {
    merge: [
      {
        title: 'Kapan dipakai',
        blocks: [
          { list: [
            'Saat lamaran kerja, beasiswa, atau pinjaman meminta "semua dokumen dalam satu PDF"',
            'Untuk mengumpulkan tagihan atau faktur bulanan dalam satu file',
            'Untuk menggabungkan bab laporan yang ditulis oleh beberapa orang',
          ] },
        ],
      },
      {
        title: 'Cara kerjanya',
        blocks: [
          'Halaman setiap PDF disalin apa adanya ke file baru tanpa digambar ulang. Karena itu teks tetap bisa dipilih dan dicari, dan gambar tetap berkualitas sama. Daftar file menampilkan pratinjau halaman pertama dan jumlah halaman tiap file, sehingga Anda bisa memeriksa isinya sebelum mengurutkannya dengan diseret.',
        ],
      },
      {
        title: 'Perlu diketahui',
        blocks: [
          { list: [
            'Tambahkan nomor dua digit di depan nama file (01_, 02_ …) agar file sudah berurutan saat dipilih.',
            'PDF yang dikunci kata sandi bisa ditambahkan dengan memasukkan kata sandinya; file gabungan tidak berkata sandi.',
            'Untuk menghapus atau memutar halaman tertentu sesudahnya, kirim hasilnya ke {tool:organize} lewat "{ui:ui.continueWith}".',
            'Jika hasil pindaian membuat file besar, lanjutkan dengan {tool:compress}.',
          ] },
        ],
      },
    ],
    split: [
      {
        title: 'Kapan dipakai',
        blocks: [
          { list: [
            'Untuk memisahkan hasil pindaian sekaligus menjadi satu file per orang atau per urusan',
            'Untuk mengirim PDF besar dalam beberapa bagian karena batas ukuran',
            'Untuk membagi buku atau modul per bab',
          ] },
        ],
      },
      {
        title: 'Tiga cara membagi',
        blocks: [
          { table: {
            head: ['Mode', 'Contoh isian', 'Hasil'],
            rows: [
              ['{ui:tools.split.ui.modeRanges}', '1-3, 4-6, 7-', 'Satu PDF per rentang ("7-" berarti halaman 7 sampai akhir)'],
              ['{ui:tools.split.ui.modeEvery}', '2', 'PDF baru setiap dua halaman'],
              ['{ui:tools.split.ui.modeEach}', '-', 'Satu PDF per halaman'],
            ],
          } },
          'Sebelum membagi, alat ini menunjukkan berapa file yang akan dibuat. Jika hasilnya beberapa file, Anda bisa mengunduh semuanya sekaligus dalam satu ZIP.',
        ],
      },
      {
        title: 'Perlu diketahui',
        blocks: [
          'Jika hanya perlu beberapa bagian, {tool:extract-pages} lebih cepat. Halaman disalin tanpa perubahan, jadi kualitas file hasil pembagian sama persis dengan aslinya.',
        ],
      },
    ],
    organize: [
      {
        title: 'Kapan dipakai',
        blocks: [
          'Alat untuk dokumen yang perlu beberapa perbaikan sekaligus: hasil pindaian yang urutannya kacau, pindaian bolak-balik dengan halaman belakang kosong, atau dokumen cetak yang perlu disisipi halaman kosong.',
        ],
      },
      {
        title: 'Yang bisa dilakukan',
        blocks: [
          { list: [
            'Menyeret halaman untuk mengubah urutan',
            'Memilih beberapa halaman lalu memutar atau menghapusnya sekaligus (Shift + klik memilih rentang)',
            'Menggandakan halaman dan menyisipkan halaman kosong',
            'Menambahkan PDF lain dan mencampur halamannya',
            'Membatalkan dan mengulang setiap perubahan',
          ] },
          'Tidak ada yang disimpan sebelum Anda menekan "{ui:tools.organize.ui.action}", jadi silakan mencoba dengan tenang.',
        ],
      },
      {
        title: 'Perlu diketahui',
        blocks: [
          'Jika hanya perlu memutar, {tool:rotate} lebih sederhana; untuk menghapus saja, gunakan {tool:delete-pages}. Dokumen ratusan halaman butuh waktu untuk menampilkan pratinjau, jadi memisahkan bagian yang diperlukan lebih dulu dengan {tool:split} bisa menghemat waktu.',
        ],
      },
    ],
    rotate: [
      {
        title: 'Kapan dipakai',
        blocks: [
          'Untuk halaman yang terbalik saat dipindai, tabel mendatar di dalam dokumen tegak, atau halaman miring di PDF yang dibuat dari foto ponsel.',
        ],
      },
      {
        title: 'Cara kerjanya',
        blocks: [
          'Setiap klik memutar halaman 90° searah jarum jam, dan "{ui:tools.rotate.ui.rotateAllLeft}" atau "{ui:tools.rotate.ui.rotateAllRight}" memutar semua halaman sekaligus. Yang berubah hanya arah halaman; tidak ada yang digambar ulang, jadi kualitas tidak berubah dan teks tetap bisa dipilih.',
        ],
      },
      {
        title: 'Perlu diketahui',
        blocks: [
          'Jika juga perlu mengurutkan ulang atau menghapus halaman, {tool:organize} menyelesaikannya sekaligus. Fitur "putar tampilan" di pembaca PDF biasanya tidak tersimpan ke file; untuk memperbaiki arah halaman secara permanen, simpan hasilnya dengan alat ini.',
        ],
      },
    ],
    'delete-pages': [
      {
        title: 'Kapan dipakai',
        blocks: [
          { list: [
            'Untuk membuang halaman belakang kosong dari pindaian bolak-balik',
            'Untuk mengeluarkan sampul atau halaman petunjuk sebelum menyerahkan dokumen',
            'Untuk menghapus halaman foto yang tidak perlu agar file lebih kecil',
          ] },
        ],
      },
      {
        title: 'Cara kerjanya',
        blocks: [
          'Klik halaman yang ingin dihapus; tombol akan menunjukkan berapa halaman yang dihapus. Halaman yang tersisa disalin tanpa perubahan ke file baru, sehingga kualitasnya sama. Alat ini mencegah Anda menghapus semua halaman secara tidak sengaja.',
        ],
      },
      {
        title: 'Perlu diketahui',
        blocks: [
          'Jika halaman yang disimpan jauh lebih sedikit daripada yang dihapus, lebih cepat memilih halaman yang disimpan di {tool:extract-pages}.',
        ],
      },
    ],
    'extract-pages': [
      {
        title: 'Kapan dipakai',
        blocks: [
          'Untuk mengirim beberapa halaman dari laporan panjang, menyimpan halaman tanda tangan kontrak saja, atau mengambil halaman tugas dari buku pelajaran berbentuk PDF.',
        ],
      },
      {
        title: 'Dua cara menyimpan',
        blocks: [
          { list: [
            '{ui:tools.extract-pages.ui.outputSingle}: halaman terpilih, sesuai urutan aslinya, dalam satu file baru.',
            '{ui:tools.extract-pages.ui.outputSeparate}: setiap halaman terpilih menjadi PDF tersendiri, bisa diunduh bersama dalam ZIP.',
          ] },
          'Data halaman disalin tanpa perubahan, sehingga pemilihan teks, tautan, dan kualitas gambar sama dengan aslinya.',
        ],
      },
      {
        title: 'Perlu diketahui',
        blocks: [
          'Butuh gambar, bukan PDF? Gunakan {tool:pdf-to-jpg}. Namun jika hanya ingin meneruskan sebagian dokumen, halaman yang diambil sebagai PDF lebih tajam dan lebih kecil daripada gambar.',
        ],
      },
    ],
    compress: [
      {
        title: 'Kapan dipakai',
        blocks: [
          'Saat email atau formulir unggah menolak file karena terlalu besar, atau sebelum mengarsipkan hasil pindaian dan PDF yang penuh foto. Dokumen yang isinya teks sudah kecil dan hampir tidak berkurang.',
        ],
      },
      {
        title: 'Tingkat kompresi',
        blocks: [
          { table: {
            head: ['Tingkat', 'Sisi gambar terpanjang', 'Kualitas JPEG', 'Cocok untuk'],
            rows: [
              ['{ui:tools.compress.ui.levelLow}', '2.400 px', '82%', 'Cetak, materi yang mengutamakan foto'],
              ['{ui:tools.compress.ui.levelMedium}', '1.700 px', '68%', 'Lampiran email dan sebagian besar pengiriman berkas'],
              ['{ui:tools.compress.ui.levelHigh}', '1.200 px', '50%', 'Batas ukuran yang sangat ketat'],
            ],
          } },
          'Hanya gambar di dalam PDF yang dikodekan ulang; teks dan grafik vektor tidak disentuh, sehingga teks tetap bisa dipilih dan dicari. Gambar yang tidak akan mengecil minimal 10% dibiarkan apa adanya untuk menjaga kualitasnya.',
        ],
      },
      {
        title: 'Tentang "{ui:tools.compress.ui.rasterize}"',
        blocks: [
          'Jika kompresi gambar belum cukup, opsi ini menggambar ulang setiap halaman sebagai gambar 150, 120, atau 96 DPI sesuai tingkatnya. Sangat efektif untuk hasil pindaian, tetapi teks tidak bisa lagi dipilih atau dicari, jadi gunakan untuk salinan yang hanya perlu dibaca.',
        ],
      },
      {
        title: 'Perlu diketahui',
        blocks: [
          { list: [
            'Jangan mengompres ulang file yang sudah dikompres: kualitasnya saja yang turun. Untuk menaikkan tingkat, mulai lagi dari file asli.',
            'Menghapus halaman yang tidak perlu dengan {tool:delete-pages} lebih dulu membuat kompresi lebih efektif.',
          ] },
        ],
      },
    ],
    'jpg-to-pdf': [
      {
        title: 'Kapan dipakai',
        blocks: [
          'Untuk mengubah foto struk, formulir, atau catatan tulisan tangan dari ponsel menjadi satu dokumen untuk diserahkan atau disimpan. Mendukung gambar JPG, PNG, WebP, GIF, dan BMP, serta meluruskan foto sesuai orientasi EXIF-nya.',
        ],
      },
      {
        title: 'Memilih pengaturan',
        blocks: [
          { table: {
            head: ['Pengaturan', 'Pilihan', 'Saran'],
            rows: [
              ['{ui:tools.jpg-to-pdf.ui.pageSize}', '{ui:tools.jpg-to-pdf.ui.sizeFit} / A4 / Letter', 'A4 untuk dicetak dan diserahkan; {ui:tools.jpg-to-pdf.ui.sizeFit} untuk arsip foto'],
              ['{ui:tools.jpg-to-pdf.ui.orientation}', '{ui:tools.jpg-to-pdf.ui.orientAuto} / {ui:tools.jpg-to-pdf.ui.orientPortrait} / {ui:tools.jpg-to-pdf.ui.orientLandscape}', 'Hampir selalu {ui:tools.jpg-to-pdf.ui.orientAuto}'],
              ['{ui:tools.jpg-to-pdf.ui.margin}', '{ui:tools.jpg-to-pdf.ui.marginNone} / {ui:tools.jpg-to-pdf.ui.marginSmall} / {ui:tools.jpg-to-pdf.ui.marginLarge}', '{ui:tools.jpg-to-pdf.ui.marginSmall} untuk dicetak; {ui:tools.jpg-to-pdf.ui.marginNone} untuk layar'],
            ],
          } },
          'Dengan A4 atau Letter, setiap foto disesuaikan ke halaman dengan proporsi tetap, sehingga semua halaman berukuran sama meskipun ukuran fotonya berbeda-beda.',
        ],
      },
      {
        title: 'Perlu diketahui',
        blocks: [
          { list: [
            'Cahaya terang tanpa bayangan dan ponsel yang sejajar dengan kertas membuat hasil jauh lebih rapi. Matikan lampu kilat karena kertas mengilap memantulkannya.',
            'Foto ponsel biasanya beberapa MB per lembar, jadi PDF cepat membesar. Dari layar hasil, Anda bisa langsung meneruskannya ke {tool:compress}.',
          ] },
        ],
      },
    ],
    'word-to-pdf': [
      {
        title: 'Kapan dipakai',
        blocks: [
          { list: [
            'Mengirim CV atau surat lamaran dalam PDF agar tampil sama di komputer mana pun',
            'Mengirim kontrak atau laporan sebagai PDF agar tidak mudah diubah',
            'Mengubah DOCX yang diterima menjadi PDF di komputer atau ponsel tanpa Word',
          ] },
        ],
      },
      {
        title: 'Cara kerjanya',
        blocks: [
          'Alat ini menjalankan pengonversi di browser Anda yang dibuat dari LibreOffice, paket aplikasi perkantoran, yang dikompilasi ke WebAssembly. Karena itu dokumen Word bisa diubah ke PDF tanpa diunggah ke server seperti situs konversi lain.',
          'Pengonversi (sekitar 50 MB) diunduh sekali dan disimpan browser, sehingga konversi berikutnya dimulai dalam hitungan detik. Jika dokumen berisi huruf Korea, Jepang, atau Tionghoa, hanya font yang diperlukan yang diunduh tambahan.',
        ],
      },
      {
        title: 'Perlu diketahui',
        blocks: [
          { list: [
            'Font seperti Calibri atau Cambria tidak disertakan, jadi dipakai font gratis dengan lebar yang sama (Carlito, Caladea). Pergantian baris tetap bisa sedikit bergeser, jadi periksa hasilnya sebelum dikirim.',
            'Jika dokumen masih memuat lacak perubahan, tanda revisi bisa ikut tampil. Untuk versi akhir yang bersih, terima semua perubahan di Word sebelum mengonversi. Komentar tidak dimasukkan ke PDF.',
            'Untuk menggabungkan beberapa dokumen menjadi satu PDF, konversi dulu lalu gunakan {tool:merge}; jika filenya besar, perkecil dengan {tool:compress}.',
          ] },
        ],
      },
    ],
    'ppt-to-pdf': [
      {
        title: 'Kapan dipakai',
        blocks: [
          { list: [
            'Mengirim slide ke dosen atau klien yang mungkin tidak punya PowerPoint atau font Anda',
            'Mencetak materi kuliah atau memberi catatan di tablet',
            'Mengubah PPT berukuran besar menjadi PDF yang lebih mudah dikirim lewat email',
          ] },
        ],
      },
      {
        title: 'Cara kerjanya',
        blocks: [
          'Pengonversi yang dibuat dari LibreOffice dan dikompilasi ke WebAssembly menggambar slide Anda menjadi PDF langsung di browser. Tidak ada yang diunggah, jadi presentasi internal atau yang belum dirilis tetap di perangkat Anda.',
          'Setiap slide menjadi satu halaman PDF, dan ukuran slide (16:9, 4:3, dll.) menjadi ukuran halaman. Pengonversi (sekitar 50 MB) diunduh sekali, lalu berikutnya langsung dimulai.',
        ],
      },
      {
        title: 'Perlu diketahui',
        blocks: [
          { list: [
            'Animasi tampil dalam keadaan akhirnya, sedangkan video dan audio tidak diputar.',
            'Catatan pembicara dan slide tersembunyi tidak dimasukkan.',
            'Font seperti Calibri diganti dengan font gratis yang mirip, sehingga lebar teks bisa sedikit berubah. Periksa kotak teks yang penuh sampai tepi.',
            'Untuk handout berisi beberapa slide per lembar, pilih "beberapa halaman per lembar" saat mencetak. Untuk memperkecil ukuran gunakan {tool:compress}; untuk mengubah slide menjadi gambar gunakan {tool:pdf-to-jpg}.',
          ] },
        ],
      },
    ],
    'pdf-to-jpg': [
      {
        title: 'Kapan dipakai',
        blocks: [
          'Untuk mengunggah satu halaman PDF ke blog atau media sosial, menyisipkannya sebagai gambar di presentasi atau dokumen, atau mengirimkannya lewat aplikasi chat kepada orang yang sulit membuka PDF.',
        ],
      },
      {
        title: 'Memilih resolusi dan format',
        blocks: [
          { table: {
            head: ['Resolusi', 'Halaman A4 dalam piksel', 'Kegunaan'],
            rows: [
              ['{ui:tools.pdf-to-jpg.ui.dpiLow}', 'sekitar 595 × 842', 'Pratinjau, berbagi cepat'],
              ['{ui:tools.pdf-to-jpg.ui.dpiMedium}', 'sekitar 1.240 × 1.754', 'Unggah ke web, membaca di layar'],
              ['{ui:tools.pdf-to-jpg.ui.dpiHigh}', 'sekitar 2.480 × 3.508', 'Cetak, memperbesar tulisan kecil'],
            ],
          } },
          'Menggandakan DPI menggandakan lebar dan tinggi, sehingga jumlah piksel menjadi empat kali dan ukuran file naik kira-kira sebesar itu. Pilih PNG untuk halaman berisi teks dan tabel, dan JPG untuk halaman yang banyak fotonya. Anda bisa mengonversi halaman terpilih saja dan mengunduh banyak gambar dalam satu ZIP.',
        ],
      },
      {
        title: 'Perlu diketahui',
        blocks: [
          'Teks di dalam gambar tidak bisa lagi dipilih atau dicari. Jika hanya ingin meneruskan sebagian dokumen, ambil halamannya sebagai PDF dengan {tool:extract-pages}.',
        ],
      },
    ],
    watermark: [
      {
        title: 'Kapan dipakai',
        blocks: [
          { list: [
            'Untuk menandai dokumen internal dengan "Rahasia" atau "Draf"',
            'Untuk menuliskan tujuan penggunaan pada salinan KTP agar tidak mudah dipakai di tempat lain',
            'Untuk menambahkan logo pada portofolio atau materi presentasi',
          ] },
        ],
      },
      {
        title: 'Yang bisa diatur',
        blocks: [
          'Pilih teks atau gambar logo, lalu atur warna, ukuran, opasitas, dan sudutnya. "{ui:tools.watermark.ui.layoutCenter}" menempatkan satu tanda di tengah halaman, sedangkan "{ui:tools.watermark.ui.layoutTile}" mengulangnya di seluruh halaman. Terapkan ke semua halaman atau hanya halaman tertentu, dan periksa hasilnya di pratinjau halaman pertama.',
        ],
      },
      {
        title: 'Perlu diketahui',
        blocks: [
          'Untuk mencegah kebocoran, tata letak "{ui:tools.watermark.ui.layoutTile}" dengan opasitas 20–30% sulit dipotong. Watermark tidak menyembunyikan isi; jika orang lain tidak boleh membaca file sama sekali, tambahkan juga kata sandi pembuka dengan {tool:protect}.',
        ],
      },
    ],
    'page-numbers': [
      {
        title: 'Kapan dipakai',
        blocks: [
          'Untuk berkas lamaran yang sudah digabung, laporan yang akan dicetak dan dijilid, serta bahan rapat yang perlu dirujuk dengan "lihat halaman 12".',
        ],
      },
      {
        title: 'Yang bisa diatur',
        blocks: [
          'Posisi (kiri, tengah, atau kanan, di atas atau di bawah), format nomor, nomor awal, ukuran huruf, dan margin. Untuk melewati sampul dan mulai menomori dari halaman isi pertama, pilih "{ui:tools.page-numbers.ui.pagesCustom}" pada halaman yang diterapkan, isi mulai halaman 2, dan biarkan nomor awal 1. Periksa pratinjau sebelum menerapkan.',
        ],
      },
      {
        title: 'Perlu diketahui',
        blocks: [
          'Beri nomor paling akhir. Jika urutan halaman diubah setelah diberi nomor, nomornya akan kacau, jadi tetapkan urutan dulu dengan {tool:merge} atau {tool:organize}.',
        ],
      },
    ],
    sign: [
      {
        title: 'Kapan dipakai',
        blocks: [
          { list: [
            'Menandatangani kontrak atau surat persetujuan yang diterima lewat email lalu langsung mengirimkannya kembali, tanpa mencetak, menandatangani, dan memindai',
            'Menyerahkan formulir pengajuan atau laporan biaya yang memerlukan tanda tangan atau stempel di samping nama',
            'Menambahkan tanda tangan di setiap halaman kontrak yang terdiri dari banyak halaman',
          ] },
        ],
      },
      {
        title: 'Tiga cara membuat tanda tangan',
        blocks: [
          { list: [
            '{ui:tools.sign.ui.modeDraw}: gambar dengan mouse atau jari. Di ponsel, tanda tangan dengan jari memberi hasil paling alami.',
            '{ui:tools.sign.ui.modeType}: ketik nama Anda lalu pilih gaya {ui:tools.sign.ui.styleScript}, {ui:tools.sign.ui.styleSerif}, atau {ui:tools.sign.ui.styleSans}.',
            '{ui:tools.sign.ui.modeImage}: unggah foto tanda tangan atau stempel di atas kertas. Aktifkan "{ui:tools.sign.ui.removeBackground}" agar kertas menjadi transparan dan tanda tangan tampak alami di halaman.',
          ] },
          'Setelah tanda tangan siap, klik halaman untuk meletakkannya di sana. Seret untuk memindahkan, seret sudut kanan bawah untuk mengubah ukuran, dan pindah halaman untuk meletakkannya di beberapa tempat. Pada halaman yang diputar, tanda tangan diletakkan persis seperti yang terlihat di layar.',
        ],
      },
      {
        title: 'Perlu diketahui',
        blocks: [
          { list: [
            'Alat ini menempelkan gambar tanda tangan Anda ke halaman. Cara ini umum dipakai untuk kontrak dan formulir sehari-hari; jika diminta tanda tangan elektronik bersertifikat, ikuti cara yang ditentukan lembaga tersebut.',
            'Agar file yang sudah ditandatangani tidak diubah orang lain, batasi pengeditan atau pasang kata sandi pembuka dengan {tool:protect}.',
            'Jika dokumen yang perlu ditandatangani terpisah di beberapa file, gabungkan dulu dengan {tool:merge} agar bisa ditandatangani sekaligus.',
            'Tanda tangan yang digambar dan gambar yang diunggah hanya dipakai di browser ini dan hilang saat halaman ditutup.',
          ] },
        ],
      },
    ],
    protect: [
      {
        title: 'Kapan dipakai',
        blocks: [
          'Untuk mengirim slip gaji, kontrak, atau dokumen medis dan keuangan yang hanya boleh dibaca oleh penerimanya.',
        ],
      },
      {
        title: 'Kata sandi dan izin',
        blocks: [
          'Seluruh dokumen dienkripsi dengan AES-256 sehingga tidak bisa dibuka tanpa kata sandi. Pengaturan izin opsional mengatur pencetakan, penyalinan, pengeditan, dan anotasi, tetapi itu hanya permintaan yang perlu dipatuhi pembaca PDF, bukan enkripsi sungguhan.',
          'Enkripsi dilakukan di browser Anda dan kata sandi tidak disimpan di mana pun. Artinya, jika Anda lupa kata sandi, tidak ada yang bisa memulihkannya, termasuk kami.',
        ],
      },
      {
        title: 'Perlu diketahui',
        blocks: [
          { list: [
            'Gunakan kata sandi panjang, minimal 12 karakter, dan hindari tanggal lahir atau nomor telepon.',
            'Kirim file lewat email dan kata sandinya lewat SMS atau telepon.',
          ] },
        ],
      },
    ],
    unlock: [
      {
        title: 'Kapan dipakai',
        blocks: [
          'Untuk menyimpan dokumen terlindungi milik sendiri, seperti tagihan bulanan, tanpa harus mengetik kata sandi setiap kali, atau untuk membuka batasan cetak dan salin pada file Anda.',
        ],
      },
      {
        title: 'Cara kerjanya',
        blocks: [
          'Setelah file dipilih, alat ini lebih dulu memberi tahu jenis perlindungan yang dipakai. File dengan kata sandi pembuka memerlukan kata sandi yang Anda ketahui; file yang hanya dibatasi izinnya bisa dibuka batasannya tanpa kata sandi. Jika file tidak dilindungi, alat ini memberi tahu bahwa file bisa langsung dipakai.',
        ],
      },
      {
        title: 'Perlu diketahui',
        blocks: [
          'File yang kata sandinya tidak Anda ketahui tidak bisa dibuka; alat ini tidak menebak kata sandi. Membuka perlindungan dokumen milik orang lain tanpa izin dapat melanggar hak cipta atau perjanjian, jadi gunakan hanya untuk file milik Anda atau yang boleh Anda ubah.',
        ],
      },
    ],
  },
};
