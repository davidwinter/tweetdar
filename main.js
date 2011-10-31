var map, polyline, tweets = {};

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

$(function() {
	
	navigator.geolocation.getCurrentPosition(show_leafletmap);

	function show_leafletmap(position) {
		var map = new L.Map('map', {
			scrollWheelZoom: false
		});

		var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/ce3741232bc240ad97bdba9bc6bde548/997/256/{z}/{x}/{y}.png',
		    cloudmade = new L.TileLayer(cloudmadeUrl, { maxZoom: 18 });
		
		var current_location = new L.LatLng(position.coords.latitude, position.coords.longitude);
		map.setView(current_location, 15).addLayer(cloudmade);
		update_position_leaflet(map, position.coords.latitude, position.coords.longitude);

		$('#message').html('Locating&hellip;');

		polyline = new L.Polyline([current_location], {color: 'red'});
		map.addLayer(polyline);

		map.locateAndSetView(15);

		map.on('locationfound', function(e) {
			update_poly(e.latlng);
			$('#message').fadeOut();
			update_position_leaflet(map, e.latlng.lat, e.latlng.lng);
		});

		
	}

	function update_poly(latlng) {
		polyline.addLatLng(latlng);
	}

	function update_position_leaflet(map, latitude, longitude) {
		get_tweets(latitude, longitude, function(tweet) {
			marker = new L.Marker(new L.LatLng(tweet.geo.coordinates[0], tweet.geo.coordinates[1]));
			map.addLayer(marker);
			marker.bindPopup(tweet_popup(tweet));
			marker.on('click', function(e) {
				twttr.widgets.load();
			});
		});
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
