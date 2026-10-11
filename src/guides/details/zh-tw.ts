// 繁體中文：工具頁面的「深入了解」區塊。{tool:id} 會變成工具連結，{ui:…} 會變成畫面上的文字。
import type { ToolDetailSet } from '../types';

export const zhTw: ToolDetailSet = {
  title: '深入了解{tool}',
  sections: {
    merge: [
      {
        title: '適用情境',
        blocks: [
          { list: [
            '求職、留學或貸款資料要求「合併成一個 PDF 提交」時',
            '想把每月的帳單、收據 PDF 合併成一個檔案保存時',
            '把多人分工撰寫的報告各章節整合成一份時',
          ] },
        ],
      },
      {
        title: '運作方式',
        blocks: [
          '合併時不會重新繪製頁面，而是把每個 PDF 的原始頁面資料直接複製到新檔案中。因此合併後文字仍可選取和搜尋，圖片畫質也不會改變。檔案清單會顯示每個檔案第一頁的預覽和頁數，方便您在拖曳排序前確認內容。',
        ],
      },
      {
        title: '小提醒',
        blocks: [
          { list: [
            '在檔名前加上 01_、02_ 這樣的兩位數編號，選取檔案時順序就已經排好了。',
            '有密碼的 PDF 在加入時輸入密碼即可一起合併，合併後的檔案不會有密碼。',
            '合併後若要刪除或旋轉個別頁面，可在結果畫面點選「{ui:ui.continueWith}」，直接交給{tool:organize}處理。',
            '如果混入掃描檔導致檔案過大，可以接著用{tool:compress}縮小。',
          ] },
        ],
      },
    ],
    split: [
      {
        title: '適用情境',
        blocks: [
          { list: [
            '把一次掃描的一疊文件依人或依案件拆成多個檔案',
            '因為附件大小限制，需要把大型 PDF 分成幾份寄送',
            '把電子書或教材 PDF 依章節拆開',
          ] },
        ],
      },
      {
        title: '三種分割方式',
        blocks: [
          { table: {
            head: ['方式', '輸入範例', '結果'],
            rows: [
              ['{ui:tools.split.ui.modeRanges}', '1-3, 4-6, 7-', '每個範圍產生一個 PDF（7- 表示第 7 頁到最後）'],
              ['{ui:tools.split.ui.modeEvery}', '2', '每 2 頁切成一個 PDF'],
              ['{ui:tools.split.ui.modeEach}', '-', '每頁產生一個 PDF'],
            ],
          } },
          '分割前會先顯示將產生幾個檔案。結果有多個檔案時，可以打包成一個 ZIP 一次下載。',
        ],
      },
      {
        title: '小提醒',
        blocks: [
          '如果只需要其中幾頁，用{tool:extract-pages}直接擷取會比分割後再挑選更快。頁面資料原樣複製，分割後的檔案畫質與原檔相同。',
        ],
      },
    ],
    organize: [
      {
        title: '適用情境',
        blocks: [
          '需要同時調整順序、旋轉、刪除等多項內容時，在一個畫面裡就能完成。適合掃描順序錯亂的文件、夾雜空白背面的雙面掃描檔，以及需要插入空白隔頁的列印資料。',
        ],
      },
      {
        title: '可以做什麼',
        blocks: [
          { list: [
            '拖曳頁面調整順序',
            '選取多頁後一次旋轉或刪除（按住 Shift 點選可連續選取）',
            '複製頁面、插入空白頁',
            '加入其他 PDF，以頁為單位混合排列',
            '復原與重做',
          ] },
          '在按下「{ui:tools.organize.ui.action}」之前，原始檔案不會被更動，可以放心嘗試。',
        ],
      },
      {
        title: '小提醒',
        blocks: [
          '只需要旋轉時用{tool:rotate}，只需要刪除時用{tool:delete-pages}會更簡單。數百頁的文件產生預覽需要一些時間，可以先用{tool:split}拆出需要的部分再編輯。',
        ],
      },
    ],
    rotate: [
      {
        title: '適用情境',
        blocks: [
          '紙張放反的掃描檔、夾雜橫向表格的文件，或用手機照片製作的 PDF 中頁面橫躺時使用。',
        ],
      },
      {
        title: '運作方式',
        blocks: [
          '每點選一次頁面，就順時針旋轉 90°；也可以用「{ui:tools.rotate.ui.rotateAllLeft}」「{ui:tools.rotate.ui.rotateAllRight}」一次旋轉所有頁面。旋轉只修改頁面的方向資訊，不會重新繪製內容，所以畫質完全不受影響，文字也仍然可以選取。',
        ],
      },
      {
        title: '小提醒',
        blocks: [
          '如果除了旋轉還要調整順序或刪除頁面，在{tool:organize}中一次完成更快。PDF 閱讀器裡的「旋轉檢視」通常不會存進檔案，想永久修正方向請用本工具儲存。',
        ],
      },
    ],
    'delete-pages': [
      {
        title: '適用情境',
        blocks: [
          { list: [
            '刪除雙面掃描產生的空白背面',
            '提交資料前拿掉封面或說明頁',
            '為了縮小檔案，刪掉不需要的照片頁',
          ] },
        ],
      },
      {
        title: '運作方式',
        blocks: [
          '在預覽中點選要刪除的頁面，按鈕上會顯示將刪除的頁數。保留的頁面依原始資料組成新檔案，畫質不變。如果不小心選取了全部頁面，工具會阻止儲存。',
        ],
      },
      {
        title: '小提醒',
        blocks: [
          '如果要保留的頁面遠少於要刪除的頁面，反過來在{tool:extract-pages}中只選保留的頁面，點選次數會更少。',
        ],
      },
    ],
    'extract-pages': [
      {
        title: '適用情境',
        blocks: [
          '從長篇報告中只寄幾頁給別人、單獨保存合約的簽名頁，或從教材 PDF 中取出作業範圍時使用。',
        ],
      },
      {
        title: '兩種儲存方式',
        blocks: [
          { list: [
            '{ui:tools.extract-pages.ui.outputSingle}：把選取的頁面依原順序合成一個新的 PDF。',
            '{ui:tools.extract-pages.ui.outputSeparate}：每個選取的頁面各存成一個 PDF，可打包成一個 ZIP 下載。',
          ] },
          '頁面資料原樣複製，文字選取、連結和畫質都與原檔相同。',
        ],
      },
      {
        title: '小提醒',
        blocks: [
          '如果需要的是圖片檔，請使用{tool:pdf-to-jpg}。不過如果目的是把文件內容交給別人，擷取成 PDF 會比轉成圖片更清晰，檔案也更小。',
        ],
      },
    ],
    compress: [
      {
        title: '適用情境',
        blocks: [
          '電子郵件附件超過上限、政府機關或學校網站有上傳大小限制時，或在保存掃描檔、圖片較多的 PDF 之前使用。以文字為主的文件本身就很小，幾乎壓不下來。',
        ],
      },
      {
        title: '各壓縮等級的差異',
        blocks: [
          { table: {
            head: ['等級', '圖片長邊上限', 'JPEG 品質', '建議用途'],
            rows: [
              ['{ui:tools.compress.ui.levelLow}', '2,400 像素', '82%', '需要列印、照片畫質很重要的資料'],
              ['{ui:tools.compress.ui.levelMedium}', '1,700 像素', '68%', '郵件附件、大多數提交文件'],
              ['{ui:tools.compress.ui.levelHigh}', '1,200 像素', '50%', '大小限制非常嚴格時'],
            ],
          } },
          '只重新儲存 PDF 中的圖片，不更動文字與圖形，因此壓縮後文字仍可選取和搜尋。重新儲存後縮小不到 10% 的圖片會保持原樣，以保護畫質。',
        ],
      },
      {
        title: '關於「{ui:tools.compress.ui.rasterize}」',
        blocks: [
          '圖片壓縮還不夠時可以使用這個選項。它會依等級把每一頁轉成 150、120 或 96 DPI 的圖片後重新產生檔案，對掃描檔特別有效，但文字將無法選取和搜尋。適合只需要閱覽的提交副本。',
        ],
      },
      {
        title: '小提醒',
        blocks: [
          { list: [
            '對已壓縮過的檔案再壓縮一次只會降低畫質。提高等級時，請從原始檔案重新開始。',
            '壓縮前先用{tool:delete-pages}刪掉不需要的頁面，效果會更好。',
          ] },
        ],
      },
    ],
    'jpg-to-pdf': [
      {
        title: '適用情境',
        blocks: [
          '把手機拍的收據、文件或手寫筆記整理成一份檔案提交或保存時使用。支援 JPG、PNG、WebP、GIF、BMP 圖片，並會依照片的旋轉資訊（EXIF）自動轉正方向。',
        ],
      },
      {
        title: '如何選擇設定',
        blocks: [
          { table: {
            head: ['設定', '選項', '建議'],
            rows: [
              ['{ui:tools.jpg-to-pdf.ui.pageSize}', '{ui:tools.jpg-to-pdf.ui.sizeFit} / A4 / Letter', '提交和列印選 A4，保存照片選{ui:tools.jpg-to-pdf.ui.sizeFit}'],
              ['{ui:tools.jpg-to-pdf.ui.orientation}', '{ui:tools.jpg-to-pdf.ui.orientAuto} / {ui:tools.jpg-to-pdf.ui.orientPortrait} / {ui:tools.jpg-to-pdf.ui.orientLandscape}', '大多數情況選{ui:tools.jpg-to-pdf.ui.orientAuto}'],
              ['{ui:tools.jpg-to-pdf.ui.margin}', '{ui:tools.jpg-to-pdf.ui.marginNone} / {ui:tools.jpg-to-pdf.ui.marginSmall} / {ui:tools.jpg-to-pdf.ui.marginLarge}', '列印用選{ui:tools.jpg-to-pdf.ui.marginSmall}，只在螢幕上看選{ui:tools.jpg-to-pdf.ui.marginNone}'],
            ],
          } },
          '選擇 A4 或 Letter 後，照片會維持原始比例縮放到紙張內。即使照片大小各不相同，所有頁面的尺寸也會一致。',
        ],
      },
      {
        title: '小提醒',
        blocks: [
          { list: [
            '在明亮、沒有陰影的地方，讓手機與紙面保持平行拍攝，效果會好很多。閃光燈容易反光，最好關掉。',
            '手機照片每張往往有好幾 MB，PDF 很快就會變大。可以在結果畫面直接交給{tool:compress}縮小。',
          ] },
        ],
      },
    ],
    'pdf-to-jpg': [
      {
        title: '適用情境',
        blocks: [
          '想把 PDF 的某一頁發到部落格或社群媒體、當作圖片放進簡報或文件，或透過通訊軟體傳給不方便開啟 PDF 的人時使用。',
        ],
      },
      {
        title: '如何選擇解析度與格式',
        blocks: [
          { table: {
            head: ['解析度', 'A4 一頁的圖片尺寸', '用途'],
            rows: [
              ['{ui:tools.pdf-to-jpg.ui.dpiLow}', '約 595 × 842 像素', '預覽、快速分享'],
              ['{ui:tools.pdf-to-jpg.ui.dpiMedium}', '約 1,240 × 1,754 像素', '網頁刊登、螢幕閱讀'],
              ['{ui:tools.pdf-to-jpg.ui.dpiHigh}', '約 2,480 × 3,508 像素', '列印、放大查看小字'],
            ],
          } },
          'DPI 提高一倍，寬和高各變為兩倍，檔案大約變為四倍。文字和表格較多的頁面適合 PNG，照片較多的頁面適合 JPG。可以只轉換選取的頁面，多張圖片可打包成一個 ZIP 下載。',
        ],
      },
      {
        title: '小提醒',
        blocks: [
          '轉成圖片後，文字將無法選取和搜尋。如果只是想把文件的一部分交給別人，用{tool:extract-pages}直接擷取成 PDF 會更清晰，檔案也更小。',
        ],
      },
    ],
    watermark: [
      {
        title: '適用情境',
        blocks: [
          { list: [
            '在內部文件上標註「機密」「草稿」等字樣',
            '在身分證影本上寫明「僅供某某用途」，避免被挪作他用',
            '在作品集或講義上加上標誌，註明出處',
          ] },
        ],
      },
      {
        title: '可以設定什麼',
        blocks: [
          '可以選擇文字或標誌圖片，並設定顏色、大小、不透明度和角度。版面可選在頁面中央放一個的「{ui:tools.watermark.ui.layoutCenter}」，或在整頁重複鋪滿的「{ui:tools.watermark.ui.layoutTile}」。可以套用到所有頁面或指定頁面，並能先在第一頁預覽中確認效果。',
        ],
      },
      {
        title: '小提醒',
        blocks: [
          '如果目的是防止外流，建議使用不易裁掉的「{ui:tools.watermark.ui.layoutTile}」版面，不透明度設為 20%～30% 左右。浮水印無法隱藏內容，如果不想讓別人看到，請同時用{tool:protect}設定開啟密碼。',
        ],
      },
    ],
    'page-numbers': [
      {
        title: '適用情境',
        blocks: [
          '為合併後的申請資料、需要列印裝訂的報告，或會議中需要說「請看第幾頁」的資料加上頁碼時使用。',
        ],
      },
      {
        title: '可以設定什麼',
        blocks: [
          '可以設定位置（頁面上方或下方的左、中、右共 6 處）、頁碼格式、起始頁碼、字級和邊界。如果想略過封面、從內文開始編號，請把套用頁面改為「{ui:tools.page-numbers.ui.pagesCustom}」，填寫從第 2 頁起的範圍，並把起始頁碼設為 1。套用前可以在第一頁預覽中確認位置。',
        ],
      },
      {
        title: '小提醒',
        blocks: [
          '頁碼要在頁面順序全部確定之後再加。加上頁碼後再調整順序會讓頁碼錯亂，所以請先用{tool:merge}或{tool:organize}排好順序。',
        ],
      },
    ],
    protect: [
      {
        title: '適用情境',
        blocks: [
          '透過電子郵件或通訊軟體傳送薪資單、合約、醫療或金融文件等只應由收件人查看的 PDF 時使用。',
        ],
      },
      {
        title: '密碼與權限設定',
        blocks: [
          '使用 AES-256 加密整份檔案內容，不知道密碼就無法開啟。權限設定可以選擇是否允許列印、複製、編輯和註解，但這些限制需要 PDF 閱讀器配合遵守，保護強度不如開啟密碼。',
          '加密在瀏覽器中完成，輸入的密碼不會儲存在任何地方。因此一旦忘記密碼，本站也無法幫您找回。',
        ],
      },
      {
        title: '小提醒',
        blocks: [
          { list: [
            '使用 12 個字元以上的長密碼，避免使用生日或電話號碼。',
            '檔案用電子郵件寄送，密碼透過簡訊或電話另外告知，這樣即使一封郵件外洩也很安全。',
          ] },
        ],
      },
    ],
    unlock: [
      {
        title: '適用情境',
        blocks: [
          '想把自己有密碼的檔案（例如每月收到的帳單）去掉密碼保存，免得每次都要輸入；或想解除自己檔案上的列印、複製限制時使用。',
        ],
      },
      {
        title: '運作方式',
        blocks: [
          '選擇檔案後，工具會先檢查並告訴您檔案有哪種保護。設有開啟密碼的檔案，需要輸入您知道的密碼才能解除；只有列印、複製等權限限制的檔案，不需要密碼就能解除限制。如果檔案沒有任何保護，工具會提示您可以直接使用。',
        ],
      },
      {
        title: '小提醒',
        blocks: [
          '不知道密碼的檔案無法解除，本工具也不提供猜測密碼的功能。未經許可解除他人文件的保護可能違反著作權或合約約定，請只用於您自己的檔案或已獲授權的檔案。',
        ],
      },
    ],
  },
};
