import { YouTubeChannelConfiguration } from '../dist/youtubechannelconfiguration.js';
import { YouTubeChannelList } from '../dist/youtubechannellist.js';
          
//API Key used for accessing the YouTube API
var youtubeApiKey = 'AIzaSyClnRkQON9_oUA9nXShlGKOwLXGRG2sqvY';

//Airtable identifiers for the API
var airtableBaseId = 'appDuKh62DrdrfGGy';
var readonlyApiKey = 'keyfGNPlzxgkVj5Eo';

//Update the markup with the latest data from the API
async function updateStats(){
  //Get the configured list of channels we want to show on the dashboard
  var youtubeChannelConfiguration = new YouTubeChannelConfiguration(readonlyApiKey, airtableBaseId);
  var configuredChannels = await youtubeChannelConfiguration.getChannelConfiguration();

  //Fill out the table in the markup with a new YouTube Channel listing
  var youtubeChannelList = new YouTubeChannelList(youtubeApiKey, "#channelList", configuredChannels);
  youtubeChannelList.fillTable();
}

$(document).ready(updateStats);
