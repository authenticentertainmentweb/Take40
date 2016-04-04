var mcmAds = (function() {

	function createIFrameString(width, height, src) {
        var f = '<iframe '
            + 'height="' + height + '" '
            + 'width="' + width + '" '
            + 'src="' + src + '" '
            + 'scrolling="no" frameborder="0" vspace="0" marginwidth="0" marginheight="0" allowtransparency="yes"></iframe>'
        return f;
    }

    var generateedElementPrefix = "movideoAdsElement";
    var nextGeneratedId = 0;
	var defaultResourceHandlers = {
            // for html resources, replace the innerHTML with the resource.
            // NOTE does not support <script> elements in the HTML resource.
            //
            'html': function(companionAd, element)
            {
                // when the companion resource starts with http:// then treat it as the src for an iframe element
                var url = companionAd.resource;
                var timestamp = new Date().getTime();
                url = url.replace(/\{timestamp\}/g, timestamp);

                // determine if resource is a URL for an iframe or plain html
                var isUrlResource = /^http:\/\//;
                if (isUrlResource.test(url))
                {
                    element.innerHTML = createIFrameString(companionAd.width, companionAd.height, url);
                }
                else
                {
                    element.innerHTML = url;
                }
            },

            // for iframe resources, simply change the IFrameElement.src to point to the new URL.
            //
            'iframe': function(companionAd, element)
            {
                var url = companionAd.resource;
                var timestamp = new Date().getTime();
                url = url.replace(/\{timestamp\}/g, timestamp);
                element.innerHTML = createIFrameString(companionAd.width, companionAd.height, url);
            },

            // for static resources, create HTML to wrap the resource, and inject to DOM.
            //
            'static': function(companionAd, element)
            {
                // handle images resource by creating an <a> link with an <img />
                // matches creativeTypes such as: image/jpeg, image/gif
                //
                if (companionAd.creativeType.indexOf('image') == 0) {
                    var html
                        = '<a href="' + companionAd.clickThroughUrl + '" target="_blank">'
                        + '<img border="0" src="' + companionAd.resource
                        + '" width="' + companionAd.width
                        + '" height="' + companionAd.height
                        + '" />'
                        + '</a>';

                    element.innerHTML = html;
                }
                // handles SWFs by embedding in the ad container
                //
                else if (companionAd.creativeType == 'application/x-shockwave-flash')
                {
                    element.innerHTML = "";
                    var generatedElementId = (generateedElementPrefix + (nextGeneratedId++));
                    var adElement = document.createElement("div");
                    adElement.id = generatedElementId;
                    element.appendChild(adElement);
                    // some ads use clickTAG, and some use clickTag so we pass in both.
                    swfobject.embedSWF(companionAd.resource + '?clickTAG=' + companionAd.clickThroughUrl + "&clickTag=" + companionAd.clickThroughUrl, generatedElementId, companionAd.width, companionAd.height, '9.0.0');
                }
            }
        };


    function buildParamString(media, playlist) {

        var paramString = 'sitename='+mcmAds.sitename+'&zone='+mcmAds.zone+'&ord='+Math.floor((Math.random()*13756)*345)

        if (media!=null){
            var genres = [];
            paramString = paramString + '&keyvalues=mediatype='+media.mediaType+';mediaid='+media.id;
            if (playlist != null) {
                paramString = paramString + ';playlistID=' + playlist.id;
            }
	        for (var i in media.tags) {
	            var tag = media.tags[i];
	            if (tag) {
	                if(tag.ns == 'music' && tag.predicate == 'genre'){
	                    genres.push(tag.value);
	                }
	                else if(tag.ns == 'music' && tag.predicate == 'label'){
	                    paramString += ';label='+tag.value;
	                }
	                else if(tag.ns == 'mcm' && tag.predicate == 'artistid'){
	                    paramString += ';artistid='+tag.value
	                }
	            }
	        }
	        for (i=0; i<genres.length; i++){
	            paramString += ';genrename'+i+'='+genres[i];
	        }
        }
        return paramString;
    }

    function findCompanionAd(companionAds, width, height)
    {
        for (var i in companionAds)
        {
            var companionAd = companionAds[i];
            if (companionAd.width == width && companionAd.height == height)
            {
                return companionAd;
            }
        }
        return null;
    }

    return {
        zone: 'media_player',
        sitename: 'Take40',

        updateCompanionAds: function (media,adSlots,playlist) {
        	var	paramString = buildParamString(media, playlist);
        	companionAds = [{resource: '/action/mediaplayer/leaderboard?tile=1&'+paramString, width: 728, height: 90 },
                            {resource: '/action/mediaplayer/island?tile=2&'+paramString, width: 300, height: 250 }];

            for (var i in adSlots) {
                var adSlot =adSlots[i];
                if (adSlot) {
                    var adElement = document.getElementById(adSlot.id);
                    if (adElement) {
                        var companionAd = findCompanionAd(companionAds, adSlot.width, adSlot.height);
                        if (companionAd) {
                            var resourceHandler = defaultResourceHandlers['iframe'];
                            if (resourceHandler) {
                                resourceHandler(companionAd, adElement);
                            }
                        }
                    }

                    if (adSlot.onChanged != null) {
                        adSlot.onChanged();
                    }
                }
            }
        }
    }
})();