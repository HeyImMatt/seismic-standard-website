export const GA_MEASUREMENT_ID = 'G-D3J4TEPJR8';

export function isValidMeasurementId(value) {
	return (
		typeof value === 'string' &&
		/^G-[A-Z0-9]{7,15}$/.test(value) &&
		!/^G-X+$/.test(value)
	);
}

export function getDestinationHost(value) {
	try {
		const url = new URL(value);
		if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
		return url.hostname.replace(/^www\./, '');
	} catch (_error) {
		return '';
	}
}

export function trackEvent(name, parameters = {}) {
	if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
		return false;
	}

	window.gtag('event', name, parameters);
	return true;
}

export function initAnalytics(measurementId = GA_MEASUREMENT_ID) {
	if (
		typeof window === 'undefined' ||
		typeof document === 'undefined' ||
		!isValidMeasurementId(measurementId)
	) {
		return false;
	}

	window.dataLayer = window.dataLayer || [];
	window.gtag =
		window.gtag ||
		function gtag() {
			window.dataLayer.push(arguments);
		};

	if (!document.getElementById('google-analytics-tag')) {
		const script = document.createElement('script');
		script.id = 'google-analytics-tag';
		script.async = true;
		script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
			measurementId,
		)}`;
		document.head.appendChild(script);
	}

	window.gtag('js', new Date());
	window.gtag('config', measurementId);
	return true;
}

export function initDeclarativeTracking() {
	if (typeof document === 'undefined') return;

	document.querySelectorAll('[data-track-event]').forEach((element) => {
		if (element.dataset.trackingBound === 'true') return;

		element.dataset.trackingBound = 'true';
		element.addEventListener('click', () => {
			const destination = element.getAttribute('href') || '';
			trackEvent(element.dataset.trackEvent, {
				cta_type: element.dataset.trackType || undefined,
				destination_host: getDestinationHost(destination) || undefined,
				release_mode: element.dataset.releaseMode || undefined,
			});
		});
	});
}

function bootAnalytics() {
	initAnalytics();
	initDeclarativeTracking();
}

if (typeof document !== 'undefined') {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', bootAnalytics, { once: true });
	} else {
		bootAnalytics();
	}
}
