var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { YouTubeChannelConfiguration } from './youtubechannelconfiguration.js';
import { YouTubeChannelList } from './youtubechannellist.js';
//Update the markup with the latest data from the API
function updateStats() {
    return __awaiter(this, void 0, void 0, function* () {
        //Configure the host to use for Azure functions
        const azureFunctionsHost = "https://jcy-dashboard-capturesubscribers.azurewebsites.net";
        //Get the configured list of channels we want to show on the dashboard
        const youtubeChannelConfiguration = new YouTubeChannelConfiguration(azureFunctionsHost);
        const configuredChannels = yield youtubeChannelConfiguration.getChannelConfiguration();
        //Fill out the table in the markup with a new YouTube Channel listing
        const youtubeChannelList = new YouTubeChannelList("channelList", configuredChannels);
        youtubeChannelList.fillTable(azureFunctionsHost);
    });
}
updateStats();
