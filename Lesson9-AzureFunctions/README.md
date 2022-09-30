# Lesson 9 - Adding Azure Functions

In the previous lesson, the application was updated to TypeScript in preparation for a later move to Next.js. Now, we are going to move our business logic into [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/) and out of the JavaScript. This will allow us to move API keys into server-side code with minimal changes to our application.

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
1. Bind the web application to the folder where you are hosting the code (e.g. `%mypath%\Lesson9-AzureFunctions` where `%mypath%` is your local file system folder where the Lesson9 folder is)
1. Deploy the Azure Functions to your Azure subscription (see further down for how to do this)
1. Configure CORS on the Azure subscription to accept your local hostname (e.g. `youtube.local`)
1. Once your Azure Functions are available, get the host name and configure youtubeDashboard.ts to have your host name instead of the one in the repo.
    `const azureFunctionsHost = "https://jcy-dashboard-capturesubscribers.azurewebsites.net";`
1. Open the HTML web page in your browser using the local hostname (e.g. `http://youtube.local/AzureFunctions.html`). 
1. On load of the page, the table will be built out. You can add breakpoints to see the code in action.

Note that there is no additional styling or extra markup. The HTML file is made to be as simple as possible for learning purposes.

## Deploying an Azure function
If you are new to Azure functions, like I was, I highly recommend the [Azure Functions tutorial](https://docs.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-node) which goes through the deployment process.

**Steps summary**
1. Open the repo in Visual Code
1. Sign in to Azure: You should have an Azure icon on the left where you can select to Sign in.
1. Create a function app in Azure: See [these steps in the tutorial](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-node#publish-the-project-to-azure) for the instructions on how to do this. The basics summary is: Click the + to create a new resource, select a subscription, region, runtime, and give it a name.
1. Go to the **Workspace** area in your Azure tab to see your local functions
1. Choose the local project you want to deploy (in this case the one with `CaptureSubscribers` and `GetConfiguredChannels` functions)
1. Press the 'cloud' icon which is for deploying to the Azure cloud
1. Select your subscription and then the app resource you created.


## What is the code doing?

## Moving to Azure functions
Two new Azure Functions have been introduced: `CaptureSubscribers` and `GetConfiguredChannels`. These wrap around their respective YouTube API and Airtable API calls.

The original logic has been moved, with minimal changes, to the Azure Function. The original methods in the JavaScript have been updated to invoke the Azure Function instead of calling the API directly.

**BUT WHY?** A big reason is to take one step forward in getting rid of more complex logic which shouldn't be in the front-end app. By having this logic reside in the Azure Function, we can start taking advantage of Node to run the logic, and start pushing things like API keys and configurations away from the browser. 

### Switching to Google client API
In the original web page, I was using `fetch` to hit the Google API. Trying to move this code directly over to Azure Functions proved to be a bit of a pain. Some of the things I hit:

1. `fetch` is not defined: In the version of Node I'm using, you can't invoke fetch. You need to import a library
2. `node-fetch` wouldn't work with `require`: I tried to use `node-fetch` as a library, but both require and import weren't working outside the function. Rather than continue trying to figure out module definitions, I used a dynamic import.... this did work, sort of.
3. `ERR_INVALID_URL` Invalid URL errors: Even with a completely valid URL, validated through my browser, the dynamically imported node-fetch kept telling me it was an invalid URL when running in the Azure Function.

However, while trying to figure out why I stumbled across some very simple code to use the Google API client and an API Key to do the query. It was very easy, and with this being server-side now I didn't need to meet my requirement for running in the browser!

### Hiding the API Keys and other configuration
Another key change is that the calling JavaScript functions no longer requires a YouTube API Key or Airtable API key, meaning the user cannot see the API keys in the browser's page source view. By moving the API keys into the Azure functions, this is now hidden.

I also moved the Airtable database identifier into the Azure function, since the HTML app doesn't really need to know about this level of detail.

Ultimately, these should wind up as environment variables that can be configured by the team running the application. For now, moving them to the Azure Function is a good first step.

## Learn more about Azure Functions

 * **Azure Functions docs:** https://docs.microsoft.com/en-us/azure/azure-functions/
 * **Create a JavaScript function in Azure using Visual Studio Code:** https://docs.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-node 
 * **Invoking Google API client to get channel statistics in JavaScript:** https://stackoverflow.com/questions/70714671/how-do-i-get-a-subscriber-count-from-youtube-api-by-channel-name