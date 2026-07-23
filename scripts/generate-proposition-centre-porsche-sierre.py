#!/usr/bin/env python3
"""
Génère la proposition commerciale PDF Alpë Workwear — pack centres auto premium.

Usage (racine du dépôt) :
    python3 scripts/generate-proposition-centre-porsche-sierre.py

Sorties :
    commercial/proposition-alpe-centre-porsche-sierre.pdf
    commercial/previews/centre-porsche-sierre-p1.png
    commercial/previews/centre-porsche-sierre-p2.png

Note : le nom de fichier sert au suivi commercial interne.
Le contenu PDF ne cite aucun concessionnaire nommé — il calibre le discours
sur l'exigence d'une marque automobile d'exception.
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
BG_ALT = HexColor("#eef3f7")
NAVY = HexColor("#0f2138")
MAGENTA = HexColor("#c41e6e")
TEXT = HexColor("#1f2933")
TEXTILE = HexColor("#11151a")

PAGE_W, PAGE_H = A4
MARGIN_X = 16 * mm
CONTENT_W = PAGE_W - 2 * MARGIN_X

ASSETS = {
    "logo": ROOT / "assets/brand/logo-responsive.png",
    "hero": ROOT / "assets/brand/og-embroidery-alpe.jpg",
    "hero_side": ROOT / "assets/images/embroidery-preview.webp",
    "softshell": ROOT / "assets/catalogue/Softshell homme.JPG",
    "polo": ROOT / "assets/catalogue/Polo.jpg",
    "gilet": ROOT / "assets/catalogue/giletsoftshell.JPG",
    "process": ROOT / "assets/images/timeline/timeline-production.webp",
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
        raise SystemExit("Polices manquantes dans assets/fonts/ : " + ", ".join(map(str, missing)))
    for name, path in FONTS.items():
        pdfmetrics.registerFont(TTFont(name, str(path)))


def ensure_assets() -> None:
    missing = [p for p in ASSETS.values() if not p.exists()]
    if missing:
        raise SystemExit("Assets manquants :\n  " + "\n  ".join(map(str, missing)))


def cover(path: Path, tw: int, th: int, focus: str = "center") -> ImageReader:
    im = PILImage.open(path).convert("RGB")
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
    align: str = "left",
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
        if align == "center":
            c.drawCentredString(x + max_w / 2, cursor, line)
        else:
            c.drawString(x, cursor, line)
        cursor -= leading
    return cursor + leading


def cta_outline(c: canvas.Canvas, label: str, cx: float, cy: float) -> None:
    c.setFont("DMSans-SemiBold", 10)
    tw = c.stringWidth(label, "DMSans-SemiBold", 10)
    pad_x, pad_y = 18, 9
    w, h = tw + 2 * pad_x, 10 + 2 * pad_y
    x, y = cx - w / 2, cy - h / 2
    c.setFillColor(white)
    c.setStrokeColor(MAGENTA)
    c.setLineWidth(1.5)
    c.roundRect(x, y, w, h, 2, fill=1, stroke=1)
    c.setFillColor(MAGENTA)
    c.drawCentredString(cx, y + pad_y + 1.5, label)


def cta_filled(c: canvas.Canvas, label: str, x: float, y: float, w: float, h: float) -> None:
    c.setFillColor(MAGENTA)
    c.roundRect(x, y, w, h, 2, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("DMSans-SemiBold", 9)
    c.drawCentredString(x + w / 2, y + h / 2 - 3, label)


def draw_page1(c: canvas.Canvas, date_label: str) -> None:
    c.setFillColor(white)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    logo = cover(ASSETS["logo"], 900, 270)
    logo_h = 11 * mm
    logo_w = logo_h * (900 / 270)
    top = PAGE_H - 11 * mm
    c.drawImage(logo, MARGIN_X, top - logo_h, width=logo_w, height=logo_h, mask="auto")
    c.setFont("DMSans-Medium", 9)
    c.setFillColor(STEEL_MUTED)
    c.drawRightString(PAGE_W - MARGIN_X, top - logo_h / 2 - 3, date_label)

    rule_y = top - logo_h - 5 * mm
    c.setStrokeColor(NAVY)
    c.setLineWidth(1.4)
    c.line(MARGIN_X, rule_y, PAGE_W - MARGIN_X, rule_y)

    foot_h = 9 * mm
    band_h = 34 * mm
    band_top = foot_h + band_h

    y = rule_y - 7 * mm

    c.setFont("DMSans", 10)
    c.setFillColor(STEEL)
    c.drawString(MARGIN_X, y, "Workwear B2B pour centres automobiles d’exception")
    y -= 8 * mm

    y = wrap(
        c,
        "Chaque détail compte — y compris la tenue de vos équipes",
        MARGIN_X,
        y,
        CONTENT_W * 0.98,
        "DMSans-Bold",
        18.5,
        22.5,
        NAVY,
    )
    y -= 5.5 * mm

    hero_h = 60 * mm
    main_w = CONTENT_W * 0.68
    side_w = CONTENT_W - main_w - 3 * mm
    c.drawImage(
        cover(ASSETS["hero"], int(main_w * 3), int(hero_h * 3), "center"),
        MARGIN_X,
        y - hero_h,
        width=main_w,
        height=hero_h,
        mask="auto",
    )
    c.drawImage(
        cover(ASSETS["hero_side"], int(side_w * 3), int(hero_h * 3), "center"),
        MARGIN_X + main_w + 3 * mm,
        y - hero_h,
        width=side_w,
        height=hero_h,
        mask="auto",
    )
    y = y - hero_h - 7 * mm

    c.setFont("DMSans-SemiBold", 11)
    c.setFillColor(TEXTILE)
    c.drawString(MARGIN_X, y, "Madame, Monsieur,")
    y -= 5.5 * mm

    paragraphs = [
        (
            "Une marque automobile d’exception se juge aussi aux détails du quotidien : "
            "accueil, vente, atelier. La tenue de vos équipes prolonge cette exigence — "
            "précision du logo, qualité du textile, cohérence visuelle d’un bout à l’autre "
            "du parcours client."
        ),
        (
            "Alpë Workwear accompagne les entreprises en Suisse avec des vêtements de "
            "travail personnalisés : broderie et sérigraphie sur softshells, polos, gilets "
            "et pièces atelier. Un interlocuteur unique, de l’écoute à la livraison "
            "coordonnée en Suisse."
        ),
        (
            "Nous calibrons chaque proposition sur le niveau de finition que votre image "
            "mérite — confort durable, marquage net, look digne d’un showroom exigeant — "
            "sans engagement sur le devis partenaire."
        ),
        (
            "Contactez-nous par courriel à info@alpeworkwear.ch ou par téléphone "
            "au +41 79 779 21 51."
        ),
    ]
    for para in paragraphs:
        y = wrap(c, para, MARGIN_X, y, CONTENT_W, "DMSans", 9.4, 12.8, TEXT)
        y -= 3.6 * mm

    cta_y = max(y - 9 * mm, band_top + 11 * mm)
    cta_outline(c, "Demander un devis partenaire", PAGE_W / 2, cta_y)

    c.setFillColor(NAVY)
    c.rect(0, foot_h, PAGE_W, band_h, fill=1, stroke=0)
    c.setFont("DMSans-SemiBold", 9)
    c.setFillColor(white)
    c.drawCentredString(
        PAGE_W / 2,
        foot_h + band_h - 6.5 * mm,
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
        base = foot_h + 11 * mm
        c.setFont("DMSans-Bold", 8)
        c.setFillColor(MAGENTA)
        c.drawCentredString(cx, base + 8 * mm, num)
        c.setFont("DMSans-SemiBold", 10)
        c.setFillColor(white)
        c.drawCentredString(cx, base + 2.5 * mm, title)
        c.setFont("DMSans", 7.5)
        c.setFillColor(STEEL_PALE)
        for j, line in enumerate(desc.split("\n")):
            c.drawCentredString(cx, base - 2.8 * mm - j * 9, line)
        if i < 2:
            c.setStrokeColor(STEEL)
            c.setLineWidth(0.6)
            sx = MARGIN_X + col_w * (i + 1)
            c.line(sx, foot_h + 3.5 * mm, sx, foot_h + band_h - 11 * mm)

    c.setFillColor(white)
    c.rect(0, 0, PAGE_W, foot_h, fill=1, stroke=0)
    c.setFont("DMSans", 7)
    c.setFillColor(STEEL_MUTED)
    c.drawCentredString(
        PAGE_W / 2,
        foot_h / 2 - 2,
        "info@alpeworkwear.ch  ·  +41 79 779 21 51  ·  www.alpeworkwear.ch",
    )


def draw_page2(c: canvas.Canvas) -> None:
    c.setFillColor(white)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    y = PAGE_H - 14 * mm

    c.setFont("DMSans", 9)
    c.setFillColor(STEEL)
    c.drawString(MARGIN_X, y, "Sélection catalogue")
    y -= 5.5 * mm
    c.setFont("DMSans-Bold", 15)
    c.setFillColor(NAVY)
    c.drawString(MARGIN_X, y, "Trois pièces pour vos équipes")
    y -= 4 * mm
    y = wrap(
        c,
        "Softshell atelier, polo vente, gilet showroom — broderie ou sérigraphie.",
        MARGIN_X,
        y,
        CONTENT_W,
        "DMSans",
        9,
        12,
        STEEL_MUTED,
    )
    y -= 5 * mm

    products = [
        (ASSETS["softshell"], "Softshell atelier", "Coupe-vent technique pour atelier et terrain."),
        (ASSETS["polo"], "Polo vente", "Présentation nette pour accueil et conseil."),
        (ASSETS["gilet"], "Gilet softshell", "Couche intermédiaire showroom & déplacements."),
    ]
    gap = 4 * mm
    card_w = (CONTENT_W - 2 * gap) / 3
    img_h = 50 * mm
    body_h = 22 * mm
    card_h = img_h + body_h

    for i, (path, title, desc) in enumerate(products):
        x = MARGIN_X + i * (card_w + gap)
        c.drawImage(
            cover(path, int(card_w * 3), int(img_h * 3)),
            x,
            y - img_h,
            width=card_w,
            height=img_h,
            mask="auto",
        )
        c.setFillColor(BG_ALT)
        c.rect(x, y - card_h, card_w, body_h, fill=1, stroke=0)
        c.setFont("DMSans-SemiBold", 8.5)
        c.setFillColor(NAVY)
        c.drawString(x + 2.5 * mm, y - img_h - 5 * mm, title)
        wrap(
            c,
            desc,
            x + 2.5 * mm,
            y - img_h - 10 * mm,
            card_w - 5 * mm,
            "DMSans",
            7.2,
            9.5,
            TEXT,
        )

    y = y - card_h - 9 * mm

    # Process
    proc_h = 30 * mm
    c.drawImage(
        cover(ASSETS["process"], int(CONTENT_W * 2.5), int(proc_h * 2.5), "center"),
        MARGIN_X,
        y - proc_h,
        width=CONTENT_W,
        height=proc_h,
        mask="auto",
    )
    c.setFillColor(HexColor("#0f2138"))
    c.setFillAlpha(0.55)
    c.rect(MARGIN_X, y - proc_h, CONTENT_W, proc_h, fill=1, stroke=0)
    c.setFillAlpha(1)

    c.setFont("DMSans-SemiBold", 8)
    c.setFillColor(white)
    c.drawString(MARGIN_X + 4 * mm, y - 5 * mm, "Co-création — de l’écoute à la livraison")

    steps = ["01 Écoute", "02 Conception", "03 Prototype", "04 Production", "05 Livraison"]
    step_w = CONTENT_W / 5
    for i, label in enumerate(steps):
        cx = MARGIN_X + step_w * i + step_w / 2
        c.setFont("DMSans-Bold", 9)
        c.setFillColor(MAGENTA)
        num, name = label.split(" ", 1)
        c.drawCentredString(cx, y - 14 * mm, num)
        c.setFont("DMSans-Medium", 7.5)
        c.setFillColor(white)
        c.drawCentredString(cx, y - 20 * mm, name)

    y = y - proc_h - 9 * mm

    c.setFont("DMSans-Medium", 8)
    c.setFillColor(STEEL)
    c.drawString(MARGIN_X, y, "POURQUOI ALPË POUR UN CENTRE AUTOMOBILE EXIGEANT")
    y -= 5 * mm

    args = [
        "Image cohérente entre showroom, vente et atelier — une signature visuelle unique.",
        "Finition digne d’une marque premium : placement, densités de broderie, rendu net.",
        "Catalogue workwear : softshell, polo, gilet, textile pro et haute visibilité.",
        "Devis partenaire, interlocuteur unique et livraison coordonnée en Suisse.",
    ]
    for a in args:
        c.setFillColor(MAGENTA)
        c.circle(MARGIN_X + 1.6 * mm, y + 2, 1.3, fill=1, stroke=0)
        y = wrap(c, a, MARGIN_X + 5 * mm, y, CONTENT_W - 5 * mm, "DMSans", 8.5, 11.5, TEXT)
        y -= 3.2 * mm

    y -= 3 * mm

    box_h = 26 * mm
    c.setFillColor(NAVY)
    c.rect(MARGIN_X, y - box_h, CONTENT_W, box_h, fill=1, stroke=0)
    c.setFont("DMSans-SemiBold", 10)
    c.setFillColor(white)
    c.drawString(MARGIN_X + 4 * mm, y - 6.5 * mm, "Prochaine étape")
    wrap(
        c,
        "Indiquez effectifs, pièces souhaitées et volumes estimés. "
        "Réponse sous 1 à 2 jours ouvrables — devis partenaire sans engagement.",
        MARGIN_X + 4 * mm,
        y - 12.5 * mm,
        CONTENT_W - 48 * mm,
        "DMSans",
        8,
        10.5,
        STEEL_PALE,
    )
    cta_filled(
        c,
        "info@alpeworkwear.ch",
        PAGE_W - MARGIN_X - 42 * mm,
        y - box_h / 2 - 6,
        38 * mm,
        12,
    )

    y = y - box_h - 7 * mm

    c.setStrokeColor(STEEL_PALE)
    c.setLineWidth(0.8)
    c.line(MARGIN_X, y, PAGE_W - MARGIN_X, y)
    y -= 5 * mm
    c.setFont("DMSans-Bold", 9)
    c.setFillColor(NAVY)
    c.drawString(MARGIN_X, y, "Alpë Workwear")
    c.setFont("DMSans", 8)
    c.setFillColor(TEXT)
    y -= 4.2 * mm
    c.drawString(MARGIN_X, y, "info@alpeworkwear.ch  ·  +41 79 779 21 51  ·  www.alpeworkwear.ch")
    y -= 3.8 * mm
    c.setFont("DMSans-Medium", 8)
    c.setFillColor(STEEL)
    c.drawString(MARGIN_X, y, "WhatsApp Business  ·  wa.me/41797792151")
    y -= 3.8 * mm
    c.setFont("DMSans", 7)
    c.setFillColor(STEEL_MUTED)
    c.drawString(
        MARGIN_X,
        y,
        "Workwear B2B · Broderie · Sérigraphie · Coordination Suisse · Atelier Kosovo",
    )


def export_previews(pdf_path: Path, preview_dir: Path) -> list[Path]:
    import fitz

    preview_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path)
    paths: list[Path] = []
    mat = fitz.Matrix(150 / 72, 150 / 72)
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
    c.setTitle("Alpë Workwear — Proposition centres automobiles premium")
    c.setAuthor("Alpë Workwear")
    c.setSubject("Workwear B2B personnalisé — excellence showroom & atelier")
    c.setCreator("Alpë Workwear — script proposition centres auto premium")

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
