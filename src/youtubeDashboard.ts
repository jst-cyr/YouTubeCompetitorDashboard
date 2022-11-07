import { YouTubeChannelConfiguration, ChannelConfig } from './youtubechannelconfiguration.js';
import { YouTubeChannelList } from './youtubechannellist.js';

//Update the markup with the latest data from the API
async function updateStats(azureFunctionsHost: string){
  //Get the configured list of channels we want to show on the dashboard
  const youtubeChannelConfiguration = new YouTubeChannelConfiguration(azureFunctionsHost);
  const configuredChannels: ChannelConfig[] = await youtubeChannelConfiguration.getChannelConfiguration();

  //Fill out the table in the markup with a new YouTube Channel listing
  const youtubeChannelList = new YouTubeChannelList("channelList", configuredChannels);
  youtubeChannelList.fillTable(azureFunctionsHost);
}

//Configure the host to use for Azure functions
const ENV_AZURE_FUNCTIONS_HOST = "https://jcy-dashboard-capturesubscribers.azurewebsites.net";
updateStats(ENV_AZURE_FUNCTIONS_HOST);