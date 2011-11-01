var tweetdar, tweets = {};

var Tweetdar = function() {
	this.message = $('#message');
	
	this.map_options = {
		zoom: 15,
		center: new google.maps.LatLng(51.505, -0.09),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		panControl: false,
		streetViewControl: false,
		mapTypeControl: false,
		zoomControlOptions: {
			position: google.maps.ControlPosition.LEFT_CENTER,
			style: google.maps.ZoomControlStyle.SMALL
		}
	};

	this.map = new google.maps.Map(
		document.getElementById("map"),
        this.map_options
	);

	this.poly_options = {
		strokeColor: '#ff0000',
		strokeOpacity: 1.0,
		strokeWeight: 3
	}

	this.poly = new google.maps.Polyline(this.poly_options);

	this.watch_id = false;

	this.last_update = false;

	this.infowindow = new google.maps.InfoWindow();
};	

Tweetdar.prototype.init_map = function() {

	this.message.html('Locating&hellip;');

	this.poly.setMap(this.map);

	this.watch_id = navigator.geolocation.watchPosition(this.location_found, this.location_error);
};

Tweetdar.prototype.on_location_found = function(position) {
	this.message.html(position.coords.latitude+','+position.coords.longitude+' @ '+position.coords.accuracy+'m');
	
	latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

	this.map.panTo(latlng);

	path = this.poly.getPath();
	path.push(latlng);

	now = Math.round(new Date().getTime() / 1000);

	self = this;

	if (this.last_update === false || (now - this.last_update) > 60) {
		
		get_tweets(position.coords.latitude, position.coords.longitude, function(tweet) {
			marker = new google.maps.Marker({
				position: new google.maps.LatLng(
						tweet.geo.coordinates[0], 
						tweet.geo.coordinates[1]
					),
				map: self.map
			});

			google.maps.event.addListener(marker, 'click', (function(marker, i) {
				return function() {
					self.infowindow.setContent(self.tweet_content(tweet));
					self.infowindow.open(self.map, marker);
					twttr.widgets.load();
				}
			})(marker, i));
		});

		this.last_update = now;
	}
}

Tweetdar.prototype.tweet_content = function(tweet) {
	
	return '<div class="tweet_content"><img src="'+tweet.profile_image_url+'" alt="" /><blockquote>'+tweet.text+'</blockquote><div class="tweet_user"><a href="https://twitter.com/'+tweet.from_user+'" class="twitter-follow-button" data-show-count="false">Follow @'+tweet.from_user+'</a></div></div>';
}

Tweetdar.prototype.on_location_error = function(position_error) {
	
	switch (position_error.code) {
		case 1:
			error = 'No permission for location';
		break;

		case 2:
			error = 'Position couldn\'t be determined';
		break;

		case 3:
			error = 'Timeout';
		break;

		default:
			error = 'An error occured';
		break;
	}

	this.message.html('<li>'+error+'</li>');
}

Tweetdar.prototype.location_found = function(position) {
	tweetdar.on_location_found(position);
};

Tweetdar.prototype.location_error = function(position_error) {
	tweetdar.on_location_error(position_error);
}

function get_tweets(latitude, longitude, tweet_loop) {
	$.getJSON('http://search.twitter.com/search.json?geocode='+latitude+','+longitude+',1km&result_type=recent&rpp=100&callback=?', function(data) {
		if (data.results) {
			for (i = 0; i < data.results.length; i++) {  
				if (data.results[i].geo) {
					if (tweets[data.results[i]['id']] === undefined) {
						tweets[data.results[i]['id']] = data.results[i];
						tweet_loop(data.results[i]);
					}
				}
			}				
		}
	});
}

$(function() {
	tweetdar = new Tweetdar();
	tweetdar.init_map();
});
