# Lesson 2 - Buiding a table of channels dynamically

In this folder, we see how to update the initial YouTube channel subscription table built in the previous lesson and now generate the markup for the rows dynamically using jQuery and an object holding a list of channels.

## Technology used
- YouTube Channel API (v3): https://www.googleapis.com/youtube/v3/channels
- jQuery v3.6 (for working with the DOM)

## Running the sample
In the HTML file, you will see a working static HTML file that will let you see the current subscription counts of two channels. To get it running:

1. Open the HTML web page in your browser. It does not require a web server, as it uses a 'fetch' against the API URL instead of the initializing the client API.
2. On load of the page, the table will be built out. You can add breakpoints to see the code in action.

Note that there is no additional styling or extra markup. The HTML file is made to be as simple as possible for learning purposes.

## What is the code doing?
In the previous lesson, we described some of the code blocks, so this will only cover the major changes from the last lesson.

### Defining the channel data
	const channels = {
		DiscoverSitecore: {
			ChannelId : 'UCJrNXcAEmZrqbf2suxbfIkg',
			Label : 'Discover Sitecore'
		},
		Sitecore: {
			ChannelId : 'UCr6untnQn62iR3DkcswdKkw',
			Label : 'Sitecore'
		}
	}

The **channels** object defines the data about the channels that was previously hard-coded into the HTML and JavaScript functions. By creating an object in this way, we can access specific properties, or loop, which will support our dynamic generation that is being introduced in this step.

### addChannel function - Building rows
	var row = $("<tr><td>" + channel.Label + "</td><td>" + subscriberCount + "</td></tr>");

	$("#channelList").find("tbody").append(row);

In this lesson, the previous 'updateSubscriber' method was renamed to 'addChannel' and now builds out the table rows, rather than updating a DIV with the subscriber count.

First, using jQuery, a new row object is built with markup for the TR and TD elements, combined with the **channel label** (defined in the const variable earlier) and the **subscriberCount** received from the API.

Next, jQuery is used to find the table which lists the channels, using the ID **channelList**. The row is then added to this table.

**NOTE:** When I first tried to append a row, I searched for the table and immediately did *append* on the table itself. This didn't render correctly. It turns out that even if the HTML does not define the tbody, the DOM in the browser ensures that a TBODY element is there. I needed to find that TBODY element in order to make sure the rows appended correctly.

### updateStats - Getting data by channel
	for(var channel in channels){
		addChannel(channels[channel]);
	}

In the previous lesson, updateStats had hard-coded channel IDs and explicitly updated rows based on each channel. This is not flexible for adding new channels to retrieve.

In this step, the updateStats was updated to loop over the **channels** object instead, and extract each channel.

**NOTE:** Coming from a background in C#, I expected 'channel' to be the actual channel object itself, but instead it was the property on the 'channels' object. This would map to **DiscoverSitecore** or **Sitecore** in the const variable defined earlier.  To get the channel object itself, you need to then access the object with the property, which is why you see this in the for loop:

	channels[channel]