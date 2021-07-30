# Lesson 5 - Integrating Airtable as a database for your JavaScript app
In previous steps, we were using an array of JavaScript objects to configure which channels we would show in the table and retrieve data for from the YouTube API.

In this lesson we are going to explore using [Airtable](https://airtable.com) as a simple data store. The list of channels will be retrieved from Airtable and those records will drive the call to the YouTube API.

**NOTE:** In this step, we are only going to explore reading data from Airtable, and we will only use the browser API. Later on, we will look at writing and updating in Airtable and using the server-side API.

## Technology used
- YouTube Channel API (v3): https://www.googleapis.com/youtube/v3/channels
- Airtable browser API: https://github.com/Airtable/airtable.js/blob/master/build/airtable.browser.js
- jQuery v3.6 (for working with the DOM)
- ECMAScript v6 required: Previous steps introduced the need for Array functions [.join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) (v1), [.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) (v5), and [.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) (v6).

## Running the sample
In the HTML file, you will see a working static HTML file that will let you see the current subscription counts of two channels. To get it running:

1. Open the HTML web page in your browser. It does not require a web server, as it uses a 'fetch' against the API URL instead of the initializing the client API.
2. On load of the page, the table will be built out. You can add breakpoints to see the code in action.

Note that there is no additional styling or extra markup. The HTML file is made to be as simple as possible for learning purposes.

## What is the code doing?
I'll cover the changes and new code introduced for Airtable in this section. Primarily, the data\Channels.js was removed and replaced by calls using lib\Airtable.browser.js

### Channels.js removed
Previously, this JS file provided an array of channels that should be shown on the dashboard. It has been removed now that the data is in Airtable.

### lib\Airtable.browser.js
This JS file provides the API for Airtable when used within the browser. It has been included in the HTML file via a SCRIPT tag.

### Including the API
	<script src="lib/airtable.browser.js"></script>

This script tag makes sure the Browser JavaScript API for Airtable is available for the rest of the scripts.

### Data access identifiers
          var airtableBaseId = 'appDuKh62DrdrfGGy';
          var readonlyApiKey = 'keyfGNPlzxgkVj5Eo';

Airtable calls databases 'base'. Each one has a unique ID and can be shared with users. This is the first piece that needs to be connected to for retrieving data tables. The `airtableBaseId` specifies the base I have in Airtable with the table `Channels`, where the data is that I want.

The API Key, stored here in `readonlyApiKey` is required to authenticate to the API. I have set up a user in Airtable with read-only access. All of this data is public, so I do not mind sharing this API Key, but recommended practice with Airtable is to not share this API Key. 

**IMPORTANT:** In general, browser access is not recommended, but for initial learning about the Airtable API I am using this to show the first steps. Later, this should be updated to use recommended security practices like environment variables and server-side access to the API instead of browser-side.

### getChannelConfiguration
	async function getChannelConfiguration(){
		...
	}

	var configuredChannels = await getChannelConfiguration();

Instead of accessing the `channels` variable, `updateStats` calls this function which accesses the Airtable API and returns the list of channels. I will break down the getChannelConfiguration method in separate sections.

### getChannelConfiguration - Configure the Airtable client
	var Airtable = require('airtable');
	Airtable.configure({
		endpointUrl: 'https://api.airtable.com',
		apiKey: readonlyApiKey
	});
	var base = Airtable.base(airtableBaseId);

This block of code initializes the API client with the connection endpoint, API key for authentication, and retrieves the base where the data we want is stored.

### getChannelConfiguration - Get Airtable records from a table
	var records = await base('Channels').select().all();

Here we get all the records in the 'Channels' table. The `base('Channels')` part specifies which database table we want to read from. The chained functions `select().all()` are a quick way to get all the data in that table. You can specify properties/functions for pagination and manipulation on the records if you would prefer, but in this example we are going simple and just getting all the records.

### getChannelConfiguration - Creating an array of objects from the data
	var channelConfigList = new Array();
	records.forEach(function(record){
		var channelConfig = {
			Label: record.get('Label'),
			ChannelId: record.get('ChannelId')
		}
		channelConfigList.push(channelConfig);
	}

When I first tried this, I made a faulty assumption that `records` was already an array of objects. I tried to access properties by iterating over `records` (using a `for(var record in records)` loop) and using a format like `record.Label`. That didn't work!

The code you see here uses a function on each record in the `records` result to create a new object that matches the structure we used in the previous `channels` JS objects. 

Invoking `record.get('Label')` tells the API to go to that result from the table and access the `Label` field in that row. You can do this for every field in the table. Here you see I extract both the `Label` field and the `ChannelId` field value.

## Want to try out Airtable with a React app? 
**Take a tutorial about the Airtable API:** https://css-tricks.com/getting-to-grips-with-the-airtable-api/