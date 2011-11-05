class Tweetdar
	
	constructor: ->
		@message = $('#message')
		@message.html('locating&hellip;')

		@tweets = {}

		$('#update').click (e) =>
			e.preventDefault()
			@update_location()
		
		$('#current').click (e) =>
			e.preventDefault()
			position = @map.getCenter()
			@location_found
				coords:
					latitude: position.lat
					longitude: position.lng
					accuracy: 0
		
		@map = new L.Map('map',
			scrollWheelZoom: false
		)

		cloudmadeUrl = 'http://{s}.tile.cloudmade.com/ce3741232bc240ad97bdba9bc6bde548/997/256/{z}/{x}/{y}.png'
		cloudmade = new L.TileLayer(cloudmadeUrl)

		@current_location = new L.LatLng(51.505, -0.09)
		@map.setView(@current_location, 15).addLayer(cloudmade)

		@update_location()
		
		twttr.widgets.load()
	
	update_location: ->
		navigator.geolocation.getCurrentPosition (position) => 
			@location_found(position)
	
	location_found: (position) ->
		@current_location = new L.LatLng(position.coords.latitude, position.coords.longitude)
		@map.panTo(@current_location)
		@message.html("#{position.coords.latitude},#{position.coords.longitude} @ #{position.coords.accuracy}m")

		@get_tweets position.coords.latitude, position.coords.longitude, (tweet) =>
			marker = new L.Marker(new L.LatLng(tweet.geo.coordinates[0], tweet.geo.coordinates[1]))
			@map.addLayer(marker)
			marker.bindPopup(@display_tweet(tweet))
			marker.on 'click', (e) ->
				twttr.widgets.load()
			
			
	
	get_tweets: (latitude, longitude, tweet_callback) ->
		$.getJSON "http://search.twitter.com/search.json?geocode=#{latitude},#{longitude},1km&result_type=recent&rpp=100&callback=?", (data) =>	
			if data.results
				for tweet in data.results
					if tweet.geo
						unless @tweets[tweet['id']]
							@tweets[tweet['id']] = tweet
							tweet_callback(tweet)
		
	
	display_tweet: (tweet) ->
		'<div class="tweet_content"><img src="'+tweet.profile_image_url+'" alt="" /><blockquote>'+tweet.text+'</blockquote><div class="tweet_user"><a href="https://twitter.com/'+tweet.from_user+'" class="twitter-follow-button" data-show-count="false">Follow @'+tweet.from_user+'</a></div></div>'

$ ->						
	tweetdar = new Tweetdar