// Tạo 14 ảnh minh họa 1080x1350 cho lịch đăng Facebook 7 ngày.
// Chạy: node facebook-capcut-7-ngay/scripts/render-images.cjs
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const OUT = path.join(__dirname, '..', 'images');
const C = { bg: '#0E1220', card: '#171D33', line: '#262E4D', text: '#F4F6FB', mute: '#A9B2CC', lime: '#C6FF3D', coral: '#FF5A6E', sky: '#4CC9F0', gold: '#FFC93D', pink: '#FF8FB8' };

const css = `
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;height:1350px;background:${C.bg};font-family:Inter,'DejaVu Sans',sans-serif;color:${C.text};overflow:hidden;display:flex;flex-direction:column;
 background-image:radial-gradient(circle at 90% 0%,rgba(198,255,61,.10),transparent 40%),radial-gradient(circle at 0% 100%,rgba(76,201,240,.10),transparent 45%)}
.head{padding:64px 72px 0}
.tag{display:inline-block;background:${C.lime};color:${C.bg};font-weight:800;font-size:26px;padding:10px 22px;border-radius:999px;letter-spacing:1px}
h1{font-size:74px;line-height:1.08;font-weight:900;margin-top:26px;letter-spacing:-1.5px}
h1 em{font-style:normal;color:${C.lime}}
.sub{font-size:31px;color:${C.mute};margin-top:16px;line-height:1.35;font-weight:500}
.stage{flex:1;margin:36px 72px 30px;position:relative;display:flex;flex-direction:column;justify-content:center;gap:28px}
.foot{height:104px;background:#151A2E;border-top:2px solid ${C.line};display:flex;align-items:center;justify-content:space-between;padding:0 72px;font-size:27px;color:${C.mute}}
.foot b{color:${C.text};font-weight:800}
.chips{display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:center}
.chip{background:${C.card};border:2px solid ${C.line};border-radius:18px;padding:14px 22px;font-size:28px;font-weight:700}
.chip.on{background:${C.lime};color:${C.bg};border-color:${C.lime}}
.arr{color:${C.lime};font-size:34px;font-weight:900}
.card{background:${C.card};border:2px solid ${C.line};border-radius:28px}
.label{font-size:24px;color:${C.mute};font-weight:600;text-align:center;margin-top:12px}
.row{display:flex;gap:24px;align-items:center;justify-content:center}
`;

const page = ({ day, tag, title, sub, body }) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
<div class="head"><span class="tag">NGÀY ${day} · ${tag}</span><h1>${title}</h1>${sub ? `<div class="sub">${sub}</div>` : ''}</div>
<div class="stage">${body}</div>
<div class="foot"><b>#MỗiNgày1TrickCapCut</b><span>Lưu lại để dùng dần ↓</span></div></body></html>`;

