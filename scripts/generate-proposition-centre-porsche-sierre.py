#!/usr/bin/env python3
"""
Proposition commerciale Alpë — centres auto premium (soft-cite).
Rythme mailing SFS : logo/date → sous-titre → titre → 1 hero plein cadre → lettre → CTA → bandeau.

Usage :
    python3 scripts/generate-proposition-centre-porsche-sierre.py
"""

from __future__ import annotations

import sys
from datetime import datetime
from pathlib import Path

from PIL import Image as PILImage
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "commercial"
PDF_PATH = OUT_DIR / "proposition-alpe-centre-porsche-sierre.pdf"
PREVIEW_DIR = OUT_DIR / "previews"

STEEL = HexColor("#49657f")
STEEL_MUTED = HexColor("#5c6f82")
STEEL_PALE = HexColor("#d8e2ea")
NAVY = HexColor("#0f2138")
MAGENTA = HexColor("#c41e6e")
TEXT = HexColor("#1f2933")
TEXTILE = HexColor("#11151a")

PAGE_W, PAGE_H = A4
MARGIN_X = 18 * mm
CONTENT_W = PAGE_W - 2 * MARGIN_X

ASSETS = {
    "logo": ROOT / "assets/brand/logo-responsive.png",
    # Hero = softshell porté (moitié droite de l’OG, sans panneau CTA)
    "hero": ROOT / "assets/brand/og-softshell-alpe.jpg",
    "detail": ROOT / "assets/images/hero-brode-alpe.webp",
    "softshell": ROOT / "assets/catalogue/Softshell homme.JPG",
    "polo": ROOT / "assets/catalogue/Polo.jpg",
    "gilet": ROOT / "assets/catalogue/giletsoftshell.JPG",
}

FONT_DIR = ROOT / "assets/fonts"
FONTS = {
    "DMSans": FONT_DIR / "DMSans-Regular.ttf",
    "DMSans-Medium": FONT_DIR / "DMSans-Medium.ttf",
    "DMSans-SemiBold": FONT_DIR / "DMSans-SemiBold.ttf",
    "DMSans-Bold": FONT_DIR / "DMSans-Bold.ttf",
}


def register_fonts() -> None:
    missing = [p for p in FONTS.values() if not p.exists()]
    if missing:
        raise SystemExit("Polices manquantes : " + ", ".join(map(str, missing)))
    for name, path in FONTS.items():
        pdfmetrics.registerFont(TTFont(name, str(path)))


def ensure_assets() -> None:
    missing = [p for p in ASSETS.values() if not p.exists()]
    if missing:
        raise SystemExit("Assets manquants :\n  " + "\n  ".join(map(str, missing)))


def cover(
    path: Path,
    tw: int,
    th: int,
    *,
    region: tuple[float, float, float, float] | None = None,
    focus: str = "center",
) -> ImageReader:
    """region = (x0, y0, x1, y1) en fractions de l’image source avant crop cover."""
    im = PILImage.open(path).convert("RGB")
    if region:
        x0, y0, x1, y1 = region
        w, h = im.size
        im = im.crop((int(w * x0), int(h * y0), int(w * x1), int(h * y1)))
    sw, sh = im.size
    scale = max(tw / sw, th / sh)
    nw, nh = int(sw * scale), int(sh * scale)
    im = im.resize((nw, nh), PILImage.Resampling.LANCZOS)
    left = (nw - tw) // 2
    if focus == "upper":
        top = 0
    elif focus == "lower":
        top = nh - th
    else:
        top = (nh - th) // 2
    return ImageReader(im.crop((left, top, left + tw, top + th)))


def wrap(
    c: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    max_w: float,
    font: str,
    size: float,
    leading: float,
    color: Color,
) -> float:
    c.setFont(font, size)
    c.setFillColor(color)
    words = text.split()
    lines: list[str] = []
    cur = ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if c.stringWidth(trial, font, size) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    cursor = y
    for line in lines:
        c.drawString(x, cursor, line)
        cursor -= leading
    return cursor + leading


