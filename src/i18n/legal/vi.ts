import type { LegalText } from './types';

export const vi: LegalText = {
  about: [
    {
      blocks: [
        '{site} là bộ công cụ PDF miễn phí mà ai cũng có thể yên tâm sử dụng. Chỉ cần một trình duyệt — không cần cài đặt, không cần tài khoản — bạn có thể gộp, tách, sắp xếp lại, nén và chuyển đổi tệp PDF.',
      ],
    },
    {
      title: 'Công cụ PDF không bao giờ tải tệp của bạn lên',
      blocks: [
        'Phần lớn các dịch vụ PDF trực tuyến tải tệp của bạn lên máy chủ của họ. {site} sử dụng WebAssembly và công nghệ trình duyệt hiện đại để thực hiện <strong>toàn bộ quá trình xử lý ngay trên thiết bị của bạn</strong>. Hợp đồng, giấy chứng nhận và bản sao giấy tờ tùy thân không bao giờ rời khỏi máy tính của bạn, và bạn không phải chờ tải lên hay tải xuống.',
      ],
    },
    { title: 'Công cụ', blocks: ['{tools}'] },
    {
      title: 'Nguồn kinh phí',
      blocks: [
        'Mọi công cụ đều miễn phí. Trang web được duy trì nhờ quảng cáo hiển thị trên các trang. Vì tệp không được xử lý trên máy chủ nên chi phí vận hành thấp, nhờ đó không giới hạn số lần sử dụng hay dung lượng tệp.',
      ],
    },
    { title: 'Mã nguồn mở', blocks: ['Dịch vụ này được xây dựng dựa trên các dự án mã nguồn mở sau:', '{opensource}'] },
    { title: 'Liên hệ', blocks: ['{contact}'] },
  ],
  privacy: [
    {
      blocks: ['{site} (“trang web”) tôn trọng quyền riêng tư của bạn. Chính sách này giải thích trang web xử lý những thông tin nào và xử lý như thế nào.'],
    },
    {
      title: '1. Tệp của bạn',
      blocks: [
        'Tệp PDF và hình ảnh <strong>được xử lý hoàn toàn trên thiết bị của bạn, bên trong trình duyệt. Chúng không bao giờ được tải lên máy chủ của chúng tôi hay chia sẻ với bên thứ ba.</strong> Dữ liệu đang xử lý chỉ tồn tại trong bộ nhớ trình duyệt và biến mất khi bạn đóng trang. Nếu bạn dùng “Tiếp tục với”, tệp kết quả được lưu trong bộ nhớ nội bộ của trình duyệt (IndexedDB) tối đa 10 phút để công cụ tiếp theo có thể mở; dữ liệu này cũng không được gửi đi đâu cả.',
      ],
    },
    {
      title: '2. Thông tin được thu thập',
      blocks: [
        'Trang web không có tài khoản và không bao giờ yêu cầu tên hay thông tin liên hệ của bạn. Tuy nhiên, các thông tin sau có thể được tạo tự động và được các nhà cung cấp dịch vụ lưu trữ, phân tích và quảng cáo xử lý:',
        {
          list: [
            'Nhật ký truy cập (địa chỉ IP, thời gian truy cập, các trang đã xem), thông tin trình duyệt và thiết bị',
            'Cookie và mã nhận dạng quảng cáo (khi quảng cáo được hiển thị)',
          ],
        },
      ],
    },
    {
      title: '3. Cookie và quảng cáo',
      blocks: [
        'Trang web có thể hiển thị quảng cáo Google AdSense để trang trải chi phí vận hành. Các nhà cung cấp bên thứ ba, bao gồm Google, sử dụng cookie để phân phát quảng cáo dựa trên các lần bạn truy cập trước đây vào trang web này hoặc các trang web khác. Việc dùng cookie quảng cáo cho phép Google và các đối tác phân phát quảng cáo dựa trên các lần bạn truy cập trang này và các trang khác trên Internet.',
        {
          list: [
            'Bạn có thể tắt quảng cáo được cá nhân hóa trong <a href="https://adssettings.google.com" rel="noopener" target="_blank">Cài đặt quảng cáo của Google</a>.',
            'Bạn có thể tắt cookie của nhà cung cấp bên thứ ba dùng cho quảng cáo được cá nhân hóa tại <a href="https://www.aboutads.info/choices/" rel="noopener" target="_blank">www.aboutads.info</a>.',
            'Tìm hiểu thêm tại <a href="https://policies.google.com/technologies/partner-sites" rel="noopener" target="_blank">Cách Google sử dụng thông tin từ các trang web hoặc ứng dụng sử dụng dịch vụ của Google</a>.',
            'Bạn có thể chặn cookie trong cài đặt trình duyệt; các công cụ PDF vẫn hoạt động bình thường khi không có cookie.',
          ],
        },
      ],
    },
    {
      title: '4. Phân tích lượt truy cập',
      blocks: [
        'Để cải thiện dịch vụ, trang web có thể thu thập số liệu truy cập bằng Cloudflare Web Analytics (không dùng cookie) hoặc Google Analytics. Các số liệu này chỉ được dùng ở dạng tổng hợp và không nhận dạng bạn.',
      ],
    },
    {
      title: '5. Chia sẻ thông tin',
      blocks: [
        'Chúng tôi không bán hay chia sẻ thông tin cá nhân của bạn. Nhà cung cấp dịch vụ lưu trữ của chúng tôi (ví dụ Cloudflare) và các nhà cung cấp quảng cáo hoặc phân tích có thể xử lý thông tin ở mục 2 theo chính sách quyền riêng tư của họ để cung cấp dịch vụ.',
      ],
    },
    {
      title: '6. Thời gian lưu trữ',
      blocks: [
        'Chúng tôi không tự lưu trữ thông tin cá nhân của bạn. Thông tin do nhà cung cấp bên thứ ba xử lý được lưu theo chính sách của họ.',
      ],
    },
    {
      title: '7. Quyền của bạn',
      blocks: [
        'Bạn có thể xóa hoặc chặn cookie bất cứ lúc nào trong cài đặt trình duyệt, và liên hệ với chúng tôi về mọi câu hỏi hoặc yêu cầu liên quan đến quyền riêng tư.',
      ],
    },
    { title: '8. Trẻ em', blocks: ['Trang web không cố ý thu thập thông tin cá nhân của trẻ em.'] },
    { title: '9. Liên hệ', blocks: ['{contact}'] },
    { title: '10. Thay đổi chính sách', blocks: ['Chính sách này có hiệu lực từ {date}. Mọi thay đổi sẽ được đăng trên trang này.'] },
  ],
  terms: [
    { title: '1. Phạm vi', blocks: ['Các điều khoản này quy định việc sử dụng các công cụ PDF do {site} (“trang web”) cung cấp.'] },
    {
      title: '2. Dịch vụ',
      blocks: [
        'Trang web cung cấp miễn phí các công cụ gộp, tách, sắp xếp, nén, chuyển đổi, thêm hình mờ, bảo vệ và mở khóa tệp PDF. Mọi xử lý đều diễn ra trong trình duyệt của bạn và tệp không bao giờ bị tải lên.',
      ],
    },
    {
      title: '3. Trách nhiệm của bạn',
      blocks: [
        {
          list: [
            'Chỉ xử lý những tệp mà bạn có quyền sử dụng.',
            'Không sử dụng dịch vụ để xâm phạm bản quyền, quyền riêng tư hoặc các quyền khác của người khác.',
            'Chỉ dùng công cụ mở khóa cho tài liệu thuộc sở hữu của bạn hoặc bạn được phép chỉnh sửa.',
            'Không can thiệp vào hoạt động bình thường của dịch vụ.',
          ],
        },
      ],
    },
    {
      title: '4. Miễn trừ trách nhiệm',
      blocks: [
        {
          list: [
            'Dịch vụ được cung cấp “nguyên trạng”, không bảo đảm về độ chính xác, tính đầy đủ hay sự phù hợp cho một mục đích cụ thể.',
            'Luôn giữ một bản sao của tệp gốc.',
            'Trong phạm vi pháp luật cho phép, trang web không chịu trách nhiệm về việc mất dữ liệu hay thiệt hại khác phát sinh từ việc sử dụng dịch vụ.',
          ],
        },
      ],
    },
    { title: '5. Quảng cáo', blocks: ['Trang web có thể hiển thị quảng cáo để duy trì hoạt động.'] },
    {
      title: '6. Thay đổi dịch vụ',
      blocks: ['Trang web có thể thay đổi, tạm ngừng hoặc chấm dứt toàn bộ hay một phần dịch vụ bất cứ lúc nào.'],
    },
    { title: '7. Luật áp dụng', blocks: ['Các điều khoản này được điều chỉnh bởi pháp luật Đại Hàn Dân Quốc.'] },
    { title: '8. Ngày hiệu lực', blocks: ['Các điều khoản này có hiệu lực từ {date}.'] },
  ],
  contact: {
    about: 'Góp ý, báo lỗi và đề nghị hợp tác: {email}',
    privacy: 'Câu hỏi về quyền riêng tư: {email}',
    none: 'Nếu có câu hỏi, vui lòng liên hệ với người quản lý trang web.',
  },
  listSeparator: ', ',
};
