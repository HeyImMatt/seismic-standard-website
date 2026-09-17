import {
	getOfficialVideoDestination,
	getReleaseActions,
	releaseConfig,
} from './release-config.mjs?v=20260917-3';
import {
	initDeclarativeTracking,
	trackEvent,
} from './analytics.mjs';

const RELEASE_MODE = 'released';

function createServiceIcon(service) {
	const namespace = 'http://www.w3.org/2000/svg';
	const icon = document.createElementNS(namespace, 'svg');
	icon.classList.add('release-service-icon', `release-service-icon-${service}`);
	icon.setAttribute('viewBox', '0 0 24 24');
	icon.setAttribute('aria-hidden', 'true');

	if (service === 'spotify') {
		const circle = document.createElementNS(namespace, 'circle');
		circle.setAttribute('cx', '12');
		circle.setAttribute('cy', '12');
		circle.setAttribute('r', '10');
		icon.appendChild(circle);

		[
			'M6.7 9.1c3.7-1.1 7.8-.8 10.9 1',
			'M7.4 12.1c3.1-.8 6.6-.5 9.3.9',
			'M8.1 15c2.5-.6 5.2-.3 7.5.8',
		].forEach((definition) => {
			const path = document.createElementNS(namespace, 'path');
			path.setAttribute('d', definition);
			icon.appendChild(path);
		});
		return icon;
	}

	if (service === 'apple_music') {
		const path = document.createElementNS(namespace, 'path');
		path.setAttribute(
			'd',
			'M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.2.07 2.04.66 2.74.71 1.05-.21 2.05-.81 3.17-.73 1.34.11 2.35.64 3.02 1.6-2.76 1.66-2.1 5.3.43 6.32-.51 1.34-1.17 2.67-2.36 3.07zM12.03 7.25c-.15-1.99 1.48-3.63 3.34-3.79.26 2.3-2.09 4.02-3.34 3.79z',
		);
		icon.appendChild(path);
		return icon;
	}

	[
		'M8.5 15.75V7.8l7-1.55v7.35',
		'M8.5 10.3l7-1.55',
		'M8.5 15.75c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm7-2.15c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z',
	].forEach((definition) => {
		const path = document.createElementNS(namespace, 'path');
		path.setAttribute('d', definition);
		icon.appendChild(path);
	});

	return icon;
}

function renderReleaseActions() {
	const container = document.getElementById('release-actions');
	if (!container) return;

	const actions = getReleaseActions(releaseConfig);
	container.replaceChildren();

	actions.forEach((action) => {
		const link = document.createElement('a');
		link.className = 'btn-primary release-service-action';
		link.href = action.url;
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		link.dataset.actionId = action.id;
		link.dataset.trackEvent = 'release_cta_click';
		link.dataset.trackType = action.id;
		link.dataset.releaseMode = RELEASE_MODE;

		link.appendChild(createServiceIcon(action.id));
		const label = document.createElement('span');
		label.textContent = action.label;
		link.appendChild(label);

		container.appendChild(link);
	});

	initDeclarativeTracking();
}

function initReleaseVideo() {
	const container = document.getElementById('release-video');
	if (!container) return;

	const destination = getOfficialVideoDestination(releaseConfig);

	if (destination.type === 'embed') {
		const iframe = document.createElement('iframe');
		iframe.src = destination.value;
		iframe.title = '30,000 Feet official video';
		iframe.allow =
			'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
		iframe.allowFullscreen = true;
		container.replaceChildren(iframe);
		return;
	}

	const link = document.createElement('a');
	link.className = 'release-video-fallback';
	link.href = destination.value;
	link.target = '_blank';
	link.rel = 'noopener noreferrer';
	link.textContent = 'Watch on YouTube';
	link.dataset.trackEvent = 'release_video_play';
	link.dataset.trackType = 'official_video';
	link.dataset.releaseMode = RELEASE_MODE;
	container.replaceChildren(link);
	initDeclarativeTracking();
}

function initReleasePage() {
	renderReleaseActions();
	initReleaseVideo();
	trackEvent('release_page_visit', {
		release_mode: RELEASE_MODE,
		page_context: 'homepage_hero',
	});
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initReleasePage, { once: true });
} else {
	initReleasePage();
}
