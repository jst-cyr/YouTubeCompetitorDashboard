const airtable = require('airtable');

//Class used to store data about a specific channel received from a data source
class ChannelConfig {
	Label;
	ChannelId;

	constructor(label, channelId){
		this.Label = label;
		this.ChannelId = channelId;
	}
}

module.exports = async function (context, req) {
    context.log('Loading configured channels from data store.');

    //Load the Airtable API and specify authentication and the base we want to connect to
    const apiKey = 'keyfGNPlzxgkVj5Eo';
    const databaseId = 'appDuKh62DrdrfGGy';
    airtable.configure({
        endpointUrl: 'https://api.airtable.com',
        apiKey: apiKey
    });
    var base = airtable.base(databaseId);

    //Select the list of records from the Airtable 
    var records = await base('Channels').select().all();
    context.log(`Airtable records: ${records}`)

    //Create the array of configured channels
    var channelConfigList = new Array();
    records.forEach(function(record){
        var channelConfig = new ChannelConfig(
            record.get('Label'), 
            record.get('ChannelId')
        );
        //Add to the list of channel configuration
        channelConfigList.push(channelConfig);
    })

    context.log(`Configured channels: ${channelConfigList}`);
    context.res = {
        body: channelConfigList
    };
}