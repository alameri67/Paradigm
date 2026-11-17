"""White studio portrait -> transparent cutout for the dark person card.

Removes only smooth, near-white background reached from the top and upper sides, so white coats
are kept. The photos already fade to white at the bottom; that band is un-blended from white
and faded out, so it turns transparent instead of leaving a pale haze.
"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def cutout(src, dst, size=640):
    im = Image.open(src).convert("RGB").resize((size, size), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32)
    mn, mx = a.min(2), a.max(2)
    lum = np.asarray(im.convert("L").filter(ImageFilter.GaussianBlur(1.5))).astype(np.float32)
    gy, gx = np.gradient(lum)
    grad = np.hypot(gx, gy)
    cand = ((mn > 238) & (mx - mn < 14) & (grad < 3.5)).astype(np.uint8) * 255
    m = Image.fromarray(cand, "L").copy()
    px = m.load()
    w, h = m.size
    seeds = [(x, 0) for x in range(0, w, 3)] + [(0, y) for y in range(0, int(h * 0.62), 3)] + [(w - 1, y) for y in range(0, int(h * 0.62), 3)]
    for s in seeds:
        if px[s] == 255:
            ImageDraw.floodfill(m, s, 128, thresh=0)
    bg = np.asarray(m) == 128
    edge = np.asarray(Image.fromarray(bg.astype(np.uint8) * 255, "L").filter(ImageFilter.MaxFilter(5))) > 0
    unblend = np.clip((255 - mn) / 255 * 2.4, 0, 1)
    alpha = np.where(bg, 0.0, np.where(edge, unblend, 1.0))
    # Bottom band: the photo already fades to white here. Un-blend the white and fade out smoothly.
    yy = np.linspace(0, 1, h)[:, None]
    t = np.clip((yy - 0.72) / 0.24, 0, 1)
    fade = 1 - t * t * (3 - 2 * t)
    band = np.clip((yy - 0.66) / 0.10, 0, 1)
    alpha = np.minimum(alpha, (1 - band) + band * unblend) * fade
    alpha = np.clip(alpha, 0, 1)
    al = Image.fromarray((alpha * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(1.0))
    alf = np.asarray(al).astype(np.float32) / 255
    safe = np.maximum(alf, 1e-3)[..., None]
    # Remove the white that was mixed into semi-transparent pixels.
    rgb = np.where(alf[..., None] < 0.999, np.clip((a - (1 - alf[..., None]) * 255) / safe, 0, 255), a)
    rgb = np.where(alf[..., None] > 0.02, rgb, 0)
    Image.fromarray(np.dstack([rgb, alf * 255]).astype(np.uint8), "RGBA").save(dst, optimize=True)

if __name__ == "__main__":
    cutout(sys.argv[1], sys.argv[2])
