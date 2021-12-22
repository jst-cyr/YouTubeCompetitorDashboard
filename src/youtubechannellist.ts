import { YouTubeData } from './youtubedata.js';
export {YouTubeChannelList};

class YouTubeChannelList {
	constructor(apiKey, tableId, configuredChannels){
		this.apiKey = apiKey;
		this.tableId = tableId;
		this.configuredChannels = configuredChannels;
	}

	//Update the markup with the latest data from the API
	async fillTable(){
		//Get a list of channel data from the API
		var youtubeData = new YouTubeData(this.apiKey);
		var channelsList = await youtubeData.getChannelData(this.configuredChannels);

		//Sort the list of channels by their subscriber count, in descending order (biggest to smallest)
		var sortedChannels = channelsList.sort((a,b) => b.SubscriberCount - a.SubscriberCount);

		//For each of the channels in the sorted list, create a row and add it to the table
		for(var index in sortedChannels){
			//Create the row, showing a label and the subscriber count
			var row = $("<tr><td>" + sortedChannels[index].Label + "</td><td>" + sortedChannels[index].SubscriberCount + "</td></tr>");

			//Add the row to the table that has ID 'channelList'
			$(this.tableId).find("tbody").append(row);
		}
	}
}

