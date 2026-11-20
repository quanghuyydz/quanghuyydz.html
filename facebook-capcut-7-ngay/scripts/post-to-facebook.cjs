// Đăng / lên lịch 14 bài trong README.md lên Fanpage qua Facebook Graph API.
//
// Biến môi trường:
//   FB_PAGE_TOKEN  Page Access Token (quyền pages_manage_posts, pages_read_engagement) – BẮT BUỘC trừ khi --dry-run
//   FB_PAGE_ID     ID Fanpage (mặc định 61570966225470)
//
// Cách dùng:
//   node facebook-capcut-7-ngay/scripts/post-to-facebook.cjs              # xem trước, không gửi gì
//   node facebook-capcut-7-ngay/scripts/post-to-facebook.cjs --check      # kiểm tra token có đúng Fanpage không
//   node facebook-capcut-7-ngay/scripts/post-to-facebook.cjs --schedule   # lên lịch mọi bài chưa tới giờ
//   node facebook-capcut-7-ngay/scripts/post-to-facebook.cjs --now 1      # đăng ngay bài số 1
//   Thêm --only 3,4 để giới hạn bài; --show 1 để xem nội dung bài 1 đúng như sẽ đăng.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const API = 'https://graph.facebook.com/v21.0';
const PAGE_ID = process.env.FB_PAGE_ID || '61570966225470';
const TOKEN = process.env.FB_PAGE_TOKEN;
const YEAR = 2026;
const TZ = '+07:00'; // giờ Việt Nam

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };

// ---- Đọc bài từ README.md ----
function parsePosts() {
  const md = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8').split('\n');
  const posts = [];
  let date = null, cur = null;
  for (const line of md) {
    const d = line.match(/^## NGÀY \d+ – .*?(\d{2})\/(\d{2})/);
    if (d) { date = `${YEAR}-${d[2]}-${d[1]}`; cur = null; continue; }
    const h = line.match(/^### Bài (\d+) · (\d{2}):(\d{2}) · (.*)$/);
    if (h) { cur = { n: +h[1], title: h[4], at: new Date(`${date}T${h[2]}:${h[3]}:00${TZ}`), image: null, body: [] }; posts.push(cur); continue; }
    if (!cur) continue;
    if (/^---\s*$/.test(line)) { cur = null; continue; }
    const img = line.match(/^!\[.*?\]\((.*?)\)/);
    if (img) { cur.image = path.join(ROOT, img[1]); continue; }
    cur.body.push(line);
  }
  // Facebook không hiển thị markdown: bỏ ** và * nhấn mạnh
  for (const p of posts) p.message = p.body.join('\n').replace(/\*\*(.+?)\*\*/g, '$1').replace(/(^|[^*])\*([^*\n]+?)\*/g, '$1$2').trim();
  return posts;
}

// ---- Gọi Graph API qua curl (curl tự dùng proxy của môi trường) ----
function graph(method, endpoint, fields = {}) {
  // token đọc từ stdin để không lộ trên dòng lệnh
  const a = method === 'GET'
    ? ['-sS', '-m', '60', '-G', `${API}/${endpoint}`, '--data-urlencode', 'access_token@-']
    : ['-sS', '-m', '120', `${API}/${endpoint}`, '-F', 'access_token=<-'];
  for (const [k, v] of Object.entries(fields)) a.push('-F', k === 'source' ? `source=@${v}` : `${k}=${v}`);
  const out = execFileSync('curl', a, { input: TOKEN, encoding: 'utf8' });
  const json = JSON.parse(out);
  if (json.error) throw new Error(`${json.error.type || 'Error'} ${json.error.code}: ${json.error.message}`);
  return json;
}
// message có thể chứa ký tự đặc biệt của curl -F (; ,) → gửi qua file tạm
function withMessageFile(msg, fn) {
  const f = path.join(require('os').tmpdir(), `fbmsg-${process.pid}.txt`);
  fs.writeFileSync(f, msg);
  try { return fn(f); } finally { fs.unlinkSync(f); }
}
function publishPhoto(p, scheduleAt) {
  return withMessageFile(p.message, (msgFile) => {
    const fields = { source: p.image, message: `<${msgFile}` };
    if (scheduleAt) Object.assign(fields, { published: 'false', scheduled_publish_time: String(Math.floor(scheduleAt / 1000)) });
    return graph('POST', `${PAGE_ID}/photos`, fields);
  });
}

// ---- Main ----
const only = val('--only') ? val('--only').split(',').map(Number) : null;
let posts = parsePosts().filter((p) => !only || only.includes(p.n));
const fmt = (d) => d.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'short' });

for (const p of posts) {
  if (!p.image || !fs.existsSync(p.image)) throw new Error(`Bài ${p.n}: không tìm thấy ảnh ${p.image}`);
}

if (!flag('--check') && !flag('--schedule') && !flag('--now')) {
  console.log(`XEM TRƯỚC (không gửi gì) – Fanpage ${PAGE_ID}\n`);
  for (const p of posts) console.log(`#${String(p.n).padStart(2)} ${fmt(p.at)}  ${p.title}  [${p.message.length} ký tự, ảnh ${path.basename(p.image)}]`);
  if (val('--show')) console.log('\n' + (posts.find((p) => p.n === Number(val('--show'))) || {}).message);
  console.log('\nThêm --check, --schedule hoặc --now <số bài> để chạy thật.');
  process.exit(0);
}
if (!TOKEN) { console.error('Thiếu biến môi trường FB_PAGE_TOKEN.'); process.exit(1); }

if (flag('--check')) {
  const me = graph('GET', `me?fields=id,name`);
  console.log(`Token thuộc: ${me.name} (${me.id})`);
  if (me.id !== PAGE_ID) console.log(`⚠ Khác FB_PAGE_ID ${PAGE_ID} – có thể bạn đang dùng User Token thay vì Page Token.`);
  process.exit(0);
}

if (flag('--now')) {
  const n = Number(val('--now'));
  const p = posts.find((x) => x.n === n);
  if (!p) { console.error(`Không có bài ${n}`); process.exit(1); }
  const r = publishPhoto(p);
  console.log(`✓ Đã đăng bài ${n}: post ${r.post_id || r.id}`);
  process.exit(0);
}

// --schedule: Facebook yêu cầu giờ hẹn cách hiện tại 10 phút → 30 ngày
const min = Date.now() + 11 * 60 * 1000;
let ok = 0;
for (const p of posts) {
  if (p.at.getTime() < min) { console.log(`– Bỏ qua bài ${p.n} (${fmt(p.at)}): đã quá giờ hoặc quá gần. Dùng --now ${p.n} nếu muốn đăng ngay.`); continue; }
  try {
    const r = publishPhoto(p, p.at.getTime());
    console.log(`✓ Bài ${p.n} hẹn ${fmt(p.at)} → ${r.id}`); ok++;
  } catch (e) { console.log(`✕ Bài ${p.n}: ${e.message}`); }
}
console.log(`\nĐã lên lịch ${ok}/${posts.length} bài. Kiểm tra trong Meta Business Suite → Lịch.`);