// ---------- helpers ----------
const person = (c = C.sky, w = 200) => `<svg viewBox="0 0 200 260" width="${w}" height="${w * 1.3}"><circle cx="100" cy="70" r="50" fill="${c}"/><path d="M8 260C8 168 48 132 100 132S192 168 192 260Z" fill="${c}"/></svg>`;
const steps = (arr, on = arr.length - 1) => `<div class="chips">${arr.map((s, i) => `${i ? '<span class="arr">→</span>' : ''}<span class="chip${i === on ? ' on' : ''}">${s}</span>`).join('')}</div>`;
const landscape = (scale = 1) => `<svg viewBox="0 0 400 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="transform:scale(${scale});transform-origin:60% 45%">
<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9A6B"/><stop offset="1" stop-color="#FFD58A"/></linearGradient></defs>
<rect width="400" height="300" fill="url(#sk)"/><circle cx="270" cy="120" r="42" fill="#FFF3C4"/>
<polygon points="0,300 0,190 90,110 170,200 250,140 400,250 400,300" fill="#5B3A8C"/><polygon points="0,300 0,240 120,170 230,250 330,200 400,240 400,300" fill="#2E2A5E"/></svg>`;
const bars = (n, seed, h, color, w = 900) => {
  let s = seed, out = '';
  const bw = w / n;
  for (let i = 0; i < n; i++) { s = (s * 9301 + 49297) % 233280; const v = 0.2 + (s / 233280) * 0.8; const bh = v * h; out += `<rect x="${i * bw + 1}" y="${(h - bh) / 2}" width="${bw - 3}" height="${bh}" rx="2" fill="${color}"/>`; }
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${out}</svg>`;
};
const phone = (inner, w = 360) => `<div style="width:${w}px;height:${w * 2}px;border-radius:52px;background:#05070D;border:12px solid #2B3354;position:relative;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,.45)">${inner}</div>`;

// ---------- 14 bài ----------
const posts = [
  { file: 'ngay1-bai1-phu-de-tu-dong', day: 1, tag: 'PHỤ ĐỀ', title: 'Ngừng gõ phụ đề <em>từng chữ</em> đi!', sub: 'Chú thích tự động – 30 giây là xong cả video',
    body: `<div class="row" style="gap:48px">
      ${phone(`<div style="position:absolute;inset:0;background:linear-gradient(160deg,#3A4F9C,#1B2245)"></div>
        <div style="position:absolute;left:0;right:0;top:190px;display:flex;justify-content:center">${person('#8FA3E8', 240)}</div>
        <div style="position:absolute;top:30px;right:26px;width:64px;height:64px;border-radius:50%;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#fff"/><path d="M17 9l5 6M22 9l-5 6"/></svg></div>
        <div style="position:absolute;left:22px;right:22px;bottom:150px;text-align:center;font-size:38px;font-weight:900;line-height:1.15;color:#fff;-webkit-text-stroke:8px #000;paint-order:stroke fill">BẠN ĐANG XEM<br><span style="color:${C.lime}">KHÔNG TIẾNG</span> ĐÚNG KHÔNG?</div>`)}
      <div style="display:flex;flex-direction:column;gap:18px;width:430px">
        ${['Văn bản', 'Chú thích tự động', 'Chọn Tiếng Việt', 'Tạo → Xong!'].map((s, i) => `<div class="card" style="padding:22px 26px;display:flex;gap:20px;align-items:center;${i === 3 ? `background:${C.lime};color:${C.bg};border-color:${C.lime}` : ''}">
          <span style="width:54px;height:54px;flex:none;border-radius:50%;background:${i === 3 ? C.bg : C.lime};color:${i === 3 ? C.lime : C.bg};display:flex;align-items:center;justify-content:center;font-weight:900;font-size:28px">${i + 1}</span>
          <span style="font-size:32px;font-weight:800">${s}</span></div>`).join('')}
        <div style="font-size:25px;color:${C.mute};line-height:1.4;margin-top:6px">Chữ to · đậm · viền đen<br>Nhớ đọc soát tên riêng!</div>
      </div></div>` },

  { file: 'ngay1-bai2-5-loi', day: 1, tag: 'LỖI HAY GẶP', title: '5 lỗi khiến video <em>“nhìn là biết làm vội”</em>', sub: '',
    body: `<div style="display:flex;flex-direction:column;gap:18px">${[
      ['Quên xóa đoạn kết có logo', 'Xóa đoạn kết / tắt “đoạn kết mặc định”'],
      ['Hai dải đen trên dưới', 'Chọn đúng tỉ lệ 9:16 hoặc 4:5'],
      ['Mỗi cảnh một kiểu chuyển cảnh', 'Ưu tiên cắt thẳng, nhấn nhá 1–2 lần'],
      ['Nhạc nền át giọng nói', 'Nhạc 15–30 · Giọng 100'],
      ['Xuất video 720p', 'Xuất 1080p · 30fps (60fps nếu nhiều chuyển động)']].map(([a, b], i) => `
      <div class="card" style="display:flex;gap:28px;align-items:center;padding:24px 30px">
        <div style="width:78px;height:78px;flex:none;border-radius:50%;background:${C.coral};display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:900">${i + 1}</div>
        <div><div style="font-size:36px;font-weight:800">✕ ${a}</div><div style="font-size:28px;color:${C.lime};font-weight:600;margin-top:6px">✓ ${b}</div></div>
      </div>`).join('')}</div>` },

  { file: 'ngay2-bai3-keyframe-zoom', day: 2, tag: 'KEYFRAME', title: 'Biến ảnh tĩnh thành <em>video có hồn</em>', sub: 'Chỉ cần nút hình thoi ◇ (Keyframe)',
    body: `<div class="row" style="gap:30px">
      <div><div class="card" style="width:400px;height:300px;overflow:hidden;padding:0">${landscape(1)}</div><div class="label">Keyframe 1 · 100%</div></div>
      <div class="arr" style="font-size:60px">→</div>
      <div><div class="card" style="width:400px;height:300px;overflow:hidden;padding:0;position:relative">${landscape(1.2)}<div style="position:absolute;inset:18px;border:4px dashed ${C.lime};border-radius:12px"></div></div><div class="label">Keyframe 2 · 120%</div></div></div>
    <div class="card" style="padding:34px 36px">
      <div style="position:relative;height:110px">
        <div style="position:absolute;left:0;right:0;top:20px;height:80px;border-radius:14px;overflow:hidden;border:3px solid #fff">${landscape(1)}</div>
        ${[0, 100].map(p => `<div style="position:absolute;left:calc(${p}% - 22px);top:-6px;width:44px;height:44px;background:${C.lime};transform:rotate(45deg);border:5px solid ${C.bg};border-radius:6px"></div>`).join('')}
      </div>
      <div style="display:flex;justify-content:space-between;font-size:26px;color:${C.mute};margin-top:18px;font-weight:600"><span>◇ đầu ảnh</span><span>Zoom nhẹ 10–20%</span><span>◇ cuối ảnh</span></div>
    </div>` },

  { file: 'ngay2-bai4-dt-hay-pc', day: 2, tag: 'THẢO LUẬN', title: 'Edit video: <em>điện thoại</em> hay <em>máy tính</em>?', sub: 'Comment “ĐT” hoặc “PC” – xem phe nào đông hơn!',
    body: `<div class="row" style="gap:0;position:relative;align-items:stretch">
      ${[['ĐT', `<svg width="110" height="190" viewBox="0 0 110 190"><rect x="5" y="5" width="100" height="180" rx="20" fill="none" stroke="${C.sky}" stroke-width="9"/><rect x="38" y="18" width="34" height="8" rx="4" fill="${C.sky}"/></svg>`, C.sky, ['Quay xong edit luôn', 'Làm ở mọi nơi', 'Đủ cho video ngắn']],
         ['PC', `<svg width="230" height="190" viewBox="0 0 230 190"><rect x="30" y="20" width="170" height="115" rx="12" fill="none" stroke="${C.pink}" stroke-width="9"/><path d="M5 160h220l-14 20H19z" fill="${C.pink}"/></svg>`, C.pink, ['Màn hình lớn, chi tiết', 'Nhiều lớp không rối', 'Hợp video dài']]]
        .map(([k, icon, col, pros], i) => `<div class="card" style="flex:1;padding:44px 34px;display:flex;flex-direction:column;align-items:center;gap:26px;${i ? 'margin-left:30px' : ''};border-color:${col}">
          <div style="height:200px;display:flex;align-items:center">${icon}</div>
          <div style="font-size:96px;font-weight:900;color:${col};line-height:1">${k}</div>
          <div style="display:flex;flex-direction:column;gap:14px;width:100%">${pros.map(p => `<div style="font-size:29px;font-weight:600;background:${C.bg};border-radius:14px;padding:14px 18px">✓ ${p}</div>`).join('')}</div></div>`).join('')}
      <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:120px;height:120px;border-radius:50%;background:${C.lime};color:${C.bg};font-size:48px;font-weight:900;display:flex;align-items:center;justify-content:center;border:10px solid ${C.bg}">VS</div>
    </div>` },

  { file: 'ngay3-bai5-cat-khop-nhac', day: 3, tag: 'BEAT SYNC', title: 'Cắt video <em>khớp nhạc</em> tự động', sub: 'Chấm vàng = nhịp. Clip “hít” vào chấm là xong.',
    body: `<div class="card" style="padding:40px 36px">
      <div style="font-size:26px;color:${C.mute};font-weight:700;margin-bottom:14px">♪ NHẠC</div>
      ${bars(60, 7, 150, '#5B6BA8', 864)}
      <div style="position:relative;height:50px;margin-top:10px">${[0, 18, 33, 52, 70, 86].map(p => `<div style="position:absolute;left:calc(${p}% - 14px);top:10px;width:28px;height:28px;border-radius:50%;background:${C.gold};box-shadow:0 0 18px ${C.gold}"></div>`).join('')}</div>
      <div style="font-size:26px;color:${C.mute};font-weight:700;margin:18px 0 14px">▶ VIDEO</div>
      <div style="display:flex;height:120px;gap:0">${[[18, '#FF8A65'], [15, '#4DB6AC'], [19, '#9575CD'], [18, '#F06292'], [16, '#64B5F6'], [14, '#FFB74D']].map(([w, c]) => `<div style="width:${w}%;background:linear-gradient(135deg,${c},${c}99);border:4px solid #fff;border-radius:12px;margin-right:-4px"></div>`).join('')}</div>
    </div>
    ${steps(['Chạm dải nhạc', 'Nhịp', 'Tự động tạo'])}` },

  { file: 'ngay3-bai6-video-20-10', day: 3, tag: 'ĐẶC BIỆT 20/10', title: 'Video tặng <em>20/10</em> trong 10 phút', sub: 'Công thức 4 bước – không cần giỏi edit',
    body: `<div class="row" style="gap:22px;margin-bottom:10px">${[['Ngày xưa', '#F8BBD0', -6], ['Lớn lên', '#FFCC80', 3], ['Hôm nay', '#B39DDB', -3], ['♥', C.coral, 5]].map(([t, c, r]) => `
      <div style="background:#fff;padding:14px 14px 0;border-radius:8px;transform:rotate(${r}deg);box-shadow:0 18px 36px rgba(0,0,0,.4)">
        <div style="width:190px;height:190px;background:${c};display:flex;align-items:flex-end;justify-content:center;overflow:hidden">${t === '♥' ? `<span style="font-size:130px;color:#fff;align-self:center">♥</span>` : person('rgba(255,255,255,.75)', 140)}</div>
        <div style="color:#333;font-size:24px;font-weight:700;text-align:center;padding:12px 0 14px">${t === '♥' ? 'Lời cảm ơn' : t}</div></div>`).join('')}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">${['Xếp ảnh từ xưa → nay', 'Zoom nhẹ bằng keyframe ◇', 'Cắt khớp nhịp nhạc nhẹ', 'Kết bằng 1 câu thật lòng'].map((s, i) => `
      <div class="card" style="padding:22px 24px;display:flex;gap:18px;align-items:center"><span style="width:52px;height:52px;flex:none;border-radius:50%;background:${C.pink};color:${C.bg};display:flex;align-items:center;justify-content:center;font-weight:900;font-size:28px">${i + 1}</span><span style="font-size:29px;font-weight:700">${s}</span></div>`).join('')}</div>` },

  { file: 'ngay4-bai7-chu-danh-may', day: 4, tag: 'CHÚC MỪNG 20/10', title: 'Lời chúc <em>hiện từng chữ</em> như đánh máy', sub: 'Hoạt ảnh “Máy đánh chữ” + tiếng gõ phím',
    body: `<div style="border-radius:32px;height:470px;position:relative;overflow:hidden;background:linear-gradient(140deg,#FF8FB8,#B06AB3 55%,#4A3F8C)">
      ${[[70, 60, 90, '#FFD1E3'], [880, 90, 70, '#FFF0F6'], [130, 360, 60, '#FFE08A'], [820, 360, 100, '#FFC2D9'], [480, 40, 40, '#fff']].map(([x, y, r, c]) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${r}px;height:${r}px;border-radius:50%;background:${c};opacity:.5"></div>`).join('')}
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px">
        <div style="font-size:34px;font-weight:700;letter-spacing:6px;color:#fff;opacity:.9">20 · 10</div>
        <div style="font-size:66px;font-weight:900;color:#fff">Chúc mẹ luôn vu<span style="opacity:.25">i khỏe</span><span style="display:inline-block;width:6px;height:64px;background:#fff;vertical-align:-8px;margin-left:4px"></span></div>
        <div style="font-size:28px;color:#fff;opacity:.85;font-weight:600">⌨ tạch · tạch · tạch</div></div></div>
    ${steps(['Văn bản', 'Hoạt ảnh', 'Vào', 'Máy đánh chữ'])}` },

  { file: 'ngay4-bai8-phan-than', day: 4, tag: 'PHÂN THÂN', title: '<em>2 bạn</em> trong 1 khung hình', sub: 'Lớp phủ + Mặt nạ “Chia đôi” – máy phải đứng yên',
    body: `<div style="border-radius:32px;height:560px;position:relative;overflow:hidden;background:linear-gradient(180deg,#2A3563 0%,#2A3563 68%,#1C2347 68%)">
      <div style="position:absolute;left:90px;top:70px;width:200px;height:150px;border:8px solid #45528A;border-radius:10px;background:#36437A"></div>
      <div style="position:absolute;right:110px;top:110px;width:120px;height:220px;border-radius:10px;background:#3B4780"></div>
      <div style="position:absolute;left:140px;bottom:40px">${person(C.sky, 230)}</div>
      <div style="position:absolute;right:140px;bottom:40px">${person(C.sky, 230)}</div>
      <div style="position:absolute;left:150px;top:160px;background:#fff;color:${C.bg};font-size:30px;font-weight:800;padding:14px 22px;border-radius:22px">Đi ngủ thôi!</div>
      <div style="position:absolute;right:120px;top:190px;background:${C.lime};color:${C.bg};font-size:30px;font-weight:800;padding:14px 22px;border-radius:22px">1 tập nữa thôi…</div>
      <div style="position:absolute;left:50%;top:0;bottom:0;border-left:6px dashed ${C.lime}"></div>
      <div style="position:absolute;left:50%;top:22px;transform:translateX(-50%);background:${C.lime};color:${C.bg};font-size:24px;font-weight:900;padding:8px 18px;border-radius:999px">MẶT NẠ: CHIA ĐÔI</div></div>
    <div class="row" style="gap:24px"><div class="chip" style="flex:1;text-align:center">Clip 1 · track chính</div><div class="chip on" style="flex:1;text-align:center">Clip 2 · lớp phủ</div></div>` },

  { file: 'ngay5-bai9-duong-cong-toc-do', day: 5, tag: 'TỐC ĐỘ', title: 'Slow-motion <em>“điện ảnh”</em> bằng đường cong', sub: 'Tốc độ → Đường cong → Hero',
    body: `<div class="card" style="padding:30px 36px">
      <svg viewBox="0 0 860 400" width="100%">
        <line x1="40" y1="350" x2="840" y2="350" stroke="${C.line}" stroke-width="4"/><line x1="40" y1="30" x2="40" y2="350" stroke="${C.line}" stroke-width="4"/>
                <path d="M40 90 C220 90 280 300 440 300 C600 300 660 90 840 90" fill="none" stroke="${C.lime}" stroke-width="12" stroke-linecap="round"/>
        ${[[40, 90], [440, 300], [840, 90]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="${C.bg}" stroke="${C.lime}" stroke-width="7"/>`).join('')}
        <text x="80" y="60" fill="${C.text}" font-size="32" font-weight="800">NHANH</text><text x="680" y="60" fill="${C.text}" font-size="32" font-weight="800">NHANH</text>
        <rect x="330" y="200" width="220" height="56" rx="28" fill="${C.gold}"/><text x="440" y="238" fill="${C.bg}" font-size="30" font-weight="900" text-anchor="middle">CHẬM ★</text>
        <text x="440" y="390" fill="${C.mute}" font-size="24" font-weight="600" text-anchor="middle">đúng khoảnh khắc đẹp nhất</text></svg></div>
    <div class="chips">${['Montage', 'Hero', 'Bullet', 'Jump Cut', 'Flash In', 'Flash Out'].map(s => `<span class="chip${s === 'Hero' ? ' on' : ''}" style="font-size:25px;padding:12px 16px">${s}</span>`).join('')}</div>
    <div class="label" style="font-size:27px">Mẹo: quay 60fps để slow-motion mượt</div>` },

  { file: 'ngay5-bai10-video-viral', day: 5, tag: 'SỰ THẬT', title: 'Video viral <em>không cần</em> máy quay xịn', sub: 'Nó cần 3 thứ – edit được hết trên điện thoại',
    body: `<div class="card" style="padding:28px 34px 20px">
      <svg viewBox="0 0 860 330" width="100%">
        <rect x="60" y="20" width="110" height="270" fill="${C.lime}" opacity=".12"/><text x="115" y="50" fill="${C.lime}" font-size="22" font-weight="800" text-anchor="middle">3 GIÂY</text><text x="115" y="76" fill="${C.lime}" font-size="22" font-weight="800" text-anchor="middle">ĐẦU</text>
        <line x1="60" y1="290" x2="840" y2="290" stroke="${C.line}" stroke-width="4"/><line x1="60" y1="20" x2="60" y2="290" stroke="${C.line}" stroke-width="4"/>
        <path d="M60 40 C110 60 140 210 220 235 S600 260 840 270" fill="none" stroke="${C.coral}" stroke-width="9" stroke-linecap="round"/>
        <path d="M60 40 C120 50 160 90 260 110 S600 150 840 165" fill="none" stroke="${C.lime}" stroke-width="9" stroke-linecap="round"/>
        <text x="600" y="140" fill="${C.lime}" font-size="26" font-weight="800">Vào thẳng vấn đề</text><text x="600" y="250" fill="${C.coral}" font-size="26" font-weight="800">Chào hỏi dài dòng</text>
        <text x="0" y="160" fill="${C.mute}" font-size="20" font-weight="700" transform="rotate(-90 20 160)">người xem còn lại</text>
        <text x="840" y="320" fill="${C.mute}" font-size="20" font-weight="600" text-anchor="end">*biểu đồ minh họa</text></svg></div>
    <div style="display:flex;flex-direction:column;gap:14px">${['Hook mạnh trong 3 giây đầu', 'Cắt hết khoảng lặng, “à… ừm…”', 'Phụ đề + tiêu đề trên màn hình'].map(s => `
      <div class="card" style="padding:20px 26px;display:flex;gap:18px;align-items:center"><span style="width:46px;height:46px;flex:none;border-radius:12px;background:${C.lime};color:${C.bg};display:flex;align-items:center;justify-content:center;font-weight:900;font-size:30px">✓</span><span style="font-size:31px;font-weight:700">${s}</span></div>`).join('')}</div>` },

  { file: 'ngay6-bai11-xoa-phong', day: 6, tag: 'XÓA NỀN', title: 'Xóa phông <em>không cần</em> phông xanh', sub: 'Lớp phủ → Xóa nền → Tự động xóa',
    body: `<div class="row" style="gap:16px">${[
      ['Gốc', `background:#6D5A4E;`, `<div style="position:absolute;left:20px;top:40px;width:90px;height:120px;background:#8C7563;border-radius:6px"></div><div style="position:absolute;right:16px;top:70px;width:70px;height:200px;background:#4F4038;border-radius:6px"></div><div style="position:absolute;left:30px;bottom:0;width:240px;height:60px;background:#5A4A40"></div>`],
      ['Đã xóa nền', `background-color:#fff;background-image:linear-gradient(45deg,#d9d9d9 25%,transparent 25%,transparent 75%,#d9d9d9 75%),linear-gradient(45deg,#d9d9d9 25%,transparent 25%,transparent 75%,#d9d9d9 75%);background-size:40px 40px;background-position:0 0,20px 20px;`, ''],
      ['Nền mới', `background:linear-gradient(180deg,#5EC8F2 0%,#BDEBFF 55%,#F3D9A4 55%,#E8C27D 100%);`, `<div style="position:absolute;right:40px;top:40px;width:70px;height:70px;border-radius:50%;background:#FFF3B0"></div><div style="position:absolute;left:0;right:0;top:52%;height:26px;background:#3AA0D6"></div>`]]
      .map(([t, bg, deco], i) => `${i ? '<div class="arr" style="font-size:44px">→</div>' : ''}<div><div style="width:270px;height:430px;border-radius:24px;position:relative;overflow:hidden;${bg}border:3px solid ${i === 2 ? C.lime : C.line}">${deco}<div style="position:absolute;left:50%;bottom:-10px;transform:translateX(-50%)">${person('#F2A65A', 210)}</div></div><div class="label" style="${i === 2 ? `color:${C.lime}` : ''}">${t}</div></div>`).join('')}</div>
    <div class="card" style="padding:22px 28px;font-size:28px;line-height:1.5;font-weight:600;text-align:center">Nền đơn giản · đủ sáng · áo khác màu nền<br><span style="color:${C.mute}">Có phông xanh? Dùng <b style="color:${C.lime}">Phím màu (Chroma key)</b></span></div>` },

  { file: 'ngay6-bai12-dung-hinh', day: 6, tag: 'ĐÓN HALLOWEEN', title: 'Dừng hình <em>giới thiệu nhân vật</em>', sub: 'Đóng băng + chữ + hiệu ứng âm thanh',
    body: `<div style="border-radius:32px;height:540px;position:relative;overflow:hidden;background:repeating-linear-gradient(135deg,#232B4F 0 22px,#1E2546 22px 44px)">
      <div style="position:absolute;left:120px;bottom:-20px;filter:grayscale(1) brightness(1.3)">${person('#9AA4C4', 320)}</div>
      <div style="position:absolute;right:40px;top:40px;display:flex;gap:12px"><span style="width:22px;height:70px;background:#fff;border-radius:4px"></span><span style="width:22px;height:70px;background:#fff;border-radius:4px"></span></div>
      <div style="position:absolute;right:50px;top:150px;width:520px;transform:rotate(-4deg);background:${C.gold};color:#111;border:7px solid #111;border-radius:12px;padding:26px 30px;box-shadow:12px 12px 0 #111">
        <div style="font-size:26px;font-weight:800;letter-spacing:2px">NHÂN VẬT:</div>
        <div style="font-size:72px;font-weight:900;line-height:1">SẾP</div>
        <div style="font-size:27px;font-weight:700;margin-top:14px;line-height:1.3">Kỹ năng đặc biệt:<br>giao việc lúc 17h59</div></div>
      <div style="position:absolute;left:40px;top:40px;background:${C.coral};font-size:26px;font-weight:900;padding:8px 18px;border-radius:8px">❚❚ FREEZE</div></div>
    <div style="display:flex;height:80px;border-radius:14px;overflow:hidden;border:3px solid #fff">
      <div style="flex:3;background:#5B6BA8;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700">clip</div>
      <div style="flex:2;background:repeating-linear-gradient(45deg,${C.gold} 0 14px,#E0A800 14px 28px);color:#111;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900">ĐÓNG BĂNG 3s</div>
      <div style="flex:3;background:#5B6BA8;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700">clip</div></div>` },

  { file: 'ngay7-bai13-am-thanh', day: 7, tag: 'ÂM THANH', title: 'Âm thanh rè, người xem <em>lướt ngay</em>', sub: 'Giảm tiếng ồn · Cân âm lượng · Nhạc mờ dần',
    body: `<div class="row" style="gap:24px">${[['TRƯỚC', C.coral, 3, 'rè · ồn · vang'], ['SAU', C.lime, 11, 'sạch · rõ lời']].map(([t, c, s, d]) => `
      <div class="card" style="flex:1;padding:26px"><div style="display:flex;justify-content:space-between;font-size:28px;font-weight:900;color:${c};margin-bottom:14px"><span>${t}</span><span style="font-size:22px;color:${C.mute};font-weight:600">${d}</span></div>
      ${t === 'TRƯỚC' ? bars(38, s, 170, c, 410) : `<svg width="410" height="170" viewBox="0 0 410 170">${Array.from({ length: 38 }, (_, i) => { const v = i % 9 < 6 ? 20 + 110 * Math.abs(Math.sin(i * 0.9)) : 6; return `<rect x="${i * 10.8 + 1}" y="${(170 - v) / 2}" width="7.8" height="${v}" rx="2" fill="${c}"/>`; }).join('')}</svg>`}</div>`).join('')}</div>
    <div class="card" style="padding:32px 36px;display:flex;flex-direction:column;gap:26px">${[['Giọng nói', 100, C.sky], ['Nhạc nền', 20, C.pink]].map(([n, v, c]) => `
      <div style="display:flex;align-items:center;gap:24px"><span style="width:200px;font-size:30px;font-weight:800">${n}</span>
        <div style="flex:1;height:16px;border-radius:8px;background:${C.bg};position:relative"><div style="width:${v / 1.5}%;height:100%;border-radius:8px;background:${c}"></div><div style="position:absolute;left:calc(${v / 1.5}% - 20px);top:-12px;width:40px;height:40px;border-radius:50%;background:#fff"></div></div>
        <span style="width:80px;text-align:right;font-size:34px;font-weight:900;color:${c}">${v}</span></div>`).join('')}
      <div style="font-size:27px;color:${C.mute};font-weight:600;text-align:center">+ Mờ dần nhạc 1–2 giây ở đầu và cuối</div></div>` },

  { file: 'ngay7-bai14-tong-ket', day: 7, tag: 'TỔNG KẾT', title: '7 ngày – <em>13 bài học</em> CapCut', sub: 'Thử thách: làm 1 video, khoe ở comment!',
    body: `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">${['Phụ đề tự động', '5 lỗi cần tránh', 'Keyframe zoom', 'ĐT hay PC?', 'Cắt khớp nhạc', 'Video 20/10', 'Chữ đánh máy', 'Phân thân', 'Đường cong tốc độ', 'Hook 3 giây', 'Xóa phông', 'Dừng hình', 'Âm thanh sạch'].map((s, i) => `
      <div class="card" style="padding:18px 18px;height:132px;display:flex;flex-direction:column;justify-content:space-between;border-radius:20px"><span style="font-size:30px;font-weight:900;color:${C.lime}">${String(i + 1).padStart(2, '0')}</span><span style="font-size:24px;font-weight:700;line-height:1.2">${s}</span></div>`).join('')}
      <div style="grid-column:span 3;background:${C.lime};color:${C.bg};border-radius:20px;padding:18px 24px;display:flex;flex-direction:column;justify-content:center;gap:6px">
        <span style="font-size:26px;font-weight:900">TUẦN SAU HỌC GÌ? COMMENT:</span>
        <span style="font-size:24px;font-weight:700">A. Màu điện ảnh · B. Chuyển cảnh mượt · C. Giọng đọc AI</span></div></div>` },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const p = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const post of posts) {
    await p.setContent(page(post), { waitUntil: 'load' });
    await p.screenshot({ path: path.join(OUT, post.file + '.png') });
    console.log('✓', post.file);
  }
  await browser.close();
})();
