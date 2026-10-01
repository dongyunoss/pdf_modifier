import type { LegalText } from './types';

export const id: LegalText = {
  about: [
    {
      blocks: [
        '{site} adalah kumpulan alat PDF gratis yang bisa digunakan siapa saja dengan aman. Cukup dengan browser — tanpa instalasi dan tanpa akun — Anda bisa menggabungkan, memisahkan, menyusun ulang, mengompres, dan mengonversi file PDF.',
      ],
    },
    {
      title: 'Alat PDF yang tidak pernah mengunggah file Anda',
      blocks: [
        'Kebanyakan layanan PDF online mengunggah file Anda ke server mereka. {site} memakai WebAssembly dan teknologi browser modern untuk melakukan <strong>semua pemrosesan di perangkat Anda sendiri</strong>. Kontrak, sertifikat, dan salinan kartu identitas tidak pernah meninggalkan komputer Anda, dan tidak perlu menunggu unggahan atau unduhan.',
      ],
    },
    { title: 'Alat', blocks: ['{tools}'] },
    {
      title: 'Pendanaan situs',
      blocks: [
        'Semua alat gratis. Situs ini didanai oleh iklan yang tampil di halamannya. Karena file tidak diproses di server, biaya operasional tetap rendah sehingga tidak ada batasan pemakaian maupun ukuran file.',
      ],
    },
    { title: 'Sumber terbuka', blocks: ['Layanan ini dibangun dengan proyek sumber terbuka berikut:', '{opensource}'] },
    { title: 'Kontak', blocks: ['{contact}'] },
  ],
  privacy: [
    {
      blocks: ['{site} (“situs”) menghormati privasi Anda. Kebijakan ini menjelaskan informasi apa yang ditangani situs dan bagaimana caranya.'],
    },
    {
      title: '1. File Anda',
      blocks: [
        'File PDF dan gambar <strong>diproses sepenuhnya di perangkat Anda, di dalam browser. File tidak pernah diunggah ke server kami atau dibagikan kepada pihak ketiga.</strong> Data kerja hanya ada di memori browser dan hilang saat Anda menutup halaman. Jika Anda menggunakan “Lanjutkan dengan”, file hasil disimpan di penyimpanan internal browser (IndexedDB) paling lama 10 menit agar alat berikutnya dapat membukanya; data ini juga tidak dikirim ke mana pun.',
      ],
    },
    {
      title: '2. Informasi yang dikumpulkan',
      blocks: [
        'Situs ini tidak memiliki akun dan tidak pernah meminta nama atau detail kontak Anda. Namun, informasi berikut dapat dibuat secara otomatis dan diproses oleh penyedia hosting, analitik, dan iklan:',
        {
          list: [
            'Log akses (alamat IP, waktu kunjungan, halaman yang dikunjungi), informasi browser dan perangkat',
            'Cookie dan pengenal iklan (saat iklan ditampilkan)',
          ],
        },
      ],
    },
    {
      title: '3. Cookie dan iklan',
      blocks: [
        'Situs ini dapat menampilkan iklan Google AdSense untuk menutup biaya operasional. Vendor pihak ketiga, termasuk Google, menggunakan cookie untuk menayangkan iklan berdasarkan kunjungan Anda sebelumnya ke situs ini atau situs lain. Penggunaan cookie iklan memungkinkan Google dan mitranya menayangkan iklan berdasarkan kunjungan Anda ke situs ini dan situs lain di Internet.',
        {
          list: [
            'Anda dapat menonaktifkan iklan yang dipersonalisasi di <a href="https://adssettings.google.com" rel="noopener" target="_blank">Setelan Iklan Google</a>.',
            'Anda dapat menonaktifkan cookie vendor pihak ketiga untuk iklan yang dipersonalisasi di <a href="https://www.aboutads.info/choices/" rel="noopener" target="_blank">www.aboutads.info</a>.',
            'Pelajari lebih lanjut di <a href="https://policies.google.com/technologies/partner-sites" rel="noopener" target="_blank">Cara Google menggunakan informasi dari situs atau aplikasi yang menggunakan layanannya</a>.',
            'Anda dapat memblokir cookie di setelan browser; alat PDF tetap berfungsi tanpa cookie.',
          ],
        },
      ],
    },
    {
      title: '4. Analitik',
      blocks: [
        'Untuk meningkatkan layanan, situs ini dapat mengumpulkan statistik kunjungan dengan Cloudflare Web Analytics (tanpa cookie) atau Google Analytics. Statistik ini hanya digunakan dalam bentuk agregat dan tidak mengidentifikasi Anda.',
      ],
    },
    {
      title: '5. Berbagi data',
      blocks: [
        'Kami tidak menjual atau membagikan informasi pribadi Anda. Penyedia hosting kami (misalnya Cloudflare) serta penyedia iklan atau analitik dapat memproses informasi di bagian 2 sesuai kebijakan privasi masing-masing untuk menyediakan layanan mereka.',
      ],
    },
    {
      title: '6. Penyimpanan',
      blocks: [
        'Kami sendiri tidak menyimpan informasi pribadi Anda. Informasi yang diproses penyedia pihak ketiga disimpan sesuai kebijakan mereka.',
      ],
    },
    {
      title: '7. Hak Anda',
      blocks: [
        'Anda dapat menghapus atau memblokir cookie kapan saja melalui setelan browser, dan menghubungi kami untuk pertanyaan atau permintaan apa pun terkait privasi.',
      ],
    },
    { title: '8. Anak-anak', blocks: ['Situs ini tidak dengan sengaja mengumpulkan informasi pribadi dari anak-anak.'] },
    { title: '9. Kontak', blocks: ['{contact}'] },
    { title: '10. Perubahan', blocks: ['Kebijakan ini berlaku sejak {date}. Setiap perubahan akan diumumkan di halaman ini.'] },
  ],
  terms: [
    { title: '1. Cakupan', blocks: ['Ketentuan ini mengatur penggunaan alat PDF yang disediakan oleh {site} (“situs”).'] },
    {
      title: '2. Layanan',
      blocks: [
        'Situs ini menyediakan alat gratis untuk menggabungkan, memisahkan, mengatur, mengompres, mengonversi, memberi watermark, melindungi, dan membuka kunci file PDF. Semua pemrosesan terjadi di browser Anda dan file tidak pernah diunggah.',
      ],
    },
    {
      title: '3. Tanggung jawab Anda',
      blocks: [
        {
          list: [
            'Proses hanya file yang berhak Anda gunakan.',
            'Jangan gunakan layanan ini untuk melanggar hak cipta, privasi, atau hak orang lain.',
            'Gunakan alat buka kunci hanya pada dokumen milik Anda atau yang Anda berwenang untuk mengubahnya.',
            'Jangan mengganggu operasional normal layanan.',
          ],
        },
      ],
    },
    {
      title: '4. Penafian',
      blocks: [
        {
          list: [
            'Layanan disediakan “sebagaimana adanya”, tanpa jaminan atas ketepatan, kelengkapan, atau kesesuaian untuk tujuan tertentu.',
            'Selalu simpan salinan file asli Anda.',
            'Sejauh diizinkan oleh hukum, situs tidak bertanggung jawab atas kehilangan data atau kerugian lain yang timbul dari penggunaan layanan.',
          ],
        },
      ],
    },
    { title: '5. Iklan', blocks: ['Situs ini dapat menampilkan iklan untuk mendukung operasionalnya.'] },
    {
      title: '6. Perubahan layanan',
      blocks: ['Situs dapat mengubah, menangguhkan, atau menghentikan sebagian atau seluruh layanan kapan saja.'],
    },
    { title: '7. Hukum yang berlaku', blocks: ['Ketentuan ini diatur oleh hukum Republik Korea.'] },
    { title: '8. Tanggal berlaku', blocks: ['Ketentuan ini berlaku sejak {date}.'] },
  ],
  contact: {
    about: 'Saran, laporan bug, dan pertanyaan kerja sama: {email}',
    privacy: 'Pertanyaan tentang privasi: {email}',
    none: 'Jika ada pertanyaan, silakan hubungi pengelola situs.',
  },
  listSeparator: ', ',
};
