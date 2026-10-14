// 简体中文：工具页面的“深入了解”部分。{tool:id} 会变成工具链接，{ui:…} 会变成界面上的文字。
import type { ToolDetailSet } from '../types';

export const zhCn: ToolDetailSet = {
  title: '深入了解{tool}',
  sections: {
    merge: [
      {
        title: '适用场景',
        blocks: [
          { list: [
            '求职、留学或贷款材料要求“合并成一个 PDF 提交”时',
            '想把每月的账单、发票 PDF 合并成一个文件存档时',
            '把多人分工撰写的报告各章节合成一份时',
          ] },
        ],
      },
      {
        title: '工作原理',
        blocks: [
          '合并时不会重新绘制页面，而是把每个 PDF 的原始页面数据直接复制到新文件中。因此合并后文字仍可选择和搜索，图片画质也不会改变。文件列表会显示每个文件第一页的预览和页数，方便您在拖动排序前确认内容。',
        ],
      },
      {
        title: '小贴士',
        blocks: [
          { list: [
            '在文件名前加上 01_、02_ 这样的两位编号，选择文件时顺序就已经排好了。',
            '带密码的 PDF 在添加时输入密码即可一起合并，合并后的文件不带密码。',
            '合并后如需删除或旋转个别页面，可在结果页面点击“{ui:ui.continueWith}”，直接交给{tool:organize}处理。',
            '如果混入扫描件导致文件过大，可以接着用{tool:compress}缩小。',
          ] },
        ],
      },
    ],
    split: [
      {
        title: '适用场景',
        blocks: [
          { list: [
            '把一次性扫描的一叠材料按人或按事项拆成多个文件',
            '因为附件大小限制，需要把大 PDF 分成几份发送',
            '把电子书或教材 PDF 按章节拆开',
          ] },
        ],
      },
      {
        title: '三种拆分方式',
        blocks: [
          { table: {
            head: ['方式', '输入示例', '结果'],
            rows: [
              ['{ui:tools.split.ui.modeRanges}', '1-3, 4-6, 7-', '每个范围生成一个 PDF（7- 表示第 7 页到最后）'],
              ['{ui:tools.split.ui.modeEvery}', '2', '每 2 页切成一个 PDF'],
              ['{ui:tools.split.ui.modeEach}', '-', '每页生成一个 PDF'],
            ],
          } },
          '拆分前会先显示将生成几个文件。结果有多个文件时，可以打包成一个 ZIP 一次下载。',
        ],
      },
      {
        title: '小贴士',
        blocks: [
          '如果只需要其中几页，用{tool:extract-pages}直接提取会比拆分后再挑选更快。页面数据原样复制，拆分后的文件画质与原文件相同。',
        ],
      },
    ],
    organize: [
      {
        title: '适用场景',
        blocks: [
          '需要同时调整顺序、旋转、删除等多项内容时，在一个界面里就能完成。适合扫描顺序错乱的文件、夹杂空白背面的双面扫描件，以及需要插入空白隔页的打印资料。',
        ],
      },
      {
        title: '可以做什么',
        blocks: [
          { list: [
            '拖动页面调整顺序',
            '选中多页后一次旋转或删除（按住 Shift 点击可连续选择）',
            '复制页面、插入空白页',
            '添加其他 PDF，按页混合排列',
            '撤销和重做',
          ] },
          '在点击“{ui:tools.organize.ui.action}”之前，原文件不会被改动，可以放心尝试。',
        ],
      },
      {
        title: '小贴士',
        blocks: [
          '只需旋转时用{tool:rotate}，只需删除时用{tool:delete-pages}会更简单。几百页的文件生成预览需要一些时间，可以先用{tool:split}拆出需要的部分再编辑。',
        ],
      },
    ],
    rotate: [
      {
        title: '适用场景',
        blocks: [
          '纸张放反了的扫描件、夹杂横向表格的文件，或用手机照片制作的 PDF 中页面横躺时使用。',
        ],
      },
      {
        title: '工作原理',
        blocks: [
          '每点击一次页面，就顺时针旋转 90°；也可以用“{ui:tools.rotate.ui.rotateAllLeft}”“{ui:tools.rotate.ui.rotateAllRight}”一次旋转所有页面。旋转只修改页面的方向信息，不会重新绘制内容，所以画质完全不受影响，文字也仍然可以选择。',
        ],
      },
      {
        title: '小贴士',
        blocks: [
          '如果除了旋转还要调整顺序或删除页面，在{tool:organize}中一次完成更快。PDF 阅读器里的“旋转视图”通常不会保存到文件中，想永久改正方向请用本工具保存。',
        ],
      },
    ],
    'delete-pages': [
      {
        title: '适用场景',
        blocks: [
          { list: [
            '删除双面扫描产生的空白背面',
            '提交材料前去掉封面或说明页',
            '为了减小文件，删掉不需要的照片页',
          ] },
        ],
      },
      {
        title: '工作原理',
        blocks: [
          '在预览中点击要删除的页面，按钮上会显示将删除的页数。保留的页面按原始数据组成新文件，画质不变。如果不小心选中了全部页面，工具会阻止保存。',
        ],
      },
      {
        title: '小贴士',
        blocks: [
          '如果要保留的页面远少于要删除的页面，反过来在{tool:extract-pages}中只选保留的页面，点击次数更少。',
        ],
      },
    ],
    'extract-pages': [
      {
        title: '适用场景',
        blocks: [
          '从长篇报告中只发送几页给别人、单独保存合同的签字页，或从教材 PDF 中取出作业范围时使用。',
        ],
      },
      {
        title: '两种保存方式',
        blocks: [
          { list: [
            '{ui:tools.extract-pages.ui.outputSingle}：把选中的页面按原顺序合成一个新的 PDF。',
            '{ui:tools.extract-pages.ui.outputSeparate}：每个选中的页面各保存为一个 PDF，可打包成一个 ZIP 下载。',
          ] },
          '页面数据原样复制，文字选择、链接和画质都与原文件相同。',
        ],
      },
      {
        title: '小贴士',
        blocks: [
          '如果需要的是图片文件，请使用{tool:pdf-to-jpg}。不过如果目的是把文件内容交给别人，提取成 PDF 比转成图片更清晰，文件也更小。',
        ],
      },
    ],
    compress: [
      {
        title: '适用场景',
        blocks: [
          '邮件附件超出上限、政府或学校网站有上传大小限制时，或在存档扫描件、图片较多的 PDF 之前使用。以文字为主的文件本身就很小，几乎压缩不了。',
        ],
      },
      {
        title: '各压缩级别的区别',
        blocks: [
          { table: {
            head: ['级别', '图片长边上限', 'JPEG 质量', '推荐用途'],
            rows: [
              ['{ui:tools.compress.ui.levelLow}', '2,400 像素', '82%', '需要打印、照片画质很重要的资料'],
              ['{ui:tools.compress.ui.levelMedium}', '1,700 像素', '68%', '邮件附件、大多数提交材料'],
              ['{ui:tools.compress.ui.levelHigh}', '1,200 像素', '50%', '大小限制非常严格时'],
            ],
          } },
          '只重新保存 PDF 中的图片，不改动文字和图形，因此压缩后文字仍可选择和搜索。重新保存后缩小不到 10% 的图片会保持原样，以保护画质。',
        ],
      },
      {
        title: '关于“{ui:tools.compress.ui.rasterize}”',
        blocks: [
          '图片压缩还不够时可以使用此选项。它会根据级别把每页转换成 150、120 或 96 DPI 的图片后重新生成文件，对扫描件特别有效，但文字将无法选择和搜索。适合只需查看的提交副本。',
        ],
      },
      {
        title: '小贴士',
        blocks: [
          { list: [
            '对已经压缩过的文件再次压缩只会降低画质。提高级别时，请从原文件重新开始。',
            '压缩前先用{tool:delete-pages}删掉不需要的页面，效果会更好。',
          ] },
        ],
      },
    ],
    'jpg-to-pdf': [
      {
        title: '适用场景',
        blocks: [
          '把手机拍的收据、文件或手写笔记整理成一个文件提交或保存时使用。支持 JPG、PNG、WebP、GIF、BMP 图片，并会按照照片的旋转信息（EXIF）自动摆正方向。',
        ],
      },
      {
        title: '如何选择设置',
        blocks: [
          { table: {
            head: ['设置', '选项', '建议'],
            rows: [
              ['{ui:tools.jpg-to-pdf.ui.pageSize}', '{ui:tools.jpg-to-pdf.ui.sizeFit} / A4 / Letter', '提交和打印选 A4，保存照片选{ui:tools.jpg-to-pdf.ui.sizeFit}'],
              ['{ui:tools.jpg-to-pdf.ui.orientation}', '{ui:tools.jpg-to-pdf.ui.orientAuto} / {ui:tools.jpg-to-pdf.ui.orientPortrait} / {ui:tools.jpg-to-pdf.ui.orientLandscape}', '大多数情况选{ui:tools.jpg-to-pdf.ui.orientAuto}'],
              ['{ui:tools.jpg-to-pdf.ui.margin}', '{ui:tools.jpg-to-pdf.ui.marginNone} / {ui:tools.jpg-to-pdf.ui.marginSmall} / {ui:tools.jpg-to-pdf.ui.marginLarge}', '打印用选{ui:tools.jpg-to-pdf.ui.marginSmall}，只在屏幕上看选{ui:tools.jpg-to-pdf.ui.marginNone}'],
            ],
          } },
          '选择 A4 或 Letter 后，照片会保持原始比例缩放到纸张内。即使照片大小各不相同，所有页面的尺寸也会一致。',
        ],
      },
      {
        title: '小贴士',
        blocks: [
          { list: [
            '在明亮、没有阴影的地方，让手机与纸面保持平行拍摄，效果会好很多。闪光灯容易反光，最好关闭。',
            '手机照片每张往往有好几 MB，PDF 很快就会变大。可以在结果页面直接交给{tool:compress}缩小。',
          ] },
        ],
      },
    ],
    'pdf-to-jpg': [
      {
        title: '适用场景',
        blocks: [
          '想把 PDF 的某一页发到博客或社交媒体、作为图片插入演示文稿或文档，或通过聊天软件发给不方便打开 PDF 的人时使用。',
        ],
      },
      {
        title: '如何选择分辨率和格式',
        blocks: [
          { table: {
            head: ['分辨率', 'A4 一页的图片尺寸', '用途'],
            rows: [
              ['{ui:tools.pdf-to-jpg.ui.dpiLow}', '约 595 × 842 像素', '预览、快速分享'],
              ['{ui:tools.pdf-to-jpg.ui.dpiMedium}', '约 1,240 × 1,754 像素', '网页发布、屏幕阅读'],
              ['{ui:tools.pdf-to-jpg.ui.dpiHigh}', '约 2,480 × 3,508 像素', '打印、放大查看小字'],
            ],
          } },
          'DPI 提高一倍，宽和高各变为两倍，文件大约变为四倍。文字和表格较多的页面适合 PNG，照片较多的页面适合 JPG。可以只转换选中的页面，多张图片可打包成一个 ZIP 下载。',
        ],
      },
      {
        title: '小贴士',
        blocks: [
          '转换成图片后，文字将无法选择和搜索。如果只是想把文件的一部分交给别人，用{tool:extract-pages}直接提取成 PDF 会更清晰，文件也更小。',
        ],
      },
    ],
    watermark: [
      {
        title: '适用场景',
        blocks: [
          { list: [
            '在内部文件上标注“机密”“草稿”等字样',
            '在身份证复印件上写明“仅供某某用途”，防止被挪作他用',
            '在作品集或讲义上加上标志，注明出处',
          ] },
        ],
      },
      {
        title: '可以设置什么',
        blocks: [
          '可以选择文字或标志图片，并设置颜色、大小、不透明度和角度。版式可选在页面中央放一个的“{ui:tools.watermark.ui.layoutCenter}”，或在整页重复铺满的“{ui:tools.watermark.ui.layoutTile}”。可以应用到所有页面或指定页面，并能先在第一页预览中确认效果。',
        ],
      },
      {
        title: '小贴士',
        blocks: [
          '如果目的是防止外泄，建议使用不易裁掉的“{ui:tools.watermark.ui.layoutTile}”版式，不透明度设为 20%～30% 左右。水印无法隐藏内容，如果不想让别人看到，请同时用{tool:protect}设置打开密码。',
        ],
      },
    ],
    'page-numbers': [
      {
        title: '适用场景',
        blocks: [
          '为合并后的申请材料、需要打印装订的报告，或会议中需要说“请看第几页”的资料加上页码时使用。',
        ],
      },
      {
        title: '可以设置什么',
        blocks: [
          '可以设置位置（页面上方或下方的左、中、右共 6 处）、页码格式、起始页码、字号和边距。如果想跳过封面、从正文开始编号，请把应用页面改为“{ui:tools.page-numbers.ui.pagesCustom}”，填写从第 2 页起的范围，并把起始页码设为 1。应用前可以在第一页预览中确认位置。',
        ],
      },
      {
        title: '小贴士',
        blocks: [
          '页码要在页面顺序全部确定之后再加。加上页码后再调整顺序会让页码错乱，所以请先用{tool:merge}或{tool:organize}定好顺序。',
        ],
      },
    ],
    sign: [
      {
        title: '适用场景',
        blocks: [
          { list: [
            '在邮件收到的合同或同意书上签名后直接发回，无需打印、签字再扫描',
            '提交申请表、报销单等需要在姓名旁签名或盖章的文件',
            '在多页合同的每一页都加上签名',
          ] },
        ],
      },
      {
        title: '制作签名的三种方式',
        blocks: [
          { list: [
            '{ui:tools.sign.ui.modeDraw}：用鼠标或手指直接书写。在手机上用手指签名，效果最接近真实笔迹。',
            '{ui:tools.sign.ui.modeType}：输入姓名，并在{ui:tools.sign.ui.styleScript}、{ui:tools.sign.ui.styleSerif}、{ui:tools.sign.ui.styleSans}中选择字体生成签名。',
            '{ui:tools.sign.ui.modeImage}：上传写在纸上的签名或盖好的印章照片。开启“{ui:tools.sign.ui.removeBackground}”后，纸张的白色部分会变透明，签名能自然地融入文件。',
          ] },
          '签名做好后，点击页面即可放在该位置。拖动可移动，拖动右下角可调整大小，也可以翻页后放到多个位置。即使是旋转过的横向页面，也会按屏幕上看到的方向放置。',
        ],
      },
      {
        title: '小贴士',
        blocks: [
          { list: [
            '本工具是把签名图片放到页面上。这种方式广泛用于日常合同和申请表；如果对方要求基于数字证书的电子签名，请按照该机构指定的方式办理。',
            '如果不希望签好的文件被他人修改，可以用{tool:protect}限制编辑权限或设置打开密码。',
            '如果要签的文件分散在多个文件中，先用{tool:merge}合成一个，就能一次签完。',
            '手写的签名和上传的图片只在本浏览器中使用，关闭页面后就会消失。',
          ] },
        ],
      },
    ],
    protect: [
      {
        title: '适用场景',
        blocks: [
          '通过邮件或聊天软件发送工资条、合同、医疗或金融文件等只应由收件人查看的 PDF 时使用。',
        ],
      },
      {
        title: '密码与权限设置',
        blocks: [
          '使用 AES-256 加密整个文件内容，不知道密码就无法打开。权限设置可以选择是否允许打印、复制、编辑和注释，但这些限制需要 PDF 阅读器配合遵守，保护强度不如打开密码。',
          '加密在浏览器中完成，输入的密码不会保存在任何地方。因此一旦忘记密码，本站也无法帮您找回。',
        ],
      },
      {
        title: '小贴士',
        blocks: [
          { list: [
            '使用 12 位以上的长密码，避免使用生日或电话号码。',
            '文件用邮件发送，密码通过短信或电话另行告知，这样即使一封邮件泄露也是安全的。',
          ] },
        ],
      },
    ],
    unlock: [
      {
        title: '适用场景',
        blocks: [
          '想把自己的加密文件（例如每月收到的账单）去掉密码保存，免得每次都要输入；或想解除自己文件上的打印、复制限制时使用。',
        ],
      },
      {
        title: '工作原理',
        blocks: [
          '选择文件后，工具会先检查并告诉您文件带有哪种保护。设有打开密码的文件，需要输入您知道的密码才能解除；只有打印、复制等权限限制的文件，无需密码即可解除限制。如果文件没有任何保护，工具会提示您可以直接使用。',
        ],
      },
      {
        title: '小贴士',
        blocks: [
          '不知道密码的文件无法解除，本工具也不提供猜测密码的功能。未经许可解除他人文件的保护可能违反著作权或合同约定，请只用于您自己的文件或已获授权的文件。',
        ],
      },
    ],
  },
};
