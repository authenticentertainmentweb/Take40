var mcmAds = (function() {

  function buildParamString(media) {
    var genres = [];

    var paramString = 'sitename=' + getDoubleClickSitename() + '&zone=' + mcmAds.zone + '&ord=' + Math.floor((Math.random() * 13756) * 345) + '&keyvalues=mediatype=' + media.mediaType + ';mediaid=' + media.id;

    for (var i in media.tags) {
      var tag = media.tags[i];
      if (tag) {
        if (tag.ns == 'music' && tag.predicate == 'genre') {
          genres.push(tag.value);
        } else if (tag.ns == 'music' && tag.predicate == 'label') {
          paramString += ';label=' + tag.value;
        } else if (tag.ns == 'mcm' && tag.predicate == 'artistid') {
          paramString += ';artistid=' + tag.value;
        } else if (tag.ns === 'music' && tag.predicate === 'explicit') {
          paramString += ';musicexplicit=' + tag.value;
        }
      }
    }

    for (i = 0; i < genres.length; i++) {
      paramString += ';genrename' + i + '=' + genres[i];
    }

    return paramString;
  }

  function convertToTitleCase(input) {
    return input.substring(0, 1).toUpperCase() + input.substring(1);
  }

  function getDoubleClickSitename() {

    if (mcmAds.syn_client == '') {
      sitename = 'Take40';
    } else {
      switch (mcmAds.syn_client) {
        case 'yahoo':
          sitename = 'yahoo7';
          break;
        case 'news':
          sitename = 'newsltd';
          break;
        case 'heraldsun':
          sitename = 'newsltd';
          break;
        case 'dailytelegraph':
          sitename = 'newsltd';
          break;
        case 'perthnow':
          sitename = 'newsltd';
          break;
        default:
          sitename = mcmAds.syn_client;
      }
    }

    return sitename;
  }

  return {
    zone: '',
    sitename: '',
    syn_client: '',

    updateCompanionAds: function(paramString) {

      paramString = 'sitename=' + getDoubleClickSitename() + '&zone=' + mcmAds.zone + '&ord=' + Math.floor((Math.random() * 13756) * 345) + '&keyvalues=' + paramString;

      var leaderboardTileNum = 3;
      var islandTileNum = 4;

      if (mcmAds.syn_client != '') {
        leaderboardTileNum = 1;
        islandTileNum = 2;
      }

      companionAds = [{
        resource: '/action/mediaplayer/leaderboard?tile=' + leaderboardTileNum + '&' + paramString,
        width: 728,
        height: 90
      }, {
        resource: '/action/mediaplayer/island?tile=' + islandTileNum + '&' + paramString,
        width: 300,
        height: 250
      }];

      for (var i in movideoAds.adSlots) {
        var adSlot = movideoAds.adSlots[i];
        if (adSlot) {
          var adElement = document.getElementById(adSlot.id);
          if (adElement) {
            var companionAd = movideoAds.findCompanionAd(companionAds, adSlot.width, adSlot.height);
            if (companionAd) {
              var resourceHandler = movideoAds.adResourceHandlers['iframe'];
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
    },

    getPlayerAlias: function() {
      var alias;

      if (mcmAds.syn_client != '' && mcmAds.syn_app == '') {
        alias = 'syndicated-player';
        mcmAds.zone = alias;
      } else if (mcmAds.syn_client != '' && mcmAds.syn_app != '') {
        alias = mcmAds.syn_app;
        mcmAds.zone = alias;
      } else {
        switch (mcmAds.zone) {
          case 'home':
            alias = 'homepage';
            break;
          case 'music_library':
            alias = 'music-library';
            break;
          case 'countdown':
            alias = 'chart';
            break;
          case 'music_charts':
            alias = 'chart';
            break;
          case 'new_music':
            alias = 'newmusic';
            break;
          case 'playlists':
            alias = 'playlists';
            break;
          case 'pop-out-default':
            alias = 'pop-out-default';
            break;
          case 'pop-out-chart':
            alias = 'pop-out-chart';
            break;
          default:
            alias = 'music-library';
        }
      }
      return alias;
    },

    playStarted: function(paramString, playerZone) {
      mcmAds.zone = playerZone;
      mcmAds.updateCompanionAds(paramString);
    },

    getMovideoKey: function() {
      return 'movideo' + convertToTitleCase(mcmAds.syn_client);
    }
  }
})();