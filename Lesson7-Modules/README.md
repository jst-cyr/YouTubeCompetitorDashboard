# Lesson 7 - Converting Classes to Modules

In the previous lesson, the steps covered how to adjust an inline script and create a Class.

In this lesson, we see how to take scripts and Classes and create very simple [Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). With these changes, the HTML file no longer needs to include all of the classes and only needs to include a single JS file, which can then use imports to load classes as needed. This functionality is widely supported across most modern browsers and no longer requires additional libraries.

## Technology used
- YouTube Channel API (v3): https://www.googleapis.com/youtube/v3/channels
- Airtable browser API: https://github.com/Airtable/airtable.js/blob/master/build/airtable.browser.js
- jQuery v3.6 (for working with the DOM)
- ECMAScript v6 required: Previous steps introduced the need for Array functions [.join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) (v1), [.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) (v5), and [.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) (v6).
- ECMAScript v6 also required for `class` definitions and `modules`.
- Browser or library that supports `import` and `export`. See [Browser support](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#browser_support)
- Web server (e.g. IIS) as 'import' and 'export' require a protocol such as HTTP. **This is the first step in the lessons where you cannot run directly from the file system.**

## Running the sample
In the HTML file, you will see a working static HTML file that will let you see the current subscription counts of two channels. To get it running:

1. Configure your local 'hosts' file to have an entry you will use to load this project (e.g. '127.0.0.1	youtube.local')
1. Create a web application definition on your web server (such as IIS) that binds to this local hostname (e.g. `youtube.local`).
1. Bind the web application to the folder where you are hosting the code (e.g. `%mypath%\Lesson7-Modules` where `%mypath%` is your local file system folder where the Lesson7 folder is)
1. Open the HTML web page in your browser using the local hostname (e.g. `http://youtube.local/Modules.html`). 
1. On load of the page, the table will be built out. You can add breakpoints to see the code in action.

Note that there is no additional styling or extra markup. The HTML file is made to be as simple as possible for learning purposes.

## What is the code doing?
In this step, all functions in the HTML file were moved into `class` definitions, similar to what was shown for `YouTubeData` in Lesson 6. The main script that launches everything was moved to a new `youtubeDashboard.js` file which is defined as a module and imports the other classes.

`import` and `export` are used to make the module functionality work. 

Now we'll break down the individual changes done in this lesson 7

### Migrating to Classes
	class YouTubeChannelList { ... }
	class YouTubeChannelConfiguration { ... }

In addition to `YouTubeData` we now have classes for `YouTubeChannelConfiguration` and `YouTubeChannelList`. This was functionality previously in the dashboard HTML file as inline script.

The first step was to move them to `lib` as Classes, just like we did with `YouTubeData`. This ensured that all the code was still working once the logic was in Classes. Converting to Modules was later.

I'm not going into depth on the changes required here. The code is very similar to what it was before when it was inline, but now encapsulated in a class. Please see [Lesson 6 - Classes](../Lesson6-Classes) to see the steps required for this.

### Introducing `youtubeDashboard.js`
	import { YouTubeChannelConfiguration } from './modules/youtubechannelconfiguration.js';
	import { YouTubeChannelList } from './modules/youtubechannellist.js';

The remaining inline script in the HTML file that is now using the new classes was moved to a new JS file named `youtubeDashboard.js`

This new file is setup as a module and uses `import` statements to include `YouTubeChannelConfiguration` and `YouTubeChannelList`. 

What about `YouTubeData`, though? That class is not used by the main script in this file, so does not need to be imported here. We only need to import the classes we use in the script. Any dependent classes need to be imported in the correct module. We'll see that later!

### The `module` type
	<script type="module" src="youtubeDashboard.js"></script>

All of the script includes were removed from the static HTML file and replaced by a single script include that includes our new dashboard module. 

**IMPORTANT:** The `type="module"` property is required to allow the module functionality to work! If this is not included, you **will get an error** when you use import/export statements:

`Uncaught SyntaxError: Cannot use import statement outside a module`

### The `export` statement
	export {YouTubeChannelConfiguration};

To make a class available for importing, we need to export it. There are several ways to do this, but what I've done here is the simplest change possible that is easy to learn.

For each `class`, at the top of the JS file I have added an `export {TheClassName};` statement. This makes it really easy to see what is imported or exported from the file without digging through the code. 

Once this `export` statement is added, the `import` statement used in `youtubeDashboard.js` will now work!


### Importing `YouTubeData` for the channel list
	import { YouTubeData } from './youtubedata.js';
	export {YouTubeChannelList};

Earlier, we saw that YouTubeData was not imported into the dashboard. This is because it is only used by the YouTubeChannelList class. This is where we really see some of the power of the module import/export. Rather than having to define all the includes in the HTML file, we can now isolate the dependencies as needed.

In the `youtubechannellist.js` file there is both an `export` for the class, but also an `import` for the `YouTubeData` class. This allows this particular class to use the `YouTubeData` class in this context.

## Learn more about modules

 * **Modules:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
 * **import:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
 * **export:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
 * **ES6 In Depth - Modules:** https://hacks.mozilla.org/2015/08/es6-in-depth-modules/