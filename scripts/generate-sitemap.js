#!/usr/bin/env node
/**
 * Génère sitemap.xml à partir des pages HTML publiques à la racine du site.
 * Usage : node scripts/generate-sitemap.js
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE_URL = 'https://www.alpeworkwear.ch';

/** Pages indexables — alignées sur assets/js/layout.js + pages légales du footer. */
const PAGES = [
  { file: 'index.html', loc: '/', priority: '1.0', changefreq: 'monthly' },
  { file: 'catalogue.html', loc: '/catalogue.html', priority: '0.8', changefreq: 'monthly' },
  { file: 'confection.html', loc: '/confection.html', priority: '0.8', changefreq: 'monthly' },
  { file: 'realisations.html', loc: '/realisations.html', priority: '0.8', changefreq: 'monthly' },
  { file: 'faq.html', loc: '/faq.html', priority: '0.8', changefreq: 'monthly' },
  { file: 'contact.html', loc: '/contact.html', priority: '0.8', changefreq: 'monthly' },
  { file: 'workwear-geneve.html', loc: '/workwear-geneve.html', priority: '0.7', changefreq: 'monthly' },
  { file: 'workwear-lausanne.html', loc: '/workwear-lausanne.html', priority: '0.7', changefreq: 'monthly' },
  { file: 'workwear-zurich.html', loc: '/workwear-zurich.html', priority: '0.7', changefreq: 'monthly' },
  { file: 'workwear-berne.html', loc: '/workwear-berne.html', priority: '0.7', changefreq: 'monthly' },
  { file: 'workwear-bale.html', loc: '/workwear-bale.html', priority: '0.7', changefreq: 'monthly' },
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
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${page.changefreq}</changefreq>`,
      `    <priority>${page.priority}</priority>`,
      '  </url>',
    ].join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

const outputPath = path.join(ROOT, 'sitemap.xml');
fs.writeFileSync(outputPath, buildSitemap(), 'utf8');
console.log(`Sitemap généré : ${outputPath} (${PAGES.length} URLs)`);
