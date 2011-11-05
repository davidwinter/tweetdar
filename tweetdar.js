(function() {
  var Tweetdar;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Tweetdar = (function() {
    function Tweetdar() {
      var cloudmade, cloudmadeUrl;
      this.message = $('#message');
      this.message.html('locating&hellip;');
      this.tweets = {};
      $('#update').click(__bind(function(e) {
        e.preventDefault();
        return this.update_location();
      }, this));
      $('#current').click(__bind(function(e) {
        var position;
        e.preventDefault();
        position = this.map.getCenter();
        return this.location_found({
          coords: {
            latitude: position.lat,
            longitude: position.lng,
            accuracy: 0
          }
        });
      }, this));
      this.map = new L.Map('map', {
        scrollWheelZoom: false
      });
      cloudmadeUrl = 'http://{s}.tile.cloudmade.com/ce3741232bc240ad97bdba9bc6bde548/997/256/{z}/{x}/{y}.png';
      cloudmade = new L.TileLayer(cloudmadeUrl);
      this.current_location = new L.LatLng(51.505, -0.09);
      this.map.setView(this.current_location, 15).addLayer(cloudmade);
      this.update_location();
      twttr.widgets.load();
    }
    Tweetdar.prototype.update_location = function() {
      return navigator.geolocation.getCurrentPosition(__bind(function(position) {
        return this.location_found(position);
      }, this));
    };
    Tweetdar.prototype.location_found = function(position) {
      this.current_location = new L.LatLng(position.coords.latitude, position.coords.longitude);
      this.map.panTo(this.current_location);
      this.message.html("" + position.coords.latitude + "," + position.coords.longitude + " @ " + position.coords.accuracy + "m");
      return this.get_tweets(position.coords.latitude, position.coords.longitude, __bind(function(tweet) {
        var marker;
        marker = new L.Marker(new L.LatLng(tweet.geo.coordinates[0], tweet.geo.coordinates[1]));
        this.map.addLayer(marker);
        marker.bindPopup(this.display_tweet(tweet));
        return marker.on('click', function(e) {
          return twttr.widgets.load();
        });
      }, this));
    };
    Tweetdar.prototype.get_tweets = function(latitude, longitude, tweet_callback) {
      return $.getJSON("http://search.twitter.com/search.json?geocode=" + latitude + "," + longitude + ",1km&result_type=recent&rpp=100&callback=?", __bind(function(data) {
        var tweet, _i, _len, _ref, _results;
        if (data.results) {
          _ref = data.results;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            tweet = _ref[_i];
            _results.push(tweet.geo ? !this.tweets[tweet['id']] ? (this.tweets[tweet['id']] = tweet, tweet_callback(tweet)) : void 0 : void 0);
          }
          return _results;
        }
      }, this));
    };
    Tweetdar.prototype.display_tweet = function(tweet) {
      return '<div class="tweet_content"><img src="' + tweet.profile_image_url + '" alt="" /><blockquote>' + tweet.text + '</blockquote><div class="tweet_user"><a href="https://twitter.com/' + tweet.from_user + '" class="twitter-follow-button" data-show-count="false">Follow @' + tweet.from_user + '</a></div></div>';
    };
    return Tweetdar;
  })();
  $(function() {
    var tweetdar;
    return tweetdar = new Tweetdar;
  });
}).call(this);
