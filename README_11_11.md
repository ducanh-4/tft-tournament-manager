# README_11_11

## Báo cáo quá trình xây dựng và kiểm soát hệ thống TFT Tournament Manager

## 1. Tổng quan hệ thống

-   **Tên dự án:** TFT Tournament Manager
-   **Mục tiêu:** Hỗ trợ quản lý giải đấu TFT, người chơi, vòng đấu,
    lobby, kết quả trận đấu và bảng xếp hạng.
-   **Frontend:** React, Vite.
-   **Backend:** Node.js, Express.
-   **Cơ sở dữ liệu:** MariaDB.
-   **ORM:** Prisma.
-   **Kiểm thử backend:** Jest, API tests.

Luồng tổng quát: React gửi HTTP request → Express route → controller →
service xử lý nghiệp vụ → repository/Prisma truy vấn MariaDB → backend
trả JSON về frontend.

## 2. Ý 1 -- Xây dựng hệ thống với sự trợ giúp của AI Agent
### 2.1. Quy trình làm việc

1.  Phân tích yêu cầu và xác định các đối tượng chính: giải đấu, người
    chơi, vòng đấu, lobby, trận đấu, kết quả và bảng xếp hạng.
2.  Khảo sát kiến trúc hiện có và đọc các file liên quan trước khi sửa
    code.
3.  Chia yêu cầu thành các tính năng nhỏ, có tiêu chí hoàn thành và kiểm
    thử riêng.
4.  Viết prompt cho Agent, nêu rõ mục tiêu, file liên quan, quy tắc
    nghiệp vụ, đầu vào/đầu ra và trường hợp lỗi.
5.  Đọc lại code Agent đề xuất, kiểm tra logic, kiểu dữ liệu, xử lý lỗi
    và ảnh hưởng tới tính năng cũ.
6.  Chạy test, kiểm tra API và thử trực tiếp trên giao diện.
7.  Xem `git diff`, chỉ giữ thay đổi đúng yêu cầu rồi commit theo từng
    tính năng hoặc lỗi.

### 2.2. Ví dụ thực tế: bảng xếp hạng BO2

Các file liên quan: - `server/src/routes/rankingRoutes.js`: khai báo
route. - `server/src/controllers/rankingController.js`: nhận request và
trả response. - `server/src/services/rankingService.js`: xử lý nghiệp vụ
xếp hạng. - `server/src/repositories/rankingRepository.js`: truy vấn dữ
liệu. - `client/src/pages/Ranking.jsx`: giao diện bảng xếp hạng. -
`client/src/App.css`: định dạng giao diện. -
`server/tests/rankingApi.test.js`: kiểm thử API.

Các quy tắc đã có test: - Trả điểm Game 1, Game 2 và tổng điểm. - Không
xếp hạng BO2 nếu một trong hai game chưa hoàn tất. - Yêu cầu đủ phạm vi
giải đấu, vòng đấu và lobby. - Từ chối lobby không thuộc giải đấu/vòng
được chọn.


### 2.3. Phân biệt phần tự làm và phần AI hỗ trợ

  -----------------------------------------------------------------------
  Công việc               Cách trình bày          Bằng chứng
  ----------------------- ----------------------- -----------------------
  Phân tích yêu cầu       Nêu yêu cầu và quy tắc  Ghi chú/checklist
                          do em xác định          

  Thiết kế luồng          Giải thích cách chia    Sơ đồ hoặc mô tả
                          lớp và luồng dữ liệu    

  Viết code               Nêu rõ phần tự viết và  Diff, lịch sử prompt
                          phần Agent đề xuất/sinh 
                          code                    

  Kiểm tra code           Đọc lại, chạy test, thử Log và kết quả test
                          dữ liệu hợp lệ/không    
                          hợp lệ                  

  Sửa lỗi                 Nêu lỗi, nguyên nhân,   Diff trước/sau
                          thay đổi và kết quả     

  Hoàn thiện              Kiểm tra hồi quy và     Git log
                          commit                  
  -----------------------------------------------------------------------

## 3. Ý 2 -- Kỹ năng kiểm soát code 

