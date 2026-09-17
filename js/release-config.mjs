export const releaseConfig = Object.freeze({
	mode: 'released',
	releaseDate: '2026-09-17',
	preSaveUrl: 'https://show.co/9vLQ9Cs',
	teaserVideoId: 'Ffm4WeMkOQ0',
	officialVideoId: 'z1rh_mLsXPI',
	spotifyUrl: 'https://open.spotify.com/album/68AazSEd5ehZBDzODKd47V',
	appleMusicUrl:
		'https://music.apple.com/us/album/30-000-feet-single/6802846065',
	amazonMusicUrl: 'https://music.amazon.com/tracks/B0HFPRXMLK',
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
		return [
			{ id: 'spotify', label: 'Spotify', url: config.spotifyUrl },
			{
				id: 'apple_music',
				label: 'Apple',
				url: config.appleMusicUrl,
			},
			{
				id: 'amazon_music',
				label: 'Amazon',
				url: config.amazonMusicUrl,
			},
		].filter((action) => isSafeHttpUrl(action.url));
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
	const videoId =
		config.mode === 'released' && isYouTubeVideoId(config.officialVideoId)
			? config.officialVideoId
			: config.teaserVideoId;

	if (isYouTubeVideoId(videoId)) {
		return {
			type: 'embed',
			value: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`,
		};
	}

	return {
		type: 'link',
		value: config.youtubeChannelUrl,
	};
}
