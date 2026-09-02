export const releaseConfig = Object.freeze({
	mode: 'pre-release',
	releaseDate: '2026-09-17',
	preSaveUrl: 'https://show.co/9vLQ9Cs',
	teaserVideoId: 'Ffm4WeMkOQ0',
	officialVideoId: '',
	listenUrl: '',
	youtubeChannelUrl: 'https://www.youtube.com/@SeismicStandard-ox1de',
});

function isSafeHttpUrl(value) {
	if (typeof value !== 'string' || value.trim() === '') return false;

	try {
		const url = new URL(value);
		return url.protocol === 'https:' || url.protocol === 'http:';
	} catch (_error) {
		return false;
	}
}

function isYouTubeVideoId(value) {
	return typeof value === 'string' && /^[A-Za-z0-9_-]{6,20}$/.test(value);
}

export function getReleaseActions(config = releaseConfig) {
	if (config.mode === 'released') {
		const actions = [];

		if (isSafeHttpUrl(config.listenUrl)) {
			actions.push({
				id: 'listen_everywhere',
				label: 'Listen Everywhere',
				url: config.listenUrl,
			});
		}

		if (isYouTubeVideoId(config.officialVideoId)) {
			actions.push({
				id: 'watch_official_video',
				label: 'Watch Official Video',
				url: `https://www.youtube.com/watch?v=${config.officialVideoId}`,
			});
		}

		return actions;
	}

	if (!isSafeHttpUrl(config.preSaveUrl)) return [];

	return [
		{
			id: 'pre_save',
			label: 'Pre-save & Follow on Spotify',
			url: config.preSaveUrl,
		},
	];
}

export function getTeaserDestination(config = releaseConfig) {
	if (isYouTubeVideoId(config.teaserVideoId)) {
		return {
			type: 'embed',
			value: `https://www.youtube-nocookie.com/embed/${config.teaserVideoId}?rel=0`,
		};
	}

	return {
		type: 'link',
		value: config.youtubeChannelUrl,
	};
}
