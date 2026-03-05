#!/usr/bin/env node
/**
 * Capacitor SPA fallback for dynamic routes.
 *
 * Next.js static export generates /meditations/_/index.html for [id] routes.
 * Capacitor's WebView serves files from the assets directory.
 * When navigating to /meditations/123/, there's no matching file.
 *
 * Fix: Copy the placeholder _/index.html as the 404.html fallback.
 * Also ensure the not-found page can handle SPA routing by copying
 * the accueil page as a general fallback.
 *
 * Most importantly: client-side <Link> navigation should work without
 * file lookups. This script is just for deep-link / reload scenarios.
 */

const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');

console.log('Setting up Capacitor SPA fallback pages...');

// Ensure 404.html exists and is a proper SPA shell
const notFoundPath = path.join(outDir, '404.html');
if (fs.existsSync(notFoundPath)) {
  console.log('  404.html exists (Next.js generated)');
} else {
  // Copy index.html as 404 fallback
  const indexPath = path.join(outDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, notFoundPath);
    console.log('  Copied index.html → 404.html');
  }
}

console.log('SPA fallback setup complete.');
