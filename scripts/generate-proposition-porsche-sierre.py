#!/usr/bin/env python3
"""
Génère la proposition commerciale PDF Alpë Workwear → Centre Porsche Sierre.

Usage (depuis la racine du dépôt) :
    python3 scripts/generate-proposition-porsche-sierre.py

Sorties :
    commercial/proposition-alpe-centre-porsche-sierre.pdf
    commercial/previews/proposition-porsche-sierre-p1.png
    commercial/previews/proposition-porsche-sierre-p2.png
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

# --- Charte Alpë -----------------------------------------------------------
STEEL = HexColor("#49657f")
STEEL_DARK = HexColor("#3a5268")
STEEL_MUTED = HexColor("#5c6f82")
STEEL_PALE = HexColor("#d8e2ea")
BG_ALT = HexColor("#eef3f7")
NAVY = HexColor("#0f2138")
MAGENTA = HexColor("#c41e6e")
TEXT = HexColor("#1f2933")
TEXTILE = HexColor("#11151a")

PAGE_W, PAGE_H = A4
MARGIN_X = 18 * mm
CONTENT_W = PAGE_W - 2 * MARGIN_X

ASSETS = {
    "logo": ROOT / "assets/brand/logo-responsive.png",
    "hero": ROOT / "assets/brand/og-embroidery-alpe.jpg",
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
        raise SystemExit(
            "Polices DM Sans manquantes :\n  "
            + "\n  ".join(str(p) for p in missing)
            + "\nPlacez-les dans assets/fonts/."
        )
    for name, path in FONTS.items():
        pdfmetrics.registerFont(TTFont(name, str(path)))


def ensure_assets() -> None:
    missing = [p for p in ASSETS.values() if not p.exists()]
    if missing:
        raise SystemExit("Assets manquants :\n  " + "\n  ".join(str(p) for p in missing))


def rgb_cover_crop(path: Path, target_w: int, target_h: int) -> ImageReader:
    """Recadre en cover (centre) et convertit en RGB pour reportlab."""
    im = PILImage.open(path).convert("RGB")
    src_w, src_h = im.size
    scale = max(target_w / src_w, target_h / src_h)
    new_w, new_h = int(src_w * scale), int(src_h * scale)
    im = im.resize((new_w, new_h), PILImage.Resampling.LANCZOS)
    left = (new_w - target_w) // 2
    top = (new_h - target_h) // 2
    im = im.crop((left, top, left + target_w, top + target_h))
    return ImageReader(im)


def draw_wrapped(
    c: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    max_width: float,
    font: str,
    size: float,
    leading: float,
    color: Color,
    align: str = "left",
) -> float:
    """Dessine un paragraphe wrappé. Retourne le y bas du dernier ligne."""
    c.setFont(font, size)
    c.setFillColor(color)
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        trial = f"{current} {word}".strip()
        if c.stringWidth(trial, font, size) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)

    cursor = y
    for line in lines:
        if align == "center":
            c.drawCentredString(x + max_width / 2, cursor, line)
        elif align == "right":
            c.drawRightString(x + max_width, cursor, line)
        else:
            c.drawString(x, cursor, line)
        cursor -= leading
    return cursor + leading


def draw_button(
    c: canvas.Canvas,
    label: str,
    cx: float,
    cy: float,
    pad_x: float = 16,
    pad_y: float = 8,
) -> None:
    c.setFont("DMSans-SemiBold", 10)
    tw = c.stringWidth(label, "DMSans-SemiBold", 10)
    w = tw + 2 * pad_x
    h = 10 + 2 * pad_y
    x = cx - w / 2
    y = cy - h / 2
    c.setFillColor(MAGENTA)
    c.roundRect(x, y, w, h, 2, fill=1, stroke=0)
    c.setFillColor(white)
    c.drawCentredString(cx, y + pad_y + 1.5, label)


def draw_page1(c: canvas.Canvas, date_label: str) -> None:
    # Fond
    c.setFillColor(white)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Bandeau haut acier pâle
    header_h = 22 * mm
    c.setFillColor(BG_ALT)
    c.rect(0, PAGE_H - header_h, PAGE_W, header_h, fill=1, stroke=0)

    # Logo
    logo = rgb_cover_crop(ASSETS["logo"], 720, 216)
    logo_h = 11 * mm
    logo_w = logo_h * (720 / 216)
    c.drawImage(
        logo,
        MARGIN_X,
        PAGE_H - header_h + (header_h - logo_h) / 2,
        width=logo_w,
        height=logo_h,
        mask="auto",
    )

    # Date
    c.setFont("DMSans-Medium", 8.5)
    c.setFillColor(STEEL_MUTED)
    c.drawRightString(PAGE_W - MARGIN_X, PAGE_H - header_h / 2 - 2.5, date_label)

    # Bandeau avantages + footer ancrés en bas (style newsletter)
    footer_h = 12 * mm
    band_h = 28 * mm
    band_top = footer_h + band_h

    y = PAGE_H - header_h - 8 * mm

    # Sous-titre / accroche automotive
    c.setFont("DMSans-Medium", 9)
    c.setFillColor(STEEL)
    c.drawString(MARGIN_X, y, "PROPOSITION PARTENAIRE  ·  CENTRES AUTOMOBILES")
    y -= 7 * mm

    # Gros titre
    title_bottom = draw_wrapped(
        c,
        "Une image de marque aussi précise que vos finitions.",
        MARGIN_X,
        y,
        CONTENT_W * 0.92,
        "DMSans-Bold",
        21,
        25,
        NAVY,
    )
    y = title_bottom - 3.5 * mm

    # Sous-accroche
    y = draw_wrapped(
        c,
        "Workwear B2B personnalisé pour les équipes du Centre Porsche Sierre — accueil, vente et atelier.",
        MARGIN_X,
        y,
        CONTENT_W * 0.95,
        "DMSans",
        10,
        13.5,
        STEEL_MUTED,
    )
    y -= 5 * mm

    # Hero
    hero_h = 52 * mm
    hero = rgb_cover_crop(ASSETS["hero"], int(CONTENT_W * 2.5), int(hero_h * 2.5))
    c.drawImage(hero, MARGIN_X, y - hero_h, width=CONTENT_W, height=hero_h, mask="auto")
    c.setFillColor(NAVY)
    c.rect(MARGIN_X, y - hero_h - 1.2 * mm, CONTENT_W, 1.2 * mm, fill=1, stroke=0)
    y = y - hero_h - 7 * mm

    # Lettre
    c.setFont("DMSans-SemiBold", 10.5)
    c.setFillColor(TEXTILE)
    c.drawString(MARGIN_X, y, "Madame, Monsieur,")
    y -= 5.5 * mm

    paragraphs = [
        (
            "Nous avons le plaisir de vous adresser cette proposition destinée au "
            "Centre Porsche Sierre — Garage Olympic SA, Route de la Bonne-Eau 2, 3960 Sierre."
        ),
        (
            "Alpë Workwear équipe les entreprises suisses en workwear personnalisé : "
            "broderie et sérigraphie sur softshells, polos, gilets et pièces atelier. "
            "Notre approche est pensée pour les marques exigeantes — cohérence visuelle, "
            "qualité textile et coordination simple, de la prise de brief à la livraison en Suisse."
        ),
        (
            "Pour vos équipes accueil, vente et atelier, nous proposons des tenues "
            "distinctes par métier, unifiées par votre identité Porsche / Garage Olympic — "
            "logo, couleurs et finitions soignées, sans compromis sur le confort au quotidien."
        ),
        (
            "Nous restons à votre disposition pour un devis partenaire sur mesure, "
            "sans engagement, adapté à vos volumes et à votre calendrier."
        ),
    ]
    for para in paragraphs:
        y = draw_wrapped(
            c, para, MARGIN_X, y, CONTENT_W, "DMSans", 9.2, 12.5, TEXT
        )
        y -= 3.6 * mm

    y -= 1.5 * mm
    c.setFont("DMSans", 9.2)
    c.setFillColor(TEXT)
    c.drawString(MARGIN_X, y, "Cordialement,")
    y -= 4.2 * mm
    c.setFont("DMSans-SemiBold", 9.2)
    c.setFillColor(NAVY)
    c.drawString(MARGIN_X, y, "L’équipe Alpë Workwear")

    # CTA centré entre la lettre et le bandeau bas
    cta_y = (y + band_top) / 2
    draw_button(c, "Demander un devis partenaire", PAGE_W / 2, cta_y)

    # Bandeau avantages 3 colonnes (bas de page)
    c.setFillColor(NAVY)
    c.rect(0, footer_h, PAGE_W, band_h, fill=1, stroke=0)

    advantages = [
        ("01", "Devis", "Proposition claire,\nsans engagement"),
        ("02", "Broderie", "Marquage précis\nsur vos tenues"),
        ("03", "Livraison Suisse", "Coordination nationale\njusqu’à Sierre"),
    ]
    col_w = CONTENT_W / 3
    for i, (num, title, desc) in enumerate(advantages):
        cx = MARGIN_X + col_w * i + col_w / 2
        base = footer_h + band_h / 2
        c.setFont("DMSans-Bold", 8)
        c.setFillColor(MAGENTA)
        c.drawCentredString(cx, base + 7.5 * mm, num)
        c.setFont("DMSans-SemiBold", 10)
        c.setFillColor(white)
        c.drawCentredString(cx, base + 2.2 * mm, title)
        c.setFont("DMSans", 7.5)
        c.setFillColor(STEEL_PALE)
        for j, line in enumerate(desc.split("\n")):
            c.drawCentredString(cx, base - 2.5 * mm - j * 9, line)

        if i < 2:
            c.setStrokeColor(STEEL)
            c.setLineWidth(0.6)
            sep_x = MARGIN_X + col_w * (i + 1)
            c.line(sep_x, footer_h + 6 * mm, sep_x, footer_h + band_h - 6 * mm)

    # Mini footer page 1
    c.setFillColor(white)
    c.rect(0, 0, PAGE_W, footer_h, fill=1, stroke=0)
    c.setFont("DMSans", 7)
    c.setFillColor(STEEL_MUTED)
    c.drawCentredString(
        PAGE_W / 2,
        footer_h / 2 - 2,
        "info@alpeworkwear.ch  ·  +41 79 779 21 51  ·  www.alpeworkwear.ch",
    )


def draw_page2(c: canvas.Canvas) -> None:
    c.setFillColor(white)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    y = PAGE_H - 16 * mm

    # En-tête section produits
    c.setFont("DMSans-Medium", 8.5)
    c.setFillColor(STEEL)
    c.drawString(MARGIN_X, y, "SÉLECTION POUR VOS ÉQUIPES")
    y -= 6 * mm
    c.setFont("DMSans-Bold", 16)
    c.setFillColor(NAVY)
    c.drawString(MARGIN_X, y, "Trois pièces adaptées à votre centre")
    y -= 4 * mm
    y = draw_wrapped(
        c,
        "Softshell atelier, polo vente et gilet — personnalisables par broderie ou sérigraphie.",
        MARGIN_X,
        y,
        CONTENT_W,
        "DMSans",
        9,
        12,
        STEEL_MUTED,
    )
    y -= 6 * mm

    products = [
        (
            ASSETS["softshell"],
            "Softshell atelier",
            "Protection coupe-vent pour les équipes atelier — confort technique et logo brodé.",
        ),
        (
            ASSETS["polo"],
            "Polo vente",
            "Présentation soignée pour l’accueil et la vente — coupe nette, marquage discret.",
        ),
        (
            ASSETS["gilet"],
            "Gilet softshell",
            "Polyvalent pour showroom et déplacements — couche intermédiaire personnalisable.",
        ),
    ]

    gap = 5 * mm
    card_w = (CONTENT_W - 2 * gap) / 3
    img_h = 40 * mm
    card_body = 30 * mm
    card_h = img_h + card_body

    for i, (img_path, title, desc) in enumerate(products):
        x = MARGIN_X + i * (card_w + gap)
        img = rgb_cover_crop(img_path, int(card_w * 3), int(img_h * 3))
        c.drawImage(img, x, y - img_h, width=card_w, height=img_h, mask="auto")
        c.setFillColor(BG_ALT)
        c.rect(x, y - card_h, card_w, card_body, fill=1, stroke=0)
        c.setFont("DMSans-SemiBold", 9)
        c.setFillColor(NAVY)
        c.drawString(x + 2.5 * mm, y - img_h - 5 * mm, title)
        draw_wrapped(
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

    # Processus 01–05
    c.setFillColor(STEEL_PALE)
    c.rect(MARGIN_X, y - 32 * mm, CONTENT_W, 32 * mm, fill=1, stroke=0)

    c.setFont("DMSans-SemiBold", 9)
    c.setFillColor(NAVY)
    c.drawString(MARGIN_X + 4 * mm, y - 6 * mm, "Notre processus — de l’écoute à la livraison")

    steps = [
        ("01", "Écoute"),
        ("02", "Conception"),
        ("03", "Prototype"),
        ("04", "Production"),
        ("05", "Livraison"),
    ]
    step_w = CONTENT_W / 5
    for i, (num, label) in enumerate(steps):
        cx = MARGIN_X + step_w * i + step_w / 2
        c.setFont("DMSans-Bold", 11)
        c.setFillColor(MAGENTA)
        c.drawCentredString(cx, y - 15 * mm, num)
        c.setFont("DMSans-Medium", 8.5)
        c.setFillColor(TEXTILE)
        c.drawCentredString(cx, y - 21 * mm, label)
        if i < 4:
            c.setStrokeColor(STEEL)
            c.setLineWidth(0.8)
            c.line(cx + step_w / 2 - 2 * mm, y - 16.5 * mm, cx + step_w / 2 + 2 * mm, y - 16.5 * mm)

    y = y - 32 * mm - 9 * mm

    # Arguments centres auto
    c.setFont("DMSans-Medium", 8.5)
    c.setFillColor(STEEL)
    c.drawString(MARGIN_X, y, "POURQUOI ALPË POUR UN CENTRE AUTOMOBILE")
    y -= 5.5 * mm

    arguments = [
        "Image de marque cohérente entre showroom, vente et atelier — une seule signature visuelle.",
        "Marquage maîtrisé (broderie / sérigraphie) pour un rendu digne d’une concession premium.",
        "Catalogue workwear adapté aux métiers : softshell, polo, gilet, pièces terrain.",
        "Interlocuteur unique, devis partenaire et livraison coordonnée en Suisse (Valais inclus).",
    ]
    for arg in arguments:
        # Puce acier
        c.setFillColor(STEEL)
        c.circle(MARGIN_X + 1.8 * mm, y + 2, 1.4, fill=1, stroke=0)
        y = draw_wrapped(
            c,
            arg,
            MARGIN_X + 5 * mm,
            y,
            CONTENT_W - 5 * mm,
            "DMSans",
            9,
            12,
            TEXT,
        )
        y -= 3.5 * mm

    y -= 3 * mm

    # Prochaine étape
    box_h = 26 * mm
    c.setFillColor(NAVY)
    c.rect(MARGIN_X, y - box_h, CONTENT_W, box_h, fill=1, stroke=0)
    c.setFont("DMSans-SemiBold", 10)
    c.setFillColor(white)
    c.drawString(MARGIN_X + 5 * mm, y - 6.5 * mm, "Prochaine étape")
    draw_wrapped(
        c,
        "Indiquez-nous effectifs (accueil / vente / atelier), pièces souhaitées et volumes estimés. "
        "Nous vous remettons un devis partenaire sous 1 à 2 jours ouvrables.",
        MARGIN_X + 5 * mm,
        y - 12 * mm,
        CONTENT_W - 52 * mm,
        "DMSans",
        8.2,
        10.5,
        STEEL_PALE,
    )
    c.setFont("DMSans-SemiBold", 8)
    label = "info@alpeworkwear.ch"
    tw = c.stringWidth(label, "DMSans-SemiBold", 8)
    bx = PAGE_W - MARGIN_X - 5 * mm - tw - 12
    by = y - box_h / 2 - 7
    c.setFillColor(MAGENTA)
    c.roundRect(bx, by, tw + 12, 14, 2, fill=1, stroke=0)
    c.setFillColor(white)
    c.drawString(bx + 6, by + 3.5, label)

    y = y - box_h - 7 * mm

    # Footer contacts
    c.setStrokeColor(STEEL_PALE)
    c.setLineWidth(0.8)
    c.line(MARGIN_X, y, PAGE_W - MARGIN_X, y)
    y -= 6 * mm

    c.setFont("DMSans-Bold", 9)
    c.setFillColor(NAVY)
    c.drawString(MARGIN_X, y, "Alpë Workwear")
    c.setFont("DMSans", 8)
    c.setFillColor(STEEL_MUTED)
    c.drawRightString(PAGE_W - MARGIN_X, y, "Centre Porsche Sierre — Garage Olympic SA")
    y -= 4.5 * mm

    c.setFont("DMSans", 8)
    c.setFillColor(TEXT)
    c.drawString(MARGIN_X, y, "info@alpeworkwear.ch  ·  +41 79 779 21 51  ·  www.alpeworkwear.ch")
    y -= 4 * mm
    c.setFillColor(STEEL)
    c.setFont("DMSans-Medium", 8)
    c.drawString(MARGIN_X, y, "WhatsApp Business  ·  wa.me/41797792151")
    y -= 4 * mm
    c.setFont("DMSans", 7.5)
    c.setFillColor(STEEL_MUTED)
    c.drawString(
        MARGIN_X,
        y,
        "Destinataire : Route de la Bonne-Eau 2, 3960 Sierre  ·  porsche-sierre.ch",
    )


def export_previews(pdf_path: Path, preview_dir: Path) -> list[Path]:
    import fitz  # PyMuPDF

    preview_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path)
    out_paths: list[Path] = []
    # ~150 DPI pour relecture
    zoom = 150 / 72
    mat = fitz.Matrix(zoom, zoom)
    for i, page in enumerate(doc, start=1):
        pix = page.get_pixmap(matrix=mat, alpha=False)
        out = preview_dir / f"proposition-porsche-sierre-p{i}.png"
        pix.save(str(out))
        out_paths.append(out)
    doc.close()
    return out_paths


def main() -> int:
    register_fonts()
    ensure_assets()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # Date FR
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
    c.setTitle("Proposition Alpë Workwear — Centre Porsche Sierre")
    c.setAuthor("Alpë Workwear")
    c.setSubject("Proposition commerciale workwear B2B personnalisé")
    c.setCreator("scripts/generate-proposition-porsche-sierre.py")

    draw_page1(c, date_label)
    c.showPage()
    draw_page2(c)
    c.save()

    previews = export_previews(PDF_PATH, PREVIEW_DIR)
    print(f"PDF : {PDF_PATH.relative_to(ROOT)}")
    for p in previews:
        print(f"Aperçu : {p.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
