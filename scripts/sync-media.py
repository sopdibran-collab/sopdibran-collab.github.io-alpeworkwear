#!/usr/bin/env python3
"""Sync catalogue, client logos, réalisations and timeline images from Alpë source folders."""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = Path.home() / "Documents/AlpëWorkwear/Alpë"
SRC_CAT = SRC / "Catalogue/Articles"
SRC_VITRINE = SRC / "Catalogue/Vitrine"
SRC_COCREATION = SRC / "Visuels/Co-création"
SRC_VIS = SRC / "Visuels"
SRC_CLIENTS = Path.home() / "Documents/AlpëWorkwear/clients"
SRC_LOGOS = SRC / "Logo clients"

OUT_CAT = ROOT / "assets/catalogue"
OUT_TIMELINE = ROOT / "assets/images/timeline"
OUT_REAL = ROOT / "assets/images/clients/realisations"
OUT_LOGOS = ROOT / "assets/images/clients/logos"
OUT_REAL_DATA = ROOT / "data/realisations.json"

# (source path, output slug, alt text, optional crop focus: center|upper|lower)
TIMELINE_SOURCES: list[tuple[Path, str, str] | tuple[Path, str, str, str]] = [
    (
        SRC_COCREATION / "01-ecoute.png",
        "ecoute",
        "Consultation client avec échantillons textile — étape écoute",
    ),
    (
        SRC_COCREATION / "02-conception.png",
        "conception",
        "Conception de la gamme vestes techniques — étape conception",
    ),
    (
        SRC_COCREATION / "03-prototype.png",
        "prototype",
        "Essayage du prototype sur chantier — étape prototype",
    ),
    (
        SRC_COCREATION / "04-production.png",
        "production",
        "Broderie industrielle en atelier — étape production",
    ),
    (
        SRC_COCREATION / "05-livraison.png",
        "livraison",
        "Tenue workwear livrée sur chantier — étape livraison",
    ),
]

REALISATION_SKIP_DIRS = {"Co-création", "Co-creation"}

LOGO_SOURCES = [
    (SRC_LOGOS / "Cantin Sàrl/logo.svg", "cantin.svg"),
    (SRC_LOGOS / "Bestek SàRL/logo.svg", "bestek.svg"),
    (SRC_LOGOS / "Visa barber/logo.svg", "visa-barber.svg"),
    (SRC_LOGOS / "Gashi Sprinkler Sàrl/logo.svg", "gashi-sprinkler.svg"),
    (SRC_LOGOS / "Manon Regamey/logo.svg", "manon-regamey.svg"),
    (SRC_LOGOS / "Sopjani Tech Sàrl/logoblanc.svg", "sopjani-tech.svg"),
    (SRC_LOGOS / "Gzimmo Sàrl/gzimmo_horizontal/gzimmo_horizontal.svg", "gzimmo.svg"),
]


def crop_landscape(
    img: Image.Image,
    target_w: int,
    target_h: int,
    focus: str = "center",
) -> Image.Image:
    w, h = img.size
    target_ratio = target_w / target_h
    current_ratio = w / h
    if current_ratio > target_ratio:
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        img = img.crop((left, 0, left + new_w, h))
    else:
        new_h = int(w / target_ratio)
        if focus == "upper":
            top = 0
        elif focus == "lower":
            top = max(0, h - new_h)
        else:
            top = (h - new_h) // 2
        img = img.crop((0, top, w, top + new_h))
    return img.resize((target_w, target_h), Image.Resampling.LANCZOS)


def save_webp(img: Image.Image, path: Path, quality: int = 82) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
    img.save(path, "WEBP", quality=quality, method=6)


def sync_catalogue() -> None:
    OUT_CAT.mkdir(parents=True, exist_ok=True)
    for src in sorted(SRC_CAT.iterdir()):
        if src.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}:
            shutil.copy2(src, OUT_CAT / src.name)


