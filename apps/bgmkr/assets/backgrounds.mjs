// SPDX-License-Identifier: AGPL-3.0-or-later
// Original, locally shipped artwork. No stock-image service or attribution dependency.
export const BACKGROUNDS = [
  { id: 'golden-hour', name: 'Golden Hour', description: 'Warm sunset sky with a glowing sun' },
  { id: 'deep-ocean', name: 'Deep Ocean', description: 'Teal water with light rays and bubbles' },
  { id: 'meadow-sky', name: 'Meadow Sky', description: 'Green hills under a bright, cloudy sky' },
  { id: 'studio-charcoal', name: 'Studio Charcoal', description: 'A dark studio spotlight for portraits' },
  { id: 'dotted-cream', name: 'Dotted Cream', description: 'A soft cream backdrop with gentle dots' },
  { id: 'aurora-night', name: 'Aurora Night', description: 'Night sky with aurora bands and stars' }
].map(background => ({ ...background, url: new URL(`./backgrounds/${background.id}.svg`, import.meta.url).href }));

export function backgroundRect(sourceWidth, sourceHeight, width, height, fit = 'cover') {
  if (![sourceWidth, sourceHeight, width, height].every(n => Number.isFinite(n) && n > 0)) throw new Error('Invalid background dimensions.');
  if (!['cover', 'contain'].includes(fit)) throw new Error('Choose fill frame or fit entire image.');
  const scale = Math[fit === 'contain' ? 'min' : 'max'](width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale, drawHeight = sourceHeight * scale;
  return { x: (width - drawWidth) / 2, y: (height - drawHeight) / 2, width: drawWidth, height: drawHeight };
}

export function drawBackground(ctx, width, height, { type = 'transparent', color = '#ffffff', image, fit = 'cover' } = {}, jpeg = false) {
  if (type === 'white' || type === 'color' || jpeg || (type === 'image' && fit === 'contain')) { ctx.fillStyle = type === 'color' ? color : '#ffffff'; ctx.fillRect(0, 0, width, height); }
  if (type === 'image') {
    if (!image) throw new Error('Choose a replacement background first.');
    const rect = backgroundRect(image.width, image.height, width, height, fit);
    ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height);
  }
}
