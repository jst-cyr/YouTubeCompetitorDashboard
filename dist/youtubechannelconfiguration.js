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
        this.AzureFunctionUrl = "https://jcy-dashboard-capturesubscribers.azurewebsites.net/api/GetConfiguredChannels";
    }
    //Retrieves the array of channels configured for the dashboard that we need to get data for from the API
    getChannelConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            //Call the Azure function to get the list of configured channels
            var channelConfigList = yield fetch(this.AzureFunctionUrl)
                .then(response => {
                return response.json();
            })
                .then(data => {
                console.log(data);
                //Convert returned data to strongly typed list of objects
                var channels = data.map((channelConfig) => {
                    return new ChannelConfig(channelConfig.Label, channelConfig.ChannelId);
                });
                return channels;
            });
            return channelConfigList;
        });
    }
}
