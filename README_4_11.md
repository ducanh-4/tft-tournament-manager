# README_4_11

## BÁO CÁO NGÀY 04/10

## 1. Thông tin dự án

**Tên dự án:** Hệ thống quản lý bảng đấu TFT

**Tựa game:** Đấu Trường Chân Lý (TFT)

**Mục đích của dự án:** Xây dựng một hệ thống giúp tạo và quản lý bảng đấu TFT cho người chơi. Hệ thống hỗ trợ tổ chức người chơi thành các Lobby, quản lý từng Round, nhập kết quả các game, tính điểm và xác định người chơi được đi tiếp vào vòng sau.

Công nghệ dự kiến sử dụng:

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MySQL/MariaDB
- ORM: Prisma
- Testing: Jest + Supertest
- Công cụ phát triển: VS Code + GitHub Copilot
- Quản lý mã nguồn: Git/GitHub

---

## 2. Ý hiểu của em về dự án

Đây là một hệ thống tạo bảng đấu cho giải TFT. Người tổ chức có thể nhập danh sách người chơi và số lượng người tham gia, sau đó hệ thống tự động chia người chơi thành các Lobby để thi đấu.

Mỗi Lobby có 8 người chơi. Các người chơi trong Lobby thi đấu 2 game (BO2). Sau khi kết thúc 2 game, hệ thống tính tổng điểm của từng người dựa trên thứ hạng ở mỗi game.

Bốn người có thành tích cao nhất trong mỗi Lobby sẽ được chọn để đi tiếp. Những người vượt qua vòng trước sẽ được hệ thống xáo trộn và chia lại thành các Lobby mới.

Ví dụ với 64 người chơi:

```text
64 người
    ↓
8 Lobby, mỗi Lobby 8 người
    ↓
Mỗi Lobby thi đấu BO2
    ↓
Top 4 mỗi Lobby
    ↓
32 người
    ↓
Chia lại Lobby
    ↓
16 người
    ↓
Chia lại Lobby
    ↓
8 người
    ↓
Chung kết
```

Mục tiêu của hệ thống là giảm bớt việc ban tổ chức phải tự chia bảng, tính điểm và theo dõi người chơi bằng thủ công.

---

## 3. Quy tắc số lượng người chơi

Số lượng người chơi hợp lệ được xây dựng theo dạng:

```text
8 × 2^n
```

Ví dụ:

```text
8
16
32
64
128
256
```

Mỗi Lobby luôn có 8 người.

Sau mỗi Round, số người chơi được giảm một nửa do mỗi Lobby lấy Top 4.

Ví dụ:

```text
128 → 64 → 32 → 16 → 8
```

Khi còn 8 người chơi thì đó là bảng chung kết.

---

## 4. Cách tính điểm

Mỗi game có 8 người chơi và điểm được tính theo thứ hạng:

| Thứ hạng | Điểm |
|---|---:|
| Top 1 | 8 |
| Top 2 | 7 |
| Top 3 | 6 |
| Top 4 | 5 |
| Top 5 | 4 |
| Top 6 | 3 |
| Top 7 | 2 |
| Top 8 | 1 |

Mỗi người chơi thi đấu 2 game trong một Lobby.

Tổng điểm của người chơi được tính bằng tổng điểm của 2 game.

Sau đó hệ thống xếp hạng người chơi trong Lobby dựa trên tổng điểm và các tiêu chí tie-break khi cần thiết.

---

## 5. Tiêu chí Regional Tie-break

Khi người chơi có cùng tổng điểm, hệ thống sử dụng các tiêu chí Regional Tie-break theo thứ tự:

1. Số game đạt Top 1 nhiều hơn.
2. Tổng điểm nhiều hơn.
3. Số game đạt Top 4 nhiều hơn.
4. Số game Top 8 ít hơn.
5. Thứ hạng ở game gần nhất tốt hơn.
6. Số game đạt Top 2 nhiều hơn.
7. Số game đạt Top 3 nhiều hơn.

Các thống kê này được tính từ dữ liệu kết quả trận đấu thay vì lưu dư thừa thành nhiều trường riêng trong database.

---

## 6. Thiết kế hệ thống

Em hiểu hệ thống được chia thành nhiều lớp để mỗi phần có một nhiệm vụ riêng:

```text
Frontend
   ↓
API
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Prisma
   ↓
MySQL/MariaDB
```

### Repository

Repository chịu trách nhiệm thao tác với database.

Một số repository đã xây dựng:

```text
tournamentRepository.js
tournamentPlayerRepository.js
roundRepository.js
```

### Service

Service xử lý nghiệp vụ của hệ thống.

Các service đã có:

```text
tournamentService.js
matchService.js
tieBreakerService.js
roundService.js
roundCreationService.js
tournamentRegistrationService.js
```

Việc chia thành Repository và Service giúp em dễ xác định vị trí code khi cần sửa hoặc mở rộng một chức năng.

---

## 7. Database

Các model chính của hệ thống:

```text
Player
Tournament
TournamentPlayer
Day
Round
Lobby
LobbyPlayer
Match
MatchResult
```

Quan hệ chính:

```text
Tournament
 ├── TournamentPlayer
 ├── Day
 └── Round
      └── Lobby
           └── LobbyPlayer
                └── Player
```

Kết quả thi đấu được lưu thông qua:

```text
Match
 └── MatchResult
      └── Player
```

Thiết kế này giúp hệ thống lưu được lịch sử các Round, Lobby, trận đấu, thứ hạng và điểm của người chơi.

---

## 8. Các chức năng đã thực hiện

