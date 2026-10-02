#!/usr/bin/env python3
"""Tordilla favicon generator.

A stylized potato-chip mark: a corn-gold crisp with an irregular wavy edge and
a folded crease, on a forest-green rounded tile. Colours come straight from the
tordilla-web design tokens (app/globals.css).

One shared geometry drives both the SVG master and every PNG/ICO render, so the
vector and raster assets always match.
"""
import math, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.dirname(os.path.abspath(__file__))
DESIGN = 512
S = 4

# ---- palette (globals.css tokens) ------------------------------------------
LEAF_600 = (31, 106, 76)
LEAF_800 = (16, 56, 42)
LEAF_900 = (10, 36, 27)
CORN_200 = (251, 230, 168)
CORN_300 = (248, 212, 119)
CORN_400 = (244, 193, 74)
CORN_600 = (208, 138, 14)
CORN_700 = (162, 104, 10)
PAPRIKA = (221, 79, 36)

# ---- geometry --------------------------------------------------------------
CX, CY = 256.0, 296.0
RT = 176.0                    # triangle circumradius
CORNER = 52.0                 # corner rounding (trim from each vertex)
BOW = 9.0                     # slight outward bow on the edges
TILT = math.radians(-8)
N_RASTER = 900
N_SVG = 240


def chip_points(n=N_RASTER, scale=1.0):
    """Rounded triangular tortilla chip, pointing up, with slightly bowed edges."""
    verts = []
    for a in (-90, 30, 150):
        rad = math.radians(a)
        verts.append((RT * math.cos(rad), RT * math.sin(rad)))
    cen = (sum(v[0] for v in verts) / 3, sum(v[1] for v in verts) / 3)

    def unit(v):
        l = math.hypot(*v) or 1.0
        return (v[0] / l, v[1] / l)

    corners = []
    for i in range(3):
        C, P, N = verts[i], verts[(i - 1) % 3], verts[(i + 1) % 3]
        din = unit((C[0] - P[0], C[1] - P[1]))
        dout = unit((N[0] - C[0], N[1] - C[1]))
        A = (C[0] - din[0] * CORNER, C[1] - din[1] * CORNER)
        B = (C[0] + dout[0] * CORNER, C[1] + dout[1] * CORNER)
        corners.append((A, B, C))

    pts, cs, es = [], 18, 46
    for i in range(3):
        A, B, C = corners[i]
        for s in range(cs + 1):                     # rounded corner
            u = s / cs
            x = (1 - u) ** 2 * A[0] + 2 * (1 - u) * u * C[0] + u * u * B[0]
            y = (1 - u) ** 2 * A[1] + 2 * (1 - u) * u * C[1] + u * u * B[1]
            pts.append((x, y))
        A2 = corners[(i + 1) % 3][0]                 # edge B_i -> A_{i+1}
        ex, ey = A2[0] - B[0], A2[1] - B[1]
        L = math.hypot(ex, ey) or 1.0
        nx, ny = -ey / L, ex / L
        mx, my = (B[0] + A2[0]) / 2, (B[1] + A2[1]) / 2
        if (mx - cen[0]) * nx + (my - cen[1]) * ny < 0:
            nx, ny = -nx, -ny
        for s in range(1, es):
            u = s / es
            pts.append((B[0] + ex * u + nx * BOW * math.sin(math.pi * u),
                        B[1] + ey * u + ny * BOW * math.sin(math.pi * u)))

    out = []
    for x, y in pts:
        xr = x * math.cos(TILT) - y * math.sin(TILT)
        yr = x * math.sin(TILT) + y * math.cos(TILT)
        out.append((CX + xr * scale, CY + yr * scale))
    return out


# ---- helpers ---------------------------------------------------------------
def gradient(size, c0, c1, angle_deg=125.0, gamma=1.0):
    x = np.linspace(0, 1, size, dtype=np.float32)
    X, Y = np.meshgrid(x, x)
    a = math.radians(angle_deg)
    t = X * math.cos(a) + Y * math.sin(a)
    t = ((t - t.min()) / (t.max() - t.min())) ** gamma
    arr = np.zeros((size, size, 3), dtype=np.uint8)
    for ch in range(3):
        arr[:, :, ch] = (c0[ch] + (c1[ch] - c0[ch]) * t).astype(np.uint8)
    return Image.fromarray(arr, "RGB")


