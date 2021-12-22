import { ChannelConfig } from './youtubechannelconfiguration.js';
export {YouTubeData, ChannelData};

class ChannelData{
	ChannelId: string;
	Label: string;
	SubscriberCount: number;
	ViewCount: number;
	VideoCount: number;

	constructor(channelId: string, label:string, subscriberCount: number, viewCount: number, videoCount: number){
		this.ChannelId = channelId;
		this.Label = label;
		this.SubscriberCount = subscriberCount;
		this.ViewCount = viewCount
		this.VideoCount = videoCount;
	}
}

class YouTubeData {
	apiKey: string;

	constructor(apiKey: string){
		this.apiKey = apiKey;
	}

	//Get the subscriber count for a specified channel
	async getChannelSubscribers(channelId: string): Promise<Number>{
		const subscriberCount: Promise<Number> = 
			fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${this.apiKey}`)
			.then(response => {
				return response.json()
			})
			.then(data => {
				console.log(data);
				return Number(data["items"][0].statistics.subscriberCount);
			})
		return subscriberCount;
	}

	//Invokes the YouTube API to get data about all channels provided in the list of channels
	//RETURNS: An array of channel objects with the YouTube statistics data
	async getChannelData(channelsList: ChannelConfig[]) : Promise<ChannelData[]>{
		//Build up a list of the IDs we want to get data for, separated by a comma
		const channelIds = channelsList.map((channel) => channel.ChannelId).join();
		
		//Fetch the data and then fill out the objects
		var youtubeChannelData = 
			fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelIds}&key=${this.apiKey}`)
			.then(response => {
				return response.json()
			})
			.then(data => {
				console.log(data);

				//Map the data from YouTube into a new array of channel objects
				var channelData = data["items"].map(
					(item: { id: string; statistics: { subscriberCount: number; viewCount: number; videoCount: number; }; }) => 
					{
						//Find the matching channel in the list that was provided
						const matchedChannel = channelsList.find(channel => channel.ChannelId === item.id);

						//Create a new object combining existing config data and the data from the YouTube API
						return new ChannelData(
								item.id,
								matchedChannel ? matchedChannel.Label : item.id,
								item.statistics.subscriberCount,
								item.statistics.viewCount,
								item.statistics.videoCount,
							);
					}
				)

				return channelData;
			});

		return youtubeChannelData;
	}
}