def cta_outline(c: canvas.Canvas, label: str, cx: float, cy: float) -> None:
    c.setFont("DMSans-SemiBold", 10)
    tw = c.stringWidth(label, "DMSans-SemiBold", 10)
    pad_x, pad_y = 22, 10
    w, h = tw + 2 * pad_x, 10 + 2 * pad_y
    x, y = cx - w / 2, cy - h / 2
    c.setFillColor(white)
    c.setStrokeColor(MAGENTA)
    c.setLineWidth(1.4)
    c.roundRect(x, y, w, h, 1.5, fill=1, stroke=1)
    c.setFillColor(MAGENTA)
    c.drawCentredString(cx, y + pad_y + 1.5, label)


def draw_page1(c: canvas.Canvas, date_label: str) -> None:
    c.setFillColor(white)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Header — rythme SFS
    logo = cover(ASSETS["logo"], 900, 270)
    logo_h = 10 * mm
    logo_w = logo_h * (900 / 270)
    top = PAGE_H - 12 * mm
    c.drawImage(logo, MARGIN_X, top - logo_h, width=logo_w, height=logo_h, mask="auto")
    c.setFont("DMSans", 9)
    c.setFillColor(STEEL_MUTED)
    c.drawRightString(PAGE_W - MARGIN_X, top - logo_h / 2 - 2.5, date_label)

    rule_y = top - logo_h - 6 * mm
    c.setStrokeColor(HexColor("#e5e9ee"))
    c.setLineWidth(0.8)
    c.line(MARGIN_X, rule_y, PAGE_W - MARGIN_X, rule_y)

    foot_h = 8 * mm
    band_h = 32 * mm
    band_top = foot_h + band_h

    y = rule_y - 9 * mm

    c.setFont("DMSans", 10)
    c.setFillColor(STEEL_MUTED)
    c.drawString(MARGIN_X, y, "Vêtements de travail au logo de l’entreprise")
    y -= 9 * mm

    y = wrap(
        c,
        "Chaque détail compte — y compris la tenue de vos équipes",
        MARGIN_X,
        y,
        CONTENT_W * 0.92,
        "DMSans-Bold",
        20,
        24,
        TEXTILE,
    )
    y -= 7 * mm

    # Un seul hero plein cadre : softshell porté (crop droite, sans panneau marketing)
    hero_h = 78 * mm
    c.drawImage(
        cover(
            ASSETS["hero"],
            int(CONTENT_W * 3.2),
            int(hero_h * 3.2),
            region=(0.48, 0.0, 1.0, 1.0),
            focus="center",
        ),
        MARGIN_X,
        y - hero_h,
        width=CONTENT_W,
        height=hero_h,
        mask="auto",
    )
    y = y - hero_h - 8 * mm

    c.setFont("DMSans-SemiBold", 11)
    c.setFillColor(TEXTILE)
    c.drawString(MARGIN_X, y, "Madame, Monsieur,")
    y -= 6 * mm

    paragraphs = [
        (
            "Une image professionnelle commence par les détails. "
            "Sur un softshell, un polo ou un gilet, le textile compte — "
            "mais aussi le placement, la taille et la couleur de votre logo."
        ),
        (
            "Alpë Workwear équipe les entreprises en Suisse : broderie et sérigraphie "
            "pour des équipes accueil, vente et atelier. Un interlocuteur unique, "
            "de l’écoute à la livraison coordonnée en Suisse."
        ),
        (
            "Nous calibrons chaque proposition sur le niveau de finition "
            "qu’exige un showroom exigeant — sans engagement sur le devis partenaire."
        ),
    ]
    for para in paragraphs:
        y = wrap(c, para, MARGIN_X, y, CONTENT_W, "DMSans", 9.6, 13.2, TEXT)
        y -= 4.2 * mm

    c.setFont("DMSans", 9)
    c.setFillColor(STEEL)
    c.drawString(MARGIN_X, y, "info@alpeworkwear.ch  ·  +41 79 779 21 59")
    y -= 10 * mm

    cta_y = max(y, band_top + 12 * mm)
    cta_outline(c, "Demander un devis partenaire", PAGE_W / 2, cta_y)

    # Bandeau 3 piliers
    c.setFillColor(NAVY)
    c.rect(0, foot_h, PAGE_W, band_h, fill=1, stroke=0)
    c.setFont("DMSans-Medium", 8.5)
    c.setFillColor(STEEL_PALE)
    c.drawCentredString(
        PAGE_W / 2,
        foot_h + band_h - 6 * mm,
        "Alpë Workwear vous accompagne sur trois piliers",
    )

    pillars = [
        ("01", "Devis", "Proposition claire,\nsans engagement"),
        ("02", "Broderie", "Marquage précis\nsur vos tenues"),
        ("03", "Livraison Suisse", "Coordination nationale\njusqu’à vous"),
    ]
    col_w = CONTENT_W / 3
    for i, (num, title, desc) in enumerate(pillars):
        cx = MARGIN_X + col_w * i + col_w / 2
        base = foot_h + 10 * mm
        c.setFont("DMSans-Bold", 8)
        c.setFillColor(MAGENTA)
        c.drawCentredString(cx, base + 8.5 * mm, num)
        c.setFont("DMSans-SemiBold", 10)
        c.setFillColor(white)
        c.drawCentredString(cx, base + 3 * mm, title)
        c.setFont("DMSans", 7.5)
        c.setFillColor(STEEL_PALE)
        for j, line in enumerate(desc.split("\n")):
            c.drawCentredString(cx, base - 2.5 * mm - j * 8.5, line)

    c.setFillColor(white)
    c.rect(0, 0, PAGE_W, foot_h, fill=1, stroke=0)
    c.setFont("DMSans", 7)
    c.setFillColor(STEEL_MUTED)
    c.drawCentredString(
        PAGE_W / 2,
        foot_h / 2 - 2,
        "www.alpeworkwear.ch",
    )


