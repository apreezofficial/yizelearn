import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root = new URL('../', import.meta.url);
const snapshots = JSON.parse(await readFile(new URL('src/lib/og-snapshots.json', root), 'utf8'));
const base = process.env.METADATA_TEST_URL || 'http://localhost:3002';
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const errors = [];
async function check(path) {
  try {
    const res = await fetch(new URL(path, base), {headers: {'User-Agent': 'Twitterbot/1.0'}});
    assert.equal(res.status, 200, `${path} HTTP response`);
    const html = await res.text();
    const tags = [...html.matchAll(/<meta\s[^>]*>/g)].map(m => m[0]);
    const meta = name => tags.find(t => attribute(t, 'property') === name || attribute(t, 'name') === name);
    const value = name => attribute(meta(name) ?? '', 'content');
    for (const key of ['description', 'og:title', 'og:description', 'og:url', 'og:image', 'og:image:width', 'og:image:height', 'og:image:alt', 'twitter:title', 'twitter:description', 'twitter:image']) assert(value(key), `${path} missing ${key}`);
    assert.equal(value('twitter:card'), 'summary_large_image', path);
    assert.equal(value('og:image:width'), '1200', path);
    assert.equal(value('og:image:height'), '630', path);
    const image = new URL(value('og:image'));
    assert.equal(image.pathname, snapshots[path], `${path} wrong snapshot`);
    await access(fileURLToPath(new URL(`public${image.pathname}`, root)));
    const canonicalTag = [...html.matchAll(/<link\s[^>]*>/g)].map(m => m[0]).find(t => attribute(t, 'rel') === 'canonical');
    assert.equal(new URL(attribute(canonicalTag ?? '', 'href')).pathname, path, `${path} canonical`);
    assert(html.match(/<title>[^<]+<\/title>/), `${path} missing title`);
    if (path.startsWith('/dashboard') || ['/login', '/signup', '/certificates/preview', '/verify/DEMO'].includes(path)) assert(value('robots')?.includes('noindex'), `${path} must not be indexed`);
  } catch (error) {errors.push(error.message);}
}
const paths = Object.keys(snapshots);
for(let i = 0; i < paths.length; i += 4) await Promise.all(paths.slice(i, i + 4).map(check));
if(errors.length) {console.error(errors.join('\n')); process.exitCode = 1;} else console.log(`Verified titles, descriptions, canonical URLs, Open Graph, Twitter cards and snapshot assets for all ${paths.length} routes.`);
