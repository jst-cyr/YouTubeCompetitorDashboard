# Lesson 8 - Converting JavaScript to TypeScript

**TBD**

## Technology used
- YouTube Channel API (v3): https://www.googleapis.com/youtube/v3/channels
- Airtable browser API: https://github.com/Airtable/airtable.js/blob/master/build/airtable.browser.js
- jQuery v3.6 (for working with the DOM)
- ECMAScript v6 required: Previous steps introduced the need for Array functions [.join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) (v1), [.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) (v5), and [.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) (v6).
- ECMAScript v6 also required for `class` definitions and `modules`.
- Browser or library that supports `import` and `export`. See [Browser support](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#browser_support)
- Web server (e.g. IIS) as 'import' and 'export' require a protocol such as HTTP. 
- [TypeScript compiler](https://code.visualstudio.com/docs/typescript/typescript-tutorial#_install-the-typescript-compiler) (TSC) is required to compile TypeScript. **This is the first step in the lessons where you will compile TypeScript**

## Running the sample
In the HTML file, you will see a working static HTML file that will let you see the current subscription counts of two channels. To get it running:

1. Configure your local 'hosts' file to have an entry you will use to load this project (e.g. '127.0.0.1	youtube.local')
1. Create a web application definition on your web server (such as IIS) that binds to this local hostname (e.g. `youtube.local`).
1. Bind the web application to the folder where you are hosting the code (e.g. `%mypath%\Lesson8-TypeScript` where `%mypath%` is your local file system folder where the Lesson8 folder is)
1. Open the HTML web page in your browser using the local hostname (e.g. `http://youtube.local/Modules.html`). 
1. On load of the page, the table will be built out. You can add breakpoints to see the code in action.

Note that there is no additional styling or extra markup. The HTML file is made to be as simple as possible for learning purposes.

## What is the code doing?
**TBD**

Now we'll break down the individual changes done in this lesson.

### Subsection One

### tsconfig.json -> target: 'es6'
In this project, I've been using ES6 to get access to a lot of things that TypeScript already supported (like modules). A lot of the examples for TypeScript migration and tsconfig.json target ES5. You might wonder: What version do I target?

TypeScript will change your script over to the correct version you target so you can have a mix of input files but a standard output to the browser. If you want to target users in older browsers, ES5 (or lower if you really want to) will work. For this tutorial, I've already required browsers that can support ES6, so in my example I've targeted ES6. You can read more about the `target` setting in the docs: https://www.typescriptlang.org/tsconfig#target

### Converting youtubeDashboard.js to TypeScript
When renaming this file to a .ts file I immediately ran into issues that I didn't quite understand. One of the biggest changes I needed to make was to use references to JS files in the same directory, so that it would work whether it was in `src` or `dist`. 

I also wanted to strongly type the configuredChannels variable. This doesn't have much value in this particular case, but it was a good way to learn how to type an array which is catching the result of a function.
`const configuredChannels: ChannelConfig[] = await youtubeChannelConfiguration.getChannelConfiguration();`

To get that to work, I also needed to add `ChannelConfig` class to the import at the top of the file:
`import { YouTubeChannelConfiguration, ChannelConfig } from './youtubechannelconfiguration.js';`


### Converting YouTubeChannelConfiguration from JS to TS
To start enforcing type rules, you can rename a .js file to a .ts file and you'll start seeing the errors being enforced. In this project, I have very few files so I didn't use a tool and manually did one file at a time. If you are learning TypeScript, I felt like this was a great way to start learning what 'works' in JavaScript but doesn't work in TypeScript. Trying to figure out how to fix each one helped me learn more about how TypeScript enforces things.

These are the big changes that needed to happen to convert the YouTubeChannelConfiguration class:

1. **Property definitions**: In the previous JS, properties were implicitly defined in the classes. Now, they need to be explicitly defined with types
1. **Parameter types**: Once properties have types defined, any parameters you are passing into these properties need to have the correct type. For example, in constructors those constructor parameters will now have to have typed parameters that match to the property types they are going to be assigned to.
1. **Update 'require' statements**: Previously, I included the Airtable library using an inline `required('airtable')`. With TypeScript validation, this now results in the error: `Cannot find name 'require'. Do you need to install type definitions for node? Try 'npm i --save-dev @types/node'`.  You can get around this validation by declaring the 'require' statement (this is a hack). In future, I'll want this running on Node and I'll use `npm install airtable` and import the module properly.
1. **Airtable REST API records types**: The call to the Airtable API returns a set of records with an implied 'any' type. This causes TypeScript to complain when we later try to iterate on the results. I needed to explicitly define a 'record' in the iteration to be of type 'any'. I would have preferred to strongly type here, but I'm going to save that step for after I start using Node and the npm install of Airtable.
1. **New ChannelConfig class**: In order to add some strong typing to the `getChannelConfiguration` method, I needed a class to hold the data. Previously, I was defining this inline in the method, but this doesn't make it available to other classes in the project. I put it in the same file and added it as an export from this TS file.
1. **Strongly typing getChannelConfiguration**: In the logic that reads from Airtable, I updated the Array to be strongly typed by declaring it as a generic array: `Array<ChannelConfig>`. The foreach loop now creates new `ChannelConfig` classes, which are added to this Array. I was able to use Visual Code's `ctrl-.` short-cut to update the method definition to have a return type (`async getChannelConfiguration(): Promise<ChannelConfig[]>`)

## Learn more about TypeScript

 * **TypeScript:** https://typescriptlang.org
 * **Migrating from JavaScript:** https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html
 * **TSConfig target:** https://www.typescriptlang.org/tsconfig#target
 * **Visual Studio Code TypeScript tutorial:** https://code.visualstudio.com/docs/typescript/typescript-tutorial