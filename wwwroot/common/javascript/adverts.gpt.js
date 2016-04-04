function updateAd() {
	if (adConfigs && adConfigs.length > 0) {
		var companionAds = false;
		var len = adConfigs.length;
		for (var j = 0; j < adConfigs.length; j++) {
			adConfig = adConfigs[j];
			var adPath = '/' + adConfig.networkId + '/' + adConfig.sitename;
			if (adConfig.zone) {
				adPath = adPath + '/' + adConfig.zone;
				if (adConfig.loc) {
					adPath = adPath + '/' + adConfig.loc;
				}
			}

			var dimensions;
			if (adConfig.dimensions) {
				dimensions = adConfig.dimensions;
			}
			else {
				dimensions = [adConfig.width, adConfig.height];
			}
		    var adSlot = googletag.defineSlot(adPath,dimensions, adConfig.divId);
			if (adConfig.keyvalues) {
				var paramArray = adConfig.keyvalues.split(";");
				var len = paramArray.length;
				for (i = 0; i < len; i += 1) {
					var param = paramArray[i];
					if (param) {
						var keyval = param.split('=');
						if (keyval && keyval.length === 2) {
							var key = keyval[0];
							var val = keyval[1];
							adSlot.setTargeting(key, val);
						}
					}
				}
			}

			if (adConfig.pos) {
				adSlot.setTargeting('pos', [adConfig.pos]);
			}

			if (adConfig.companionAd) {
				adSlot.addService(googletag.companionAds());
				companionAds = true;
			}
			adSlot.addService(googletag.pubads());
			adConfig.adSlot = adSlot;

		}

		googletag.pubads().enableSingleRequest();
		googletag.pubads().enableAsyncRendering();
		googletag.pubads().collapseEmptyDivs();

		if (companionAds) {
			googletag.companionAds().setRefreshUnfilledSlots(true);
			googletag.pubads().disableInitialLoad();
		}

		googletag.enableServices();
	}
}

googletag.cmd.push(updateAd);