def sync_timeline() -> None:
    OUT_TIMELINE.mkdir(parents=True, exist_ok=True)
    manifest: list[dict[str, str]] = []
    for entry in TIMELINE_SOURCES:
        src, slug, alt = entry[0], entry[1], entry[2]
        focus = entry[3] if len(entry) > 3 else "center"
        if not src.exists():
            print(f"skip missing timeline source: {src}")
            continue
        with Image.open(src) as img:
            rgb = img.convert("RGB")
            main = crop_landscape(rgb, 1200, 525, focus)
            thumb = crop_landscape(rgb, 240, 96, focus)
            save_webp(main, OUT_TIMELINE / f"timeline-{slug}.webp")
            save_webp(thumb, OUT_TIMELINE / f"timeline-{slug}-thumb.webp")
        manifest.append({"slug": slug, "src": str(src), "alt": alt})
    (ROOT / "data/timeline.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def slugify(name: str) -> str:
    stem = Path(name).stem.lower()
    return re.sub(r"[^a-z0-9]+", "-", stem).strip("-")


def alt_from_filename(filename: str, client_folder: str = "") -> str:
    name = filename.lower()
    folder = client_folder.lower()
    if "bestek" in name or "bestek" in folder:
        client = "Bestek Sàrl"
    elif "visa" in name or "visabarber" in name or "visa" in folder:
        client = "Visa Barber"
    elif "sopjani" in name or "sopjani" in folder:
        client = "Sopjani Tech Sàrl"
    elif "gashi" in name or "gashi" in folder:
        client = "Gashi Sprinkler Sàrl"
    elif "manon" in name or "manon" in folder:
        client = "Manon Regamey Sàrl"
    elif "cantin" in name or "cantin" in folder:
        client = "Cantin Sàrl"
    else:
        client = "Client Alpë Workwear"

    details: list[str] = []
    if "softshell" in name:
        details.append("softshell")
    if "tshirt" in name:
        details.append("t-shirt")
    if "blanc" in name:
        details.append("blanc")
    if "dos" in name:
        details.append("vue dos")

    if details:
        return f"{client} — {', '.join(details)}"
    return f"{client} — réalisation personnalisée"


def is_realisation_source(path: Path) -> bool:
    if path.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
        return False
    stem = path.stem.lower()
    return stem.startswith("visu") or stem.startswith("visa")


def sync_realisations() -> None:
    OUT_REAL.mkdir(parents=True, exist_ok=True)
    sources: list[tuple[Path, str]] = []

    if SRC_VIS.is_dir():
        for client_dir in sorted(SRC_VIS.iterdir()):
            if not client_dir.is_dir() or client_dir.name in REALISATION_SKIP_DIRS:
                continue
            for src in sorted(client_dir.iterdir()):
                if is_realisation_source(src):
                    sources.append((src, client_dir.name))
    elif SRC_CLIENTS.is_dir():
        for src in sorted(SRC_CLIENTS.iterdir()):
            if is_realisation_source(src):
                sources.append((src, ""))

    if not sources:
        print("skip realisations: no visu* sources found in Visuels/ or clients/")
        return

    for old in OUT_REAL.glob("*.webp"):
        old.unlink()

    items: list[dict[str, str | int]] = []
    for src, client_folder in sources:
        slug = slugify(src.name)
        out_path = OUT_REAL / f"{slug}.webp"
        with Image.open(src) as img:
            out = img.convert("RGB")
            w, h = out.size
            if max(w, h) > 1200:
                out.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
            save_webp(out, out_path)
            w, h = out.size
        items.append(
            {
                "id": slug,
                "src": f"assets/images/clients/realisations/{slug}.webp",
                "alt": alt_from_filename(src.name, client_folder),
                "width": w,
                "height": h,
            }
        )

    OUT_REAL_DATA.parent.mkdir(parents=True, exist_ok=True)
    OUT_REAL_DATA.write_text(json.dumps(items, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def load_logo_image(src: Path) -> Image.Image:
    if src.suffix.lower() == ".pdf":
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
            tmp_path = Path(tmp.name)
        subprocess.run(
            ["sips", "-s", "format", "png", str(src), "--out", str(tmp_path)],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        img = Image.open(tmp_path).convert("RGBA")
        tmp_path.unlink(missing_ok=True)
        return img
    return Image.open(src).convert("RGBA")


def sync_logos() -> None:
    OUT_LOGOS.mkdir(parents=True, exist_ok=True)
    for src, name in LOGO_SOURCES:
        if not src.exists():
            print(f"skip missing logo: {src}")
            continue
        if src.suffix.lower() == ".svg":
            shutil.copy2(src, OUT_LOGOS / name)
            continue
        out = load_logo_image(src)
        if "bestek" in name:
            w, h = out.size
            out = out.crop((0, 0, w, int(h * 0.72)))
        w, h = out.size
        max_dim = max(w, h)
        if max_dim > 320:
            scale = 320 / max_dim
            out = out.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
        target = OUT_LOGOS / (name if name.endswith(".webp") else name.replace(".png", ".webp"))
        save_webp(out.convert("RGB"), target, quality=90)


def main() -> None:
    sync_catalogue()
    sync_timeline()
    sync_realisations()
    sync_logos()
    print("Media sync complete.")


if __name__ == "__main__":
    main()
