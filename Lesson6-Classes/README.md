# Lesson 6 - Creating Classes in JavaScript
Previous steps had a lot of inline JavaScript that was used to retrieve data from the YouTube API.

In this lesson, this code is migrated to a `lib\youtubedata.js` file which defines a new JavaScript `class`. With these changes we can see the small adjustments needed to take inline script and create a Class.

## Technology used
- YouTube Channel API (v3): https://www.googleapis.com/youtube/v3/channels
- Airtable browser API: https://github.com/Airtable/airtable.js/blob/master/build/airtable.browser.js
- jQuery v3.6 (for working with the DOM)
- ECMAScript v6 required: Previous steps introduced the need for Array functions [.join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) (v1), [.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) (v5), and [.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) (v6).
- ECMAScript v6 also required for `class` definitions.

## Running the sample
In the HTML file, you will see a working static HTML file that will let you see the current subscription counts of two channels. To get it running:

1. Open the HTML web page in your browser. It does not require a web server, as it uses a 'fetch' against the API URL instead of the initializing the client API.
2. On load of the page, the table will be built out. You can add breakpoints to see the code in action.

Note that there is no additional styling or extra markup. The HTML file is made to be as simple as possible for learning purposes.

## What is the code doing?
In this step, code was moved from the HTML file into `lib\YouTubeData.js`. I'll cover here the changes needed to make a simple class.

### The `class` keyword
	class YouTubeData {
		...
	}

The first step was to copy the functions from the HTML file into the YouTubeData.js file. But that doesn't make it a class. We need to define the class using the `class` keyword. In this case, we use the `class` keyword followed by the name of the class ('YouTubeData'). Our functions are then inside the braces.

### The `constructor`
	constructor(apiKey){
		this.apiKey = apiKey;
	}

JavaScript classes have a special function called `constructor` which allows you to specify how this class should be created/instantiated.

In this case, I need an API Key to access the YouTube API, so I have made it part of the parameters for the constructor, and I've initialized a property to store it on the instance of the object. Future calls to functions on this object can then access this `apiKey` property.

### Updating `getChannelSubscribers`
	async getChannelSubscribers(channelId) {
		...
		fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${this.apiKey}`)
		...
	}
I copy pasted this method in, but needed to make **two** changes:

1. The `function` keyword needed to be dropped from the definition
2. The `apiKey` variable used in the fecth needed to be updated to access the class property instead using `this.apiKey`

### Updating `getChannelData`
	async getChannelData(channelsList){
		...
		fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelIds}&key=${this.apiKey}`)
		...
	{}

I copy pasted this method in, but needed to make **two** changes:

1. The `function` keyword needed to be dropped from the definition
2. The `apiKey` variable used in the fecth needed to be updated to access the class property instead using `this.apiKey`

### Including the class
	<script src="lib/youtubedata.js"></script>

This script tag makes sure the YouTubeData class is available for the rest of the scripts.

### Calling the YouTubeData class
	var youtubeData = new YouTubeData(youtubeApiKey);
	var channelsList = await youtubeData.getChannelData(configuredChannels);

Previously, this code would directly invoke the getChannelData function exactly as above, but without the `youtubeData` object being involved.

In this step, we create a new instance of the YouTubeData class by using the `new` keyword, followed by the name of the class ('YouTubeData'). This is calling the constructor we defined on the class.

The API Key is passed in as a parameter to the constructor so that the object is initialized correctly.

To invoke `getChannelData` we then need to make the call on the new `youtubeData` object that was created by using `youtubeData.getChannelData`.

## Learn more about classes

 * Classes: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes