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

  about: {
    operator: {
      title: 'Who runs this site',
      blocks: [
        'PDF Modifier is built and run by an independent developer in South Korea. It started from frustration with free PDF sites that demand sign-ups, cap daily use or require uploading files, and aims to be a set of tools with none of those conditions.',
        { list: [
          'All processing happens in your browser. There is no server that receives files, so we cannot store or look at them.',
          'Tool explanations and guides are written against the tools’ real settings and behavior, and are updated when the tools change.',
          'Ads pay for running the site and are kept away from places where they would get in your way, such as the file picker and the processing screen.',
          'Bug reports and feature suggestions are welcome at the contact address below, and changes are listed in the update history.',
        ] },
      ],
    },
    updatesTitle: 'Update history',
    updates: [
      { date: '2026-10-14', items: [
        'Added Word to PDF and PowerPoint to PDF. They run LibreOffice (MPL-2.0), compiled to WebAssembly, inside your browser, so files are never uploaded.',
        'Added the Sign PDF tool for adding a signature or stamp to a PDF. You can draw it, type your name or upload an image.',
        'Added the guide “How to Sign a PDF Without Printing or Scanning It”.',
      ] },
      { date: '2026-10-11', items: [
        'Published 12 PDF guides in English and Korean.',
        'Added an in-depth "More about" section to every tool page in all 13 languages.',
        'Reworded the privacy promise as "Files stay private" to explain more plainly that files never leave your device.',
      ] },
      { date: '2026-10-02', items: [
        'Added a comparison with typical online PDF sites to the home page.',
        'Made the free, no sign-up promise visible in search results and link previews, with a preview image for each language.',
      ] },
      { date: '2026-10-01', items: [
        'Added a processing screen that shows progress and elapsed time.',
        'Added Japanese, Chinese (Simplified and Traditional), Spanish, Portuguese, French, German, Italian, Indonesian, Vietnamese and Turkish, for 13 languages in total.',
      ] },
      { date: '2026-09-29', items: [
        'Launched PDF Modifier with 13 tools: merge, split, organize, rotate, delete and extract pages, compress, JPG to PDF, PDF to JPG, watermark, page numbers, protect and unlock.',
      ] },
    ],
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
              '{ui:tools.split.ui.modeRanges}: type "1-3, 4-6, 7-" and each range becomes its own PDF. Useful when each set has a different number of pages.',
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
    {
      slug: 'pdf-on-phone',
      title: 'Merging and Compressing PDFs on a Phone: iPhone and Android, Step by Step',
      description:
        'How to merge and shrink PDFs in your phone’s browser without installing an app, and how to deal with the part that trips people up most: picking files and finding the result.',
      tools: ['merge', 'compress', 'jpg-to-pdf'],
      published: '2026-10-11',
      updated: '2026-10-11',
      sections: [
        {
          blocks: [
            'Sometimes a document has to go out right now and there is no computer around. The tools on this site work in a phone browser exactly as they do on a desktop, so there is nothing to install. On a phone, though, people get stuck less on the tools themselves than on "where do I pick the file, and where did the result go?" This guide focuses on that.',
          ],
        },
        {
          title: 'Check which browser you are in',
          blocks: [
            'Links opened inside apps such as Instagram, Facebook, LinkedIn or a chat app open in that app’s built-in browser. Those browsers sometimes fail to pick files or to download results. Use the menu (often in a corner of the screen) to choose "Open in browser", then work in Safari, Chrome or Samsung Internet.',
          ],
        },
        {
          title: 'iPhone: picking files and finding downloads',
          blocks: [
            { steps: [
              'Open the tool you need, such as {tool:merge}, in Safari.',
              'Tap the button to choose a PDF. The Files app opens (if a menu appears first, tap "Choose Files"). PDFs you received by email or in a chat app need to be saved to Files first with "Save to Files" in the share menu.',
              'When you tap download, Safari may ask for confirmation. Tap "Download".',
              'The file is saved in the Files app, in the "Downloads" folder. You can also open it from the download icon next to Safari’s address bar.',
            ] },
          ],
        },
        {
          title: 'Android: picking files and finding downloads',
          blocks: [
            { steps: [
              'Open the tool in Chrome or Samsung Internet and tap the button to choose a PDF.',
              'In the file picker, go to "Downloads" or your file manager and choose the PDF. Files received in a chat app usually need to be saved from the conversation first.',
              'Results are saved to the "Download" folder, which you can reach from the Files app (or "My Files" on Samsung). Tapping the download notification opens the file directly.',
            ] },
          ],
        },
        {
          title: 'Common jobs on a phone',
          blocks: [
            { list: [
              'Document photos to PDF: in {tool:jpg-to-pdf} you can pick photos straight from your photo library. Choose Letter or A4 as the page size for a clean result.',
              'Combining PDFs: in {tool:merge}, select several files at once and use the arrow buttons in the list to set the order.',
              'Shrinking for email: if an attachment is too large, use "Recommended" in {tool:compress}. PDFs containing phone photos shrink a lot.',
            ] },
          ],
        },
        {
          title: 'Worth knowing',
          blocks: [
            { list: [
              'Files are processed on your phone, not sent to a server. Data use is limited to loading the tool the first time, and speed depends on your phone.',
              'Switching to another app mid-task can pause the browser. Keep the screen on until the progress indicator finishes.',
              'Files of several hundred megabytes, or documents with hundreds of pages, may exceed a phone’s memory. Use a computer, or split the document with {tool:split} first.',
            ] },
          ],
        },
      ],
    },

    {
      slug: 'rotate-pdf-permanently',
      title: 'Rotated a PDF but It’s Sideways Again? View Rotation vs. File Rotation',
      description:
        'Why a page you rotated in a PDF viewer comes back sideways, how to save the correct orientation into the file for good, and why phone photos end up on their side.',
      tools: ['rotate', 'organize', 'jpg-to-pdf'],
      published: '2026-10-11',
      updated: '2026-10-11',
      sections: [
        {
          blocks: [
            'You rotate a sideways scan in your PDF viewer, send it off, and the recipient opens it to find it still on its side. It happens all the time, because there are two different kinds of rotation.',
          ],
        },
        {
          title: 'View rotation vs. file rotation',
          blocks: [
            { table: {
              head: ['', 'View rotation', 'File rotation'],
              rows: [
                ['What changes', 'How the page is shown on your screen right now', 'The orientation value stored in the PDF'],
                ['When reopened', 'Back to how it was', 'Stays rotated'],
                ['When sent to others', 'They see the original orientation', 'They see it rotated too'],
                ['Typical examples', 'A viewer’s "Rotate View" menu, rotate buttons in a browser’s PDF viewer', '{tool:rotate}, rotating pages in an editor and saving'],
              ],
            } },
            'Features with "view" in the name, such as Adobe Acrobat Reader’s "View › Rotate View", usually only turn the display. Rotate buttons in Chrome’s or Edge’s PDF viewer may not be saved either, depending on the program and version. For a file you are sending to someone, rotate the file itself and save a new copy.',
          ],
        },
        {
          title: 'How rotation is stored in a PDF',
          blocks: [
            'Each PDF page carries a value saying whether to show it turned by 0°, 90°, 180° or 270°. File rotation only changes that value; the page content is not redrawn. That is why you can rotate as often as you like without losing quality, and the text stays selectable and searchable.',
          ],
        },
        {
          title: 'Fixing orientation for good',
          blocks: [
            { steps: [
              'Open {tool:rotate} and choose your PDF.',
              'Each tap or click turns a page 90° clockwise. If every page is turned the same way, use "Rotate all left" or "Rotate all right".',
              'Press "Apply rotation", download the file and open it again to check.',
            ] },
            'If you also need to reorder pages or remove blank ones, {tool:organize} does it all in one pass.',
          ],
        },
        {
          title: 'Why phone photos end up sideways',
          blocks: [
            'Phone cameras store the image the same way whichever way you hold the phone, and add a note (the EXIF orientation tag) saying "show this turned by 90°". Photo apps read the note and show the picture upright, but a program that ignores it produces sideways pages in a PDF.',
            '{tool:jpg-to-pdf} reads that tag and straightens each photo before placing it. If a page is still sideways, the phone probably recorded the wrong orientation because it was held flat; fix it afterwards with {tool:rotate}.',
          ],
        },
        {
          title: 'Getting orientation right when scanning',
          blocks: [
            { list: [
              'Feed every page in the same direction. Collect landscape pages and scan them as a separate batch so they are easy to rotate together.',
              'If your scanner has "auto-rotate" or "auto orientation", turn it on. It uses the direction of the text, so check pages that contain only photos or tables.',
            ] },
          ],
        },
      ],
    },

    {
      slug: 'send-id-copy-safely',
      title: 'How to Send a Copy of Your ID Safely: What to Cover, What to Add, How to Send It',
      description:
        'How to lower the risk when you must send a passport or driver’s license copy as a PDF: covering details, a purpose watermark, a password and cleaning up afterwards.',
      tools: ['jpg-to-pdf', 'watermark', 'compress', 'protect'],
      published: '2026-10-11',
      updated: '2026-10-11',
      sections: [
        {
          blocks: [
            'Opening an account, starting a job or renting an apartment often means sending a copy of your ID. Once a copy is out there you cannot take it back, and it can be used for identity fraud, so a few precautions before you send it go a long way.',
          ],
        },
        {
          title: '1. Cover what the recipient doesn’t need, when you take the photo',
          blocks: [
            'If the recipient does not need certain details, such as a document number or your address, cover them. The most reliable way is to put a piece of paper or a sticky note over them before taking the photo. Painting over details in an editing app afterwards leaves the original photo on your phone, and semi-transparent markers can let the text show through.',
            { tip: 'Some organizations must see the complete document, for example for identity verification required by law. Check the instructions before covering anything.' },
          ],
        },
        {
          title: '2. Turn the photos into a clean PDF',
          blocks: [
            'If you photographed the front and back, select both in {tool:jpg-to-pdf} to create a single PDF. Choosing Letter or A4 makes it easy for the recipient to print. Bright light without shadows, with the phone held parallel to the card, keeps the text sharp.',
          ],
        },
        {
          title: '3. Add the purpose and date as a watermark',
          blocks: [
            'In {tool:watermark}, add text such as "For account opening at Example Bank only – Oct 11, 2026", stating the recipient, purpose and date. If the copy turns up somewhere else, the stated purpose makes it much harder to misuse.',
            { list: [
              'The "Tiled" layout repeats the text across the whole page, so it cannot simply be cropped off.',
              'An opacity of about 20–30% keeps the ID readable while the text stays visible.',
              'Let the text run across the photo and name so that those parts cannot be cut out cleanly.',
            ] },
          ],
        },
        {
          title: '4. Make the watermark hard to remove',
          blocks: [
            'A watermark is text drawn on top of the page, so PDF editing software can sometimes remove it. To make that much harder, send the watermarked file to {tool:compress} and turn on "Maximum compression (convert pages to images)". Each page becomes a single picture with the watermark baked in, and the file gets smaller too.',
          ],
        },
        {
          title: '5. Sending it, and cleaning up afterwards',
          blocks: [
            { list: [
              'If you send it by email, add an open password with {tool:protect} and share the password by text message or phone.',
              'Never post it in group chats or public forums; use a channel only the recipient can see.',
              'Afterwards, delete the original photos and the PDF from your downloads, and empty "Recently Deleted" as well.',
            ] },
            'The tools on this site process photos and PDFs on your own device without sending them to a server. The more sensitive the file, the more it matters that it is not stored anywhere along the way.',
          ],
        },
      ],
    },

    {
      slug: 'page-numbers-skip-cover',
      title: 'Adding Page Numbers Without Numbering the Cover Page',
      description:
        'How to skip the cover and table of contents and start numbering at 1 on the first content page, how to choose position and format, and what to check before you add numbers.',
      tools: ['page-numbers', 'merge', 'organize'],
      published: '2026-10-11',
      updated: '2026-10-11',
      sections: [
        {
          blocks: [
            'Reports and application packets usually have an unnumbered cover, with the first content page as page 1. In a word processor that means fiddling with section breaks; with a finished PDF it takes a few clicks.',
          ],
        },
        {
          title: 'Before numbering: settle the order',
          blocks: [
            'Page numbers are drawn onto the pages, so if you reorder pages afterwards the numbers get shuffled with them. If you need to combine files, do it first with {tool:merge}, check for missing or blank pages in {tool:organize}, and add numbers last.',
          ],
        },
        {
          title: 'Skipping the cover page',
          blocks: [
            { steps: [
              'Open {tool:page-numbers} and choose your PDF.',
              'Switch the pages setting to "Custom" and enter "2-", meaning page 2 to the end. To skip a cover and a one-page table of contents, enter "3-".',
              'Keep the starting number at 1. Numbers are counted only across the pages you selected, so the first content page becomes page 1.',
              'Choose position and format, check the preview, then press "Add page numbers".',
            ] },
            'With a format that shows the total, such as "1 / 10", the total also counts only the numbered pages. An 11-page document with a cover shows "1 / 10" to "10 / 10" on its content pages.',
          ],
        },
        {
          title: 'Choosing position and format',
          blocks: [
            { table: {
              head: ['Document', 'Suggested position', 'Suggested format'],
              rows: [
                ['Reports, papers, submissions', 'Bottom center', '1 or - 1 -'],
                ['Packets of several documents', 'Bottom right', '1 / 10 (lets the recipient check nothing is missing)'],
                ['Formal or legal documents', 'Bottom center or bottom right', 'Page 1 of 10'],
                ['Printed slides for a meeting', 'Top right', '1'],
              ],
            } },
            'Books printed double-sided sometimes put numbers on the outer edge, alternating between odd and even pages. This tool places numbers in the same position on every page, so for double-sided printing choose bottom center, which looks right on both sides.',
          ],
        },
        {
          title: 'If numbers are hidden or cut off',
          blocks: [
            { list: [
              'If numbers overlap an existing footer, switch the margin to "Large" or move the numbers to the top.',
              'If numbers are cut off when printing, they are too close to the edge your printer cannot reach. Use a margin of "Normal" or more.',
              'Landscape pages mixed into the document are fine: numbers are placed according to how each page is displayed.',
            ] },
          ],
        },
      ],
    },

    {
      slug: 'pdf-vs-jpg-submission',
      title: 'PDF or JPG: Which Should You Use When Submitting Documents?',
      description:
        'When a form just says "attach your documents", how PDF and JPG differ, which to choose in common situations, and how to convert between them.',
      tools: ['jpg-to-pdf', 'pdf-to-jpg', 'compress', 'merge'],
      published: '2026-10-11',
      updated: '2026-10-11',
      sections: [
        {
          blocks: [
            'When an application only says "attach supporting documents" without naming a format, it is not obvious whether to send a PDF or a photo (JPG). The two formats suit different jobs, and choosing the right one saves the reviewer time and saves you a "please resend" email.',
          ],
        },
        {
          title: 'How the formats differ',
          blocks: [
            { table: {
              head: ['', 'PDF', 'JPG (image)'],
              rows: [
                ['Multiple pages', 'Many pages in one file', 'One file per page'],
                ['Text', 'Selectable and searchable if the original was a document', 'Text is part of the picture, not searchable'],
                ['Printing', 'Carries a paper size and prints as is', 'Has to be scaled when printing'],
                ['Viewing', 'Opens on nearly every device but needs a viewer', 'Opens instantly anywhere'],
                ['Size', 'Small for documents, large with many photos', 'The size of the photo'],
              ],
            } },
          ],
        },
        {
          title: 'Which one to choose',
          blocks: [
            { list: [
              'Multi-page paperwork (contracts, several certificates): send one PDF. Loose images get out of order and are easy to miss. Combine them with {tool:merge}.',
              'Originals made in Word, Google Docs or Excel: export to PDF. The text stays crisp and searchable.',
              'One or two photos of a receipt or ID: follow the instructions, and if the portal only accepts PDF, convert with {tool:jpg-to-pdf}.',
              'Portals that accept "images only": convert the PDF with {tool:pdf-to-jpg}. For text-heavy pages use 150 DPI or more, and PNG for the sharpest text.',
              'Quickly showing someone in a chat: an image is easiest for them to view.',
            ] },
          ],
        },
        {
          title: 'When you hit a size limit',
          blocks: [
            'Submission portals often limit the size of each file. PDFs built from photos grow quickly, so shrink them with "Recommended" in {tool:compress}. If you must upload images and they are too big, converting again at the next lower resolution is the quickest fix.',
          ],
        },
        {
          title: 'A checklist before you send',
          blocks: [
            { list: [
              'Open the downloaded file yourself once. Empty or broken attachments are more common than you would think.',
              'Check that every page is there and in order. The back of a two-sided certificate is the page most often forgotten.',
              'Zoom in on photos to make sure the text is readable. A blurry or glare-covered photo is quicker to retake than to explain.',
              'Send the original file, not a screenshot of it. Screenshots are low resolution and include clutter such as your phone’s status bar.',
              'If you added a password, make sure the recipient gets it through a separate channel.',
            ] },
          ],
        },
        {
          title: 'The file name is part of the submission',
          blocks: [
            'A file called "IMG_4821.jpg" forces the reviewer to open it to find out what it is. Names like "Jane_Smith_Employment_Letter.pdf", with your name and the document type, make the reviewer’s job easier and help them confirm nothing is missing.',
          ],
        },
      ],
    },
    {
      slug: 'sign-pdf-without-printing',
      title: 'How to Sign a PDF Without Printing or Scanning It',
      description:
        'How to add your signature or a stamp to a contract or form you received as a PDF, without printing and scanning, plus tips for a clean signature and what to check before sending.',
      tools: ['sign', 'merge', 'protect', 'compress'],
      published: '2026-10-14',
      updated: '2026-10-14',
      sections: [
        {
          blocks: [
            'When a contract, consent form or application arrives as a PDF, the old routine was to print it, sign it, then scan it or take a photo and send it back. Without a printer, or away from your desk, that takes a while. Placing an image of your signature directly on the PDF gets it done in a few minutes, even on a phone.',
          ],
        },
        {
          title: '1. Get the document ready',
          blocks: [
            'If the papers you need to sign are split across several files, combine them first with {tool:merge} so you can sign once and send a single file back. Check which pages have a signature line or a name box before you start, so placing the signature is quick.',
          ],
        },
        {
          title: '2. Create your signature',
          blocks: [
            { table: {
              head: ['Method', 'Best when', 'Tip'],
              rows: [
                ['Draw', 'You want it to look like your real signature', 'Drawing with a finger on a phone looks more natural than a mouse. Draw it large; you can shrink it when placing it.'],
                ['Type', 'You have no set signature or need a neat printed name', 'Pick the script, serif or sans style that suits the document.'],
                ['Upload an image', 'You want to use a stamp or a signature written on paper', 'Photograph it on white paper in good light, upload it and turn on “Remove white background”.'],
              ],
            } },
            { tip: 'Black or blue ink both work well. Blue is easy to tell apart from a black-and-white copy, which is why many people use it for original signatures.' },
          ],
        },
        {
          title: '3. Place it on the signature line',
          blocks: [
            { steps: [
              'Open {tool:sign} and choose your PDF.',
              'Create your signature, then click the signature line in the page preview. The signature is placed where you click.',
              'Drag the signature to line it up, and drag its bottom-right corner to fit the size of the box.',
              'If other pages need a signature, switch pages and place it the same way, then press “Sign PDF”.',
            ] },
            'On a computer, click a placed signature once, then nudge it with the arrow keys and resize it with the + and - keys. Remove a misplaced signature with the × button at its top right.',
          ],
        },
        {
          title: 'Check before you send',
          blocks: [
            { list: [
              'Open the downloaded file and make sure the signature sits on the line and does not cover any text.',
              'To stop others from editing the signed file, restrict editing or add an open password with {tool:protect}.',
              'If a large stamp photo made the file heavy, shrink it with {tool:compress} before sending.',
              'If you keep a signature or stamp image file, store it carefully so no one else can reuse it.',
            ] },
            'This site never sends your signature or document to a server; everything is processed inside your browser, so even sensitive contracts are not left anywhere along the way.',
          ],
        },
        {
          title: 'Is a signature added this way valid?',
          blocks: [
            'In many places, including under the US ESIGN Act and the EU eIDAS Regulation, a signature cannot be denied legal effect solely because it is electronic, and everyday contracts, consent forms and applications are routinely exchanged as PDFs with a signature image.',
            'Some documents, however, follow stricter rules, such as wills, certain court or government filings, or agreements that require a certificate-based digital signature. For high-value contracts or official submissions, check which method the other party accepts. This article is general information, not legal advice.',
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
              ['{ui:tools.split.ui.modeRanges}', '1-3, 4-6, 7-', 'One PDF per range ("7-" means page 7 to the end)'],
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
            '{ui:tools.extract-pages.ui.outputSingle}: the selected pages, in their original order, in a single new file.',
            '{ui:tools.extract-pages.ui.outputSeparate}: each selected page as its own PDF, downloadable together as a ZIP.',
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
    'word-to-pdf': [
      {
        title: 'When to use it',
        blocks: [
          { list: [
            'Submitting a résumé or cover letter as a PDF, so it looks the same on any computer',
            'Sending a contract or report as a PDF so it can’t be edited easily',
            'Turning a DOCX you received into a PDF on a computer or phone without Word',
          ] },
        ],
      },
      {
        title: 'How it works',
        blocks: [
          'This tool runs a converter built from LibreOffice, the office suite, compiled to WebAssembly so it runs inside your browser. That is how it converts Word documents to PDF without uploading them to a server the way other converter sites do.',
          'The converter (about 50 MB) is downloaded once and kept by your browser, so later conversions start within seconds. If a document contains Korean, Japanese or Chinese, only the matching fonts are downloaded in addition.',
        ],
      },
      {
        title: 'Good to know',
        blocks: [
          { list: [
            'Fonts such as Calibri or Cambria are not included, so similar free fonts with the same width (Carlito, Caladea) are used. Line breaks can still shift slightly, so check the result before you submit it.',
            'If tracked changes are still in the document, the revision marks may appear. For a clean final copy, accept all changes in Word before converting. Comments are not included in the PDF.',
            'To combine several documents into one PDF, convert them and then use {tool:merge}; if the file is large, shrink it with {tool:compress}.',
          ] },
        ],
      },
    ],
    'ppt-to-pdf': [
      {
        title: 'When to use it',
        blocks: [
          { list: [
            'Sending slides to a teacher or client who may not have PowerPoint or your fonts',
            'Printing lecture slides or annotating them on a tablet',
            'Turning a large PPT into a PDF that is easier to email',
          ] },
        ],
      },
      {
        title: 'How it works',
        blocks: [
          'A converter built from LibreOffice and compiled to WebAssembly draws your slides into a PDF inside your browser. Nothing is uploaded, so internal decks and unreleased presentations stay on your device.',
          'Each slide becomes one PDF page, and the slide size (16:9, 4:3 and so on) becomes the page size. The converter (about 50 MB) is downloaded once, and later conversions start right away.',
        ],
      },
      {
        title: 'Good to know',
        blocks: [
          { list: [
            'Animations appear in their final state, and video and audio don’t play.',
            'Speaker notes and hidden slides are not included.',
            'Fonts such as Calibri are replaced with similar free fonts, so text width can change slightly. Check text boxes that are filled to the edge.',
            'For handouts with several slides per sheet, choose “multiple pages per sheet” when printing. To shrink the result use {tool:compress}; to turn slides into images use {tool:pdf-to-jpg}.',
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
    sign: [
      {
        title: 'When to use it',
        blocks: [
          { list: [
            'Signing a contract or consent form you received by email and sending it straight back, with no printing, signing and scanning',
            'Submitting an application or expense form that needs a signature or stamp next to your name',
            'Adding a signature to every page of a multi-page agreement',
          ] },
        ],
      },
      {
        title: 'Three ways to create a signature',
        blocks: [
          { list: [
            '{ui:tools.sign.ui.modeDraw}: draw it with your mouse or finger. Drawing with a finger on a phone gives the most natural result.',
            '{ui:tools.sign.ui.modeType}: type your name and pick a {ui:tools.sign.ui.styleScript}, {ui:tools.sign.ui.styleSerif} or {ui:tools.sign.ui.styleSans} style.',
            '{ui:tools.sign.ui.modeImage}: upload a photo of a signature or stamp on paper. Turn on “{ui:tools.sign.ui.removeBackground}” to make the paper transparent so it sits naturally on the page.',
          ] },
          'Once your signature is ready, click the page to place it there. Drag it to move it, drag the bottom-right corner to resize it, and switch pages to place it in several spots. On rotated pages it is placed exactly as you see it on screen.',
        ],
      },
      {
        title: 'Good to know',
        blocks: [
          { list: [
            'This tool places an image of your signature on the page. That is widely used for everyday contracts and forms; if a certificate-based digital signature is required, follow the method the organization specifies.',
            'To stop others from editing the signed file, restrict editing or add an open password with {tool:protect}.',
            'If the documents to sign are split across several files, combine them first with {tool:merge} so you can sign them in one go.',
            'Your drawn signature and uploaded images are only used inside this browser and disappear when you close the page.',
          ] },
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
