// English guides and in-depth tool sections. Format: types.ts. Korean edition: ko.ts.
// {tool:compress} inside a paragraph becomes a link to that tool.
import type { GuideSet } from './types';

export const en: GuideSet = {
  ui: {
    nav: 'Guides',
    indexTitle: 'PDF Guides - How to Shrink, Merge, Convert and Protect PDFs',
    indexHeading: 'PDF guides',
    indexLead:
      'Practical write-ups for the moments PDFs get in the way: why a file is huge, how to put an application packet in order, which password actually protects a document. They go a step further than the how-to on each tool page.',
    indexDescription:
      'Guides to reducing PDF file size, merging PDFs, turning phone photos into PDFs, password protection and choosing image resolution, written around real everyday problems.',
    homeTitle: 'PDF guides',
    homeMore: 'All guides',
    readMore: 'Read guide',
    minutes: '{n} min read',
    updated: 'Updated {date}',
    toolsTitle: 'Tools used in this guide',
    tryTool: 'Open {tool}',
    moreGuides: 'More guides',
    detailsTitle: 'More about {tool}',
    relatedGuides: 'Related guides',
    author: 'PDF Modifier',
  },

  guides: [
    {
      slug: 'reduce-pdf-file-size',
      title: 'How to Reduce PDF File Size (and Why Some PDFs Barely Shrink)',
      description:
        'Why PDFs grow to tens of megabytes, which files compress well and which do not, and a step-by-step way to get under an email or upload limit.',
      tools: ['compress', 'delete-pages', 'split', 'jpg-to-pdf'],
      published: '2026-10-11',
      updated: '2026-10-11',
      sections: [
        {
          blocks: [
            'Sooner or later every PDF hits a wall: an email that bounces, or an upload form that says "maximum file size 10 MB". Before you start pressing compress buttons, it helps to know where the megabytes actually come from. Once you do, hitting a size target takes minutes instead of guesswork.',
          ],
        },
        {
          title: 'Most of a PDF’s size is images',
          blocks: [
            'A PDF contains text, vector shapes, fonts and images. Text and shapes are stored as drawing instructions ("put these letters here"), so even a few hundred pages of them rarely exceed a few megabytes. Photos and scans are different: every pixel is stored, so a single page can take several megabytes.',
            'That is why a ten-page report saved straight from Word can be 300 KB while the same report run through an office scanner comes out at 20 MB. Documents built from phone photos are the same story: modern phone cameras produce images more than 4,000 pixels wide, far more than a screen or printer needs for a document.',
          ],
        },
        {
          title: 'Files that shrink well, and files that don’t',
          blocks: [
            { list: [
              'Shrink well: scanned documents, photo-heavy reports and portfolios, PDFs made from phone pictures.',
              'Barely shrink: text-based documents exported from Word, Google Docs or Excel, and files that were already compressed.',
            ] },
            'A text-based document has almost no images, so there is little to squeeze. If such a file is still large, the cause is usually embedded fonts or one or two high-resolution images on a cover page. In that case, removing pages you do not need does more than compression.',
          ],
        },
        {
          title: 'What the compressor actually does',
          blocks: [
            '{tool:compress} takes each image out of the PDF, resizes it to what screens and printers really need, re-encodes it as JPEG at a chosen quality and puts it back. Text and vector graphics are left alone, so you can still select and search the text afterwards.',
            { table: {
              head: ['Level', 'Longest image side', 'JPEG quality', 'Good for'],
              rows: [
                ['Light', '2,400 px', '82%', 'Documents you will print, photo-critical material'],
                ['Recommended', '1,700 px', '68%', 'Email attachments, most upload forms'],
                ['Strong', '1,200 px', '50%', 'Strict upload limits'],
              ],
            } },
            'An A4 or Letter page rendered 1,700 pixels tall is roughly 200 DPI, plenty for reading on screen or printing on an office printer. That is why "Recommended" solves most cases.',
            'If the file is still too big, you can turn on maximum compression. It redraws every page as an image, which works wonders on scans, but the text becomes part of the picture and can no longer be selected or searched. Use it for copies that only need to be read.',
          ],
        },
        {
          title: 'A reliable order for hitting a size limit',
          blocks: [
            { steps: [
              'Remove what you do not need first. Blank pages, cover sheets and duplicate scans can be dropped with {tool:delete-pages}, sometimes saving more than compression would.',
              'Compress once with "Recommended" in {tool:compress}. The result screen shows how much was saved.',
              'Still too large? Try "Strong", starting again from the original file rather than the already compressed one.',
              'If it still does not fit, turn on maximum compression, or use {tool:split} to send the document in several parts.',
            ] },
            { tip: 'Compressing an already compressed PDF mostly lowers quality without saving space. When you step up a level, always start again from the original.' },
          ],
        },
        {
          title: 'Make it small from the start',
          blocks: [
            'If you use a scanner, choosing black-and-white or grayscale instead of color and 200–300 DPI for documents makes files several times smaller. When building a PDF from phone photos in {tool:jpg-to-pdf}, choosing A4 or Letter as the page size fits each photo to a standard page, which also looks neater.',
            'Attachment limits vary: Gmail allows 25 MB per message and Outlook.com 20 MB, while government and school portals are often much stricter. Creating files at the quality you need is easier, and looks better, than shrinking them in a hurry right before a deadline.',
          ],
        },
      ],
    },

    {
      slug: 'merge-pdf-files',
      title: 'How to Merge PDF Files and Put an Application Packet in Order',
      description:
        'When a job, school or loan application wants everything as one PDF: naming files, choosing an order, merging, and fixing the problems that usually come up.',
      tools: ['merge', 'organize', 'page-numbers', 'compress'],
      published: '2026-10-11',
      updated: '2026-10-11',
      sections: [
        {
          blocks: [
            '"Please submit all documents as a single PDF" shows up on job applications, scholarship forms, visa and loan paperwork. Joining files is easy; producing one that a reviewer can follow, at a size the upload form accepts, takes a little more care.',
          ],
        },
        {
          title: 'Name your files before you merge',
          blocks: [
            'You can drag files into order in {tool:merge}, but with ten or more files, finding the right one in the list is work in itself. Numbering file names first means they arrive already sorted.',
            { list: [
              'Use two digits, such as 01_application.pdf, 02_resume.pdf, 03_transcript.pdf, so that 10 and above still sort correctly.',
              'If the instructions specify an order, follow it exactly. If not, "form → identification → supporting documents → other" is a safe default.',
            ] },
          ],
        },
        {
          title: 'Merging step by step',
          blocks: [
            { steps: [
              'Open {tool:merge} and select or drop all your PDF files.',
              'Drag files in the list, or use the arrow buttons, to set the order. Each file shows a preview of its first page and its page count.',
              'Press "Merge PDF". The combined file is ready to download on the result screen.',
            ] },
            'Merging copies the original page data instead of redrawing pages, so text stays selectable and images keep their quality. Password-protected files can be included by entering their password when you add them.',
          ],
        },
        {
          title: 'Polish the merged file',
          blocks: [
            'Sometimes you need to work page by page rather than file by file: drop the blank back of a certificate, straighten a sideways scan, or move one page to the front. Use "Continue with" on the result screen to send the merged file straight to {tool:organize} without uploading it again, and make those changes with page previews.',
            'For long packets, adding page numbers with {tool:page-numbers} lets reviewers point to "the certificate on page 7" and saves a round of emails.',
          ],
        },
        {
          title: 'Common problems',
          blocks: [
            { list: [
              'The merged file is too large: typical when scans are included. Compressing with "Recommended" in {tool:compress} usually brings it under the limit.',
              'Pages are different sizes: mixing Letter documents with receipt photos produces pages of varying size. Nothing is wrong with the content, but turning photos into PDFs with {tool:jpg-to-pdf} at Letter or A4 size before merging gives a uniform result.',
              'Fillable forms: forms with input fields may behave differently after merging. Fill them in first, then merge, and open the result to check that your answers are visible.',
            ] },
          ],
        },
      ],
    },

    {
      slug: 'photos-to-pdf',
      title: 'How to Turn Phone Photos of Documents and Receipts into a Clean PDF',
      description:
        'No scanner? How to photograph paperwork so it stays readable, which page size and margin settings to use, and how to keep the PDF small enough to send.',
      tools: ['jpg-to-pdf', 'compress', 'rotate', 'merge'],
      published: '2026-10-11',
      updated: '2026-10-11',
      sections: [
        {
          blocks: [
            'Expense receipts, a copy of an ID, a signed form: plenty of paperwork now gets "scanned" with a phone. Simply bundling the photos into a PDF works, but a few habits make the result far easier for the recipient to read.',
          ],
        },
        {
          title: 'When you take the photo',
          blocks: [
            { list: [
              'Use bright, indirect light and avoid shadows. Holding the phone directly above the paper often casts its own shadow, so light from the side, such as a window, works best.',
              'Keep the phone parallel to the page. Shooting at an angle turns the page into a trapezoid and shrinks text on one side.',
              'Place the paper on a darker surface that contrasts with it, so its edges are easy to see.',
              'Turn the flash off. Glossy paper and thermal receipts reflect it and the text washes out.',
              'For multi-page documents, keep the same orientation and distance for every shot so the pages look consistent.',
            ] },
          ],
        },
        {
          title: 'Making the PDF',
          blocks: [
            { steps: [
              'Open {tool:jpg-to-pdf} and select your photos. JPG, PNG, WebP, GIF and BMP files all work.',
              'Drag the previews into the right page order.',
              'Choose page size, orientation and margins, then press "Convert to PDF".',
            ] },
            { table: {
              head: ['Setting', 'Options', 'When to use'],
              rows: [
                ['Page size', 'Image size / A4 / Letter', 'A4 or Letter for printing and submissions, Image size to keep photos as they are'],
                ['Orientation', 'Auto / Portrait / Landscape', 'Auto in most cases; each photo gets the orientation that suits it'],
                ['Margins', 'None / Small / Large', 'Small for documents you will print, None for screen-only material'],
              ],
            } },
            'With A4 or Letter selected, each photo is scaled to fit the page while keeping its proportions. Even if your photos are all different sizes, every page comes out the same size, which is easier to flip through and prints without cropping.',
          ],
        },
        {
          title: 'Afterwards: orientation and size',
          blocks: [
            'If a page ends up sideways because the photo’s orientation data was wrong, click it in {tool:rotate} to straighten it.',
            'Phone photos are often 3–5 MB each, so ten of them can make a PDF of several tens of megabytes. If that is too much for email or an upload form, compress with "Recommended" in {tool:compress}; for document photos the difference is hard to see.',
            { tip: 'When sending a copy of an ID, add a watermark stating its purpose, such as "For account opening at Example Bank only". It makes the copy much harder to misuse elsewhere. {tool:watermark} lets you set the text and transparency.' },
          ],
        },
        {
          title: 'Your photos stay on your device',
          blocks: [
            'Receipts, IDs and contracts are full of personal data. The conversion on this site builds the PDF inside your browser without sending the photos to a server, so they are not stored anywhere else. The guide "Is it safe to upload files to online PDF tools?" explains how you can check this yourself.',
          ],
        },
      ],
    },

    {
      slug: 'pdf-password-guide',
      title: 'PDF Password Protection Explained: Open Passwords vs. Permission Restrictions',
      description:
        'What the two kinds of PDF protection actually prevent, how to choose a strong password, and what you can and cannot do when a password is lost.',
      tools: ['protect', 'unlock', 'watermark'],
      published: '2026-10-11',
      updated: '2026-10-11',
      sections: [
        {
          blocks: [
            'Pay stubs, contracts and medical records often travel by email with a password on them. But a PDF "password" can mean two very different things, and mixing them up can leave a document far less protected than you think.',
          ],
        },
        {
          title: 'Two kinds of protection',
          blocks: [
            { table: {
              head: ['Type', 'What it does', 'Strength'],
              rows: [
                ['Open password', 'Without the password the file cannot be opened at all; the content itself is encrypted', 'Strong: a long, unpredictable password is practically unbreakable'],
                ['Permission restrictions', 'The file opens, but PDF viewers are asked not to allow printing, copying or editing', 'Weak: software that ignores the flags can bypass them'],
              ],
            } },
            'The key point is that permission restrictions are closer to a request than a lock. Most viewers honor them, but a program that does not will open the file without limits. If a document really needs protecting, it needs an open password.',
          ],
        },
        {
          title: 'Adding a password',
          blocks: [
            { steps: [
              'Open {tool:protect} and choose your PDF.',
              'Type the password twice. Press "Show" to check what you typed.',
              'Optionally choose whether to allow printing, copying, editing and annotations.',
              'Press "Protect PDF" and download the result.',
            ] },
            'The tool encrypts with AES-256, the strongest method in the PDF standard. Encryption happens in your browser and the password is not stored anywhere.',
          ],
        },
        {
          title: 'Choosing a strong password',
          blocks: [
            { list: [
              'Length matters most. Aim for 12 characters or more; short passwords fall to guessing no matter how many symbols they contain.',
              'Avoid birthdays, phone numbers and parts of ID numbers. People around the recipient can often find them.',
              'A passphrase of three or four unrelated words (for example blue-umbrella-third-monday) is long yet easy to remember.',
              'Send the password through a different channel from the file: the PDF by email, the password by text message or phone. One leaked inbox then is not enough.',
            ] },
          ],
        },
        {
          title: 'Removing a password',
          blocks: [
            'For your own documents, typing a password every time gets old. In {tool:unlock} you enter the password once and save an unprotected copy. Files that only have permission restrictions can be freed without any password.',
            'A file whose open password you do not know cannot be unlocked. Content encrypted with AES-256 has no recovery route, so if you protect important files, keep their passwords somewhere safe.',
            { tip: 'Removing protection from someone else’s document without permission may breach copyright or an agreement. Only unlock files that are yours or that you are authorized to change.' },
          ],
        },
        {
          title: 'Instead of, or alongside, a password: watermarks',
          blocks: [
            'When a document has to be shown but you worry about leaks, {tool:watermark} can stamp "Confidential" or the recipient’s name across it. A watermark does not hide anything, but it follows the content into screenshots and printouts, which discourages sharing and shows where a copy came from.',
          ],
        },
      ],
    },

    {
      slug: 'is-online-pdf-editor-safe',
      title: 'Is It Safe to Upload Files to Online PDF Tools? How to Check',
      description:
        'The difference between PDF tools that upload your files to a server and ones that work inside the browser, and two simple ways to see which kind a site is.',
      tools: ['merge', 'compress', 'protect'],
      published: '2026-10-11',
      updated: '2026-10-11',
      sections: [
        {
          blocks: [
            'Search for "merge PDF" or "compress PDF" and you will find dozens of free sites. They are convenient, but before uploading a contract or a copy of your passport it is worth asking one question: where does this file go?',
          ],
        },
        {
          title: 'Server processing vs. browser processing',
          blocks: [
            { table: {
              head: ['', 'Server processing', 'Browser processing'],
              rows: [
                ['Where the file goes', 'Uploaded to the company’s servers', 'Never leaves your device'],
                ['Speed', 'Upload and download time added', 'Depends on your device; no transfer time'],
                ['Large files', 'Often limited in size or number of tasks because servers cost money', 'As large as your device’s memory allows'],
                ['Retention', 'Usually promises to delete files after a period', 'Gone from memory when you close the page'],
              ],
            } },
            'Server processing is not automatically unsafe. Reputable services encrypt transfers and state that files are deleted after a while. But you cannot verify that promise, and the file still sits on another company’s computers for some time. If your employer forbids uploading certain documents to outside services, server-based tools are simply off the table.',
          ],
        },
        {
          title: 'How to check what a site actually does',
          blocks: [
            'Rather than relying on a site’s own description, you can test it in two ways.',
            { steps: [
              'The airplane-mode test: open the site, then disconnect from the internet (turn off Wi-Fi) and run the task. A browser-based tool, once it has loaded its program, finishes offline. A server-based tool stops at the upload step.',
              'The developer-tools test: in desktop Chrome press F12, open the "Network" tab and run the task. An upload request about the size of your file (usually a POST) means the file is being sent to a server.',
            ] },
            'Every tool on this site works in the browser. The first time you use a tool, it downloads the PDF engine (about 1–2 MB) once; after that, all processing happens on your device. You are welcome to verify that with either test above.',
          ],
        },
        {
          title: 'Other things worth checking',
          blocks: [
            { list: [
              'Does it require an account? Processing a file does not need one. If a site insists on sign-up, look at what it does with your email address.',
              'Does it stamp the output? Some free tiers add a logo or watermark to results, which is awkward for official submissions.',
              'Is there a privacy policy and a contact address? A trustworthy service explains what it collects and how long it keeps it.',
            ] },
            'If you handle sensitive documents regularly, use a browser-based tool and add an open password with {tool:protect} before you send the file anywhere.',
          ],
        },
      ],
    },

    {
      slug: 'organize-scanned-pdf',
      title: 'Cleaning Up a Scanned PDF: Rotate, Reorder, Delete Blank Pages and Extract',
      description:
        'Batch scans come out with mixed-up order, blank backs and sideways pages. Which tool fixes which problem fastest.',
      tools: ['organize', 'rotate', 'delete-pages', 'extract-pages', 'split'],
      published: '2026-10-11',
      updated: '2026-10-11',
      sections: [
        {
          blocks: [
            'Feed a stack of paper through an office scanner and you get one PDF, along with a list of small problems: blank backs from duplex scanning, pages fed upside down, sheets in the wrong order. Picking the right tool for each problem turns the clean-up into a few minutes of work.',
          ],
        },
        {
          title: 'Which tool for which job',
          blocks: [
            { table: {
              head: ['What you want to do', 'Best tool'],
              rows: [
                ['Several fixes at once (order, rotation, deletion, blank pages)', '{tool:organize}'],
                ['Straighten sideways pages only', '{tool:rotate}'],
                ['Remove blank or unwanted pages', '{tool:delete-pages}'],
                ['Save a few pages as a separate file', '{tool:extract-pages}'],
                ['Break a batch into several files', '{tool:split}'],
              ],
            } },
          ],
        },
        {
          title: 'Fix everything in one place',
          blocks: [
            'When there are several things to fix, {tool:organize} is fastest. Every page is laid out as a preview: drag to reorder, select several pages and rotate or delete them together, and undo any mistake. The original is untouched until you press "Save changes".',
            { tip: 'Hold Shift while clicking to select every page in between. For scattered pages such as the blank backs of a duplex scan, click each one to select them, then delete them all at once.' },
          ],
        },
        {
          title: 'Splitting a batch by person or case',
          blocks: [
            'If you scanned several people’s paperwork in one go, {tool:split} separates it. There are three modes.',
            { list: [
              'Ranges: type "1-3, 4-6, 7-" and each range becomes its own PDF. Useful when each set has a different number of pages.',
              'Every N pages: if every set is two pages long, enter 2 to cut every two pages.',
              'Every page: one PDF per page, handy for individual receipts.',
            ] },
            'When the result is several files, you can download them together as one ZIP file.',
          ],
        },
        {
          title: 'Fewer fixes next time',
          blocks: [
            'The quickest clean-up is the one you never have to do. Menu names differ between copiers, but most offer the settings below.',
            { list: [
              'Scan single-sided originals single-sided. With duplex on, every blank back ends up in the PDF. If there is a "skip blank pages" option, turn it on.',
              'Feed every sheet the same way round. If landscape tables or receipts are mixed in, scan them as a separate batch and merge the files afterwards.',
              'Make one file per set. Pressing scan separately for each person or case saves splitting later.',
              'For text documents, black-and-white or grayscale at 200–300 DPI is enough. Color at 600 DPI looks almost identical on screen but makes the file several times larger.',
              'Open the result right away and check the first and last pages. Discovering a missing page after the paper has been filed away means scanning everything again.',
            ] },
            'For files you already have, use the tools above; for the next batch, try these settings and the tidying step gets much shorter.',
          ],
        },
        {
          title: 'Finishing touches',
          blocks: [
            'For long documents, {tool:page-numbers} makes later reference easier. Scans tend to be large, so a pass through {tool:compress} before archiving or sending is worthwhile.',
            'Every tool’s result screen has "Continue with", so a rotated file can go straight to deletion or compression without uploading it again.',
          ],
        },
      ],
    },

    {
      slug: 'pdf-to-image-resolution',
      title: 'Converting PDF to Images: Which Resolution (DPI) Should You Choose?',
      description:
        'Whether to pick 72, 150 or 300 DPI when turning PDF pages into JPG or PNG images, and when each image format makes sense.',
      tools: ['pdf-to-jpg', 'extract-pages', 'jpg-to-pdf'],
      published: '2026-10-11',
      updated: '2026-10-11',
      sections: [
        {
          blocks: [
            'To post a PDF page on a blog, drop it into slides or send it in a chat app, you need it as an image. The resolution you choose decides both how sharp it looks and how big the file is.',
          ],
        },
        {
          title: 'What DPI means',
          blocks: [
            'DPI (dots per inch) is how many pixels are used for each inch of the page. PDF pages have a real paper size, so choosing a DPI fixes the pixel dimensions of the image.',
            { table: {
              head: ['Resolution', 'Letter page in pixels', 'Good for'],
              rows: [
                ['Low (72 DPI)', 'about 612 × 792', 'Previews, quick sharing in chat'],
                ['Medium (150 DPI)', 'about 1,275 × 1,650', 'Blogs and websites, slides, on-screen reading'],
                ['High (300 DPI)', 'about 2,550 × 3,300', 'Printing, zooming into small print'],
              ],
            } },
            'Doubling the DPI doubles both width and height, so the image has four times as many pixels and the file grows by roughly as much. For on-screen use 150 DPI is plenty; 300 DPI pays off when you print.',
          ],
        },
        {
          title: 'JPG or PNG?',
          blocks: [
            { list: [
              'JPG suits pages with photos or scans: rich colors, small files.',
              'PNG suits text, tables and charts: crisp edges with no blur around letters, but larger files.',
            ] },
            'If in doubt, choose PNG for documents and JPG for photo-heavy pages.',
          ],
        },
        {
          title: 'Converting',
          blocks: [
            { steps: [
              'Open {tool:pdf-to-jpg} and choose your PDF.',
              'All pages start selected. Deselect the ones you do not need.',
              'Pick the image format and resolution and convert. Multiple images can be downloaded as one ZIP file.',
            ] },
            { tip: 'Images cannot be searched and their text cannot be selected. If the goal is simply to pass part of a document to someone, extracting the pages as a PDF with {tool:extract-pages} gives a sharper, smaller file.' },
          ],
        },
        {
          title: 'Posting to blogs, social media and chat',
          blocks: [
            { list: [
              'Most blogs and social networks resize uploaded images anyway. A 300 DPI image ends up looking about the same on screen, so 150 DPI is plenty for the web.',
              'Chat apps often compress images unless you choose to send the original file. If small print turns to mush, check that setting before raising the resolution.',
              'A tall Letter or A4 page shows small text on a phone screen. To highlight one part, convert the page and crop it in your photo app; it reads much better.',
              'Before posting publicly, check for pages with names, phone numbers, addresses or signatures, and simply leave those pages unselected when converting.',
              'Each file name includes its page number, so you always know which page an image came from.',
            ] },
          ],
        },
        {
          title: 'The other way round',
          blocks: [
            'Need to combine several images into one document instead? Use {tool:jpg-to-pdf}. The guide "How to turn phone photos of documents and receipts into a clean PDF" covers the details.',
          ],
        },
      ],
    },
  ],

  toolDetails: {
    merge: [
      {
        title: 'When to use it',
        blocks: [
          { list: [
            'An application asks for all documents "as a single PDF"',
            'Collecting monthly statements or receipts into one file for your records',
            'Assembling chapters of a report written by different people',
          ] },
        ],
      },
      {
        title: 'How it works',
        blocks: [
          'Pages are copied from each PDF into a new file without being redrawn, so text stays selectable and searchable and images keep their original quality. The file list shows a preview of each file’s first page and its page count, so you can check what is what before dragging files into order.',
        ],
      },
      {
        title: 'Good to know',
        blocks: [
          { list: [
            'Prefix file names with 01_, 02_ and so on, and they arrive already in order.',
            'Password-protected files can be added by entering their password; the merged file has no password.',
            'To drop or rotate individual pages afterwards, send the result to {tool:organize} with "Continue with".',
            'If scans make the merged file large, continue to {tool:compress}.',
          ] },
        ],
      },
    ],
    split: [
      {
        title: 'When to use it',
        blocks: [
          { list: [
            'Separating a batch scan into one file per person or case',
            'Sending a large PDF in parts because of a size limit',
            'Breaking a book or course pack into chapters',
          ] },
        ],
      },
      {
        title: 'Three ways to split',
        blocks: [
          { table: {
            head: ['Mode', 'Example input', 'Result'],
            rows: [
              ['Ranges', '1-3, 4-6, 7-', 'One PDF per range ("7-" means page 7 to the end)'],
              ['Every N pages', '2', 'A new PDF every two pages'],
              ['Every page', '-', 'One PDF per page'],
            ],
          } },
          'Before splitting, the tool tells you how many files will be created. Multiple results can be downloaded together as a single ZIP file.',
        ],
      },
      {
        title: 'Good to know',
        blocks: [
          'If you only need a few of the pieces, {tool:extract-pages} gets you there faster. Pages are copied unchanged, so split files have exactly the quality of the original.',
        ],
      },
    ],
    organize: [
      {
        title: 'When to use it',
        blocks: [
          'This is the one-screen tool for documents that need several fixes: scans in the wrong order, duplex scans with blank backs, or print documents that need a blank separator page inserted.',
        ],
      },
      {
        title: 'What you can do',
        blocks: [
          { list: [
            'Drag pages to reorder them',
            'Select several pages and rotate or delete them together (Shift-click selects a range)',
            'Duplicate pages and insert blank pages',
            'Add another PDF and mix its pages in',
            'Undo and redo any change',
          ] },
          'Nothing is written until you press "Save changes", so feel free to experiment.',
        ],
      },
      {
        title: 'Good to know',
        blocks: [
          'If you only need rotation, {tool:rotate} is simpler; for deletion only, {tool:delete-pages}. Documents with hundreds of pages take a while to preview, so splitting out the part you need with {tool:split} first can save time.',
        ],
      },
    ],
    rotate: [
      {
        title: 'When to use it',
        blocks: [
          'For pages fed into a scanner upside down, landscape tables in a portrait document, or sideways pages in a PDF made from phone photos.',
        ],
      },
      {
        title: 'How it works',
        blocks: [
          'Each click turns a page 90° clockwise, and "Rotate all left/right" turns every page at once. Rotation only changes the page’s orientation setting; nothing is redrawn, so quality is untouched and text remains selectable.',
        ],
      },
      {
        title: 'Good to know',
        blocks: [
          'If you also need to reorder or delete pages, {tool:organize} does it all in one go. The rotated file can be passed straight to another tool with "Continue with".',
        ],
      },
    ],
    'delete-pages': [
      {
        title: 'When to use it',
        blocks: [
          { list: [
            'Removing blank backs from a duplex scan',
            'Dropping a cover or instruction page before submitting',
            'Cutting unneeded photo pages to reduce file size',
          ] },
        ],
      },
      {
        title: 'How it works',
        blocks: [
          'Click the pages to remove in the preview; the button shows how many will go. The remaining pages are copied unchanged into a new file, so quality stays the same. The tool will not let you delete every page by mistake.',
        ],
      },
      {
        title: 'Good to know',
        blocks: [
          'If you are keeping far fewer pages than you are removing, select the keepers in {tool:extract-pages} instead. It takes fewer clicks.',
        ],
      },
    ],
    'extract-pages': [
      {
        title: 'When to use it',
        blocks: [
          'For sending a few pages of a long report, keeping just the signature page of a contract, or pulling the homework pages out of a textbook PDF.',
        ],
      },
      {
        title: 'Two ways to save',
        blocks: [
          { list: [
            'As one PDF: the selected pages, in their original order, in a single new file.',
            'One file per page: each selected page as its own PDF, downloadable together as a ZIP.',
          ] },
          'Page data is copied unchanged, so text selection, links and image quality match the original.',
        ],
      },
      {
        title: 'Good to know',
        blocks: [
          'Need image files rather than PDFs? Use {tool:pdf-to-jpg}. For passing a document along, though, extracted PDF pages are sharper and smaller than images.',
        ],
      },
    ],
    compress: [
      {
        title: 'When to use it',
        blocks: [
          'When an email or upload form rejects a file for being too large, or before archiving scans and photo-heavy PDFs. Text-based documents are already small and barely shrink.',
        ],
      },
      {
        title: 'Compression levels',
        blocks: [
          { table: {
            head: ['Level', 'Longest image side', 'JPEG quality', 'Best for'],
            rows: [
              ['Light', '2,400 px', '82%', 'Print, photo-critical material'],
              ['Recommended', '1,700 px', '68%', 'Email attachments, most submissions'],
              ['Strong', '1,200 px', '50%', 'Strict size limits'],
            ],
          } },
          'Only the images inside the PDF are re-encoded; text and vector graphics are left alone, so the text stays selectable and searchable. Images that would not shrink by at least 10% are kept as they were, to protect their quality.',
        ],
      },
      {
        title: 'Maximum compression (every page as an image)',
        blocks: [
          'When image compression is not enough, turn on maximum compression. Each page is redrawn as an image at 150, 120 or 96 DPI depending on the level. It is very effective on scans, but the text can no longer be selected or searched, so use it for read-only copies.',
        ],
      },
      {
        title: 'Good to know',
        blocks: [
          { list: [
            'Do not compress a compressed file again; when stepping up a level, start from the original.',
            'Removing unneeded pages with {tool:delete-pages} first makes compression more effective.',
            'The guide "How to reduce PDF file size" explains the details and a reliable order of steps.',
          ] },
        ],
      },
    ],
    'jpg-to-pdf': [
      {
        title: 'When to use it',
        blocks: [
          'For turning phone photos of receipts, forms and handwritten notes into one document to submit or keep. JPG, PNG, WebP, GIF and BMP images are supported, and photos are turned upright according to their EXIF orientation.',
        ],
      },
      {
        title: 'Choosing settings',
        blocks: [
          { table: {
            head: ['Setting', 'Options', 'Recommended'],
            rows: [
              ['Page size', 'Image size / A4 / Letter', 'Letter or A4 for print and submissions, Image size for photo archives'],
              ['Orientation', 'Auto / Portrait / Landscape', 'Auto in most cases'],
              ['Margins', 'None / Small / Large', 'Small for print, None for screen'],
            ],
          } },
          'With A4 or Letter, each photo is scaled to fit the page while keeping its proportions, so every page comes out the same size even when the photos differ.',
        ],
      },
      {
        title: 'Good to know',
        blocks: [
          { list: [
            'Bright light without shadows, and the phone held parallel to the paper, make a big difference.',
            'Phone photos run to several megabytes each, so the PDF grows fast. Send the result straight to {tool:compress} from the result screen.',
            'The guide "How to turn phone photos of documents and receipts into a clean PDF" covers everything from taking the photo to submitting the file.',
          ] },
        ],
      },
    ],
    'pdf-to-jpg': [
      {
        title: 'When to use it',
        blocks: [
          'For posting a PDF page on a blog or social media, placing it in slides or a document editor as a picture, or sending it in a chat to someone who cannot easily open PDFs.',
        ],
      },
      {
        title: 'Choosing resolution and format',
        blocks: [
          { table: {
            head: ['Resolution', 'Letter page in pixels', 'Use'],
            rows: [
              ['Low (72 DPI)', 'about 612 × 792', 'Previews, quick sharing'],
              ['Medium (150 DPI)', 'about 1,275 × 1,650', 'Web posts, reading on screen'],
              ['High (300 DPI)', 'about 2,550 × 3,300', 'Printing, zooming into small text'],
            ],
          } },
          'Choose PNG for pages of text and tables and JPG for photo-heavy pages. You can convert only the pages you select, and download multiple images as one ZIP.',
        ],
      },
      {
        title: 'Good to know',
        blocks: [
          'Images lose selectable, searchable text. If you just want to pass on part of a document, extract the pages as a PDF with {tool:extract-pages}. The guide "Converting PDF to images: which resolution should you choose?" compares the options in detail.',
        ],
      },
    ],
    watermark: [
      {
        title: 'When to use it',
        blocks: [
          { list: [
            'Marking internal documents "Confidential" or "Draft"',
            'Stamping an ID copy with its purpose so it cannot easily be reused elsewhere',
            'Adding your logo to a portfolio or handout',
          ] },
        ],
      },
      {
        title: 'What you can set',
        blocks: [
          'Choose text or a logo image, then set color, size, opacity and angle. "Center" places a single mark in the middle of the page, while "Tiled" repeats it across the whole page. Apply it to all pages or only the ones you list, and check the first-page preview before applying.',
        ],
      },
      {
        title: 'Good to know',
        blocks: [
          'To discourage leaks, a tiled layout at around 20–30% opacity is hard to crop out. A watermark does not hide content; to keep people from reading the file at all, add an open password with {tool:protect}.',
        ],
      },
    ],
    'page-numbers': [
      {
        title: 'When to use it',
        blocks: [
          'For merged application packets, reports that will be printed and bound, and meeting material where people need to say "turn to page 12".',
        ],
      },
      {
        title: 'What you can set',
        blocks: [
          'Position (left, center or right at the top or bottom), number format, starting number, font size and margin. To skip a cover page and start numbering on the first content page, switch the pages setting to a custom range and keep the starting number at 1. Check the first-page preview before applying.',
        ],
      },
      {
        title: 'Good to know',
        blocks: [
          'Add numbers last. Reordering pages after numbering scrambles them, so settle the order in {tool:merge} or {tool:organize} first.',
        ],
      },
    ],
    protect: [
      {
        title: 'When to use it',
        blocks: [
          'For sending pay stubs, contracts, or medical and financial paperwork that only the recipient should read.',
        ],
      },
      {
        title: 'Password and permissions',
        blocks: [
          'The whole document is encrypted with AES-256 so it cannot be opened without the password. Optional permissions control printing, copying, editing and annotating, but those are flags that PDF viewers are asked to respect, not real encryption.',
          'Encryption runs in your browser and the password is never stored. That also means that if you forget it, nobody, including us, can recover it.',
        ],
      },
      {
        title: 'Good to know',
        blocks: [
          { list: [
            'Use a long password of 12 characters or more, and avoid birthdays or phone numbers.',
            'Send the file by email and the password by text message or phone.',
            'The "PDF password protection explained" guide covers the difference between open passwords and permissions.',
          ] },
        ],
      },
    ],
    unlock: [
      {
        title: 'When to use it',
        blocks: [
          'For keeping your own protected documents, such as monthly statements, without retyping the password every time, or for lifting print and copy restrictions on your own files.',
        ],
      },
      {
        title: 'How it works',
        blocks: [
          'When you choose a file, the tool first tells you what kind of protection it has. Files with an open password need the password you know; files with only permission restrictions can be freed without one. If a file has no protection, the tool tells you that you can use it as it is.',
        ],
      },
      {
        title: 'Good to know',
        blocks: [
          'Files whose password you do not know cannot be unlocked; the tool does not guess passwords. Removing protection from someone else’s document without permission may breach copyright or an agreement, so only use it on files that are yours or that you are authorized to change.',
        ],
      },
    ],
  },
};
