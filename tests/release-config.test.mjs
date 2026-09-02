import assert from 'assert';
import { readFileSync } from 'fs';

import {
	getReleaseActions,
	getTeaserDestination,
	releaseConfig,
} from '../js/release-config.mjs';

const tests = [];

function test(name, run) {
	tests.push({ name, run });
}

test('pre-release mode exposes only the live Show.co action', () => {
	assert.deepEqual(getReleaseActions(releaseConfig), [
		{
			id: 'pre_save',
			label: 'Pre-save & Follow on Spotify',
			url: 'https://show.co/9vLQ9Cs',
		},
	]);
});

test('released mode exposes only configured destinations', () => {
	assert.deepEqual(
		getReleaseActions({
			...releaseConfig,
			mode: 'released',
			listenUrl: 'https://example.com/listen',
		}),
		[
			{
				id: 'listen_everywhere',
				label: 'Listen Everywhere',
				url: 'https://example.com/listen',
			},
		],
	);
});

test('released mode omits every unconfigured destination', () => {
	assert.deepEqual(
		getReleaseActions({ ...releaseConfig, mode: 'released' }),
		[],
	);
});

test('missing teaser ID uses the YouTube channel fallback', () => {
	assert.deepEqual(getTeaserDestination({ ...releaseConfig, teaserVideoId: '' }), {
		type: 'link',
		value: releaseConfig.youtubeChannelUrl,
	});
});

test('live release configuration loads the 30,000 Feet trailer', () => {
	assert.deepEqual(getTeaserDestination(releaseConfig), {
		type: 'embed',
		value: 'https://www.youtube-nocookie.com/embed/Ffm4WeMkOQ0?rel=0',
	});
});

test('initial homepage markup loads the current trailer without a content flash', () => {
	const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
	assert.ok(
		html.includes(
			'https://www.youtube-nocookie.com/embed/Ffm4WeMkOQ0?rel=0',
		),
	);
});

test('configured teaser ID produces a privacy-enhanced embed URL', () => {
	assert.deepEqual(
		getTeaserDestination({ ...releaseConfig, teaserVideoId: 'abc123_X-y' }),
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
			preSaveUrl: 'javascript:alert(1)',
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
