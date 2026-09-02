import assert from 'assert';
import { readFileSync } from 'fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

const expectedTags = [
	'<title>30,000 Feet — Seismic Standard</title>',
	'<link rel="canonical" href="https://seismicstandardmusic.com/">',
	'<meta property="og:type" content="website">',
	'<meta property="og:title" content="30,000 Feet — Seismic Standard">',
	'<meta property="og:url" content="https://seismicstandardmusic.com/">',
	'<meta property="og:image" content="https://seismicstandardmusic.com/images/30000-feet-cover.jpg">',
	'<meta name="twitter:card" content="summary_large_image">',
	'<meta name="twitter:title" content="30,000 Feet — Seismic Standard">',
	'<meta name="twitter:image" content="https://seismicstandardmusic.com/images/30000-feet-cover.jpg">',
];

for (const tag of expectedTags) {
	assert.ok(html.includes(tag), `Missing homepage metadata: ${tag}`);
}

const description =
	'Pre-save “30,000 Feet,” the debut single and music video from Seismic Standard, arriving September 17, 2026.';

assert.ok(
	html.includes(`<meta name="description" content="${description}">`),
	'Missing release-focused meta description',
);
assert.ok(
	html.includes(`<meta property="og:description" content="${description}">`),
	'Missing Open Graph description',
);
assert.ok(
	html.includes(`<meta name="twitter:description" content="${description}">`),
	'Missing Twitter description',
);

console.log('PASS homepage release metadata');
