import {
	getReleaseActions,
	getTeaserDestination,
	releaseConfig,
} from './release-config.mjs?v=20260902-1';
import {
	initDeclarativeTracking,
	trackEvent,
} from './analytics.mjs';

function createSpotifyIcon() {
	const namespace = 'http://www.w3.org/2000/svg';
	const icon = document.createElementNS(namespace, 'svg');
	icon.classList.add('release-spotify-icon');
	icon.setAttribute('viewBox', '0 0 24 24');
	icon.setAttribute('aria-hidden', 'true');

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

function renderReleaseActions() {
	const container = document.getElementById('release-actions');
	if (!container) return;

	const actions = getReleaseActions(releaseConfig);
	container.replaceChildren();

	actions.forEach((action) => {
		const link = document.createElement('a');
		link.className = 'btn-primary release-primary-action';
		link.href = action.url;
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		link.dataset.actionId = action.id;
		link.dataset.trackEvent = 'release_cta_click';
		link.dataset.trackType = action.id;
		link.dataset.releaseMode = releaseConfig.mode;

		if (action.id === 'pre_save') {
			link.appendChild(createSpotifyIcon());
			const label = document.createElement('span');
			label.textContent = action.label;
			link.appendChild(label);
		} else {
			link.textContent = action.label;
		}

		container.appendChild(link);
	});

	initDeclarativeTracking();
}

function initReleaseVideo() {
	const container = document.getElementById('release-video');
	if (!container) return;

	const configuredVideo =
		releaseConfig.mode === 'released' && releaseConfig.officialVideoId
			? { ...releaseConfig, teaserVideoId: releaseConfig.officialVideoId }
			: releaseConfig;
	const destination = getTeaserDestination(configuredVideo);

	if (destination.type === 'embed') {
		const iframe = document.createElement('iframe');
		iframe.src = destination.value;
		iframe.title =
			releaseConfig.mode === 'released'
				? '30,000 Feet official video'
				: '30,000 Feet official teaser';
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
	link.dataset.trackType = 'teaser';
	link.dataset.releaseMode = releaseConfig.mode;
	container.replaceChildren(link);
	initDeclarativeTracking();
}

function initReleasePage() {
	renderReleaseActions();
	initReleaseVideo();
	trackEvent('release_page_visit', {
		release_mode: releaseConfig.mode,
		page_context: 'homepage_hero',
	});
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initReleasePage, { once: true });
} else {
	initReleasePage();
}
