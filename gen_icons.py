#!/usr/bin/env python3
"""Generate StickyQuest '!' icons: gold circle with dark exclamation mark."""
from PIL import Image, ImageDraw, ImageFont
import os

ICONS_DIR = "src-tauri/icons"
os.makedirs(ICONS_DIR, exist_ok=True)

GOLD   = (245, 197, 66, 255)
DARK   = (26, 16, 0, 255)
TRANSP = (0, 0, 0, 0)


def draw_icon(size):
    img = Image.new("RGBA", (size, size), TRANSP)
    d = ImageDraw.Draw(img)

    # Circle padding: 6% on each side
    pad = max(1, int(size * 0.06))
    d.ellipse([pad, pad, size - pad - 1, size - pad - 1], fill=GOLD)

    # Exclamation mark proportions
    cx = size / 2
    bar_w  = max(2, int(size * 0.14))   # width of vertical bar
    bar_h  = max(2, int(size * 0.38))   # height of bar
    dot_r  = max(1, int(size * 0.09))   # radius of dot
    gap    = max(1, int(size * 0.06))   # gap between bar bottom and dot top

    # Vertical center of the whole mark sits at 54% of circle height
    total_h = bar_h + gap + dot_r * 2
    mark_top = int((size - total_h) / 2) - int(size * 0.02)

    # Bar
    bx0 = int(cx - bar_w / 2)
    bx1 = int(cx + bar_w / 2)
    by0 = mark_top
    by1 = mark_top + bar_h
    d.rounded_rectangle([bx0, by0, bx1, by1], radius=max(1, bar_w // 3), fill=DARK)

    # Dot
    dy_center = by1 + gap + dot_r
    d.ellipse([int(cx - dot_r), int(dy_center - dot_r),
               int(cx + dot_r), int(dy_center + dot_r)], fill=DARK)

    return img


# --- tray icon (32x32) ---
tray = draw_icon(32)
tray.save(os.path.join(ICONS_DIR, "tray-icon.png"))
print("tray-icon.png (32x32)")

# --- standard PNG replacements ---
for size, name in [
    (32,  "32x32.png"),
    (128, "128x128.png"),
    (256, "128x128@2x.png"),
    (256, "icon.png"),
]:
    img = draw_icon(size)
    img.save(os.path.join(ICONS_DIR, name))
    print(f"{name} ({size}x{size})")

# --- icon.ico (multi-size: 16, 32, 48, 256) ---
sizes = [16, 32, 48, 256]
images = [draw_icon(s) for s in sizes]
images[0].save(
    os.path.join(ICONS_DIR, "icon.ico"),
    format="ICO",
    sizes=[(s, s) for s in sizes],
    append_images=images[1:],
)
print("icon.ico (16,32,48,256)")

print("Done.")
