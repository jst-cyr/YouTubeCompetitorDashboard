var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export { YouTubeChannelConfiguration, ChannelConfig };
//Class used to store data about a specific channel received from a data source
class ChannelConfig {
    constructor(label, channelId) {
        this.Label = label;
        this.ChannelId = channelId;
    }
}
//Class used to retrieve all channel configuration from a data source
class YouTubeChannelConfiguration {
    constructor(apiKey, databaseId) {
        this.apiKey = apiKey;
        this.databaseId = databaseId;
    }
    //Retrieves the array of channels configured for the dashboard that we need to get data for from the API
    getChannelConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            //Load the Airtable API and specify authentication and the base we want to connect to
            var Airtable = require('airtable');
            Airtable.configure({
                endpointUrl: 'https://api.airtable.com',
                apiKey: this.apiKey
            });
            var base = Airtable.base(this.databaseId);
            //Select the list of records from the Airtable 
            var records = yield base('Channels').select().all();
            //Create the array of configured channels
            var channelConfigList = new Array();
            records.forEach(function (record) {
                var channelConfig = new ChannelConfig(record.get('Label'), record.get('ChannelId'));
                //Add to the list of channel configuration
                channelConfigList.push(channelConfig);
            });
            return channelConfigList;
        });
    }
}
