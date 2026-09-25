#!/usr/bin/env node
/**
 * Génère sitemap.xml à partir des pages HTML publiques à la racine du site.
 * Usage : node scripts/generate-sitemap.js
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = 'https://www.alpeworkwear.ch';

/** Pages indexables — alignées sur assets/js/layout.js + pages légales du footer. */
const PAGES = [
  { file: 'index.html', loc: '/', priority: '1.0', changefreq: 'monthly' },
  { file: 'catalogue.html', loc: '/catalogue.html', priority: '0.8', changefreq: 'monthly' },
  { file: 'confection.html', loc: '/confection.html', priority: '0.8', changefreq: 'monthly' },
  {
    file: 'confection-sur-mesure.html',
    loc: '/confection-sur-mesure.html',
    priority: '0.8',
    changefreq: 'monthly',
    alternates: [
      { hreflang: 'fr', href: `${BASE_URL}/confection-sur-mesure.html` },
      { hreflang: 'en', href: `${BASE_URL}/en/cut-and-sew-manufacturing.html` },
      { hreflang: 'x-default', href: `${BASE_URL}/confection-sur-mesure.html` },
    ],
  },
  {
    file: 'en/cut-and-sew-manufacturing.html',
    loc: '/en/cut-and-sew-manufacturing.html',
    priority: '0.8',
    changefreq: 'monthly',
    alternates: [
      { hreflang: 'fr', href: `${BASE_URL}/confection-sur-mesure.html` },
      { hreflang: 'en', href: `${BASE_URL}/en/cut-and-sew-manufacturing.html` },
      { hreflang: 'x-default', href: `${BASE_URL}/confection-sur-mesure.html` },
    ],
  },
  { file: 'realisations.html', loc: '/realisations.html', priority: '0.8', changefreq: 'monthly' },
  { file: 'faq.html', loc: '/faq.html', priority: '0.8', changefreq: 'monthly' },
  { file: 'contact.html', loc: '/contact.html', priority: '0.8', changefreq: 'monthly' },
  {
    file: 'vetements-travail-batiment-artisans.html',
    loc: '/vetements-travail-batiment-artisans.html',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    file: 'vetements-travail-nettoyage.html',
    loc: '/vetements-travail-nettoyage.html',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    file: 'vetements-travail-paysagiste.html',
    loc: '/vetements-travail-paysagiste.html',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    file: 'vetements-travail-garage-mecanique.html',
    loc: '/vetements-travail-garage-mecanique.html',
    priority: '0.8',
    changefreq: 'monthly',
  },
  { file: 'workwear-geneve.html', loc: '/workwear-geneve.html', priority: '0.7', changefreq: 'monthly' },
  { file: 'workwear-lausanne.html', loc: '/workwear-lausanne.html', priority: '0.7', changefreq: 'monthly' },
  { file: 'workwear-zurich.html', loc: '/workwear-zurich.html', priority: '0.7', changefreq: 'monthly' },
  { file: 'workwear-berne.html', loc: '/workwear-berne.html', priority: '0.7', changefreq: 'monthly' },
  { file: 'workwear-bale.html', loc: '/workwear-bale.html', priority: '0.7', changefreq: 'monthly' },
  { file: 'workwear-valais.html', loc: '/workwear-valais.html', priority: '0.7', changefreq: 'monthly' },
  {
    file: 'confidentialite.html',
    loc: '/confidentialite.html',
    priority: '0.3',
    changefreq: 'yearly',
  },
  {
    file: 'mentions-legales.html',
    loc: '/mentions-legales.html',
    priority: '0.3',
    changefreq: 'yearly',
  },
];

function getLastMod(file) {
  const filePath = path.join(ROOT, file);
  try {
    const gitDate = execSync(`git log -1 --format=%cs -- "${filePath}"`, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (gitDate) return gitDate;
  } catch {
    /* hors dépôt git ou fichier non versionné */
  }
  const { mtime } = fs.statSync(filePath);
  return mtime.toISOString().slice(0, 10);
}

function buildSitemap() {
  const urls = PAGES.map((page) => {
    const filePath = path.join(ROOT, page.file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Page manquante : ${page.file}`);
    }
    const lastmod = getLastMod(page.file);
    const loc = `${BASE_URL}${page.loc}`;
    const alternates = (page.alternates || [])
      .map(
        (alt) =>
          `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}"/>`
      )
      .join('\n');
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${page.changefreq}</changefreq>`,
      `    <priority>${page.priority}</priority>`,
      alternates,
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n');
  });

  const xmlns = PAGES.some((page) => page.alternates && page.alternates.length)
    ? '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
    : '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    xmlns,
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

const outputPath = path.join(ROOT, 'sitemap.xml');
fs.writeFileSync(outputPath, buildSitemap(), 'utf8');
console.log(`Sitemap généré : ${outputPath} (${PAGES.length} URLs)`);
