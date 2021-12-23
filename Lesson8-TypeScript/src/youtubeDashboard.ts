import { YouTubeChannelConfiguration, ChannelConfig } from './youtubechannelconfiguration.js';
import { YouTubeChannelList } from './youtubechannellist.js';

//API Key used for accessing the YouTube API
const youtubeApiKey = 'AIzaSyClnRkQON9_oUA9nXShlGKOwLXGRG2sqvY';

//Airtable identifiers for the API
const airtableBaseId = 'appDuKh62DrdrfGGy';
const readonlyApiKey = 'keyfGNPlzxgkVj5Eo';

//Update the markup with the latest data from the API
async function updateStats(){
  //Get the configured list of channels we want to show on the dashboard
  const youtubeChannelConfiguration = new YouTubeChannelConfiguration(readonlyApiKey, airtableBaseId);
  const configuredChannels: ChannelConfig[] = await youtubeChannelConfiguration.getChannelConfiguration();

  //Fill out the table in the markup with a new YouTube Channel listing
  const youtubeChannelList = new YouTubeChannelList(youtubeApiKey, "channelList", configuredChannels);
  youtubeChannelList.fillTable();
}

updateStats();
