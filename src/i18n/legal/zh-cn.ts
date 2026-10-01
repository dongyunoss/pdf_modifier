import type { LegalText } from './types';

export const zhCn: LegalText = {
  about: [
    {
      blocks: [
        '{site} 是一套任何人都能免费、放心使用的 PDF 工具。无需安装软件，也无需注册账号，只要有浏览器，就能合并、拆分、整理、压缩 PDF 并将其转换为图片。',
      ],
    },
    {
      title: '不上传文件的 PDF 工具',
      blocks: [
        '大多数在线 PDF 服务会把文件上传到服务器进行处理。{site} 利用 WebAssembly 和现代浏览器技术，<strong>在您自己的设备上完成所有处理</strong>。合同、证明、证件复印件等敏感文件不会离开您的电脑，也无需等待上传和下载。',
      ],
    },
    { title: '功能', blocks: ['{tools}'] },
    {
      title: '运营方式',
      blocks: [
        '所有功能均免费提供，网站的运营费用由页面上展示的广告承担。由于不在服务器上处理文件，运营成本很低，因此可以不限使用次数和文件大小。',
      ],
    },
    { title: '开源项目', blocks: ['本服务基于以下开源项目构建：', '{opensource}'] },
    { title: '联系我们', blocks: ['{contact}'] },
  ],
  privacy: [
    {
      blocks: ['{site}（以下简称“本网站”）尊重您的隐私。本政策说明本网站会处理哪些信息以及如何处理。'],
    },
    {
      title: '1. 您的文件',
      blocks: [
        'PDF 和图片文件<strong>完全在您的设备（网页浏览器）中处理，绝不会上传到我们的服务器或提供给第三方。</strong>处理中的数据只存在于浏览器内存中，关闭页面后即会消失。使用“继续使用”功能时，结果文件会在浏览器内部存储（IndexedDB）中临时保存最多 10 分钟，以便下一个工具打开，这些数据同样不会发送到任何地方。',
      ],
    },
    {
      title: '2. 收集的信息',
      blocks: [
        '本网站没有账号功能，不会要求您提供姓名或联系方式。但在使用过程中，以下信息可能会自动生成，并由托管、统计和广告服务提供商处理：',
        {
          list: ['访问记录（IP 地址、访问时间、访问的页面）、浏览器和设备信息', 'Cookie 和广告标识符（展示广告时）'],
        },
      ],
    },
    {
      title: '3. Cookie 和广告',
      blocks: [
        '本网站可能会展示 Google AdSense 广告以支付运营费用。包括 Google 在内的第三方供应商会使用 Cookie，根据您以往访问本网站或其他网站的记录投放广告。Google 使用广告 Cookie，使其及其合作伙伴能够根据您对本网站和互联网上其他网站的访问情况投放广告。',
        {
          list: [
            '您可以在 <a href="https://adssettings.google.com" rel="noopener" target="_blank">Google 广告设置</a>中停用个性化广告。',
            '您可以在 <a href="https://www.aboutads.info/choices/" rel="noopener" target="_blank">www.aboutads.info</a> 停用第三方供应商用于个性化广告的 Cookie。',
            '详情请参阅<a href="https://policies.google.com/technologies/partner-sites" rel="noopener" target="_blank">Google 如何使用来自使用其服务的网站的信息</a>。',
            '您可以在浏览器设置中阻止 Cookie，PDF 工具仍可正常使用。',
          ],
        },
      ],
    },
    {
      title: '4. 访问统计',
      blocks: [
        '为改进服务，本网站可能会使用不依赖 Cookie 的 Cloudflare Web Analytics 或 Google Analytics 收集访问统计。这些统计仅以汇总形式使用，不会识别您的身份。',
      ],
    },
    {
      title: '5. 信息共享',
      blocks: [
        '我们不会出售或向第三方提供您的个人信息。托管服务商（例如 Cloudflare）以及广告和统计服务提供商可能会根据各自的隐私政策处理第 2 条所述信息，以提供其服务。',
      ],
    },
    {
      title: '6. 保存期限',
      blocks: ['我们本身不保存您的个人信息。第三方服务提供商处理的信息将按照其政策规定的期限保存后删除。'],
    },
    {
      title: '7. 您的权利',
      blocks: ['您可以随时在浏览器设置中删除或阻止 Cookie，也可以就任何隐私问题或请求与我们联系。'],
    },
    { title: '8. 儿童', blocks: ['本网站不会有意收集儿童的个人信息。'] },
    { title: '9. 联系方式', blocks: ['{contact}'] },
    { title: '10. 政策变更', blocks: ['本政策自{date}起生效。如有变更，将在本页面公布。'] },
  ],
  terms: [
    { title: '1. 适用范围', blocks: ['本条款规定您使用 {site}（以下简称“本网站”）所提供 PDF 工具的条件。'] },
    {
      title: '2. 服务内容',
      blocks: [
        '本网站免费提供 PDF 合并、拆分、整理、压缩、转换、加水印、加密和解锁等工具。所有处理都在您的浏览器中进行，文件绝不会上传。',
      ],
    },
    {
      title: '3. 用户责任',
      blocks: [
        {
          list: [
            '只处理您有权使用的文件。',
            '不得利用本服务侵犯他人的著作权、隐私或其他权利。',
            '解锁工具仅限用于您拥有或有权修改的文档。',
            '不得干扰本服务的正常运行。',
          ],
        },
      ],
    },
    {
      title: '4. 免责声明',
      blocks: [
        {
          list: [
            '本服务按“现状”提供，本网站不对处理结果的准确性、完整性或特定用途的适用性作任何保证。',
            '请务必保留原始文件的副本。',
            '在法律允许的范围内，本网站不对因使用本服务而导致的数据丢失或其他损失承担责任。',
          ],
        },
      ],
    },
    { title: '5. 广告', blocks: ['本网站可能会展示广告以维持运营。'] },
    { title: '6. 服务变更', blocks: ['本网站可随时变更、暂停或终止全部或部分服务。'] },
    { title: '7. 适用法律', blocks: ['本条款受大韩民国法律管辖。'] },
    { title: '8. 生效日期', blocks: ['本条款自{date}起生效。'] },
  ],
  contact: {
    about: '功能建议、问题反馈和合作洽谈，请发送邮件至 {email}',
    privacy: '隐私相关咨询：{email}',
    none: '如有任何问题，请联系网站运营者。',
  },
  listSeparator: '、',
};
