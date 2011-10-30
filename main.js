$(function() {
	
	navigator.geolocation.getCurrentPosition(show_leafletmap);

	function show_leafletmap(position) {
		var map = new L.Map('map', {
			scrollWheelZoom: false
		});

		var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/ce3741232bc240ad97bdba9bc6bde548/997/256/{z}/{x}/{y}.png',
		    cloudmade = new L.TileLayer(cloudmadeUrl, { maxZoom: 18 });
		
		var london = new L.LatLng(position.coords.latitude, position.coords.longitude); // geographical point (longitude and latitude)
		map.setView(london, 15).addLayer(cloudmade);

		var marker = new L.Marker(new L.LatLng(position.coords.latitude, position.coords.longitude));
		map.addLayer(marker);
		marker.bindPopup('You!').openPopup();

		/** Twitter **/

		$.getJSON('http://search.twitter.com/search.json?geocode='+position.coords.latitude+','+position.coords.longitude+',1km&result_type=recent&rpp=100&callback=?', function(data) {
			if (data.results) {
				for (i = 0; i < data.results.length; i++) {  
  					if (data.results[i].geo) {
						marker = new L.Marker(new L.LatLng(data.results[i].geo.coordinates[0], data.results[i].geo.coordinates[1]));
						map.addLayer(marker);
						marker.bindPopup('<div class="tweet_content"><img src="'+data.results[i].profile_image_url+'" alt="" /><blockquote>'+data.results[i].text+'</blockquote><div class="tweet_user"><a href="https://twitter.com/'+data.results[i].from_user+'" class="twitter-follow-button" data-show-count="false">Follow @'+data.results[i].from_user+'</a></div></div>');
						marker.on('click', function(e) {
							twttr.widgets.load();
						});
					}
				}				
			}
		});
	}

	function show_gmap(position) {
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;

		map_options = {
			zoom: 15,
			center: new google.maps.LatLng(latitude,longitude),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		map = new google.maps.Map(
			document.getElementById("map"),
	        map_options
		);

		infowindow = new google.maps.InfoWindow();

		$.getJSON('http://search.twitter.com/search.json?geocode='+latitude+','+longitude+',1km&result_type=recent&rpp=100&callback=?', function(data) {
			if (data.results) {

				for (i = 0; i < data.results.length; i++) {  
  					if (data.results[i].geo) {
						marker = new google.maps.Marker({
							position: new google.maps.LatLng(
									data.results[i].geo.coordinates[0], 
									data.results[i].geo.coordinates[1]
								),
							map: map
						});

						google.maps.event.addListener(marker, 'click', (function(marker, i) {
							return function() {
								infowindow.setContent('<div class="tweet_content"><img src="'+data.results[i].profile_image_url+'" alt="" /><blockquote>'+data.results[i].text+'</blockquote><div class="tweet_user"><a href="https://twitter.com/'+data.results[i].from_user+'" class="twitter-follow-button" data-show-count="false">Follow @'+data.results[i].from_user+'</a></div></div>');
								infowindow.open(map, marker);
								twttr.widgets.load();
							}
						})(marker, i));
					}
				}				
			}
		});
	}

});