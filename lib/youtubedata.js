class YouTubeData {
	constructor(apiKey){
		this.apiKey = apiKey;
	}

	//Get the subscriber count for a specified channel
	async getChannelSubscribers(channelId) {
		var subscriberCount = 
			fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${this.apiKey}`)
			.then(response => {
				return response.json()
			})
			.then(data => {
				console.log(data);
				return data["items"][0].statistics.subscriberCount;
			})
			return subscriberCount;
		}

	//Invokes the YouTube API to get data about all channels provided in the list of channels
	//RETURNS: An array of channel objects with the YouTube statistics data
	async getChannelData(channelsList){
		//Build up a list of the IDs we want to get data for, separated by a comma
		var channelIds = channelsList.map((channel) => channel.ChannelId).join();
		
		//Fetch the data and then fill out the objects
		var youtubeChannelData = 
			fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelIds}&key=${this.apiKey}`)
			.then(response => {
				return response.json()
			})
			.then(data => {
				console.log(data);

				//Map the data from YouTube into a new array of channel objects
				var channelData = data["items"].map(item => 
				{
					//Find the matching channel in the list that was provided
					var matchedChannel = channelsList.find(channel => channel.ChannelId === item.id);

					//Create a new object combining existing config data and the data from the YouTube API
					return {
					ChannelId: item.id,
					Label: matchedChannel.Label,
					SubscriberCount: item.statistics.subscriberCount,
					ViewCount: item.statistics.viewCount,
					VideoCount: item.statistics.videoCount,
					}
				}
				)

				return channelData;
			});

		return youtubeChannelData;
	}
}