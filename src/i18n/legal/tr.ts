import type { LegalText } from './types';

export const tr: LegalText = {
  about: [
    {
      blocks: [
        '{site}, herkesin gönül rahatlığıyla kullanabileceği ücretsiz PDF araçlarından oluşur. Yalnızca bir web tarayıcısıyla — kurulum ve hesap olmadan — PDF dosyalarını birleştirebilir, bölebilir, yeniden sıralayabilir, sıkıştırabilir ve dönüştürebilirsiniz.',
      ],
    },
    {
      title: 'Dosyalarınızı asla yüklemeyen PDF araçları',
      blocks: [
        'Çevrimiçi PDF hizmetlerinin çoğu dosyalarınızı kendi sunucularına yükler. {site}, WebAssembly ve modern tarayıcı teknolojisiyle <strong>tüm işlemleri kendi cihazınızda</strong> yapar. Sözleşmeler, belgeler ve kimlik kopyaları bilgisayarınızdan hiç çıkmaz; yükleme veya indirme beklemeniz de gerekmez.',
      ],
    },
    { title: 'Araçlar', blocks: ['{tools}'] },
    {
      title: 'Site nasıl finanse ediliyor',
      blocks: [
        'Tüm araçlar ücretsizdir. Site, sayfalarında gösterilen reklamlarla ayakta kalır. Dosyalar sunucularda işlenmediği için işletme maliyetleri düşüktür; bu sayede kullanım veya dosya boyutu sınırı yoktur.',
      ],
    },
    { title: 'Açık kaynak', blocks: ['Bu hizmet aşağıdaki açık kaynak projeler üzerine kuruludur:', '{opensource}'] },
    { title: 'İletişim', blocks: ['{contact}'] },
  ],
  privacy: [
    {
      blocks: ['{site} (“site”) gizliliğinize saygı duyar. Bu politika, sitenin hangi bilgileri nasıl işlediğini açıklar.'],
    },
    {
      title: '1. Dosyalarınız',
      blocks: [
        'PDF ve görsel dosyaları <strong>tamamen cihazınızda, web tarayıcınızın içinde işlenir. Sunucularımıza asla yüklenmez ve üçüncü taraflarla paylaşılmaz.</strong> Çalışma verileri yalnızca tarayıcı belleğinde bulunur ve sayfayı kapattığınızda silinir. “Şununla devam et” özelliğini kullanırsanız, sonuç dosyası bir sonraki aracın açabilmesi için tarayıcınızın dahili depolamasında (IndexedDB) en fazla 10 dakika tutulur; bu veri de hiçbir yere gönderilmez.',
      ],
    },
    {
      title: '2. Toplanan bilgiler',
      blocks: [
        'Sitede hesap yoktur ve adınız ya da iletişim bilgileriniz asla istenmez. Ancak aşağıdaki bilgiler otomatik olarak oluşabilir ve barındırma, analiz ve reklam sağlayıcıları tarafından işlenebilir:',
        {
          list: [
            'Erişim kayıtları (IP adresi, ziyaret zamanı, ziyaret edilen sayfalar), tarayıcı ve cihaz bilgileri',
            'Çerezler ve reklam tanımlayıcıları (reklam gösterildiğinde)',
          ],
        },
      ],
    },
    {
      title: '3. Çerezler ve reklamlar',
      blocks: [
        'Site, işletme maliyetlerini karşılamak için Google AdSense reklamları gösterebilir. Google dahil üçüncü taraf sağlayıcılar, bu siteye veya diğer sitelere önceki ziyaretlerinize göre reklam göstermek için çerezler kullanır. Google’ın reklam çerezlerini kullanması, Google’ın ve iş ortaklarının bu siteye ve internetteki diğer sitelere yaptığınız ziyaretlere göre reklam göstermesini sağlar.',
        {
          list: [
            'Kişiselleştirilmiş reklamları <a href="https://adssettings.google.com" rel="noopener" target="_blank">Google Reklam Ayarları</a> sayfasından kapatabilirsiniz.',
            'Üçüncü taraf sağlayıcıların kişiselleştirilmiş reklam çerezlerini <a href="https://www.aboutads.info/choices/" rel="noopener" target="_blank">www.aboutads.info</a> adresinden kapatabilirsiniz.',
            'Ayrıntılar için <a href="https://policies.google.com/technologies/partner-sites" rel="noopener" target="_blank">Google’ın, hizmetlerini kullanan site veya uygulamalardan gelen bilgileri nasıl kullandığı</a> sayfasına bakın.',
            'Çerezleri tarayıcı ayarlarınızdan engelleyebilirsiniz; PDF araçları çerezler olmadan da çalışmaya devam eder.',
          ],
        },
      ],
    },
    {
      title: '4. Analiz',
      blocks: [
        'Hizmeti geliştirmek için site, ziyaret istatistiklerini Cloudflare Web Analytics (çerezsiz) veya Google Analytics ile toplayabilir. Bu istatistikler yalnızca toplu olarak kullanılır ve sizi tanımlamaz.',
      ],
    },
    {
      title: '5. Paylaşım',
      blocks: [
        'Kişisel bilgilerinizi satmayız veya paylaşmayız. Barındırma sağlayıcımız (ör. Cloudflare) ile reklam veya analiz sağlayıcıları, hizmetlerini sunmak için 2. bölümdeki bilgileri kendi gizlilik politikalarına göre işleyebilir.',
      ],
    },
    {
      title: '6. Saklama',
      blocks: [
        'Kişisel bilgilerinizi kendimiz saklamayız. Üçüncü taraf sağlayıcıların işlediği bilgiler, onların politikalarına göre saklanır.',
      ],
    },
    {
      title: '7. Haklarınız',
      blocks: [
        'Çerezleri istediğiniz zaman tarayıcı ayarlarınızdan silebilir veya engelleyebilir, gizlilikle ilgili her türlü soru veya talep için bizimle iletişime geçebilirsiniz.',
      ],
    },
    { title: '8. Çocuklar', blocks: ['Site, çocuklardan bilerek kişisel bilgi toplamaz.'] },
    { title: '9. İletişim', blocks: ['{contact}'] },
    { title: '10. Değişiklikler', blocks: ['Bu politika {date} tarihinden itibaren geçerlidir. Değişiklikler bu sayfada yayımlanır.'] },
  ],
  terms: [
    { title: '1. Kapsam', blocks: ['Bu koşullar, {site} (“site”) tarafından sunulan PDF araçlarının kullanımını düzenler.'] },
    {
      title: '2. Hizmet',
      blocks: [
        'Site; PDF dosyalarını birleştirmek, bölmek, düzenlemek, sıkıştırmak, dönüştürmek, filigran eklemek, korumak ve kilidini açmak için ücretsiz araçlar sunar. Tüm işlemler tarayıcınızda gerçekleşir ve dosyalarınız asla yüklenmez.',
      ],
    },
    {
      title: '3. Sorumluluklarınız',
      blocks: [
        {
          list: [
            'Yalnızca kullanma hakkına sahip olduğunuz dosyaları işleyin.',
            'Hizmeti başkalarının telif haklarını, gizliliğini veya diğer haklarını ihlal etmek için kullanmayın.',
            'Kilit açma aracını yalnızca size ait olan veya değiştirmeye yetkili olduğunuz belgelerde kullanın.',
            'Hizmetin normal işleyişine müdahale etmeyin.',
          ],
        },
      ],
    },
    {
      title: '4. Sorumluluk reddi',
      blocks: [
        {
          list: [
            'Hizmet “olduğu gibi” sunulur; doğruluk, eksiksizlik veya belirli bir amaca uygunluk konusunda hiçbir garanti verilmez.',
            'Orijinal dosyalarınızın bir kopyasını her zaman saklayın.',
            'Yasaların izin verdiği ölçüde site, hizmetin kullanımından doğan veri kaybı veya diğer zararlardan sorumlu değildir.',
          ],
        },
      ],
    },
    { title: '5. Reklam', blocks: ['Site, işleyişini desteklemek için reklam gösterebilir.'] },
    {
      title: '6. Hizmette değişiklikler',
      blocks: ['Site, hizmetin tamamını veya bir kısmını dilediği zaman değiştirebilir, askıya alabilir veya sonlandırabilir.'],
    },
    { title: '7. Uygulanacak hukuk', blocks: ['Bu koşullar Kore Cumhuriyeti yasalarına tabidir.'] },
    { title: '8. Yürürlük tarihi', blocks: ['Bu koşullar {date} tarihinden itibaren geçerlidir.'] },
  ],
  contact: {
    about: 'Öneriler, hata bildirimleri ve iş birliği talepleri için: {email}',
    privacy: 'Gizlilikle ilgili sorular: {email}',
    none: 'Sorularınız için lütfen site yöneticisiyle iletişime geçin.',
  },
  listSeparator: ', ',
};
