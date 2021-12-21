# Lesson 4 - Using JavaScript Array functions to handle multiple results from the YouTube API

In the previous step, we took a dynamically generated table and sorted the results. This was the first 'Array' manipulation done on the data.

In this step, we are going to examine some other Array functions such as **map**, **find**, and **join**

You'll also notice a new file (data\Channels.js) that was added to represent a data source of channel data. In previous steps, this was inline in the HTML source but has now been moved to an external file and converted to an Array of objects.

***SIDE NOTE:*** I really got tripped up before finding things like `map` when creating objects. Because the objects weren't strongly typed, I was reading values from the API onto an object and getting 'undefined' when I later tried to read them.

Turns out, because JavaScript just doesn't care about whether a property is already defined, it just puts it wherever you say and doesn't tell you you were wrong and it shouldn't be there. So I was reading the data, but not putting it in the 'value' of an object, but one level higher. It took me some debugging to figure out that was the problem.

## Technology used
- YouTube Channel API (v3): https://www.googleapis.com/youtube/v3/channels
- jQuery v3.6 (for working with the DOM)
- ECMAScript v1: For Array [.join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)
- ECMAScript v5 : For Array [.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) to create a new array of objects from an existing array of data
- ECMAScript v6 : For Array [.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) to locate a single result in an array matching a property.
- ECMAScript v10 no longer needed: By moving to these other Array manipulations, `entries` and `fromEntries` are no longer needed.


## Running the sample
In the HTML file, you will see a working static HTML file that will let you see the current subscription counts of two channels. To get it running:

1. Open the HTML web page in your browser. It does not require a web server, as it uses a 'fetch' against the API URL instead of the initializing the client API.
2. On load of the page, the table will be built out. You can add breakpoints to see the code in action.

Note that there is no additional styling or extra markup. The HTML file is made to be as simple as possible for learning purposes.

## What is the code doing?
There were some major changes from the last version, so here I'll cover those changes.

### Moving channel data to an array in a separate file
	const channels = [
		{
			ChannelId : 'UCJrNXcAEmZrqbf2suxbfIkg',
			Label : 'Discover Sitecore',
		},
		{
			ChannelId : 'UCr6untnQn62iR3DkcswdKkw',
			Label : 'Sitecore',
		},
		{
			ChannelId: 'UCN-7ZEctit8Qu01BWeHQ0Fw',
			Label : 'Adobe Experience Cloud',
		},
		{
			ChannelId: 'UCrsEcxPCJlz5yZ_FKGo6D9g',
			Label : 'Contentful',
		},
		{
			ChannelId: 'UCoLZaNd2rZ0mFPBD2aSPD7A',
			Label : 'Optimizely (Episerver)',
		}
	]

The `channels` object has been changed to now be an array, now that the code is primarily running array functions. 

Also, you will note that the previously introduced 'SubscriberCount' property is gone. These objects are used to provide the configuration for labels and channel IDs, but the actual data objects with the YouTube API results are now returned in other code, not on these configuration objects.

### getChannelSubscribers no longer used
While the method is still there in the file, it is no longer called. One of the big changes in this step is to move from individual API calls for each channel to working with arrays.

For that, we now need to get data about **ALL** the channels at the same time, and this method is not required anymore.

### getChannelData is introduced
The new getChannelData function replaces the individual API fetch calls with a fetch call for all the channel IDs. This function processes the data returned by the API and returns an array of objects with everything we need.

There are a few things happening here, so I'll break down the function into a few different blocks.

### getChannelData - Concatenating ID values with a join method
	var channelIds = channelsList.map((channel) => channel.ChannelId).join();

This is a very simple line that uses a few Array functions to get a comma-separated list of IDs. The `.map` function is similar to a LINQ `select` call and creates an Array of the ChannelId property values.

The chained **.join** function then concatenates everything into a single string, separated by the specified separator string. I didn't provide one here, so it defaults to "comma", which is what I wanted.

**Read more:**
 * [Array.join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)
 * [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

### getChannelData - Fetching data for multiple Channels from the YouTube API
	fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelIds}&key=${apiKey}`)

This is almost exactly the same as the previous fetch, but you'll notice that now we are passing in a comma-separated list of IDs. This means that the result that comes back will have multiple items, which we now need to gather together.

### getChannelData - Using 'map' to create new objects from the YouTube data
	//Map the data from YouTube into a new array of channel objects
	var channelData = data["items"].map(item => 
		{
			//Find the matching channel in the list that was provided
			var matchedChannel = channelsList.find(channel => channel.ChannelId === item.id);

			//Create a new object combining existing config data and the data from the YouTube API
			return {
				ChannelId: item.id,
				Label: matchedChannel.Label,
				SubscriberCount: item.statistics.subscriberCount,
				ViewCount: item.statistics.viewCount,
				VideoCount: item.statistics.videoCount,
			}
		}
	)

This block of code uses the `map` function to create new objects. I first implemented this with a `for` loop, iterating over the items, creating the objects, and then adding them onto a result array. However, `map` does that for you!

As mentioned before, this is a lot like the LINQ `select` behaviour. You provide a function that you want to execute on each item in the Array, and a new Array is returned with that data.

In this particular use case, I'm creating the channel objects I want to use for creating my table. This needs things like the channel ID and statistics, but also a display label that comes from the configuration list of channels.

First, the matching configuration is found (using `find`), and then a new object is created by merging the data from the YouTube API result and the config object.

**Read more:**
 * [Array.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
 * [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

### updateStats - Simplified channel data retrieval
	var channelsList = await getChannelData(channels);

By using this new method for getting all the channels, there is a simpler call which can pass in the configuration and begin working with the result. No for-loop is required anymore

### updateStats - Simplified sorting
	var sortedChannels = channelsList.sort((a,b) => b.SubscriberCount - a.SubscriberCount);

Previously I was using `entries` and `fromEntries` to convert objects to an Array and back again. Now that the configuration is an Array, and the channel data is an array, it's much easier to natively call the `sort` on the array. 

I also no longer have the pesky 'property' in the way, so when doing the comparison function for the sort I can directly access the `SubscriberCount` property instead of doing something like `b[1].SubscriberCount`.