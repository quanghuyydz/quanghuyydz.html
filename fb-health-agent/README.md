# 🌿 FB Health Content Agent

Agent dùng Claude để **soạn bài về sống khoẻ, cuộc sống hằng ngày, mẹo sống lành mạnh** và
**hẹn giờ đăng** lên Facebook Page: https://www.facebook.com/profile.php?id=61595044925972

## Cách hoạt động

1. `generate` — Claude soạn bài cho 7 ngày tới (mặc định 2 bài/ngày: 07:00 và 19:30 giờ VN),
   xoay vòng các chủ đề trong `config.json`, tránh trùng với bài đã đăng (`history.json`).
   Bài được lưu ở `queue.json` với `status: "draft"`.
2. Bạn đọc/sửa `queue.json`, đổi bài muốn đăng thành `"status": "approved"`.
3. `schedule` — đẩy bài đã duyệt lên Facebook dưới dạng **bài hẹn giờ** (xem được trong
   Meta Business Suite → Planner). Bài đã đẩy chuyển sang `history.json`.
4. `run` — làm cả 3 bước, tự duyệt. GitHub Actions chạy lệnh này **mỗi tối Chủ nhật 20:00**.

## Cài đặt (1 lần)

### 1. Lấy Page Access Token
1. Vào https://developers.facebook.com → **My Apps → Create App** (loại *Business*).
2. Mở **Graph API Explorer**, chọn app vừa tạo, bấm *Get User Access Token*, tick quyền:
   `pages_show_list`, `pages_manage_posts`, `pages_read_engagement`.
3. Gọi `GET /me/accounts` → tìm Page của bạn, lấy `id` (Page ID) và `access_token`.
4. Đổi sang token dài hạn (không hết hạn): dùng **Access Token Debugger → Extend Access Token**
   cho user token, rồi gọi lại `/me/accounts` bằng token dài hạn đó — Page token trả về sẽ không hết hạn.

> Lưu ý: link `profile.php?id=61595044925972` phải là **Page** (Trang), không phải trang cá nhân.
> Facebook không cho API đăng lên trang cá nhân. Page ID trong `/me/accounts` có thể khác số trong link.

### 2. Lấy Claude API key
https://console.anthropic.com → API Keys.

### 3. Thêm Secrets vào GitHub
Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Tên | Giá trị |
|---|---|
| `ANTHROPIC_API_KEY` | khoá Claude |
| `FB_PAGE_ID` | Page ID |
| `FB_PAGE_TOKEN` | Page Access Token |

### 4. Chạy thử
Tab **Actions → FB Health Content Agent → Run workflow**, chọn `generate` để xem bài trước,
hoặc `run` để soạn và hẹn giờ luôn.

## Chạy trên máy

```bash
cd fb-health-agent
pip install -r requirements.txt
export ANTHROPIC_API_KEY=... FB_PAGE_ID=... FB_PAGE_TOKEN=...
python agent.py generate   # soạn bài -> queue.json
python agent.py schedule   # hẹn giờ các bài approved
python agent.py list       # xem bài đang hẹn giờ trên Page
```

## Tuỳ chỉnh (`config.json`)
- `post_times`: khung giờ đăng mỗi ngày.
- `days_ahead`: soạn trước bao nhiêu ngày (Facebook cho hẹn tối đa 30 ngày).
- `pillars`, `formats`, `tone`, `hashtags`: chủ đề, định dạng, giọng văn.
- `model`: model Claude dùng để viết.

## An toàn nội dung
Prompt yêu cầu chỉ đưa thông tin phổ thông, không chẩn đoán, không khuyên thuốc/TPCN,
không hứa hẹn kết quả phi thực tế. Nên dùng chế độ `generate` + duyệt tay trong vài tuần đầu.
