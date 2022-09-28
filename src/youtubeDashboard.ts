import { YouTubeChannelConfiguration, ChannelConfig } from './youtubechannelconfiguration.js';
import { YouTubeChannelList } from './youtubechannellist.js';

//Update the markup with the latest data from the API
async function updateStats(){
  //Get the configured list of channels we want to show on the dashboard
  const youtubeChannelConfiguration = new YouTubeChannelConfiguration();
  const configuredChannels: ChannelConfig[] = await youtubeChannelConfiguration.getChannelConfiguration();

  //Fill out the table in the markup with a new YouTube Channel listing
  const youtubeChannelList = new YouTubeChannelList("channelList", configuredChannels);
  youtubeChannelList.fillTable();
}

updateStats();
