import assert from 'assert';
import { readFileSync } from 'fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function position(marker) {
	const index = html.indexOf(marker);
	assert.notEqual(index, -1, `Missing expected homepage marker: ${marker}`);
	return index;
}

const heroStart = position('<!-- Hero Section -->');
const releaseStart = position('<main id="release-content"');
const showsStart = position('<section id="shows">');
const watchStart = position('<section id="watch">');
const aboutStart = position('<section id="about">');
const listenStart = position('<section id="tracks">');

assert.ok(heroStart < releaseStart, 'The band-photo hero should lead the homepage');
assert.ok(releaseStart < showsStart, '30,000 Feet should precede Shows');
assert.ok(showsStart < watchStart, 'Shows should precede Watch');
assert.ok(watchStart < aboutStart, 'Watch should precede About');
assert.ok(aboutStart < listenStart, 'About should precede Listen');

assert.ok(!html.includes('<template id="original-home-hero">'), 'The restored hero must be active, not stored in a template');
assert.ok(!html.includes('about-grid'), 'About should return to the text-only layout');
assert.ok(!html.includes('about-photo-frame'), 'About should not include the staircase photo');

for (const navigation of [
	'<a href="#release-content" class="nav-link"',
	'<a href="#shows" class="nav-link">Shows</a>',
	'<a href="#watch" class="nav-link">Watch</a>',
	'<a href="#about" class="nav-link">About</a>',
	'<a href="#tracks" class="nav-link">Listen</a>',
]) {
	position(navigation);
}

const desktopNavOrder = [
	position('data-release-mode="released">30,000 Feet</a>'),
	position('<a href="#shows" class="nav-link">Shows</a>'),
	position('<a href="#watch" class="nav-link">Watch</a>'),
	position('<a href="#about" class="nav-link">About</a>'),
	position('<a href="#tracks" class="nav-link">Listen</a>'),
];
assert.deepEqual([...desktopNavOrder].sort((a, b) => a - b), desktopNavOrder, 'Desktop navigation should follow the homepage order');

const mobileNavOrder = [
	position('data-release-mode="released">30,000 Feet</a>'),
	position('<a href="#shows" class="mobile-nav-link">Shows</a>'),
	position('<a href="#watch" class="mobile-nav-link">Watch</a>'),
	position('<a href="#about" class="mobile-nav-link">About</a>'),
	position('<a href="#tracks" class="mobile-nav-link">Listen</a>'),
];
assert.deepEqual([...mobileNavOrder].sort((a, b) => a - b), mobileNavOrder, 'Mobile navigation should follow the homepage order');

console.log('PASS homepage section and navigation order');
