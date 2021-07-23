# Lesson 3 - Building a table with a sorted list

In the previous steps, we used JavaScript to invoke the YouTube API to get subscription counts and generate a table dynamically from the results.

In this step, we are going to change things up so that the generated list of rows is sorted from largest subscription count to smallest.

I've also added some other channels to the list so that it is easier to see the effect of the sorting with some extra data.

## Technology used
- YouTube Channel API (v3): https://www.googleapis.com/youtube/v3/channels
- jQuery v3.6 (for working with the DOM)
- ECMAScript v10 (for using [.fromEntries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries) to convert an array back to an object after sorting)

## Running the sample
In the HTML file, you will see a working static HTML file that will let you see the current subscription counts of two channels. To get it running:

1. Open the HTML web page in your browser. It does not require a web server, as it uses a 'fetch' against the API URL instead of the initializing the client API.
2. On load of the page, the table will be built out. You can add breakpoints to see the code in action.

Note that there is no additional styling or extra markup. The HTML file is made to be as simple as possible for learning purposes.

## What is the code doing?
In the previous lesson, we described some of the code blocks, so this will only cover the major changes from the last lesson.

### More channel data
	const channels = {
		DiscoverSitecore: {
			ChannelId : 'UCJrNXcAEmZrqbf2suxbfIkg',
			Label : 'Discover Sitecore',
			SubscriberCount : 0
		},
		Sitecore: {
			ChannelId : 'UCr6untnQn62iR3DkcswdKkw',
			Label : 'Sitecore',
			SubscriberCount : 0
		},
		AdobeExperienceCloud: {
			ChannelId: 'UCN-7ZEctit8Qu01BWeHQ0Fw',
			Label : 'Adobe Experience Cloud',
			SubscriberCount : 0
		},
		Contentful: {
			ChannelId: 'UCrsEcxPCJlz5yZ_FKGo6D9g',
			Label : 'Contentful',
			SubscriberCount: 0
		},
		Optimizely: {
			ChannelId: 'UCoLZaNd2rZ0mFPBD2aSPD7A',
			Label : 'Optimizely (Episerver)',
			SubscriberCount: 0
		}
	}

The **channels** object previously had only a label and channelID, and there were only two channels. Additional channels have been added to make it easier to see the sorting. 

Also, you will note the new **SubcriberCount** property where we can store the number of subcribers returned by the YouTube API.

### updateStats function - Getting subscriber counts
	for(var channel in channels){
		channels[channel].SubscriberCount = await getChannelSubscribers(channels[channel].ChannelId);
	}

***Previously:*** The **updateStats** method would call **addChannel** for each channel which would retrieve the subscriber count and then create a row for the output.

***Now:*** DOM manipulation must so that we can sort all channels first. The **updateStats** here loops through the channels object, and for each channel stores the result from the YouTube API on the channel object in the **SubscriberCount** property.

**NOTE:** You will notice again that the 'channel' value in this loop is not the object, but an index in the channels object. We need to use it to get the inner channel object.

### updateStats - Sorting the channels!!
	var sortedChannels = Object.fromEntries(
		Object.entries(channels).sort((a,b) => b[1].SubscriberCount - a[1].SubscriberCount)
	);

**This is the important one for this lesson!**

This block of code takes all the channels and returns an object that is sorted by the **SubscriberCount** property, from largest to smallest. We're going to break this one down piece by piece.


### Object.fromEntries
	var sortedChannels = Object.fromEntries(...)

The **fromEntries** portion of the code takes the result of what is inside the call and turns it back into an Object, instead of the Array that is normally created.

Read more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries


### Object.entries
	Object.entries(channels)

This part of the block takes the **channels** object and turns that into an array. This is needed so that we can sort.

Read more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries

### Array.sort
	.sort((a,b) => b[1].SubscriberCount - a[1].SubscriberCount)

By chaining this sort onto the **entries** call, we can take the array of **channels** and ensure it is sorted by **SubscriberCount**

In this block, **'a'** and **'b'** represent two elements in the array being sorted. As the sort runs, it will compare two elements, and we use these variables so that we can define a comparison function.

**b[1].SubscriberCount** and **a[1].SubscriberCount** inform the sort function what properties to access on the objects when doing the comparison.

The sort is done as **b-a** so that we can get a descending order (i.e. the bigger numbers first). If **b>a** then it will sort **b** first, which is what we want. If this had been done as **a-b**, then if **b>a** it will sort **a** first, which would give us an ascending order.

Read more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

### Outputting the sorted list
	for(var index in sortedChannels){
		//Create the row, showing a label and the subscriber count
		var row = $("<tr><td>" + sortedChannels[index].Label + "</td><td>" + sortedChannels[index].SubscriberCount + "</td></tr>");

		//Add the row to the table that has ID 'channelList'
		$("#channelList").find("tbody").append(row);
	}

This is a variation of the **addChannel** function that was used in the last lesson. Now that we have all the data we need, and we have sorted the list, this loop does the following:

1. Creates a **tr** row with two cells, one with the channel label, and another with the subscription count.
2. Adds that created row to the table that has ID **'channelList'**