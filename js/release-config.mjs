export const releaseConfig = Object.freeze({
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

export function getOfficialVideoDestination(config = releaseConfig) {
	const videoId = config.officialVideoId;

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