def draw_page2(c: canvas.Canvas) -> None:
    c.setFillColor(white)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    y = PAGE_H - 16 * mm

    c.setFont("DMSans", 9)
    c.setFillColor(STEEL_MUTED)
    c.drawString(MARGIN_X, y, "Sélection pour vos équipes")
    y -= 6 * mm
    c.setFont("DMSans-Bold", 16)
    c.setFillColor(TEXTILE)
    c.drawString(MARGIN_X, y, "Trois pièces. Une image cohérente.")
    y -= 8 * mm

    products = [
        (ASSETS["softshell"], "Softshell", "Atelier & terrain"),
        (ASSETS["polo"], "Polo", "Accueil & vente"),
        (ASSETS["gilet"], "Gilet", "Showroom & déplacements"),
    ]
    gap = 5 * mm
    card_w = (CONTENT_W - 2 * gap) / 3
    img_h = 58 * mm

    for i, (path, title, role) in enumerate(products):
        x = MARGIN_X + i * (card_w + gap)
        c.drawImage(
            cover(path, int(card_w * 3), int(img_h * 3), focus="upper"),
            x,
            y - img_h,
            width=card_w,
            height=img_h,
            mask="auto",
        )
        c.setFont("DMSans-SemiBold", 10)
        c.setFillColor(TEXTILE)
        c.drawString(x, y - img_h - 5 * mm, title)
        c.setFont("DMSans", 8)
        c.setFillColor(STEEL_MUTED)
        c.drawString(x, y - img_h - 9.5 * mm, role)

    y = y - img_h - 18 * mm

    # Preuve finition — détail broderie plein cadre
    c.setFont("DMSans", 9)
    c.setFillColor(STEEL_MUTED)
    c.drawString(MARGIN_X, y, "Finition")
    y -= 5 * mm
    c.setFont("DMSans-Bold", 13)
    c.setFillColor(TEXTILE)
    c.drawString(MARGIN_X, y, "Le marquage digne d’une marque exigeante")
    y -= 5 * mm

    det_h = 42 * mm
    c.drawImage(
        cover(ASSETS["detail"], int(CONTENT_W * 3), int(det_h * 3), focus="center"),
        MARGIN_X,
        y - det_h,
        width=CONTENT_W,
        height=det_h,
        mask="auto",
    )
    y = y - det_h - 10 * mm

    # Process simple sur fond clair (pas d’usine sombre)
    c.setFont("DMSans-SemiBold", 9)
    c.setFillColor(STEEL)
    c.drawString(MARGIN_X, y, "De l’écoute à la livraison")
    y -= 7 * mm

    steps = ["01 Écoute", "02 Conception", "03 Prototype", "04 Production", "05 Livraison"]
    step_w = CONTENT_W / 5
    for i, label in enumerate(steps):
        cx = MARGIN_X + step_w * i + step_w / 2
        num, name = label.split(" ", 1)
        c.setFont("DMSans-Bold", 10)
        c.setFillColor(MAGENTA)
        c.drawCentredString(cx, y, num)
        c.setFont("DMSans", 8)
        c.setFillColor(TEXT)
        c.drawCentredString(cx, y - 5 * mm, name)
        if i < 4:
            c.setStrokeColor(STEEL_PALE)
            c.setLineWidth(0.7)
            c.line(cx + step_w / 2 - 2 * mm, y + 1.5, cx + step_w / 2 + 2 * mm, y + 1.5)

    y -= 16 * mm

    args = [
        "Image cohérente entre showroom, vente et atelier.",
        "Broderie et sérigraphie maîtrisées — rendu net, placement juste.",
        "Devis partenaire, interlocuteur unique, livraison coordonnée en Suisse.",
    ]
    for a in args:
        c.setFillColor(MAGENTA)
        c.circle(MARGIN_X + 1.4 * mm, y + 1.8, 1.2, fill=1, stroke=0)
        y = wrap(c, a, MARGIN_X + 5 * mm, y, CONTENT_W - 5 * mm, "DMSans", 9, 12, TEXT)
        y -= 4 * mm

    y -= 4 * mm
    box_h = 28 * mm
    c.setFillColor(NAVY)
    c.rect(MARGIN_X, y - box_h, CONTENT_W, box_h, fill=1, stroke=0)
    c.setFont("DMSans-SemiBold", 11)
    c.setFillColor(white)
    c.drawString(MARGIN_X + 5 * mm, y - 8 * mm, "Prochaine étape")
    wrap(
        c,
        "Indiquez effectifs, pièces et volumes estimés. "
        "Réponse sous 1 à 2 jours ouvrables — sans engagement.",
        MARGIN_X + 5 * mm,
        y - 14 * mm,
        CONTENT_W - 10 * mm,
        "DMSans",
        8.5,
        11.5,
        STEEL_PALE,
    )
    c.setFont("DMSans-SemiBold", 9)
    c.setFillColor(MAGENTA)
    c.drawString(MARGIN_X + 5 * mm, y - box_h + 6 * mm, "info@alpeworkwear.ch  ·  +41 79 779 21 59")

    y = y - box_h - 8 * mm
    c.setFont("DMSans", 7.5)
    c.setFillColor(STEEL_MUTED)
    c.drawCentredString(
        PAGE_W / 2,
        y,
        "Alpë Workwear  ·  WhatsApp wa.me/41797792159  ·  www.alpeworkwear.ch",
    )