def catmull_to_bezier_path(pts):
    n = len(pts)
    d = [f"M{pts[0][0]:.2f},{pts[0][1]:.2f}"]
    for i in range(n):
        p0, p1 = pts[(i - 1) % n], pts[i]
        p2, p3 = pts[(i + 1) % n], pts[(i + 2) % n]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d.append(f"C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}")
    d.append("Z")
    return " ".join(d)


def render(size, simple=False):
    M = size * S
    k = M / DESIGN
    pts = [(x * k, y * k) for x, y in chip_points()]

    # --- rounded tile -------------------------------------------------
    tile_mask = Image.new("L", (M, M), 0)
    ImageDraw.Draw(tile_mask).rounded_rectangle([0, 0, M - 1, M - 1],
                                                radius=int(112 * k), fill=255)
    base = Image.new("RGBA", (M, M), (0, 0, 0, 0))
    base.paste(gradient(M, LEAF_600, LEAF_800, angle_deg=125), (0, 0), tile_mask)
    sheen = gradient(M, (255, 255, 255), LEAF_600, angle_deg=90, gamma=2.8)
    sheen_a = Image.new("L", (M, M), 0)
    ImageDraw.Draw(sheen_a).ellipse([-M * .3, -M * .7, M * 1.3, M * .40], fill=42)
    sheen_a = Image.composite(sheen_a.filter(ImageFilter.GaussianBlur(M * .05)),
                              Image.new("L", (M, M), 0), tile_mask)
    base = Image.alpha_composite(base, Image.merge("RGBA", (*sheen.split(), sheen_a)))

    # --- masks --------------------------------------------------------
    chip_mask = Image.new("L", (M, M), 0)
    ImageDraw.Draw(chip_mask).polygon(pts, fill=255)

    xs = np.arange(M) / k
    X, Y = np.meshgrid(xs, xs)            # design-space coords
    chip_np = np.asarray(chip_mask) > 127

    def radial_veil(cx, cy, rad, power=1.5):
        d = np.sqrt((X - cx) ** 2 + (Y - cy) ** 2)
        v = np.clip(1 - d / rad, 0, 1) ** power
        m = (v * chip_np * 255).astype(np.uint8)
        return Image.fromarray(m).filter(ImageFilter.GaussianBlur(M * .012))

    light_mask = radial_veil(CX - 80, CY - 92, 230)
    dark_mask = radial_veil(CX + 84, CY + 66, 200)

    # --- shadow -------------------------------------------------------
    shadow = chip_mask.filter(ImageFilter.GaussianBlur(M * .022)).point(lambda v: int(v * .40))
    sh_layer = Image.new("RGBA", (M, M), LEAF_900 + (0,))
    sh = Image.new("L", (M, M), 0)
    sh.paste(shadow, (0, int(M * .014)))
    sh_layer.putalpha(sh)
    base = Image.alpha_composite(base, sh_layer)

    # --- chip body ----------------------------------------------------
    chip = Image.new("RGBA", (M, M), (0, 0, 0, 0))
    chip.paste(gradient(M, CORN_300, CORN_600, angle_deg=118), (0, 0), chip_mask)

    # soft curl shadow near the lower edge (no hard fold)
    for mask, col, a in ((light_mask, CORN_200, 70), (dark_mask, CORN_700, 60)):
        lay = Image.new("RGBA", (M, M), col + (0,))
        lay.putalpha(mask.point(lambda v, a=a: int(v * a / 255)))
        chip = Image.alpha_composite(chip, lay)

    # outline
    ol = Image.new("L", (M, M), 0)
    ImageDraw.Draw(ol).line(pts + [pts[0]], fill=255,
                            width=max(2, int(M * .006)), joint="curve")
    ol = ol.filter(ImageFilter.GaussianBlur(M * .0035))
    ol_layer = Image.new("RGBA", (M, M), CORN_700 + (0,))
    ol_layer.putalpha(ol)
    chip = Image.alpha_composite(chip, ol_layer)

    # seasoning speckles
    if not simple:
        sp = Image.new("RGBA", (M, M), (0, 0, 0, 0))
        spd = ImageDraw.Draw(sp)
        for dx, dy, rad, col in [(-50, 14, 5, CORN_700), (-10, -30, 4, CORN_700),
                                 (38, 10, 5, CORN_700), (8, 44, 4, CORN_700),
                                 (-30, 48, 4, CORN_200), (48, -12, 4, CORN_700),
                                 (22, -8, 3, PAPRIKA)]:
            x, y, r = CX * k + dx * k, CY * k + dy * k, rad * k
            spd.ellipse([x - r * 1.25, y - r * 0.85, x + r * 1.25, y + r * 0.85],
                        fill=col + (170,))
        sp = Image.composite(sp, Image.new("RGBA", (M, M), (0, 0, 0, 0)), chip_mask)
        chip = Image.alpha_composite(chip, sp)

    base = Image.alpha_composite(base, chip)
    return base.resize((size, size), Image.LANCZOS)


