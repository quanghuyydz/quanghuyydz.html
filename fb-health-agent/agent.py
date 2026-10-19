"""Agent tạo nội dung "sống khoẻ" và lên lịch đăng lên Facebook Page.

Lệnh:
  python agent.py generate   # Claude viết bài cho N ngày tới -> queue.json (để duyệt)
  python agent.py schedule   # Đẩy các bài "approved" trong queue.json lên Facebook (hẹn giờ)
  python agent.py run        # generate + tự duyệt + schedule (dùng cho chạy tự động)
  python agent.py list       # Xem các bài đã hẹn giờ trên Page

Biến môi trường:
  ANTHROPIC_API_KEY  - khoá API Claude
  FB_PAGE_ID         - ID của Page (vd 61595044925972)
  FB_PAGE_TOKEN      - Page Access Token (quyền pages_manage_posts, pages_read_engagement)
"""

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

import anthropic

ROOT = Path(__file__).parent
CONFIG = json.loads((ROOT / "config.json").read_text(encoding="utf-8"))
QUEUE_FILE = ROOT / "queue.json"
HISTORY_FILE = ROOT / "history.json"
TZ = timezone(timedelta(hours=CONFIG["timezone_offset_hours"]))

SYSTEM_PROMPT = f"""Bạn là content creator cho Facebook Page "{CONFIG['page_name']}" về sống khoẻ,
cuộc sống hằng ngày và mẹo sống lành mạnh. Viết bằng tiếng Việt có dấu, giọng văn: {CONFIG['tone']}.

Quy tắc:
- Mở đầu bằng 1 câu "hook" gây tò mò trong 1 dòng.
- Thân bài ngắn gọn, dễ đọc trên điện thoại, xuống dòng nhiều, dùng emoji vừa phải.
- Kết bằng 1 câu kêu gọi tương tác (hỏi ý kiến, mời bình luận, chia sẻ).
- 150-300 từ. Cuối bài 3-5 hashtag, ưu tiên: {' '.join(CONFIG['hashtags'])}.
- Chỉ đưa thông tin phổ thông, an toàn, có cơ sở khoa học. KHÔNG chẩn đoán bệnh, KHÔNG
  khuyên dùng thuốc/thực phẩm chức năng, KHÔNG hứa hẹn kết quả kiểu "giảm 5kg trong 3 ngày".
  Với chủ đề liên quan bệnh lý, nhắc người đọc tham khảo ý kiến bác sĩ.
- Không lặp lại chủ đề đã đăng gần đây."""

POST_TOOL = {
    "name": "save_posts",
    "description": "Lưu danh sách bài viết Facebook đã soạn.",
    "input_schema": {
        "type": "object",
        "properties": {
            "posts": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "topic": {"type": "string", "description": "Chủ đề ngắn gọn (dùng để tránh trùng)"},
                        "pillar": {"type": "string"},
                        "message": {"type": "string", "description": "Nội dung bài đăng hoàn chỉnh"},
                        "image_idea": {"type": "string", "description": "Gợi ý ảnh minh hoạ"},
                    },
                    "required": ["topic", "pillar", "message", "image_idea"],
                },
            }
        },
        "required": ["posts"],
    },
}


def load_json(path, default):
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else default


