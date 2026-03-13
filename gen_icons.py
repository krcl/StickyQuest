#!/usr/bin/env python3
"""Generate StickyQuest '!' icons with supersampling for crisp edges."""
from PIL import Image, ImageDraw
import os

ICONS_DIR = "src-tauri/icons"
os.makedirs(ICONS_DIR, exist_ok=True)

GOLD   = (245, 197, 66, 255)
DARK   = (26, 16, 0, 255)
TRANSP = (0, 0, 0, 0)

SCALE = 4  # supersampling factor: draw at 4x, downscale for clean edges


def draw_icon(size):
    """Render icon at size*SCALE, then downscale to size with LANCZOS."""
    s = size * SCALE
    img = Image.new("RGBA", (s, s), TRANSP)
    d = ImageDraw.Draw(img)

    # Circle: tight, just 2% padding so it fills the frame
    pad = max(SCALE, int(s * 0.02))
    d.ellipse([pad, pad, s - pad - 1, s - pad - 1], fill=GOLD)

    # Exclamation mark proportions (relative to upscaled canvas)
    cx = s / 2
    bar_w  = max(SCALE * 2, int(s * 0.14))
    bar_h  = max(SCALE * 2, int(s * 0.38))
    dot_r  = max(SCALE,     int(s * 0.09))
    gap    = max(SCALE,     int(s * 0.06))

    total_h = bar_h + gap + dot_r * 2
    mark_top = int((s - total_h) / 2) - int(s * 0.02)

    bx0 = int(cx - bar_w / 2)
    bx1 = int(cx + bar_w / 2)
    by0 = mark_top
    by1 = mark_top + bar_h
    # Simple rectangle — no rounding at upscaled size to avoid tiny artefacts
    d.rectangle([bx0, by0, bx1, by1], fill=DARK)

    dy_center = by1 + gap + dot_r
    d.ellipse([int(cx - dot_r), int(dy_center - dot_r),
               int(cx + dot_r), int(dy_center + dot_r)], fill=DARK)

    # Downscale with LANCZOS for smooth, anti-aliased result
    return img.resize((size, size), Image.LANCZOS)


# --- PNG outputs ---
for size, name in [
    (32,  "tray-icon.png"),
    (32,  "32x32.png"),
    (128, "128x128.png"),
    (256, "128x128@2x.png"),
    (256, "icon.png"),
]:
    img = draw_icon(size)
    img.save(os.path.join(ICONS_DIR, name))
    print(f"{name} ({size}x{size})")

# --- Square logos (Windows Store / taskbar jump-list) ---
for size, name in [
    (30,  "Square30x30Logo.png"),
    (44,  "Square44x44Logo.png"),
    (71,  "Square71x71Logo.png"),
    (89,  "Square89x89Logo.png"),
    (107, "Square107x107Logo.png"),
    (142, "Square142x142Logo.png"),
    (150, "Square150x150Logo.png"),
    (284, "Square284x284Logo.png"),
    (310, "Square310x310Logo.png"),
    (50,  "StoreLogo.png"),
]:
    img = draw_icon(size)
    img.save(os.path.join(ICONS_DIR, name))
    print(f"{name} ({size}x{size})")

# --- Multi-size ICO: draw from 512px source, resample down ---
# Pillow's ICO saver: pass a large source image + sizes= list
big = draw_icon(512)  # high-res master for resampling
big.save(
    os.path.join(ICONS_DIR, "icon.ico"),
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48), (256, 256)],
)
print("icon.ico (16,32,48,256)")

print("Done.")
