import type { LegalText } from './types';

export const en: LegalText = {
  about: [
    {
      blocks: [
        '{site} is a set of free PDF tools that anyone can use safely. With nothing but a web browser — no installation and no account — you can merge, split, reorder, compress and convert PDF files.',
      ],
    },
    {
      title: 'PDF tools that never upload your files',
      blocks: [
        'Most online PDF services upload your files to their servers. {site} uses WebAssembly and modern browser technology to do <strong>all processing on your own device</strong>. Contracts, certificates and ID copies never leave your computer, and there is no waiting for uploads or downloads.',
      ],
    },
    { title: 'Tools', blocks: ['{tools}'] },
    {
      title: 'How the site is funded',
      blocks: [
        'Every tool is free. The site is supported by the ads shown on its pages. Because files are not processed on servers, running costs stay low, so there are no limits on usage or file size.',
      ],
    },
    { title: 'Open source', blocks: ['This service is built on these open-source projects:', '{opensource}'] },
    { title: 'Contact', blocks: ['{contact}'] },
  ],
  privacy: [
    {
      blocks: ['{site} (“the site”) respects your privacy. This policy explains what information the site handles and how.'],
    },
    {
      title: '1. Your files',
      blocks: [
        'PDF and image files are <strong>processed entirely on your device, inside your web browser. They are never uploaded to our servers or shared with third parties.</strong> Working data only lives in browser memory and disappears when you close the page. If you use “Continue with”, the result file is kept in your browser’s internal storage (IndexedDB) for up to 10 minutes so the next tool can open it; it is not sent anywhere either.',
      ],
    },
    {
      title: '2. Information collected',
      blocks: [
        'The site has no accounts and never asks for your name or contact details. However, the following information may be generated automatically and processed by hosting, analytics and advertising providers:',
        {
          list: [
            'Access logs (IP address, time of visit, pages visited), browser and device information',
            'Cookies and advertising identifiers (when ads are shown)',
          ],
        },
      ],
    },
    {
      title: '3. Cookies and advertising',
      blocks: [
        'The site may display Google AdSense ads to cover its running costs. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this site or other websites. Google’s use of advertising cookies enables it and its partners to serve ads based on your visits to this and other sites on the Internet.',
        {
          list: [
            'You can opt out of personalized advertising in <a href="https://adssettings.google.com" rel="noopener" target="_blank">Google Ads Settings</a>.',
            'You can opt out of third-party vendors’ cookies for personalized advertising at <a href="https://www.aboutads.info/choices/" rel="noopener" target="_blank">www.aboutads.info</a>.',
            'Learn more in <a href="https://policies.google.com/technologies/partner-sites" rel="noopener" target="_blank">How Google uses information from sites that use its services</a>.',
            'You can block cookies in your browser settings; the PDF tools keep working without them.',
          ],
        },
      ],
    },
    {
      title: '4. Analytics',
      blocks: [
        'To improve the service, the site may collect visit statistics with Cloudflare Web Analytics (cookie-free) or Google Analytics. These statistics are only used in aggregated form and do not identify you.',
      ],
    },
    {
      title: '5. Sharing',
      blocks: [
        'We do not sell or share your personal information. Our hosting provider (e.g. Cloudflare) and advertising or analytics providers may process the information in section 2 under their own privacy policies in order to provide their services.',
      ],
    },
    {
      title: '6. Retention',
      blocks: [
        'We do not store your personal information ourselves. Information processed by third-party providers is kept according to their policies.',
      ],
    },
    {
      title: '7. Your rights',
      blocks: [
        'You can delete or block cookies at any time in your browser settings, and contact us with any privacy question or request.',
      ],
    },
    { title: '8. Children', blocks: ['The site does not knowingly collect personal information from children.'] },
    { title: '9. Contact', blocks: ['{contact}'] },
    { title: '10. Changes', blocks: ['This policy is effective as of {date}. Any changes will be posted on this page.'] },
  ],
  terms: [
    { title: '1. Scope', blocks: ['These terms govern your use of the PDF tools provided by {site} (“the site”).'] },
    {
      title: '2. The service',
      blocks: [
        'The site provides free tools to merge, split, organize, compress, convert, watermark, protect and unlock PDF files. All processing happens inside your browser and your files are never uploaded.',
      ],
    },
    {
      title: '3. Your responsibilities',
      blocks: [
        {
          list: [
            'Only process files that you have the right to use.',
            'Do not use the service to infringe copyrights, privacy or other rights of others.',
            'Only use the unlock tool on documents you own or are authorized to modify.',
            'Do not interfere with the normal operation of the service.',
          ],
        },
      ],
    },
    {
      title: '4. Disclaimer',
      blocks: [
        {
          list: [
            'The service is provided “as is”, without warranties of accuracy, completeness or fitness for a particular purpose.',
            'Always keep a copy of your original files.',
            'To the extent permitted by law, the site is not liable for any loss of data or other damages arising from use of the service.',
          ],
        },
      ],
    },
    { title: '5. Advertising', blocks: ['The site may display advertisements to support its operation.'] },
    {
      title: '6. Changes to the service',
      blocks: ['The site may change, suspend or discontinue all or part of the service at any time.'],
    },
    { title: '7. Governing law', blocks: ['These terms are governed by the laws of the Republic of Korea.'] },
    { title: '8. Effective date', blocks: ['These terms are effective as of {date}.'] },
  ],
  contact: {
    about: 'Suggestions, bug reports and partnership inquiries: {email}',
    privacy: 'Privacy questions: {email}',
    none: 'Please contact the site operator with any questions.',
  },
  listSeparator: ', ',
};