# ---- SVG master ------------------------------------------------------------
def build_svg():
    chip = catmull_to_bezier_path(chip_points(N_SVG))
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Tordilla">
  <defs>
    <linearGradient id="tile" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2f8360"/><stop offset=".55" stop-color="#1f6a4c"/><stop offset="1" stop-color="#10382a"/>
    </linearGradient>
    <linearGradient id="chip" x1=".2" y1=".08" x2=".82" y2=".95">
      <stop offset="0" stop-color="#f8d477"/><stop offset=".5" stop-color="#f4c14a"/><stop offset="1" stop-color="#d08a0e"/>
    </linearGradient>
    <radialGradient id="curl" cx=".62" cy=".72" r=".62">
      <stop offset="0" stop-color="#a2680a" stop-opacity=".38"/><stop offset="1" stop-color="#a2680a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="sheen" cx=".42" cy=".28" r=".55">
      <stop offset="0" stop-color="#fbe6a8" stop-opacity=".55"/><stop offset="1" stop-color="#fbe6a8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="tsheen" cx=".5" cy=".16" r=".8">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".16"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="9" stdDeviation="9" flood-color="#0a241b" flood-opacity=".34"/>
    </filter>
    <clipPath id="cchip"><path d="{chip}"/></clipPath>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#tile)"/>
  <rect width="512" height="512" rx="112" fill="url(#tsheen)"/>
  <g filter="url(#soft)">
    <path d="{chip}" fill="url(#chip)"/>
  </g>
  <g clip-path="url(#cchip)">
    <path d="{chip}" fill="url(#curl)"/>
    <path d="{chip}" fill="url(#sheen)"/>
    <g fill="#a2680a" fill-opacity=".55">
      <ellipse cx="206" cy="310" rx="6" ry="4"/><ellipse cx="246" cy="266" rx="5" ry="3.5"/>
      <ellipse cx="294" cy="306" rx="6" ry="4"/><ellipse cx="264" cy="340" rx="5" ry="3.5"/>
      <ellipse cx="304" cy="284" rx="5" ry="3.5"/>
    </g>
    <g fill="#fdf3d3" fill-opacity=".6">
      <ellipse cx="226" cy="344" rx="5" ry="3.5"/>
    </g>
    <g fill="#dd4f24" fill-opacity=".5">
      <ellipse cx="278" cy="288" rx="4" ry="3"/>
    </g>
  </g>
  <path d="{chip}" fill="none" stroke="#a2680a" stroke-width="3" stroke-linejoin="round"/>
</svg>
'''


if __name__ == "__main__":
    outdir = os.path.join(OUT, "icons")
    os.makedirs(outdir, exist_ok=True)
    with open(os.path.join(outdir, "favicon.svg"), "w", encoding="utf-8") as fh:
        fh.write(build_svg())
    imgs = {}
    for s in [16, 32, 48, 64, 128, 180, 256, 512]:
        imgs[s] = render(s, simple=(s <= 32))
        imgs[s].save(os.path.join(outdir, f"icon-{s}.png"))
    imgs[48].save(os.path.join(outdir, "favicon.ico"), format="ICO",
                  sizes=[(16, 16), (32, 32), (48, 48)],
                  append_images=[imgs[16], imgs[32]])
    print("svg bytes:", os.path.getsize(os.path.join(outdir, "favicon.svg")))
    print("wrote", sorted(os.listdir(outdir)))
