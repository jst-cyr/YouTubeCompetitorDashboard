export {YouTubeChannelConfiguration, ChannelConfig};

//This hack allows TypeScript to skip validating the 'require' statement in getChannelConfiguration(). 
//In future steps, we should run on Node and import Airtable as a proper module.
declare var require: any;

//Class used to store data about a specific channel received from a data source
class ChannelConfig {
	Label: string;
	ChannelId: string;

	constructor(label: string, channelId: string){
		this.Label = label;
		this.ChannelId = channelId;
	}
}

//Class used to retrieve all channel configuration from a data source
class YouTubeChannelConfiguration {
	AzureFunctionUrl: string;

	constructor(azureFunctionHost: string){
		this.AzureFunctionUrl = `${azureFunctionHost}/api/GetConfiguredChannels`;
	}

	//Retrieves the array of channels configured for the dashboard that we need to get data for from the API
	async getChannelConfiguration(): Promise<ChannelConfig[]>{

		//Call the Azure function to get the list of configured channels
		var channelConfigList = fetch(this.AzureFunctionUrl)
			.then(response => {
				return response.json()
			})
			.then(data => {
				console.log(data);

				//Convert returned data to strongly typed list of objects
				var channels = data.map(
					(channelConfig: { Label: string; ChannelId: string; }) => 
					{
						return new ChannelConfig( channelConfig.Label, channelConfig.ChannelId );
					}
				);

				return channels;
			});

		return channelConfigList;
	}
}