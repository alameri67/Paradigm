#!/usr/bin/env python3
"""Turns a white-background portrait into a grey cut-out that blends into the dark worker card.

Usage: python3 scripts/make-portrait-cutout.py public/portraits/health.jpg
Writes public/portraits/health-cutout.png next to the input.

How it works: the white background is found by flooding inwards from the image edges
through near-white pixels, so light clothing inside the figure (like a white coat) is kept.
The background becomes transparent with a soft edge, the picture is turned grey (so the
card's mood colour can't tint it oddly), and the bottom fades out so it melts into the card.
"""
import sys
from collections import deque
from PIL import Image, ImageFilter, ImageOps

src = sys.argv[1]
im = Image.open(src).convert("RGB")
w, h = im.size
grey = ImageOps.grayscale(im)
px = grey.load()

# 1. Flood fill the near-white background from every edge pixel.
T = 232
bg = Image.new("L", (w, h), 0)
bp = bg.load()
q = deque()
for x in range(w):
    q.extend([(x, 0), (x, h - 1)])
for y in range(h):
    q.extend([(0, y), (w - 1, y)])
while q:
    x, y = q.popleft()
    if bp[x, y] or px[x, y] < T:
        continue
    bp[x, y] = 255
    if x > 0: q.append((x - 1, y))
    if x < w - 1: q.append((x + 1, y))
    if y > 0: q.append((x, y - 1))
    if y < h - 1: q.append((x, y + 1))

# 2. Alpha: opaque inside the figure; in the background, fade by how far from white the pixel is.
alpha = Image.new("L", (w, h))
ap = alpha.load()
for y in range(h):
    for x in range(w):
        if bp[x, y]:
            ap[x, y] = max(0, min(255, int((255 - px[x, y]) * 255 / (255 - T))))
        else:
            ap[x, y] = 255
alpha = alpha.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.5))

# 3. Fade the bottom third so the figure melts into the card.
ap = alpha.load()
start = int(h * 0.62)
for y in range(start, h):
    k = 1 - (y - start) / (h - start)
    k = k * k * (3 - 2 * k)
    for x in range(w):
        ap[x, y] = int(ap[x, y] * k)

# 4. Slightly darker grey so a light coat doesn't glare against the dark card.
grey = grey.point(lambda v: int(v * 0.88))
out = Image.merge("LA", (grey, alpha))
dst = src.rsplit(".", 1)[0] + "-cutout.png"
out.save(dst, optimize=True)
print("wrote", dst, out.size)
