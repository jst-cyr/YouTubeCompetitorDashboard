export {YouTubeChannelConfiguration};

//This hack allows TypeScript to skip validating the 'require' statement in getChannelConfiguration(). 
//In future steps, we should run on Node and import Airtable as a proper module.
declare var require: any;

class YouTubeChannelConfiguration {
	apiKey: string;
	databaseId: string;

	constructor(apiKey: string, databaseId: string){
		this.apiKey = apiKey;
		this.databaseId = databaseId;
	}

	//Retrieves the array of channels configured for the dashboard that we need to get data for from the API
	async getChannelConfiguration(){
		//Load the Airtable API and specify authentication and the base we want to connect to
		var Airtable = require('airtable');
		Airtable.configure({
			endpointUrl: 'https://api.airtable.com',
			apiKey: this.apiKey
		});
		var base = Airtable.base(this.databaseId);

		//Select the list of records from the Airtable 
		var records = await base('Channels').select().all();

		//Create the array of configured channels
		var channelConfigList = new Array();
		records.forEach(function(record: any){
			var channelConfig = {
				Label: record.get('Label'),
				ChannelId: record.get('ChannelId')
			}
			//Add to the list of channel configuration
			channelConfigList.push(channelConfig);
		})

		return channelConfigList;
	}
}