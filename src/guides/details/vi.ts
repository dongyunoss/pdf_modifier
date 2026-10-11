// Tiếng Việt: phần "Tìm hiểu thêm" trên trang mỗi công cụ. {tool:id} thành liên kết, {ui:…} thành chữ trên giao diện.
import type { ToolDetailSet } from '../types';

export const vi: ToolDetailSet = {
  title: 'Tìm hiểu thêm về {tool}',
  sections: {
    merge: [
      {
        title: 'Khi nào nên dùng',
        blocks: [
          { list: [
            'Khi hồ sơ xin việc, học bổng hay vay vốn yêu cầu "nộp tất cả giấy tờ trong một file PDF"',
            'Để gộp sao kê hoặc hóa đơn hằng tháng vào một file lưu trữ',
            'Để ghép các chương của một báo cáo do nhiều người viết',
          ] },
        ],
      },
      {
        title: 'Cách hoạt động',
        blocks: [
          'Các trang của từng PDF được sao chép nguyên vẹn sang file mới mà không vẽ lại. Vì vậy chữ vẫn chọn và tìm kiếm được, hình ảnh giữ nguyên chất lượng. Danh sách file hiển thị bản xem trước trang đầu và số trang của từng file để bạn kiểm tra nội dung trước khi kéo thả sắp xếp.',
        ],
      },
      {
        title: 'Mẹo nhỏ',
        blocks: [
          { list: [
            'Đặt số hai chữ số ở đầu tên file (01_, 02_ …) thì khi chọn, các file đã đúng thứ tự.',
            'PDF có mật khẩu vẫn gộp được nếu bạn nhập mật khẩu khi thêm file; file sau khi gộp không có mật khẩu.',
            'Muốn xóa hoặc xoay vài trang sau đó, hãy chuyển kết quả sang {tool:organize} bằng "{ui:ui.continueWith}".',
            'Nếu file bị nặng vì có bản scan, hãy tiếp tục với {tool:compress}.',
          ] },
        ],
      },
    ],
    split: [
      {
        title: 'Khi nào nên dùng',
        blocks: [
          { list: [
            'Tách một xấp giấy tờ scan cùng lúc thành từng file theo người hoặc theo hồ sơ',
            'Gửi một PDF lớn thành nhiều phần vì giới hạn dung lượng',
            'Chia sách hoặc giáo trình PDF theo từng chương',
          ] },
        ],
      },
      {
        title: 'Ba cách tách',
        blocks: [
          { table: {
            head: ['Chế độ', 'Ví dụ nhập', 'Kết quả'],
            rows: [
              ['{ui:tools.split.ui.modeRanges}', '1-3, 4-6, 7-', 'Mỗi khoảng một PDF ("7-" là từ trang 7 đến hết)'],
              ['{ui:tools.split.ui.modeEvery}', '2', 'Cứ hai trang tạo một PDF mới'],
              ['{ui:tools.split.ui.modeEach}', '-', 'Mỗi trang một PDF'],
            ],
          } },
          'Trước khi tách, công cụ cho biết sẽ tạo bao nhiêu file. Nếu có nhiều file, bạn có thể tải tất cả cùng lúc trong một file ZIP.',
        ],
      },
      {
        title: 'Mẹo nhỏ',
        blocks: [
          'Nếu chỉ cần vài phần, dùng {tool:extract-pages} sẽ nhanh hơn. Các trang được sao chép nguyên vẹn nên file sau khi tách có chất lượng đúng như bản gốc.',
        ],
      },
    ],
    organize: [
      {
        title: 'Khi nào nên dùng',
        blocks: [
          'Đây là công cụ cho tài liệu cần sửa nhiều thứ cùng lúc: bản scan lộn thứ tự, scan hai mặt có mặt sau trống, hoặc tài liệu in cần chèn thêm trang trắng.',
        ],
      },
      {
        title: 'Bạn có thể làm gì',
        blocks: [
          { list: [
            'Kéo trang để đổi thứ tự',
            'Chọn nhiều trang rồi xoay hoặc xóa cùng lúc (giữ Shift khi nhấp để chọn một dải trang)',
            'Nhân bản trang, chèn trang trắng',
            'Thêm PDF khác và trộn các trang',
            'Hoàn tác và làm lại mọi thay đổi',
          ] },
          'Chưa có gì được lưu cho đến khi bạn nhấn "{ui:tools.organize.ui.action}", nên cứ yên tâm thử.',
        ],
      },
      {
        title: 'Mẹo nhỏ',
        blocks: [
          'Nếu chỉ cần xoay, {tool:rotate} đơn giản hơn; chỉ cần xóa thì dùng {tool:delete-pages}. Tài liệu hàng trăm trang cần thời gian để hiển thị bản xem trước, vì vậy tách phần cần thiết bằng {tool:split} trước sẽ nhanh hơn.',
        ],
      },
    ],
    rotate: [
      {
        title: 'Khi nào nên dùng',
        blocks: [
          'Khi giấy bị đưa ngược vào máy scan, khi tài liệu dọc có lẫn bảng biểu nằm ngang, hoặc khi PDF tạo từ ảnh điện thoại có trang bị nằm nghiêng.',
        ],
      },
      {
        title: 'Cách hoạt động',
        blocks: [
          'Mỗi lần nhấp, trang xoay 90° theo chiều kim đồng hồ; "{ui:tools.rotate.ui.rotateAllLeft}" và "{ui:tools.rotate.ui.rotateAllRight}" xoay tất cả các trang cùng lúc. Chỉ thông tin hướng của trang thay đổi, nội dung không bị vẽ lại, nên chất lượng giữ nguyên và chữ vẫn chọn được.',
        ],
      },
      {
        title: 'Mẹo nhỏ',
        blocks: [
          'Nếu còn cần sắp xếp lại hoặc xóa trang, {tool:organize} làm được tất cả trong một lần. Chức năng "xoay chế độ xem" của trình đọc PDF thường không lưu vào file; muốn sửa hướng trang vĩnh viễn, hãy lưu kết quả bằng công cụ này.',
        ],
      },
    ],
    'delete-pages': [
      {
        title: 'Khi nào nên dùng',
        blocks: [
          { list: [
            'Xóa mặt sau trống của bản scan hai mặt',
            'Bỏ trang bìa hoặc trang hướng dẫn trước khi nộp tài liệu',
            'Xóa các trang ảnh không cần thiết để giảm dung lượng',
          ] },
        ],
      },
      {
        title: 'Cách hoạt động',
        blocks: [
          'Nhấp vào các trang muốn xóa; nút bấm sẽ hiển thị số trang bị xóa. Các trang còn lại được sao chép nguyên vẹn sang file mới nên chất lượng không đổi. Công cụ không cho phép xóa hết tất cả các trang do nhầm lẫn.',
        ],
      },
      {
        title: 'Mẹo nhỏ',
        blocks: [
          'Nếu số trang giữ lại ít hơn nhiều so với số trang cần xóa, hãy chọn các trang cần giữ trong {tool:extract-pages} để đỡ phải nhấp nhiều.',
        ],
      },
    ],
    'extract-pages': [
      {
        title: 'Khi nào nên dùng',
        blocks: [
          'Khi muốn gửi vài trang trong một báo cáo dài, chỉ lưu trang chữ ký của hợp đồng, hoặc lấy riêng phần bài tập trong giáo trình PDF.',
        ],
      },
      {
        title: 'Hai cách lưu',
        blocks: [
          { list: [
            '{ui:tools.extract-pages.ui.outputSingle}: các trang đã chọn, theo thứ tự ban đầu, trong một file mới.',
            '{ui:tools.extract-pages.ui.outputSeparate}: mỗi trang đã chọn thành một PDF riêng, có thể tải chung trong một file ZIP.',
          ] },
          'Dữ liệu trang được sao chép nguyên vẹn nên việc chọn chữ, liên kết và chất lượng hình ảnh giống hệt bản gốc.',
        ],
      },
      {
        title: 'Mẹo nhỏ',
        blocks: [
          'Cần ảnh thay vì PDF? Hãy dùng {tool:pdf-to-jpg}. Nhưng nếu chỉ muốn chuyển một phần tài liệu cho người khác, trang trích xuất dạng PDF sẽ nét hơn và nhẹ hơn ảnh.',
        ],
      },
    ],
    compress: [
      {
        title: 'Khi nào nên dùng',
        blocks: [
          'Khi email hoặc biểu mẫu tải lên từ chối file vì quá lớn, hoặc trước khi lưu trữ bản scan và PDF có nhiều ảnh. Tài liệu chủ yếu là chữ vốn đã nhẹ nên gần như không giảm thêm.',
        ],
      },
      {
        title: 'Các mức nén',
        blocks: [
          { table: {
            head: ['Mức', 'Cạnh dài nhất của ảnh', 'Chất lượng JPEG', 'Phù hợp cho'],
            rows: [
              ['{ui:tools.compress.ui.levelLow}', '2.400 px', '82%', 'In ấn, tài liệu cần ảnh đẹp'],
              ['{ui:tools.compress.ui.levelMedium}', '1.700 px', '68%', 'Đính kèm email, hầu hết hồ sơ nộp'],
              ['{ui:tools.compress.ui.levelHigh}', '1.200 px', '50%', 'Giới hạn dung lượng rất chặt'],
            ],
          } },
          'Chỉ ảnh bên trong PDF được mã hóa lại; chữ và hình vector không bị động đến, nên sau khi nén chữ vẫn chọn và tìm kiếm được. Ảnh nào nén lại mà không giảm được ít nhất 10% sẽ được giữ nguyên để bảo toàn chất lượng.',
        ],
      },
      {
        title: 'Về "{ui:tools.compress.ui.rasterize}"',
        blocks: [
          'Khi nén ảnh vẫn chưa đủ, tùy chọn này vẽ lại mỗi trang thành ảnh 150, 120 hoặc 96 DPI tùy theo mức. Cách này rất hiệu quả với bản scan, nhưng chữ sẽ không còn chọn hay tìm kiếm được, nên chỉ dùng cho bản sao cần xem.',
        ],
      },
      {
        title: 'Mẹo nhỏ',
        blocks: [
          { list: [
            'Đừng nén lại file đã nén: chỉ làm giảm chất lượng. Muốn tăng mức nén, hãy bắt đầu lại từ file gốc.',
            'Xóa trước các trang không cần bằng {tool:delete-pages} sẽ giúp nén hiệu quả hơn.',
          ] },
        ],
      },
    ],
    'jpg-to-pdf': [
      {
        title: 'Khi nào nên dùng',
        blocks: [
          'Khi muốn biến ảnh chụp hóa đơn, biểu mẫu hay ghi chú viết tay bằng điện thoại thành một tài liệu để nộp hoặc lưu trữ. Hỗ trợ ảnh JPG, PNG, WebP, GIF và BMP, đồng thời tự xoay ảnh cho đúng theo thông tin hướng EXIF.',
        ],
      },
      {
        title: 'Chọn thiết lập',
        blocks: [
          { table: {
            head: ['Thiết lập', 'Lựa chọn', 'Gợi ý'],
            rows: [
              ['{ui:tools.jpg-to-pdf.ui.pageSize}', '{ui:tools.jpg-to-pdf.ui.sizeFit} / A4 / Letter', 'A4 để in và nộp; {ui:tools.jpg-to-pdf.ui.sizeFit} để lưu ảnh'],
              ['{ui:tools.jpg-to-pdf.ui.orientation}', '{ui:tools.jpg-to-pdf.ui.orientAuto} / {ui:tools.jpg-to-pdf.ui.orientPortrait} / {ui:tools.jpg-to-pdf.ui.orientLandscape}', 'Hầu hết trường hợp chọn {ui:tools.jpg-to-pdf.ui.orientAuto}'],
              ['{ui:tools.jpg-to-pdf.ui.margin}', '{ui:tools.jpg-to-pdf.ui.marginNone} / {ui:tools.jpg-to-pdf.ui.marginSmall} / {ui:tools.jpg-to-pdf.ui.marginLarge}', '{ui:tools.jpg-to-pdf.ui.marginSmall} khi in; {ui:tools.jpg-to-pdf.ui.marginNone} khi xem trên màn hình'],
            ],
          } },
          'Khi chọn A4 hoặc Letter, mỗi ảnh được thu vừa trang mà vẫn giữ tỷ lệ, nên mọi trang đều cùng kích thước dù các ảnh khác nhau.',
        ],
      },
      {
        title: 'Mẹo nhỏ',
        blocks: [
          { list: [
            'Chụp ở nơi đủ sáng, không bóng đổ và giữ điện thoại song song với tờ giấy sẽ cho kết quả gọn gàng hơn nhiều. Hãy tắt đèn flash vì giấy bóng dễ phản chiếu.',
            'Mỗi ảnh điện thoại thường vài MB nên PDF tăng dung lượng rất nhanh. Từ màn hình kết quả, bạn có thể chuyển thẳng sang {tool:compress}.',
          ] },
        ],
      },
    ],
    'pdf-to-jpg': [
      {
        title: 'Khi nào nên dùng',
        blocks: [
          'Khi muốn đăng một trang PDF lên blog hay mạng xã hội, chèn nó như hình ảnh vào bài thuyết trình hoặc tài liệu, hay gửi qua ứng dụng nhắn tin cho người khó mở PDF.',
        ],
      },
      {
        title: 'Chọn độ phân giải và định dạng',
        blocks: [
          { table: {
            head: ['Độ phân giải', 'Trang A4 tính bằng pixel', 'Mục đích'],
            rows: [
              ['{ui:tools.pdf-to-jpg.ui.dpiLow}', 'khoảng 595 × 842', 'Xem trước, chia sẻ nhanh'],
              ['{ui:tools.pdf-to-jpg.ui.dpiMedium}', 'khoảng 1.240 × 1.754', 'Đăng web, đọc trên màn hình'],
              ['{ui:tools.pdf-to-jpg.ui.dpiHigh}', 'khoảng 2.480 × 3.508', 'In ấn, phóng to chữ nhỏ'],
            ],
          } },
          'Tăng gấp đôi DPI thì chiều rộng và chiều cao đều tăng gấp đôi, ảnh có số pixel gấp bốn và file cũng lớn lên tương ứng. Chọn PNG cho trang nhiều chữ và bảng biểu, JPG cho trang nhiều ảnh. Bạn có thể chỉ chuyển các trang đã chọn và tải nhiều ảnh trong một file ZIP.',
        ],
      },
      {
        title: 'Mẹo nhỏ',
        blocks: [
          'Khi đã thành ảnh, chữ không thể chọn hay tìm kiếm được nữa. Nếu chỉ muốn chuyển một phần tài liệu, hãy trích xuất các trang dưới dạng PDF bằng {tool:extract-pages}.',
        ],
      },
    ],
    watermark: [
      {
        title: 'Khi nào nên dùng',
        blocks: [
          { list: [
            'Đánh dấu tài liệu nội bộ là "Mật" hoặc "Bản nháp"',
            'Ghi rõ mục đích sử dụng trên bản sao căn cước để không bị dùng vào việc khác',
            'Thêm logo vào hồ sơ năng lực hoặc tài liệu phát tay',
          ] },
        ],
      },
      {
        title: 'Có thể thiết lập gì',
        blocks: [
          'Chọn chữ hoặc ảnh logo, sau đó chỉnh màu, kích thước, độ mờ và góc xoay. "{ui:tools.watermark.ui.layoutCenter}" đặt một dấu duy nhất ở giữa trang, còn "{ui:tools.watermark.ui.layoutTile}" lặp lại dấu trên toàn trang. Có thể áp dụng cho mọi trang hoặc chỉ những trang chỉ định, và xem trước kết quả trên trang đầu tiên.',
        ],
      },
      {
        title: 'Mẹo nhỏ',
        blocks: [
          'Để hạn chế rò rỉ, kiểu "{ui:tools.watermark.ui.layoutTile}" với độ mờ khoảng 20–30% rất khó cắt bỏ. Hình mờ không che giấu nội dung; nếu không muốn ai khác đọc file, hãy đặt thêm mật khẩu mở file bằng {tool:protect}.',
        ],
      },
    ],
    'page-numbers': [
      {
        title: 'Khi nào nên dùng',
        blocks: [
          'Khi cần đánh số trang cho bộ hồ sơ đã gộp, báo cáo sẽ in và đóng quyển, hoặc tài liệu họp mà mọi người cần nói "xem trang 12".',
        ],
      },
      {
        title: 'Có thể thiết lập gì',
        blocks: [
          'Vị trí (trái, giữa hoặc phải, ở trên hoặc ở dưới), định dạng số, số bắt đầu, cỡ chữ và lề. Để bỏ qua trang bìa và bắt đầu đánh số từ trang nội dung đầu tiên, hãy chọn "{ui:tools.page-numbers.ui.pagesCustom}" ở phần trang áp dụng, nhập từ trang 2 trở đi và để số bắt đầu là 1. Kiểm tra bản xem trước trước khi áp dụng.',
        ],
      },
      {
        title: 'Mẹo nhỏ',
        blocks: [
          'Hãy đánh số sau cùng. Nếu sắp xếp lại trang sau khi đánh số, số trang sẽ bị lộn xộn, vì vậy hãy chốt thứ tự trước bằng {tool:merge} hoặc {tool:organize}.',
        ],
      },
    ],
    protect: [
      {
        title: 'Khi nào nên dùng',
        blocks: [
          'Khi gửi phiếu lương, hợp đồng hoặc giấy tờ y tế, tài chính mà chỉ người nhận được xem.',
        ],
      },
      {
        title: 'Mật khẩu và quyền',
        blocks: [
          'Toàn bộ tài liệu được mã hóa bằng AES-256, không có mật khẩu thì không mở được. Phần quyền tùy chọn kiểm soát việc in, sao chép, chỉnh sửa và chú thích, nhưng đó chỉ là yêu cầu mà trình đọc PDF được mong đợi tuân theo, không phải mã hóa thực sự.',
          'Việc mã hóa diễn ra trong trình duyệt của bạn và mật khẩu không được lưu ở bất kỳ đâu. Điều đó cũng có nghĩa là nếu quên mật khẩu, không ai, kể cả chúng tôi, có thể khôi phục.',
        ],
      },
      {
        title: 'Mẹo nhỏ',
        blocks: [
          { list: [
            'Dùng mật khẩu dài từ 12 ký tự trở lên, tránh ngày sinh hay số điện thoại.',
            'Gửi file qua email và gửi mật khẩu qua tin nhắn SMS hoặc điện thoại.',
          ] },
        ],
      },
    ],
    unlock: [
      {
        title: 'Khi nào nên dùng',
        blocks: [
          'Khi muốn lưu tài liệu có mật khẩu của chính mình, như sao kê hằng tháng, mà không phải nhập mật khẩu mỗi lần, hoặc muốn gỡ giới hạn in và sao chép trên file của mình.',
        ],
      },
      {
        title: 'Cách hoạt động',
        blocks: [
          'Khi bạn chọn file, công cụ cho biết trước file đang có loại bảo vệ nào. File có mật khẩu mở cần mật khẩu mà bạn biết; file chỉ bị giới hạn quyền có thể gỡ giới hạn mà không cần mật khẩu. Nếu file không có bảo vệ, công cụ sẽ báo rằng bạn có thể dùng ngay.',
        ],
      },
      {
        title: 'Mẹo nhỏ',
        blocks: [
          'Không thể mở khóa file mà bạn không biết mật khẩu; công cụ không đoán mật khẩu. Gỡ bảo vệ tài liệu của người khác khi chưa được phép có thể vi phạm bản quyền hoặc thỏa thuận, vì vậy chỉ dùng cho file của bạn hoặc file bạn được phép chỉnh sửa.',
        ],
      },
    ],
  },
};