def save_json(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def upcoming_slots():
    """Các khung giờ đăng trong N ngày tới, bắt đầu từ ngày mai."""
    today = datetime.now(TZ).date()
    slots = []
    for d in range(1, CONFIG["days_ahead"] + 1):
        day = today + timedelta(days=d)
        for t in CONFIG["post_times"]:
            h, m = map(int, t.split(":"))
            slots.append(datetime(day.year, day.month, day.day, h, m, tzinfo=TZ))
    return slots


def generate():
    queue = load_json(QUEUE_FILE, [])
    history = load_json(HISTORY_FILE, [])
    taken = {p["scheduled_at"] for p in queue + history}
    slots = [s for s in upcoming_slots() if s.isoformat() not in taken]
    if not slots:
        print("Không còn khung giờ trống trong kỳ tới.")
        return queue

    recent_topics = [p["topic"] for p in (history + queue)[-60:]]
    prompt = (
        f"Hãy soạn {len(slots)} bài đăng Facebook, mỗi bài cho một khung giờ sau:\n"
        + "\n".join(f"- {s.strftime('%A %d/%m %H:%M')}" for s in slots)
        + "\n\nXoay vòng các trụ cột nội dung:\n"
        + "\n".join(f"- {p}" for p in CONFIG["pillars"])
        + "\n\nĐa dạng định dạng:\n"
        + "\n".join(f"- {f}" for f in CONFIG["formats"])
        + "\n\nBài buổi sáng nên nhẹ nhàng, tạo năng lượng; bài buổi tối nên thư giãn hoặc tương tác."
        + "\n\nCác chủ đề đã dùng gần đây (tránh lặp):\n"
        + ("\n".join(f"- {t}" for t in recent_topics) or "(chưa có)")
        + "\n\nGọi tool save_posts với đúng số bài, theo đúng thứ tự khung giờ."
    )

    client = anthropic.Anthropic()
    resp = client.messages.create(
        model=CONFIG["model"],
        max_tokens=16000,
        system=SYSTEM_PROMPT,
        tools=[POST_TOOL],
        tool_choice={"type": "tool", "name": "save_posts"},
        messages=[{"role": "user", "content": prompt}],
    )
    posts = next(b.input["posts"] for b in resp.content if b.type == "tool_use")

    for slot, post in zip(slots, posts):
        queue.append({**post, "scheduled_at": slot.isoformat(), "status": "draft"})
    save_json(QUEUE_FILE, queue)
    print(f"Đã soạn {min(len(slots), len(posts))} bài -> {QUEUE_FILE.name}")
    print('Duyệt/sửa nội dung rồi đổi "status" thành "approved" trước khi chạy schedule.')
    return queue


def graph(method, path, params):
    version = CONFIG["graph_api_version"]
    params = {**params, "access_token": os.environ["FB_PAGE_TOKEN"]}
    data = urllib.parse.urlencode(params).encode()
    url = f"https://graph.facebook.com/{version}/{path}"
    if method == "GET":
        req = urllib.request.Request(f"{url}?{data.decode()}")
    else:
        req = urllib.request.Request(url, data=data, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"Facebook API lỗi {e.code}: {e.read().decode()}") from None


def schedule(auto_approve=False):
    queue = load_json(QUEUE_FILE, [])
    history = load_json(HISTORY_FILE, [])
    page_id = os.environ["FB_PAGE_ID"]
    now = datetime.now(TZ)
    remaining = []

    for post in queue:
        if auto_approve and post["status"] == "draft":
            post["status"] = "approved"
        when = datetime.fromisoformat(post["scheduled_at"])
        if post["status"] != "approved":
            remaining.append(post)
            continue
        # Facebook chỉ cho hẹn giờ từ 10 phút đến 30 ngày tới.
        if not (now + timedelta(minutes=10) < when < now + timedelta(days=30)):
            print(f"Bỏ qua (ngoài khung 10 phút - 30 ngày): {post['topic']} @ {when}")
            remaining.append(post)
            continue
        res = graph("POST", f"{page_id}/feed", {
            "message": post["message"],
            "published": "false",
            "scheduled_publish_time": int(when.timestamp()),
        })
        post.update(status="scheduled", fb_post_id=res.get("id"))
        history.append(post)
        print(f"✅ Đã hẹn giờ {when:%d/%m %H:%M}: {post['topic']} (id {res.get('id')})")

    save_json(QUEUE_FILE, remaining)
    save_json(HISTORY_FILE, history)


def list_scheduled():
    res = graph("GET", f"{os.environ['FB_PAGE_ID']}/scheduled_posts",
                {"fields": "id,message,scheduled_publish_time"})
    for p in res.get("data", []):
        when = datetime.fromtimestamp(int(p["scheduled_publish_time"]), TZ)
        print(f"{when:%d/%m %H:%M}  {p['id']}  {p.get('message', '')[:60]!r}")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "help"
    if cmd == "generate":
        generate()
    elif cmd == "schedule":
        schedule()
    elif cmd == "run":
        generate()
        schedule(auto_approve=True)
    elif cmd == "list":
        list_scheduled()
    else:
        print(__doc__)
