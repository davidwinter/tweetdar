var map, marker, i, infowindow;

$(function() {
	navigator.geolocation.getCurrentPosition(show_map);

	function show_map(position) {
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
				
		map_options = {
			zoom: 14,
			center: new google.maps.LatLng(latitude,longitude),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		
		map = new google.maps.Map(
			document.getElementById("gmap"),
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
								infowindow.setContent('<div class="tweet_content"><img src="'+data.results[i].profile_image_url+'" alt="" /><div class="tweet_user"><a href="http://twitter.com/'+data.results[i].from_user+'" target="_blank">'+data.results[i].from_user+'</a></div><blockquote>'+data.results[i].text+'</blockquote></div>');
								infowindow.open(map, marker);
							}
						})(marker, i));
					}
				}				
			}
		});
	}
});