### 8.1. Tournament Rules

Đã xây dựng logic để:

- Kiểm tra số lượng người chơi hợp lệ.
- Tính số Lobby.
- Tính số người chơi của Round tiếp theo.
- Xác định Round chung kết.
- Tính điểm theo placement.

### 8.2. BO2 Scoring

Đã xây dựng logic:

- Tính điểm từng game.
- Tính tổng điểm BO2.
- Xếp hạng người chơi.
- Chọn Top 4 của từng Lobby.

### 8.3. Regional Tie-break

Đã triển khai các tiêu chí tie-break theo thứ tự đã nêu ở trên.

### 8.4. Đăng ký người chơi

Đã xây dựng phần đăng ký người chơi vào bảng đấu thông qua:

```text
TournamentPlayer
```

Hệ thống kiểm tra việc đăng ký trùng người chơi trong cùng một Tournament.

### 8.5. Tạo Round và Lobby

Đã xây dựng:

```text
roundRepository.js
roundCreationService.js
```

Chức năng `createRound()` thực hiện:

1. Tìm bảng đấu.
2. Kiểm tra bảng đấu tồn tại.
3. Lấy danh sách người chơi đã đăng ký.
4. Kiểm tra số lượng người chơi.
5. Xác định số Round tiếp theo.
6. Xác định Round là QUALIFIER hay FINAL.
7. Xáo trộn người chơi.
8. Chia người chơi thành các Lobby, mỗi Lobby 8 người.
9. Lưu Lobby vào database.
10. Lưu quan hệ LobbyPlayer vào database.

---

## 9. Kiểm thử

Trong quá trình phát triển, em sử dụng Jest để kiểm thử business logic và các thao tác với database.

Các nhóm test hiện có gồm:

- Tournament rules
- Match scoring
- Regional tie-break
- Round service
- Tournament registration
- TournamentPlayer repository
- Round repository
- Round creation service

Checkpoint gần nhất:

```text
16 Test Suites Passed
```

Riêng `roundService.test.js`:

```text
9 tests passed
```

Việc chạy test sau mỗi thay đổi giúp kiểm tra xem chức năng mới có làm ảnh hưởng đến các chức năng đã xây dựng trước đó hay không.

---

## 10. Git và GitHub

Em sử dụng Git để lưu lại các checkpoint của dự án theo từng giai đoạn.

Một số commit đã thực hiện:

```text
feat: add tournament api
test: add round service tests
feat: add tournament repository
test: verify prisma database connection
feat: connect tournament api to database
fix: configure prisma client for node server
feat: add registration and round persistence
```

Mã nguồn được push lên GitHub để lưu trữ và theo dõi lịch sử phát triển.

---

## 11. Sử dụng GitHub Copilot

Trong quá trình làm dự án, em sử dụng GitHub Copilot để hỗ trợ viết code.

Quy trình làm việc:

```text
Đưa yêu cầu chức năng
        ↓
Copilot đề xuất code
        ↓
Đọc và kiểm tra code
        ↓
Chạy test
        ↓
Sửa lỗi nếu cần
        ↓
Kiểm tra git diff
        ↓
Commit
```

Một vấn đề đã gặp là khi tạo service và test mới, có nguy cơ ghi đè lên file đã tồn tại.

Em đã sử dụng:

```powershell
git status
git diff
git restore
```

để phát hiện và khôi phục `roundService.js` và `roundService.test.js`.

Sau đó phần xử lý database của Round được tách thành:

```text
roundCreationService.js
roundCreationService.test.js
```

Qua quá trình này, em hiểu rằng khi sử dụng AI Coding Agent vẫn cần kiểm tra cấu trúc project, đọc code, kiểm tra diff và chạy test, thay vì chỉ lấy code do AI sinh ra rồi sử dụng trực tiếp.

---

## 12. Công việc tiếp theo

### Backend API

Tiếp tục xây dựng API cho hệ thống bảng đấu:

```text
POST /api/tournaments
GET  /api/tournaments
GET  /api/tournaments/:id

POST /api/tournaments/:id/players
GET  /api/tournaments/:id/players

POST /api/tournaments/:id/rounds
GET  /api/tournaments/:id/rounds
GET  /api/rounds/:id
```

### Frontend

Sau khi hoàn thành API, xây dựng giao diện React để người tổ chức có thể:

- Tạo bảng đấu.
- Nhập số lượng người chơi.
- Thêm người chơi.
- Xem danh sách người chơi.
- Bắt đầu Round.
- Xem các Lobby.
- Nhập kết quả 2 game.
- Xem điểm và thứ hạng.
- Theo dõi người chơi được đi tiếp.
- Theo dõi các Round cho đến bảng chung kết.

---

## 13. Kết quả hiện tại

Tính đến báo cáo ngày 04/10, phần backend nền tảng của hệ thống bảng đấu TFT đã được xây dựng và kiểm thử.

Các phần đã hoàn thành:

```text
Database
Prisma
Tournament rules
Player management
Registration
BO2 scoring
Regional tie-break
Round business logic
Round persistence
Lobby persistence
Automated tests
Git/GitHub
```

Các phần đang tiếp tục:

```text
Backend API
Frontend React
Frontend kết nối Backend
Nhập và quản lý kết quả trận đấu trên giao diện
Kiểm thử toàn bộ trên trình duyệt
```

Mục tiêu của giai đoạn tiếp theo là hoàn thiện API và xây dựng giao diện web để hệ thống có thể được sử dụng trực tiếp nhằm tạo và quản lý bảng đấu TFT.
