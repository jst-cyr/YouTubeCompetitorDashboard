# Lesson 1 - Retrieving subscription count for a channel

In this folder, learn how to use the YouTube API to retrieve the current subscription count for a channel and output it on the page.

## Technology used
- YouTube Channel API (v3): https://www.googleapis.com/youtube/v3/channels
- Static HTML
- Vanilla JavaScript (JS) (no other JS libraries or frameworks used)

## Running the sample
In the HTML file, you will see a working static HTML file that will let you see the current subscription counts of two channels. To get it running:

1. Open the HTML web page in your browser. It does not require a web server, as it uses a 'fetch' against the API URL instead of the initializing the client API.
2. Click on the "Update stats" button at the top of the page. This will trigger the call to the API and will fill in the "Subscribers" column.

Note that there is no additional styling or extra markup. The HTML file is made to be as simple as possible for learning purposes.

## What is the code doing?
I tried to keep the code simple and self-documenting, but I know I needed to figure some things out as I started learning this and making mistakes, so here are some important bits:

### getChannelSubscribers

#### Using async on the function definition
	async function getChannelSubscribers(channelId){}

The first thing to notice in this function is the '**async**' on the function definition. I was trying to invoke the API in the method and return the value out of the function, but until I put 'async' on it the value returned was being lost and was only accessible within the function itself. I learned later that this all about [Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).

#### Invoking the fetch

	fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`)

The first call in the method is invoking the API directly, without using the client library, and instead using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). I was trying to reduce the number of dependencies for this first step. This calls the API and passes in the **channelId** value passed to the function, as well as the **apiKey** value that was defined earlier in the code.

#### Converting the response

	.then(response => {
    	return response.json()
    })

The fetch is followed by a 'then' block which reads through the response JSON object and creates an object from it. More details here: https://developer.mozilla.org/en-US/docs/Web/API/Response/json

#### Extracting the subscription count

	.then(data => {
    	console.log(data);
    	return data["items"][0].statistics.subscriberCount;
    })

After converting the response to an object, the object is logged to console (to validate we got a response) and then accesses the statistics in the array of responses to extract the subscriberCount. This is not a "safe" call as it can fail if any of the object is not filled out, but for simplicity it is not checking for null values.

### updateSubscriber

#### Calling an async method
	var subscriberCount = await getChannelSubscribers(channelId);

The updateSubscriber method is also async, but when you call an async method you also need to use the **await** to make sure you wait for the result from the async function you are calling. Here the code is waiting on the getChannelSubscribers function to return the subscriberCount value for the specified channel.

#### Updating the DOM
	var subscriberCountDiv = document.getElementById(channelId);
    if(subscriberCountDiv){
    	subscriberCountDiv.innerHTML = subscriberCount;
	}

This block takes the value received from the API and updates the element in the DOM with the value.

### updateStats
This method is invoked by the button on the page and contains the definition of the channel IDs we want to get subscriber counts for. Not much going on here, just invoking other methods and passing in the channel ID.

### The markup
	<tr><td>Discover Sitecore</td><td><div id="UCJrNXcAEmZrqbf2suxbfIkg" class="subscriberCount"></div></td></tr>

The one thing I wanted to call out here is the DIV definition. To make it easy to update, I've put the channel ID as the ID of the DIV that needs to be updated. As I move forward and make this more dynamic and data-driven, this will need to change, but for this step this was an easy way to match up the channel data with the DIV where the value should be placed.