### 3.1. Biết tính năng nằm ở đâu và sửa như thế nào

  Thành phần      Vai trò
  --------------- --------------------------------------
  Route           Khai báo endpoint
  Controller      Đọc request và trả response
  Service         Xử lý quy tắc nghiệp vụ
  Repository      Truy vấn dữ liệu
  Frontend page   Hiển thị và nhận thao tác người dùng
  CSS             Định dạng giao diện
  Test            Kiểm tra hành vi mong đợi

### 3.2. Log, diff và Git

-   **Log ứng dụng/test:** Giúp xác định request hoặc test nào lỗi, lỗi
    ở bước nào và thông báo/stack trace liên quan. Không ghi mật khẩu
    hoặc token vào log.
-   **Diff:** Cho biết chính xác các dòng code thay đổi.
-   **Git log:** Theo dõi lịch sử commit.
-   **Git status:** Xem file đang sửa, file mới và trạng thái staging.

Các lệnh cần biết:

``` bash
git status
git diff
git diff --staged
git log --oneline -10
git show --stat HEAD
```

Quy trình trước khi commit: 1. Chạy `git status`. 2. Đọc `git diff` để
xác nhận thay đổi đúng yêu cầu. 3. Kiểm tra có sửa nhầm file hoặc làm lộ
thông tin nhạy cảm không. 4. Chạy test liên quan. 5. Commit với thông
điệp mô tả đúng một tính năng hoặc lỗi. 6. Kiểm tra lại trạng thái Git.

Ví dụ các commit đã có trong dự án: -
`bcccc1d Add scoped BO2 ranking API` -
`43d8a5e Build scoped BO2 leaderboard page` -
`da8199b test: fix tournament cleanup foreign key errors`

Các commit này minh họa việc tách phần API, giao diện và sửa lỗi kiểm
thử thành các mốc riêng biệt.

## 4. Ý 3 -- Kết hợp công cụ kiểm thử tính năng nâng cao (2 điểm)

### 4.1. Các lớp kiểm thử

  -----------------------------------------------------------------------
  Loại test               Mục tiêu                Ví dụ
  ----------------------- ----------------------- -----------------------
  Unit test               Kiểm tra logic nhỏ      Tính điểm theo thứ hạng

  Integration/API test    Kiểm tra các thành phần API ranking truy vấn dữ
                          phối hợp                liệu và trả JSON

  Validation/error test   Kiểm tra dữ liệu không  Thiếu tham số giải
                          hợp lệ                  đấu/vòng/lobby

  Regression test         Đảm bảo sửa mới không   Chạy lại test round và
                          phá tính năng cũ        ranking

  Manual/UI test          Kiểm tra trên trình     Chọn giải đấu, vòng,
                          duyệt                   lobby và xem điểm
  -----------------------------------------------------------------------

### 4.2. Test đã có trong dự án

File `server/tests/rankingApi.test.js` đã kiểm tra: - Điểm từng game và
tổng điểm. - Không xếp hạng BO2 nếu một game chưa có kết quả hoàn tất. -
Yêu cầu đủ giải đấu, vòng đấu và lobby. - Từ chối lobby không thuộc giải
đấu/vòng đã chọn. - Lấy danh sách vòng đấu và lobby của giải đấu.

Kết quả của lần chạy trước:

``` text
PASS tests/rankingApi.test.js
Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```

Các test khác cũng từng chạy thành công:

``` text
PASS tests/roundApi.test.js
PASS tests/roundCreationService.test.js
Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total
```

Đây là kết quả của lần chạy trước, không phải cam kết về trạng thái code
hiện tại. Trước khi báo cáo, cần chạy lại test và lưu kết quả mới.

### 4.3. Quy trình kiểm thử đề xuất

1.  Xác định yêu cầu và tiêu chí chấp nhận.
2.  Viết test cho trường hợp bình thường, dữ liệu sai, thiếu dữ liệu và
    dữ liệu biên.
3.  Chạy test tự động bằng Jest.
4.  Đọc log/stack trace khi test thất bại và truy nguyên nhân.
5.  Kiểm tra API bằng test hoặc công cụ phù hợp.
6.  Thao tác trên frontend và kiểm tra request/response trong tab
    Network của DevTools.
7.  Chạy lại test liên quan để kiểm tra hồi quy.
8.  Lưu bằng chứng: log test, request/response, diff và commit.