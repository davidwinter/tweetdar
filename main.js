var map, polyline, tweets = {};

var Tweetdar = function() {
	this.message = '';
};	

Tweetdar.prototype.init_map = function() {
	this.message = $('#message');
	this.map = 	new L.Map('map', {
		scrollWheelZoom: false
	});

	this.cloudmadeUrl = 'http://{s}.tile.cloudmade.com/ce3741232bc240ad97bdba9bc6bde548/997/256/{z}/{x}/{y}.png';
	this.cloudmade = new L.TileLayer(this.cloudmadeUrl, { maxZoom: 18 });
		
	this.map.setView(new L.LatLng(51.505, -0.09), 15).addLayer(this.cloudmade);

	this.message.append('<li>Locating&hellip;</li>');

	this.map.locateAndSetView(15);

	this.map.on('locationfound', this.location_found);
};

Tweetdar.prototype.location_found = function(e) {
	$('#message').append('<li>Found: '+e.latlng.lat+','+e.latlng.lng+'</li>');
};

$(function() {
	tweetdar = new Tweetdar();
	tweetdar.init_map();
});

/*
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

function tweet_popup(tweet) {
	return '<div class="tweet_content"><img src="'+tweet.profile_image_url+'" alt="" /><blockquote>'+tweet.text+'</blockquote><div class="tweet_user"><a href="https://twitter.com/'+tweet.from_user+'" class="twitter-follow-button" data-show-count="false">Follow @'+tweet.from_user+'</a></div></div>';
}

function update_location(e) {
	//map.setView(e.latlng);
	$('#message ul').append('<li>'+e.latlng.lat+','+e.latlng.lng+'</li>');
	//update_poly(e.latlng);
	//$('#message').fadeOut();
	//update_position_leaflet(map, e.latlng.lat, e.latlng.lng);
}

function update_poly(latlng) {
	if (polyline === undefined) {
		polyline = new L.Polyline([latlng], {color: 'red'});
	} else {
		polyline.addLatLng(latlng);
	}
}

function update_position_leaflet(latitude, longitude) {
		get_tweets(latitude, longitude, function(tweet) {
			marker = new L.Marker(new L.LatLng(tweet.geo.coordinates[0], tweet.geo.coordinates[1]));
			map.addLayer(marker);
			marker.bindPopup(tweet_popup(tweet));
			marker.on('click', function(e) {
				twttr.widgets.load();
			});
		});
	}

$(function() {
	
	navigator.geolocation.getCurrentPosition(show_leafletmap);

	function show_leafletmap(position) {
		var map = new L.Map('map', {
			scrollWheelZoom: false
		});

		var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/ce3741232bc240ad97bdba9bc6bde548/997/256/{z}/{x}/{y}.png',
		    cloudmade = new L.TileLayer(cloudmadeUrl, { maxZoom: 18 });
		
		//var current_location = new L.LatLng(position.coords.latitude, position.coords.longitude);
		map.setView(new L.LatLng(51.505, -0.09), 15).addLayer(cloudmade);
		//update_position_leaflet(map, position.coords.latitude, position.coords.longitude);

		$('#message').html('<ul><li>Locating&hellip;</li></ul>');

		//polyline = new L.Polyline([current_location], {color: 'red'});
		//map.addLayer(polyline);

		map.locateAndSetView(15);

		map.on('locationfound', update_location);

		
	}

	

	

	function show_gmap(position) {
		map_options = {
			zoom: 15,
			center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		map = new google.maps.Map(
			document.getElementById("map"),
	        map_options
		);

		infowindow = new google.maps.InfoWindow();

		get_tweets(position.coords.latitude, position.coords.longitude, function(tweet) {
			marker = new google.maps.Marker({
				position: new google.maps.LatLng(
						tweet.geo.coordinates[0], 
						tweet.geo.coordinates[1]
					),
				map: map
			});

			google.maps.event.addListener(marker, 'click', (function(marker, i) {
				return function() {
					infowindow.setContent(tweet_popup(tweet));
					infowindow.open(map, marker);
					twttr.widgets.load();
				}
			})(marker, i));
		});
	}

});
*/