def export_previews(pdf_path: Path, preview_dir: Path) -> list[Path]:
    import fitz

    preview_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path)
    paths: list[Path] = []
    mat = fitz.Matrix(160 / 72, 160 / 72)
    for i, page in enumerate(doc, start=1):
        out = preview_dir / f"centre-porsche-sierre-p{i}.png"
        page.get_pixmap(matrix=mat, alpha=False).save(str(out))
        paths.append(out)
    doc.close()
    return paths


def main() -> int:
    register_fonts()
    ensure_assets()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    months = [
        "",
        "janvier",
        "février",
        "mars",
        "avril",
        "mai",
        "juin",
        "juillet",
        "août",
        "septembre",
        "octobre",
        "novembre",
        "décembre",
    ]
    now = datetime.now()
    date_label = f"{now.day} {months[now.month]} {now.year}"

    c = canvas.Canvas(str(PDF_PATH), pagesize=A4)
    c.setTitle("Alpë Workwear — Workwear B2B personnalisé")
    c.setAuthor("Alpë Workwear")
    c.setSubject("Proposition workwear B2B — broderie, sérigraphie, livraison Suisse")
    c.setCreator("Alpë Workwear")

    draw_page1(c, date_label)
    c.showPage()
    draw_page2(c)
    c.save()

    for p in export_previews(PDF_PATH, PREVIEW_DIR):
        print(f"Aperçu : {p.relative_to(ROOT)}")
    print(f"PDF : {PDF_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
