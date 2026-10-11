// Türkçe: her aracın "Daha fazla bilgi" bölümü. {tool:id} bağlantıya, {ui:…} arayüzdeki metne dönüşür.
import type { ToolDetailSet } from '../types';

export const tr: ToolDetailSet = {
  title: '{tool} hakkında daha fazla bilgi',
  sections: {
    merge: [
      {
        title: 'Ne zaman kullanılır',
        blocks: [
          { list: [
            'İş, burs veya kredi başvurusu "tüm belgeleri tek PDF olarak" istediğinde',
            'Her ay gelen ekstreleri veya faturaları tek dosyada toplamak için',
            'Farklı kişilerin yazdığı rapor bölümlerini birleştirmek için',
          ] },
        ],
      },
      {
        title: 'Nasıl çalışır',
        blocks: [
          'Her PDF’nin sayfaları yeniden çizilmeden, olduğu gibi yeni dosyaya kopyalanır. Bu yüzden metin seçilebilir ve aranabilir kalır, görseller de kalitesini korur. Dosya listesinde her dosyanın ilk sayfasının önizlemesi ve sayfa sayısı görünür; sürükleyerek sıralamadan önce içeriği kontrol edebilirsiniz.',
        ],
      },
      {
        title: 'Bilmekte fayda var',
        blocks: [
          { list: [
            'Dosya adlarının başına 01_, 02_ gibi iki haneli numaralar eklerseniz dosyalar seçildiği anda sıralı gelir.',
            'Parolalı PDF’ler eklenirken parolası girilerek birleştirilebilir; birleştirilen dosyanın parolası olmaz.',
            'Sonradan tek tek sayfaları silmek veya döndürmek için sonucu "{ui:ui.continueWith}" ile {tool:organize} aracına gönderin.',
            'Taranmış belgeler dosyayı büyüttüyse {tool:compress} ile devam edin.',
          ] },
        ],
      },
    ],
    split: [
      {
        title: 'Ne zaman kullanılır',
        blocks: [
          { list: [
            'Toplu taranan belgeleri kişi veya dosya başına ayrı dosyalara ayırmak için',
            'Boyut sınırı yüzünden büyük bir PDF’yi parçalar hâlinde göndermek için',
            'Bir kitabı veya ders notunu bölümlere ayırmak için',
          ] },
        ],
      },
      {
        title: 'Üç bölme yöntemi',
        blocks: [
          { table: {
            head: ['Mod', 'Örnek giriş', 'Sonuç'],
            rows: [
              ['{ui:tools.split.ui.modeRanges}', '1-3, 4-6, 7-', 'Her aralık için bir PDF ("7-" 7. sayfadan sona kadar demektir)'],
              ['{ui:tools.split.ui.modeEvery}', '2', 'Her iki sayfada bir yeni PDF'],
              ['{ui:tools.split.ui.modeEach}', '-', 'Her sayfa için bir PDF'],
            ],
          } },
          'Bölmeden önce araç kaç dosya oluşacağını gösterir. Birden fazla sonuç varsa hepsini tek bir ZIP dosyası olarak indirebilirsiniz.',
        ],
      },
      {
        title: 'Bilmekte fayda var',
        blocks: [
          'Yalnızca bazı bölümlere ihtiyacınız varsa {tool:extract-pages} daha hızlıdır. Sayfalar değiştirilmeden kopyalandığı için bölünen dosyalar orijinaliyle tamamen aynı kalitededir.',
        ],
      },
    ],
    organize: [
      {
        title: 'Ne zaman kullanılır',
        blocks: [
          'Aynı anda birkaç düzeltme gereken belgeler içindir: sırası karışmış taramalar, arkası boş sayfalar içeren çift taraflı taramalar veya araya boş sayfa eklenmesi gereken baskı belgeleri.',
        ],
      },
      {
        title: 'Neler yapabilirsiniz',
        blocks: [
          { list: [
            'Sayfaları sürükleyerek sırasını değiştirmek',
            'Birden çok sayfayı seçip birlikte döndürmek veya silmek (Shift + tıklama bir aralık seçer)',
            'Sayfa çoğaltmak ve boş sayfa eklemek',
            'Başka bir PDF ekleyip sayfalarını karıştırmak',
            'Her değişikliği geri almak ve yinelemek',
          ] },
          '"{ui:tools.organize.ui.action}" düğmesine basana kadar hiçbir şey kaydedilmez; gönül rahatlığıyla deneyebilirsiniz.',
        ],
      },
      {
        title: 'Bilmekte fayda var',
        blocks: [
          'Yalnızca döndürmeniz gerekiyorsa {tool:rotate}, yalnızca silmek için {tool:delete-pages} daha basittir. Yüzlerce sayfalık belgelerde önizlemelerin oluşması zaman alır; önce ihtiyacınız olan bölümü {tool:split} ile ayırmak zaman kazandırır.',
        ],
      },
    ],
    rotate: [
      {
        title: 'Ne zaman kullanılır',
        blocks: [
          'Tarayıcıya ters giren sayfalar, dikey bir belgedeki yatay tablolar veya telefon fotoğraflarından oluşturulan PDF’lerde yan yatmış sayfalar için.',
        ],
      },
      {
        title: 'Nasıl çalışır',
        blocks: [
          'Her tıklama sayfayı saat yönünde 90° döndürür; "{ui:tools.rotate.ui.rotateAllLeft}" ve "{ui:tools.rotate.ui.rotateAllRight}" tüm sayfaları bir kerede döndürür. Yalnızca sayfanın yön bilgisi değişir; hiçbir şey yeniden çizilmez, bu yüzden kalite bozulmaz ve metin seçilebilir kalır.',
        ],
      },
      {
        title: 'Bilmekte fayda var',
        blocks: [
          'Sayfaları ayrıca yeniden sıralamanız veya silmeniz gerekiyorsa {tool:organize} hepsini tek seferde yapar. PDF okuyuculardaki "görünümü döndür" genellikle dosyaya kaydedilmez; yönü kalıcı olarak düzeltmek için sonucu bu araçla kaydedin.',
        ],
      },
    ],
    'delete-pages': [
      {
        title: 'Ne zaman kullanılır',
        blocks: [
          { list: [
            'Çift taraflı taramadaki boş arka sayfaları kaldırmak için',
            'Belgeyi teslim etmeden önce kapak veya açıklama sayfasını çıkarmak için',
            'Gereksiz fotoğraf sayfalarını silip dosyayı küçültmek için',
          ] },
        ],
      },
      {
        title: 'Nasıl çalışır',
        blocks: [
          'Silmek istediğiniz sayfalara tıklayın; düğme kaç sayfanın silineceğini gösterir. Kalan sayfalar değiştirilmeden yeni bir dosyaya kopyalanır, bu yüzden kalite aynı kalır. Araç, yanlışlıkla tüm sayfaları silmenizi engeller.',
        ],
      },
      {
        title: 'Bilmekte fayda var',
        blocks: [
          'Saklayacağınız sayfalar sileceklerinizden çok daha azsa, saklanacakları {tool:extract-pages} ile seçmek daha az tıklama gerektirir.',
        ],
      },
    ],
    'extract-pages': [
      {
        title: 'Ne zaman kullanılır',
        blocks: [
          'Uzun bir rapordan birkaç sayfa göndermek, bir sözleşmenin yalnızca imza sayfasını saklamak veya PDF ders kitabından ödev sayfalarını çıkarmak için.',
        ],
      },
      {
        title: 'İki kaydetme yöntemi',
        blocks: [
          { list: [
            '{ui:tools.extract-pages.ui.outputSingle}: seçilen sayfalar, özgün sıralarıyla, tek bir yeni dosyada.',
            '{ui:tools.extract-pages.ui.outputSeparate}: seçilen her sayfa ayrı bir PDF olarak, hepsi tek bir ZIP ile indirilebilir.',
          ] },
          'Sayfa verileri değiştirilmeden kopyalanır; metin seçimi, bağlantılar ve görsel kalitesi orijinalle aynıdır.',
        ],
      },
      {
        title: 'Bilmekte fayda var',
        blocks: [
          'PDF yerine görsel mi gerekiyor? {tool:pdf-to-jpg} aracını kullanın. Ancak yalnızca belgenin bir kısmını iletmek istiyorsanız PDF olarak çıkarılan sayfalar görsellerden daha net ve daha küçüktür.',
        ],
      },
    ],
    compress: [
      {
        title: 'Ne zaman kullanılır',
        blocks: [
          'Bir e-posta veya yükleme formu dosyayı çok büyük olduğu için reddettiğinde ya da taramaları ve fotoğraf ağırlıklı PDF’leri arşivlemeden önce. Metin ağırlıklı belgeler zaten küçüktür ve neredeyse hiç küçülmez.',
        ],
      },
      {
        title: 'Sıkıştırma seviyeleri',
        blocks: [
          { table: {
            head: ['Seviye', 'Görselin uzun kenarı', 'JPEG kalitesi', 'Uygun olduğu durum'],
            rows: [
              ['{ui:tools.compress.ui.levelLow}', '2.400 px', '%82', 'Baskı, fotoğrafın önemli olduğu belgeler'],
              ['{ui:tools.compress.ui.levelMedium}', '1.700 px', '%68', 'E-posta ekleri ve çoğu başvuru'],
              ['{ui:tools.compress.ui.levelHigh}', '1.200 px', '%50', 'Çok sıkı boyut sınırları'],
            ],
          } },
          'Yalnızca PDF içindeki görseller yeniden kodlanır; metin ve vektör grafikler değiştirilmez, böylece metin seçilebilir ve aranabilir kalır. En az %10 küçülmeyecek görseller, kaliteyi korumak için olduğu gibi bırakılır.',
        ],
      },
      {
        title: '"{ui:tools.compress.ui.rasterize}" hakkında',
        blocks: [
          'Görsel sıkıştırma yetmediğinde bu seçenek her sayfayı seviyeye göre 150, 120 veya 96 DPI’lık bir görsel olarak yeniden çizer. Taramalarda çok etkilidir, ancak metin artık seçilemez ve aranamaz; yalnızca okunacak kopyalar için kullanın.',
        ],
      },
      {
        title: 'Bilmekte fayda var',
        blocks: [
          { list: [
            'Sıkıştırılmış bir dosyayı yeniden sıkıştırmak yalnızca kaliteyi düşürür. Seviyeyi yükseltirken orijinal dosyadan yeniden başlayın.',
            'Gereksiz sayfaları önce {tool:delete-pages} ile çıkarmak sıkıştırmayı daha etkili kılar.',
          ] },
        ],
      },
    ],
    'jpg-to-pdf': [
      {
        title: 'Ne zaman kullanılır',
        blocks: [
          'Telefonla çekilmiş fiş, form veya el yazısı not fotoğraflarını teslim etmek ya da saklamak için tek bir belgeye dönüştürmek istediğinizde. JPG, PNG, WebP, GIF ve BMP görselleri desteklenir; fotoğraflar EXIF yön bilgisine göre otomatik olarak düzeltilir.',
        ],
      },
      {
        title: 'Ayarları seçmek',
        blocks: [
          { table: {
            head: ['Ayar', 'Seçenekler', 'Öneri'],
            rows: [
              ['{ui:tools.jpg-to-pdf.ui.pageSize}', '{ui:tools.jpg-to-pdf.ui.sizeFit} / A4 / Letter', 'Baskı ve teslim için A4; fotoğraf arşivi için {ui:tools.jpg-to-pdf.ui.sizeFit}'],
              ['{ui:tools.jpg-to-pdf.ui.orientation}', '{ui:tools.jpg-to-pdf.ui.orientAuto} / {ui:tools.jpg-to-pdf.ui.orientPortrait} / {ui:tools.jpg-to-pdf.ui.orientLandscape}', 'Çoğu durumda {ui:tools.jpg-to-pdf.ui.orientAuto}'],
              ['{ui:tools.jpg-to-pdf.ui.margin}', '{ui:tools.jpg-to-pdf.ui.marginNone} / {ui:tools.jpg-to-pdf.ui.marginSmall} / {ui:tools.jpg-to-pdf.ui.marginLarge}', 'Baskı için {ui:tools.jpg-to-pdf.ui.marginSmall}; ekran için {ui:tools.jpg-to-pdf.ui.marginNone}'],
            ],
          } },
          'A4 veya Letter seçildiğinde her fotoğraf oranları korunarak sayfaya sığdırılır; fotoğraflar farklı boyutlarda olsa bile tüm sayfalar aynı boyutta olur.',
        ],
      },
      {
        title: 'Bilmekte fayda var',
        blocks: [
          { list: [
            'Gölgesiz, aydınlık bir ortamda ve telefonu kâğıda paralel tutarak çekmek büyük fark yaratır. Flaşı kapatın; parlak kâğıt ışığı yansıtır.',
            'Telefon fotoğrafları tanesi birkaç MB olduğu için PDF hızla büyür. Sonuç ekranından doğrudan {tool:compress} aracına geçebilirsiniz.',
          ] },
        ],
      },
    ],
    'pdf-to-jpg': [
      {
        title: 'Ne zaman kullanılır',
        blocks: [
          'Bir PDF sayfasını blogda veya sosyal medyada paylaşmak, sunuma ya da belgeye görsel olarak eklemek veya PDF açmakta zorlanan birine mesajlaşma uygulamasıyla göndermek için.',
        ],
      },
      {
        title: 'Çözünürlük ve biçim seçimi',
        blocks: [
          { table: {
            head: ['Çözünürlük', 'A4 sayfanın piksel boyutu', 'Kullanım'],
            rows: [
              ['{ui:tools.pdf-to-jpg.ui.dpiLow}', 'yaklaşık 595 × 842', 'Önizleme, hızlı paylaşım'],
              ['{ui:tools.pdf-to-jpg.ui.dpiMedium}', 'yaklaşık 1.240 × 1.754', 'Web’de yayınlama, ekranda okuma'],
              ['{ui:tools.pdf-to-jpg.ui.dpiHigh}', 'yaklaşık 2.480 × 3.508', 'Baskı, küçük yazıları büyütme'],
            ],
          } },
          'DPI’yi iki katına çıkarmak genişliği ve yüksekliği iki katına çıkarır; görselin piksel sayısı dört katına, dosya boyutu da yaklaşık o kadar artar. Metin ve tablo ağırlıklı sayfalar için PNG, fotoğraf ağırlıklı sayfalar için JPG seçin. Yalnızca seçtiğiniz sayfaları dönüştürebilir, birden çok görseli tek ZIP ile indirebilirsiniz.',
        ],
      },
      {
        title: 'Bilmekte fayda var',
        blocks: [
          'Görsele dönüşen sayfada metin artık seçilemez veya aranamaz. Belgenin yalnızca bir kısmını iletmek istiyorsanız sayfaları {tool:extract-pages} ile PDF olarak çıkarın.',
        ],
      },
    ],
    watermark: [
      {
        title: 'Ne zaman kullanılır',
        blocks: [
          { list: [
            'İç belgeleri "Gizli" veya "Taslak" olarak işaretlemek için',
            'Kimlik fotokopisine hangi amaçla verildiğini yazarak başka yerde kullanılmasını zorlaştırmak için',
            'Portfolyoya veya sunum notlarına logonuzu eklemek için',
          ] },
        ],
      },
      {
        title: 'Neler ayarlanabilir',
        blocks: [
          'Metin veya logo görseli seçip rengini, boyutunu, opaklığını ve açısını ayarlayın. "{ui:tools.watermark.ui.layoutCenter}" sayfanın ortasına tek bir işaret koyar, "{ui:tools.watermark.ui.layoutTile}" ise işareti tüm sayfaya tekrarlar. Tüm sayfalara ya da yalnızca belirttiğiniz sayfalara uygulayabilir, sonucu ilk sayfanın önizlemesinde kontrol edebilirsiniz.',
        ],
      },
      {
        title: 'Bilmekte fayda var',
        blocks: [
          'Sızıntıyı caydırmak için %20–30 opaklıkta "{ui:tools.watermark.ui.layoutTile}" yerleşimini kırpmak zordur. Filigran içeriği gizlemez; dosyayı başka kimsenin okumaması gerekiyorsa {tool:protect} ile açılış parolası da ekleyin.',
        ],
      },
    ],
    'page-numbers': [
      {
        title: 'Ne zaman kullanılır',
        blocks: [
          'Birleştirilmiş başvuru dosyaları, basılıp ciltlenecek raporlar ve toplantıda "12. sayfaya bakın" denmesi gereken belgeler için.',
        ],
      },
      {
        title: 'Neler ayarlanabilir',
        blocks: [
          'Konum (üstte veya altta; solda, ortada veya sağda), numara biçimi, başlangıç numarası, yazı boyutu ve kenar boşluğu. Kapak sayfasını atlayıp numaralandırmaya ilk içerik sayfasından başlamak için uygulanacak sayfalarda "{ui:tools.page-numbers.ui.pagesCustom}" seçeneğini seçin, 2. sayfadan itibaren girin ve başlangıç numarasını 1 bırakın. Uygulamadan önce önizlemeyi kontrol edin.',
        ],
      },
      {
        title: 'Bilmekte fayda var',
        blocks: [
          'Numaraları en son ekleyin. Numaralandırdıktan sonra sayfaların sırasını değiştirirseniz numaralar karışır; sırayı önce {tool:merge} veya {tool:organize} ile kesinleştirin.',
        ],
      },
    ],
    protect: [
      {
        title: 'Ne zaman kullanılır',
        blocks: [
          'Maaş bordrosu, sözleşme, sağlık veya finans belgeleri gibi yalnızca alıcının okuması gereken PDF’leri göndermek için.',
        ],
      },
      {
        title: 'Parola ve izinler',
        blocks: [
          'Belgenin tamamı AES-256 ile şifrelenir ve parola olmadan açılamaz. İsteğe bağlı izinler yazdırma, kopyalama, düzenleme ve not eklemeyi denetler; ancak bunlar PDF okuyuculardan uymaları istenen işaretlerdir, gerçek şifreleme değildir.',
          'Şifreleme tarayıcınızda yapılır ve parola hiçbir yerde saklanmaz. Bu da parolayı unutursanız kimsenin, biz dahil, onu kurtaramayacağı anlamına gelir.',
        ],
      },
      {
        title: 'Bilmekte fayda var',
        blocks: [
          { list: [
            'En az 12 karakterlik uzun bir parola kullanın; doğum tarihi veya telefon numarasından kaçının.',
            'Dosyayı e-postayla, parolayı SMS veya telefonla iletin.',
          ] },
        ],
      },
    ],
    unlock: [
      {
        title: 'Ne zaman kullanılır',
        blocks: [
          'Aylık ekstreler gibi kendi korumalı belgelerinizi her seferinde parola yazmadan saklamak ya da kendi dosyalarınızdaki yazdırma ve kopyalama kısıtlamalarını kaldırmak için.',
        ],
      },
      {
        title: 'Nasıl çalışır',
        blocks: [
          'Bir dosya seçtiğinizde araç önce dosyada ne tür bir koruma olduğunu söyler. Açılış parolası olan dosyalar bildiğiniz parolayı gerektirir; yalnızca izin kısıtlaması olan dosyalar parola olmadan serbest bırakılır. Dosya korumasızsa, olduğu gibi kullanabileceğinizi bildirir.',
        ],
      },
      {
        title: 'Bilmekte fayda var',
        blocks: [
          'Parolasını bilmediğiniz dosyaların kilidi açılamaz; araç parola tahmin etmez. Başkasının belgesindeki korumayı izinsiz kaldırmak telif hakkını veya bir sözleşmeyi ihlal edebilir; bu yüzden yalnızca size ait ya da değiştirme yetkiniz olan dosyalarda kullanın.',
        ],
      },
    ],
  },
};
