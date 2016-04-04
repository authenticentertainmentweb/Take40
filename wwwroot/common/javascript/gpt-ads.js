var gptAds = (function() {

	function getTargetingMap(media, playlist) {
		var targetMap = new Array();
		var i = 0;
		if (media) {
			targetMap[i++] = {key : 'mediaid', value : media.id};
			targetMap[i++] = {key : 'mediatype', value : media.mediaType};

			if (media.tags) {
				for (var j = 0; j < media.tags.length; j++) {
					var tag = media.tags[j];
					if (tag.ns === 'mcm' && tag.predicate === 'artistid') {
						targetMap[i++] = {key : 'artistid', value : tag.value};
					}
					if (tag.ns === 'music' && tag.predicate === 'label') {
						targetMap[i++] = {key : 'label', value : tag.value};
					}
					if (tag.ns === 'music' && tag.predicate === 'artist') {
						targetMap[i++] = {key : 'musicartist', value : tag.value};
					}
					if (tag.ns === 'music' && tag.predicate === 'year') {
						targetMap[i++] = {key : 'musicyear', value : tag.value};
					}
					if (tag.ns === 'music' && tag.predicate === 'content') {
						targetMap[i++] = {key : 'musiccontent', value : tag.value};
					}
					if (tag.ns === 'music' && tag.predicate === 'era') {
						targetMap[i++] = {key : 'musicera', value : tag.value};
					}
					if (tag.ns === 'music' && tag.predicate === 'theme') {
						targetMap[i++] = {key : 'musictheme', value : tag.value};
					}
					if (tag.ns === 'music' && tag.predicate === 'mood') {
						targetMap[i++] = {key : 'musicmood', value : tag.value};
					}
				}

				var genretags = jQuery.grep(media.tags, function(tag,i) {
					return tag.ns === 'music' && tag.predicate === 'genre';
				});

				if (genretags) {
				    var genres = [];
				    for (var k = 0; k < genretags.length; k++) {
					var genretag = genretags[k];
		    			genres.push(genretag.value);
				    }

				    targetMap[i++] = {key : 'genreName', value: genres};
				}
			}
		}

		if (playlist) {
			targetMap[i++] = {key : 'playlistid', value : playlist.id};
		}

		return targetMap;
	}

	return {

		updateCompanionAds: function(media, playlist) {
			var targetMap = getTargetingMap(media, playlist);

			var companionAds = [];
			jQuery(adConfigs).each(function(index, adConfig) {
				if (adConfig.companionAd) {
					adConfig.adSlot.clearTargeting();

					jQuery(targetMap).each(function(index, tag) {
						adConfig.adSlot.setTargeting(tag.key, tag.value);
					});

					companionAds.push(adConfig.adSlot);
				}
			});

			if (companionAds.length > 0) {
				googletag.pubads().refresh(companionAds);
			}
		}
	}
})();