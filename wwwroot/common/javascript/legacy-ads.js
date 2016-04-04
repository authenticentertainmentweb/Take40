// Legacy ad logic

$ = document.id;

// Injects ads into correct positions. Called on window.load.
function injectAds() {
    var island = $('hiddenTallIslandAd');
    var lb = $('hiddenLeaderboard');
    var mh = $('hiddenMasthead');
    var mast = $('masthead-ad');
    var chartOne = $('adOne');
    var chartTwo = $('adTwo');
    var chartThree = $('adThree');
    var chartFour = $('adFour');
    var islandBottom = $('islandBottom');

    if (($('islandBottom')) && ($('islandBottomHolder'))) {
        islandBottom.style.visibility = 'visible';
        islandBottom.injectInside('islandBottomHolder');
    }

    if (($('leaderboard')) && ($('hiddenLeaderboard'))) {
        lb.style.visibility = 'visible';
        lb.injectInside('leaderboard');
    }

    if (($('masthead')) && ($('hiddenMasthead'))) {
        mh.style.visibility = 'visible';
        mh.injectInside('masthead');
    }
    if (($('masthead-holder')) && ($('masthead-ad'))) {
        mast.style.visibility = 'visible';
        mast.injectInside('masthead-holder');
    }
    if (($('ad-insert-1')) && ($('adOne'))) {
        chartOne.style.visibility = 'visible';
        chartOne.injectInside('ad-insert-1');
    }
    if (($('ad-insert-2')) && ($('adTwo'))) {
        chartTwo.style.visibility = 'visible';
        chartTwo.injectInside('ad-insert-2');
    }
    if (($('ad-insert-3')) && ($('adThree'))) {
        chartThree.style.visibility = 'visible';
        chartThree.injectInside('ad-insert-3');
    }
    if (($('ad-insert-4')) && ($('adFour'))) {
        chartFour.style.visibility = 'visible';
        chartFour.injectInside('ad-insert-4');
    }
}

function getCookieValue(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg) {
            return getCookieOffset(j);
        }

        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) {
            break;
        }
    }
    return null;
}

function getCookieOffset(offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1) {
        endstr = document.cookie.length;
    }
    return unescape(document.cookie.substring(offset, endstr));
}

function setCookieValue(name, value) {
    var largeExpDate = new Date();
    largeExpDate.setTime(largeExpDate.getTime() + (365 * 24 * 3600 * 1000));
    var path = null;
    var domain = null;
    var secure = false;

    document.cookie = name + "=" + escape(value) + //"; expires=" +
    //largeExpDate.toGMTString() +
    ((path == null) ? "" : ("; path=" + path)) +
        ((domain == null) ? "" : ("; domain=" + domain)) +
        ((secure == true) ? "; secure" : "");
}

function showMarquee() {
    var marquee = $('marquee');
    var lbHolder = $('leaderboard-holder');

    if (marquee && marquee.getStyle('display') != 'none' && marquee.getChildren().length > 0) {
        $('masthead-holder').style.display = 'block';
        $('masthead-btn').style.display = 'block';
        if (lbHolder) {
            lbHolder.style.display = 'none';
        }
    } else {
        if (lbHolder) {
            lbHolder.style.display = 'block';
        }
    }
}

function showLeaderboard() {
    var marquee = $('marquee');
    if (marquee) {
        var leaderboard = $('leaderboard');
        if (leaderboard && leaderboard.getStyle('display') != 'none' && leaderboard.getChildren().length > 0) {
            $('leaderboard-holder').style.display = 'block';
        } else {
            $('leaderboard-holder').style.display = 'none';
        }
    }
}

function isMarqueeDefined() {
    var marqueeDefined = false;
    Array.each(adConfigs, function(adConfig, i) {
        if (adConfig.divId === 'marquee') {
            marqueeDefined = true;
        }
    });

    return marqueeDefined;
}

function isCompanionAdDefined() {
    var companionAdDefined = false;
    Array.each(adConfigs, function(adConfig, i) {
        if (adConfig.companionAd) {
            companionAdDefined = true;
        }
    });

    return companionAdDefined;
}

function initMarqueeButton() {
    var marqueeBtn = $(document.body).getElement('#masthead-btn span');
    if (marqueeBtn) {
        marqueeBtn.addEvent('click', function() {
            if (this.hasClass('open')) {
                this.removeClass('open');
                this.setText('Close [x]');
                $(document.body).getElement('#marquee').style.display = 'block';
            } else {
                this.addClass('open');
                this.setText('Show ad [+]');
                $(document.body).getElement('#marquee').style.display = 'none';
            }
        })
    }
}

var globalMarquee = false;
function initAds() {

    var marqueeDefined = isMarqueeDefined();
    var companionAdsDefined = isCompanionAdDefined();
    var bannerAds = [];
    Array.each(adConfigs, function(adConfig, index) {
        var divId = adConfig.divId;
        var div = $(divId);

        if (div) {

            googletag.display(divId);
            if (!adConfig.companionAd) {
                bannerAds.push(adConfig.adSlot);
            }
        }
    });

    googletag.pubads().addEventListener('slotRenderEnded', function(event) {
        if(event.size[0] === 960 && event.isEmpty === false) {
            globalMarquee = true;
            showMarquee();
        }
        
    });
    if (companionAdsDefined && bannerAds.length > 0) {
        googletag.pubads().refresh(bannerAds);
    }
}

function initAdvertisements() {

    var lbHolder = $('leaderboard-holder');
    if (lbHolder && !isMarqueeDefined()) {
        lbHolder.style.display = 'block';
    } else {
        $('marquee').style.display = 'block';
    }
    googletag.cmd.push(initAds);
}

function initGlobal() {
    initMarqueeButton();
    initAdvertisements();
}

window.addEvents({
    'domready': function() {
        initGlobal();
    }
});