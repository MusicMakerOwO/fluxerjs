#!/usr/bin/env node
/**
 * Generate shortcode→unicode map from emojilib (same data source as node-emoji).
 * Run: pnpm exec tsx scripts/generate-emoji-shortcodes.ts
 *
 * emojilib format: { "😀": ["grinning_face", "face", "smile", ...], ... }
 * We invert to: { "grinning_face": "😀", "face": "😀", ... }
 *
 * Manual overrides for aliases not in emojilib (e.g. light_blue_heart → 💙).
 */
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, join } from 'node:path';

const cwd = process.cwd();
// Turbo/pnpm run build from packages/util, so cwd may be repo root OR packages/util
const repoRoot =
  basename(cwd) === 'util' && basename(dirname(cwd)) === 'packages' ? join(cwd, '../..') : cwd;
const utilPath = join(repoRoot, 'packages/util');
const require = createRequire(join(repoRoot, 'package.json'));

const emojilibPath = require.resolve('emojilib', { paths: [utilPath] });
// emojilib: emoji → [keywords]. node-emoji uses emojilib.
const emojilibData = require(emojilibPath) as Record<string, string[]>;

const map: Record<string, string> = {};

for (const [emoji, keywords] of Object.entries(emojilibData)) {
  if (!Array.isArray(keywords)) continue;
  for (const kw of keywords) {
    // Skip invalid shortcodes: colons, too short, or non-word chars
    const normalized = String(kw).replace(/\s+/g, '_').trim();
    if (normalized.length < 2 || /[:()]/.test(normalized)) continue;
    // Only allow snake_case / word chars for :name: format
    if (!/^[\w_]+$/.test(normalized)) continue;
    map[normalized.toLowerCase()] = emoji;
  }
}

// Manual overrides: aliases not in emojilib (e.g. Slack/GitHub use light_blue_heart)
const overrides: Record<string, string> = {
  light_blue_heart: '💙',
};

for (const [shortcode, emoji] of Object.entries(overrides)) {
  map[shortcode.toLowerCase()] = emoji;
}

const output = `/**
 * Auto-generated from emojilib (same source as node-emoji).
 * Run: pnpm exec tsx scripts/generate-emoji-shortcodes.ts
 */
export const UNICODE_EMOJI_SHORTCODES: Record<string, string> = ${JSON.stringify(map, null, 0)};
`;

const outPath = join(utilPath, 'src/emojiShortcodes.generated.ts');
writeFileSync(outPath, output, 'utf8');
console.log(`Wrote ${outPath} (${Object.keys(map).length} shortcodes)`);
