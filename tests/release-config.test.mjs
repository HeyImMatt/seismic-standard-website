import assert from 'assert';
import { readFileSync } from 'fs';

import {
	getOfficialVideoDestination,
	getReleaseActions,
	releaseConfig,
} from '../js/release-config.mjs';

const tests = [];

function test(name, run) {
	tests.push({ name, run });
}

test('live release exposes equal direct links to each streaming service', () => {
	assert.deepEqual(getReleaseActions(releaseConfig), [
		{
			id: 'spotify',
			label: 'Spotify',
			url: 'https://open.spotify.com/album/68AazSEd5ehZBDzODKd47V',
		},
		{
			id: 'apple_music',
			label: 'Apple',
			url: 'https://music.apple.com/us/album/30-000-feet-single/6802846065',
		},
		{
			id: 'amazon_music',
			label: 'Amazon',
			url: 'https://music.amazon.com/tracks/B0HFPRXMLK',
		},
	]);
});

test('release omits unconfigured or unsafe service destinations', () => {
	assert.deepEqual(
		getReleaseActions({
			...releaseConfig,
			spotifyUrl: 'javascript:alert(1)',
			appleMusicUrl: '',
			amazonMusicUrl: '',
		}),
		[],
	);
});

test('missing official video ID uses the YouTube channel fallback', () => {
	assert.deepEqual(
		getOfficialVideoDestination({
			...releaseConfig,
			officialVideoId: '',
		}),
		{
			type: 'link',
			value: releaseConfig.youtubeChannelUrl,
		},
	);
});

test('live release configuration loads the official music video', () => {
	assert.deepEqual(getOfficialVideoDestination(releaseConfig), {
		type: 'embed',
		value: 'https://www.youtube-nocookie.com/embed/z1rh_mLsXPI?rel=0',
	});
});

test('initial homepage markup shows the live release without a content flash', () => {
	const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
	assert.ok(
		html.includes(
			'https://www.youtube-nocookie.com/embed/z1rh_mLsXPI?rel=0',
		),
	);
	assert.ok(html.includes('<span>Official Music Video</span>'));
	assert.ok(html.includes('Released September 17, 2026'));
	assert.match(
		html,
		/Our debut single is\s+airborne! Watch the official music video/,
	);
	assert.ok(html.includes('data-release-mode="released"'));
	for (const service of ['YouTube', 'Instagram', 'Facebook']) {
		assert.match(
			html,
			new RegExp(
				`<a class="release-social-action"[^>]*aria-label="${service}"`,
				's',
			),
		);
	}
});

test('configured official video ID produces a privacy-enhanced embed URL', () => {
	assert.deepEqual(
		getOfficialVideoDestination({
			...releaseConfig,
			officialVideoId: 'abc123_X-y',
		}),
		{
			type: 'embed',
			value: 'https://www.youtube-nocookie.com/embed/abc123_X-y?rel=0',
		},
	);
});

test('unsafe URLs are never returned as actions', () => {
	assert.deepEqual(
		getReleaseActions({
			...releaseConfig,
			spotifyUrl: 'javascript:alert(1)',
			appleMusicUrl: 'javascript:alert(1)',
			amazonMusicUrl: 'javascript:alert(1)',
		}),
		[],
	);
});

let failures = 0;

for (const { name, run } of tests) {
	try {
		run();
		console.log(`PASS ${name}`);
	} catch (error) {
		failures += 1;
		console.error(`FAIL ${name}`);
		console.error(error);
	}
}

if (failures > 0) process.exitCode = 1;
