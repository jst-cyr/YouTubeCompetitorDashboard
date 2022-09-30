import { YouTubeData, ChannelData } from './youtubedata.js';
import { ChannelConfig } from './youtubechannelconfiguration.js';
export {YouTubeChannelList};

class YouTubeChannelList {
	tableId: string;
	configuredChannels: ChannelConfig[];

	constructor(tableId: string, configuredChannels: ChannelConfig[]){
		this.tableId = tableId;
		this.configuredChannels = configuredChannels;
	}

	//Update the markup with the latest data from the API
	async fillTable(azureFunctionsHost: string){
		//Get a list of channel data from the API
		const youtubeData = new YouTubeData(azureFunctionsHost);
		const channelsList = await youtubeData.getChannelData(this.configuredChannels);

		//Sort the list of channels by their subscriber count, in descending order (biggest to smallest)
		const sortedChannels = channelsList.sort((a:ChannelData,b:ChannelData) => b.SubscriberCount - a.SubscriberCount);

		//For each of the channels in the sorted list, create a row and add it to the table
		for(var index in sortedChannels){
			//Create the row, showing a label and the subscriber count
			const row = document.createElement("tr");
			row.innerHTML=("<td>" + sortedChannels[index].Label + "</td><td>" + sortedChannels[index].SubscriberCount + "</td>");

			//Add the row to the table that has ID provided
			document.getElementById(this.tableId)?.querySelector("tbody")?.appendChild(row);
		}
	}
}

