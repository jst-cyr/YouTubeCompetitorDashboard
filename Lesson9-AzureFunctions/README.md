# Lesson 9 - Adding Azure Functions

In the previous lesson, the application was updated to TypeScript in preparation for a later move to Next.js. Now, we are going to move our business logic into [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/) and out of the JavaScript. This will allow for the code to run regularly, even when the website is not being visited.

This will also extend our Airtable integration to store historical data.

## Technology used
- YouTube Channel API (v3): https://www.googleapis.com/youtube/v3/channels
- Airtable browser API: https://github.com/Airtable/airtable.js/blob/master/build/airtable.browser.js
- ECMAScript v6 required: Previous steps introduced the need for Array functions [.join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) (v1), [.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) (v5), and [.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) (v6).
- ECMAScript v6 also required for `class` definitions and `modules`.
- Browser or library that supports `import` and `export`. See [Browser support](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#browser_support)
- Web server (e.g. IIS) as 'import' and 'export' require a protocol such as HTTP. 
- [TypeScript compiler](https://code.visualstudio.com/docs/typescript/typescript-tutorial#_install-the-typescript-compiler) (TSC) is required to compile TypeScript. **This is the first step in the lessons where you will compile TypeScript**
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js 16.x](https://nodejs.org/en/download/releases/)
- [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
- [Azure Functions Core Tools 4.x](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Cwindows%2Ccsharp%2Cportal%2Cbash#install-the-azure-functions-core-tools)

## Running the sample
In the HTML file, you will see a working static HTML file that will let you see the current subscription counts of two channels. To get it running:

1. Configure your local 'hosts' file to have an entry you will use to load this project (e.g. '127.0.0.1	youtube.local')
1. Create a web application definition on your web server (such as IIS) that binds to this local hostname (e.g. `youtube.local`).
1. Bind the web application to the folder where you are hosting the code (e.g. `%mypath%\Lesson8-TypeScript` where `%mypath%` is your local file system folder where the Lesson8 folder is)
1. Open the HTML web page in your browser using the local hostname (e.g. `http://youtube.local/TypeScript.html`). 
1. On load of the page, the table will be built out. You can add breakpoints to see the code in action.

Note that there is no additional styling or extra markup. The HTML file is made to be as simple as possible for learning purposes.

## What is the code doing?

### Switching to Google client API
In the original web page, I was using `fetch` to hit the Google API. Trying to move this code directly over to Azure Functions proved to be a bit of a pain. Some of the things I hit:

1. `fetch` is not defined: In the version of Node I'm using, you can't invoke fetch. You need to import a library
2. `node-fetch` wouldn't work with `require`: I tried to use `node-fetch` as a library, but both require and import weren't working outside the function. Rather than continue trying to figure out module definitions, I used a dynamic import.... this did work, sort of.
3. `ERR_INVALID_URL` Invalid URL errors: Even with a completely valid URL, validated through my browser, the dynamically imported node-fetch kept telling me it was an invalid URL when running in the Azure Function.

However, while trying to figure out why I stumbled across some very simple code to use the Google API client and an API Key to do the query. It was very easy, and with this being server-side now I didn't need to meet my requirement for running in the browser.


## Learn more about Azure Functions

 * **Azure Functions docs:** https://docs.microsoft.com/en-us/azure/azure-functions/
 * **Create a JavaScript function in Azure using Visual Studio Code:** https://docs.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-node 
 * **Invoking Google API client to get channel statistics in JavaScript:** https://stackoverflow.com/questions/70714671/how-do-i-get-a-subscriber-count-from-youtube-api-by-channel-name