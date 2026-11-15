# Tự nghe giọng tiếng Việt và ghi file phụ đề .srt (dòng ngắn tối đa 7 chữ).
# Cần cài trước: python3 -m pip install --user faster-whisper
# Cách dùng:   python3 phu_de_whisper.py <video hoặc file tiếng> <file .srt ra> [mô hình]
# Mô hình mặc định "small" (tải khoảng 500 MB lần đầu). Máy yếu dùng "base" (nhanh hơn, kém chính xác hơn).
import sys

def giay(t):
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

def main():
    if len(sys.argv) < 3:
        print("Cách dùng: python3 phu_de_whisper.py <video> <ra.srt> [small|base|medium]")
        sys.exit(1)
    vao, ra = sys.argv[1], sys.argv[2]
    mo_hinh = sys.argv[3] if len(sys.argv) > 3 else "small"
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        print("CHUA_CAI: chạy python3 -m pip install --user faster-whisper")
        sys.exit(2)
    model = WhisperModel(mo_hinh, device="cpu", compute_type="int8")
    doan, _ = model.transcribe(vao, language="vi", word_timestamps=True, vad_filter=True)
    dong = []  # (bắt đầu, kết thúc, chữ)
    for d in doan:
        tu = [w for w in (d.words or []) if w.word.strip()]
        if not tu:
            if d.text.strip():
                dong.append((d.start, d.end, d.text.strip()))
            continue
        cum = []
        for w in tu:
            cum.append(w)
            het_cau = w.word.strip()[-1:] in ".,?!;:"
            if len(cum) >= 7 or het_cau:
                dong.append((cum[0].start, cum[-1].end, " ".join(x.word.strip() for x in cum)))
                cum = []
        if cum:
            dong.append((cum[0].start, cum[-1].end, " ".join(x.word.strip() for x in cum)))
    with open(ra, "w", encoding="utf-8") as f:
        for i, (a, b, chu) in enumerate(dong, 1):
            if b - a < 0.7:
                b = a + 0.7
            if i < len(dong) and b > dong[i][0]:
                b = max(a + 0.3, dong[i][0])
            f.write(f"{i}\n{giay(a)} --> {giay(b)}\n{chu}\n\n")
    print(f"XONG: {len(dong)} dòng phụ đề → {ra}")

if __name__ == "__main__":
    main()
