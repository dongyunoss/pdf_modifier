import type { LegalText } from './types';

export const zhTw: LegalText = {
  about: [
    {
      blocks: [
        '{site} 是一套任何人都能免費、安心使用的 PDF 工具。不需安裝軟體，也不用註冊帳號，只要有瀏覽器，就能合併、分割、整理、壓縮 PDF，或將 PDF 轉換成圖片。',
      ],
    },
    {
      title: '不上傳檔案的 PDF 工具',
      blocks: [
        '大多數線上 PDF 服務會把檔案上傳到伺服器處理。{site} 運用 WebAssembly 與新一代瀏覽器技術，<strong>在您自己的裝置上完成所有處理</strong>。合約、證明文件、證件影本等敏感文件都不會離開您的電腦，也不必等待上傳和下載。',
      ],
    },
    { title: '提供的功能', blocks: ['{tools}'] },
    {
      title: '營運方式',
      blocks: [
        '所有功能都免費提供，網站的營運費用由頁面上顯示的廣告支應。由於不在伺服器上處理檔案，營運成本很低，因此可以不限使用次數和檔案大小。',
      ],
    },
    { title: '使用的開放原始碼', blocks: ['本服務以下列開放原始碼專案打造而成：', '{opensource}'] },
    { title: '聯絡我們', blocks: ['{contact}'] },
  ],
  privacy: [
    {
      blocks: ['{site}（以下簡稱「本網站」）重視您的隱私。本政策說明本網站會處理哪些資訊，以及如何處理。'],
    },
    {
      title: '1. 您的檔案',
      blocks: [
        'PDF 和圖片檔案<strong>完全在您的裝置（網頁瀏覽器）中處理，絕不會上傳到我們的伺服器或提供給第三方。</strong>作業中的資料只存在於瀏覽器記憶體中，關閉頁面後就會消失。使用「繼續使用」功能時，結果檔案會暫存在瀏覽器的內部儲存空間（IndexedDB）最多 10 分鐘，以便下一個工具開啟，這些資料同樣不會傳送到任何地方。',
      ],
    },
    {
      title: '2. 收集的資訊',
      blocks: [
        '本網站沒有帳號功能，也不會要求您提供姓名或聯絡方式。但在使用過程中，下列資訊可能會自動產生，並由主機代管、流量分析和廣告服務供應商處理：',
        {
          list: ['存取紀錄（IP 位址、造訪時間、瀏覽的頁面）、瀏覽器和裝置資訊', 'Cookie 和廣告識別碼（顯示廣告時）'],
        },
      ],
    },
    {
      title: '3. Cookie 和廣告',
      blocks: [
        '本網站可能會顯示 Google AdSense 廣告以支應營運費用。包括 Google 在內的第三方供應商會使用 Cookie，根據您過去造訪本網站或其他網站的紀錄放送廣告。Google 使用廣告 Cookie，讓 Google 及其合作夥伴能根據您造訪本網站和網際網路上其他網站的情形放送廣告。',
        {
          list: [
            '您可以在 <a href="https://adssettings.google.com" rel="noopener" target="_blank">Google 廣告設定</a>中停用個人化廣告。',
            '您可以在 <a href="https://www.aboutads.info/choices/" rel="noopener" target="_blank">www.aboutads.info</a> 停用第三方供應商用於個人化廣告的 Cookie。',
            '詳情請參閱<a href="https://policies.google.com/technologies/partner-sites" rel="noopener" target="_blank">Google 如何使用採用其服務的網站所提供的資訊</a>。',
            '您可以在瀏覽器設定中封鎖 Cookie，PDF 工具仍可正常使用。',
          ],
        },
      ],
    },
    {
      title: '4. 流量分析',
      blocks: [
        '為了改善服務，本網站可能會使用不需 Cookie 的 Cloudflare Web Analytics 或 Google Analytics 收集造訪統計。這些統計只會以彙總形式使用，不會識別您的身分。',
      ],
    },
    {
      title: '5. 資訊分享',
      blocks: [
        '我們不會出售或向第三方提供您的個人資訊。主機代管業者（例如 Cloudflare）以及廣告和分析服務供應商，可能會依各自的隱私權政策處理第 2 條所述資訊，以提供其服務。',
      ],
    },
    {
      title: '6. 保存期間',
      blocks: ['我們本身不保存您的個人資訊。第三方服務供應商處理的資訊，會依其政策規定的期間保存後刪除。'],
    },
    {
      title: '7. 您的權利',
      blocks: ['您可以隨時在瀏覽器設定中刪除或封鎖 Cookie，也可以就任何隱私問題或請求與我們聯絡。'],
    },
    { title: '8. 兒童', blocks: ['本網站不會蓄意收集兒童的個人資訊。'] },
    { title: '9. 聯絡方式', blocks: ['{contact}'] },
    { title: '10. 政策變更', blocks: ['本政策自{date}起生效。如有變更，將於本頁面公告。'] },
  ],
  terms: [
    { title: '1. 適用範圍', blocks: ['本條款規範您使用 {site}（以下簡稱「本網站」）所提供 PDF 工具的條件。'] },
    {
      title: '2. 服務內容',
      blocks: [
        '本網站免費提供 PDF 合併、分割、整理、壓縮、轉換、加入浮水印、保護和解鎖等工具。所有處理都在您的瀏覽器中進行，檔案絕不會上傳。',
      ],
    },
    {
      title: '3. 使用者責任',
      blocks: [
        {
          list: [
            '只處理您有權使用的檔案。',
            '不得利用本服務侵害他人的著作權、隱私或其他權利。',
            '解鎖工具僅限用於您擁有或有權修改的文件。',
            '不得妨礙本服務的正常運作。',
          ],
        },
      ],
    },
    {
      title: '4. 免責聲明',
      blocks: [
        {
          list: [
            '本服務依「現狀」提供，本網站不保證處理結果的正確性、完整性或特定用途的適用性。',
            '請務必保留原始檔案的副本。',
            '在法律允許的範圍內，本網站對因使用本服務而造成的資料遺失或其他損害不負任何責任。',
          ],
        },
      ],
    },
    { title: '5. 廣告', blocks: ['本網站可能會顯示廣告以維持營運。'] },
    { title: '6. 服務變更', blocks: ['本網站得隨時變更、暫停或終止全部或部分服務。'] },
    { title: '7. 準據法', blocks: ['本條款以大韓民國法律為準據法。'] },
    { title: '8. 生效日期', blocks: ['本條款自{date}起生效。'] },
  ],
  contact: {
    about: '功能建議、問題回報和合作洽詢，請寄信至 {email}',
    privacy: '隱私權相關問題：{email}',
    none: '如有任何問題，請聯絡網站營運者。',
  },
  listSeparator: '、',
};
