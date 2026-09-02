import assert from 'assert';

import {
	GA_MEASUREMENT_ID,
	getDestinationHost,
	isValidMeasurementId,
	trackEvent,
} from '../js/analytics.mjs';

const tests = [];

function test(name, run) {
	tests.push({ name, run });
}

test('accepts GA4 measurement IDs and rejects empty or example values', () => {
	assert.equal(isValidMeasurementId('G-ABC123DEF4'), true);
	assert.equal(isValidMeasurementId(''), false);
	assert.equal(isValidMeasurementId('G-XXXXXXXXXX'), false);
	assert.equal(isValidMeasurementId('UA-12345-6'), false);
});

test('uses the production GA4 web-stream measurement ID', () => {
	assert.equal(GA_MEASUREMENT_ID, 'G-D3J4TEPJR8');
});

test('tracking is harmless without browser globals or configured GA', () => {
	assert.doesNotThrow(() =>
		trackEvent('release_cta_click', { release_mode: 'pre-release' }),
	);
});

test('destination host reports only safe web URLs', () => {
	assert.equal(getDestinationHost('https://show.co/9vLQ9Cs'), 'show.co');
	assert.equal(getDestinationHost('javascript:alert(1)'), '');
	assert.equal(getDestinationHost('not a url'), '');
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
