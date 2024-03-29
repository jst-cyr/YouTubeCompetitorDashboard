# Lesson 10 - Using Secrets with Azure Functions

In the previous lesson, the application was updated to migrate the calls to Airtable and Google's YouTube API into Azure Functions. That was a setup to move API keys into server-side code. Now, we want to move those API keys into secrets so that each user of our repo will be able to configure their own security, and we won't be sharing API keys in our source control anymore.

## Technology used
- YouTube Channel API (v3): https://www.googleapis.com/youtube/v3/channels
- ECMAScript v6 required: Previous steps introduced the need for Array functions [.join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) (v1), [.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) (v5), and [.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) (v6).
- ECMAScript v6 also required for `class` definitions and `modules`.
- Browser or library that supports `import` and `export`. See [Browser support](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#browser_support)
- Web server (e.g. IIS) as 'import' and 'export' require a protocol such as HTTP. 
- Airtable NPM package
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
    `const ENV_AZURE_FUNCTIONS_HOST = "https://jcy-dashboard-capturesubscribers.azurewebsites.net";`
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
1. Create your Azure Key Vault and enter your values (see below section named **'Creating and Configuring your Azure Key Vault'**)
1. Configure access to the key vault (see **'Configuring secure access to Azure Key Vault settings'**)
1. Configure your environment settings (see **'Configuring application settings for your Azure Function App'**)


## Creating and Configuring your Azure Key Vault
In order to safely configure out Azure Functions, the settings are stored in the Azure Key Vault. **NOTE:** This will add cost to your Azure Bill! You can use your own, but these steps assume you don't have one. There are multiple ways to do this, but the following steps are based on [this Azure quickstart](https://learn.microsoft.com/en-us/azure/key-vault/general/quick-create-portal) and [this blog](https://sandervandevelde.wordpress.com/2019/05/01/it-only-takes-simple-five-steps-to-secure-your-secrets-in-azure-functions/).

1. Login to the Azure Portal
1. Navigate to the Resource Group you created for deploying your Azure Functions
1. Click "Create" and search for 'Key Vault' in the marketplace. The first result should be a Microsoft Azure Service
1. In  the *Create a Key Vault* wizard, the *Basics* step will need you to specify the Subscription and Resource Group. Set this to be the same subscription and Resource Group as the Azure Functions.
1. Provide a name and region and pricing tier. I suggest starting with Standard until you know you need more.
1. Click *Review + create* to jump to the end of the wizard.
1. Wait a moment, then the *Create* button will activate. Click it and create your vault!
1. When the deployment is complete, click the **Go to resource** button and view the new Vault. Here is where you will add your configurations.
1. Select **Secrets** from the left pane and click *Generate/import* to create a new Secret
1. Select the following settings to configure the **YouTube API key* secret
    * **Upload options:** Manual
    * **Name:** Youtube-API-Key
    * **Secret value:** Put your YouTube API Key value here. It will look something like this: `BJzaRyBlnWkAOG8_oWB1jAShlLPOwLGIUY2skuE`
    * Leave the rest as defaults/empty.
1. Generate a new secret and configure the **Airtable API key** secret
    * **Upload options:** Manual
    * **Name:** Airtable-API-Key
    * **Secret value:** Put your Airtable API Key value here. It will look something like this: `keyrGWPlabgkYp5Do`
    * Leave the rest as defaults/empty.
1. Generate a new secret and configure the **Airtable database id** secret
    * **Upload options:** Manual
    * **Name:** Airtable-Database-Id
    * **Secret value:** Put your Airtable database ID value here. This is the table in Airtable that contains the configured YouTube channels. It will look something like this: `appBuJh28DrqrfTTy`
    * Leave the rest as defaults/empty.

## Configuring secure access to Azure Key Vault settings
1. In Azure Portal, navigate to your Azure Function App. This was created earlier in your steps and is where you deployed all your Azure Functions.
1. On the left pane, scroll down to the **Settings** section and select **Identity**.
1. Click the **Status** toggle to **On** and hit *Save* to save the changes. You'll be asked to confirm.
1. In Azure Portal, navigate back to your Azure Key Vault you have created.
1. On the left pane, select **Access configuration** in the **Settings** section. 
1. Enable Azure RBAC by switching from *Vault access policy* to **Azure role-based access control**
1. Go to the **Access control (IAM)** for the vault to add a new policy.
1. Click *Add role assignment* button and make these selections:
    * Role: Key Vault Secrets User
    * Members: Assign access to 'Managed identity'
    * Members: *Select members* and then select options to get to your subscription and eventually select your Function app.
1. Click *Review + assign* and save your changes. The role assignment will be added to IAM!

## Configuring application settings for your Azure Function App
The logic to access the key vault requires you to configure some application settings. Further on in this file you will see how to configure this locally in `local.settings.json`. For running in the cloud, these are the steps you need to do to configure your Azure Function App.

1. Login to the Azure Portal
1. Navigate to your Azure Functions App that you have created in your subscription.
1. Click on **Configuration** to access the application settings
1. Create a new application setting named `KEY_VAULT_NAME`. The value specified here should match to the name of the Azure Key Vault you created earlier.
1. Create a new application setting named `KEY_YOUTUBE_API`. The value specified here should match to the name of the secret you created to contain the YouTube API Key. If you followed the above instructions, this will be `Youtube-API-Key`.
1. Create a new application setting named `KEY_AIRTABLE_API`. The value specified here should match to the name of the secret you created to contain the Airtable API Key. If you followed the above instructions, this will be `Airtable-API-Key`.
1. Create a new application setting named `KEY_AIRTABLE_DATABASE_ID`. The value specified here should match to the name of the secret you created to contain the Airtable Database ID. If you followed the above instructions, this will be `Airtable-Database-Id`.

## Running the Azure Functions locally 

### Configuring environment variables
Locally, you will need a `local.settings.json` file that configures the various application settings required by the application. This is an example:
```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "KEY_VAULT_NAME" : "MyKeyVault",
    "KEY_YOUTUBE_API" : "YouTube-API-Key",
    "KEY_AIRTABLE_API" : "Airtable-API-Key",
    "KEY_AIRTABLE_DATABASE_ID" : "Airtable-Database-Id"
  }
}
```

* **KEY_VAULT_NAME:** This is the name of your key vault.
* **KEY_YOUTUBE_API:** This is the name of the key you added to the vault for the Youtube API Key value.
* **KEY_AIRTABLE_API:** This is the name of the key you added to the vault for the Airtable API Key value.
* **KEY_AIRTABLE_DATABASE_ID:** This is the name of the key you added to the vault for the Airtable Database ID value (where channels are stored).

### Gaining access to the Key Vault
Once you've secured your Azure Function in the portal, you may not be able to execute the Azure Function  from your Visual Code instance. You might get an error that states: `Caller is not authorized to perform action on resource`. Assuming you setup the Key Vault, by default your Azure account has access to the vault, so you need to ensure your Visual Code authenticates as you.

1. Open a terminal in Visual Code
1. Type `az login` at the terminal prompt. This will launch a browser window to authenticate to Azure.
1. Authenticate to the Azure portal with the account you used to setup the Key Vault.

You will now be authenticated and can execute your function!

## What is the code doing?

### Required modules for accessing Azure Key Vault
The following code ensures we have the libraries required to access the Key Vault and things like the DefaultAzureCredential.
```javascript
const {DefaultAzureCredential} = require('@azure/identity');
const {SecretClient} = require('@azure/keyvault-secrets');
```

### Extracting values for environment variables inside an Azure Function
In order to be more secure and move your settings used with your key vault out of the codebase, you need environment variables. The following code is an example of how to extract these from the environment:

```javascript
    const keyVaultName = process.env["KEY_VAULT_NAME"];
    const youtubeAPIKeySecretName =  process.env["KEY_YOUTUBE_API"];
```

In the above code, the values extracted here will be used to connect to the appropriate Key Vault (KEY_VAULT_NAME) and extract the value for the secret with a specific name (KEY_YOUTUBE_API).

### Validating environment variable configuration
If you are just learning, you might want to skip straight to extracting values. However, it's a good idea to validate the environment configurations so that you can throw a helpful error back to the developer about any missing configurations. I particularly needed this when first setting my code up in Azure as I had missed configuring a few values and the error messages helped me know which ones were missing a value.

```javascript
    if(!keyVaultName || !youtubeAPIKeySecretName){
        var missingEnvironmentSettingMessage = "Environment settings have not been configured correctly."
        if(!keyVaultName){
            missingEnvironmentSettingMessage += "\n -KEY_VAULT_NAME : This environment variable has not been configured with a value. Please specify the name of your key vault to be used in the URL for the vault (e.g. https://${keyVaultName}.vault.azure.net.";
        }
        if(!youtubeAPIKeySecretName){
            missingEnvironmentSettingMessage += "\n -KEY_YOUTUBE_API: This environment variable  has not been configured with a value. Please specify the name of the secret in the vault which contains the API Key used to connect to the YouTube API.";
        }

        context.log(missingEnvironmentSettingMessage);
        context.res = {
            status: 500,
            body: missingEnvironmentSettingMessage,
        };
        return;
    }
```

In the above code, I have a few error messages that I went to send back to the calling application, along with a 500 error code. I test all the settings and for each one that is missing add the error message to the result.

### Retrieve a value from the Azure Key Vault
Once you have valid configuration, the Azure Function needs to create a `DefaultAzureCredential` and a `SecretClient` that are configured for your Key Vault. This is essentially the 'connection' to the vault. Here is an example from the code that shows connecting to extract a secret value:

```javascript
    const keyVaultUri = `https://${keyVaultName}.vault.azure.net`;
    const credential = new DefaultAzureCredential();
    const secretClient = new SecretClient(keyVaultUri, credential);
    const apiKeySecret = await secretClient.getSecret(youtubeAPIKeySecretName);
    const apiKey = apiKeySecret.value;
```

In the above code, the following happens:
1. The vault name (`keyVaultName`) is put into a full valid URI that will connect to the Azure Key Vault resource.
1. The `DefaultAzureCredential` and the `keyVaultUri` are then used to instantiate a `SecretClient` which we can call. 
1. A call is made to `getSecret` using the name of the key we want to get a value for. In this case, `youtubeAPIKeySecretName` holds that value. The response is stored in the constant.
1. The value of the secret is then extracted from the response using `.value`

**NOTE:** You do not need a new `SecretClient` connection for each Key Vault value that you want. You can use the same client to get multiple secrets:

```javascript
    const secretClient = new SecretClient(keyVaultUri, credential);
    const apiKeySecret = await secretClient.getSecret(apiKeySecretName);
    const databaseIdSecret = await secretClient.getSecret(databaseIdSecretName);
```

## Learn more about Azure Functions and Secrets

 * [Use Key Vault references for App Service and Azure Functions](https://learn.microsoft.com/en-us/azure/app-service/app-service-key-vault-references?tabs=azure-cli) (learn.microsoft.com)
 * [Quickstart: Create a key vault using the Azure Portal](https://learn.microsoft.com/en-us/azure/key-vault/general/quick-create-portal) (learn.microsoft.com)
 * [Quickstart: Set and retrieve a secret from Azure Key Vault using the Azure portal](https://learn.microsoft.com/en-us/azure/key-vault/secrets/quick-create-portal) (learn.microsoft.com)
 * [Provide access to Key Vault keys, certificates, and secrets with an Azure role-based access control](https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide?tabs=azure-cli) (learn.microsoft.com)
 * [Quickstart: Create a JavaScript function in Azure using Visual Studio Code](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-node) (learn.microsoft.com)
 * [Quickstart: Azure Key Vault secret client library for JavaScript (version 4)](https://learn.microsoft.com/en-us/azure/key-vault/secrets/quick-create-node) (learn.microsoft.com)
 * [How to use Key Vault references for Azure Functions locally](https://learn.microsoft.com/en-us/answers/questions/824221/how-to-use-key-vault-references-for-azure-function.html) (learn.microsoft.com)
 * [A secure way to use Credentials and Secrets in Azure Functions](https://levelup.gitconnected.com/a-secure-way-to-use-credentials-and-secrets-in-azure-functions-7ec91813c807) (levelup.gitconnected.com)
 * [It only takes five simple steps to secure your secrets in Azure Functions](https://sandervandevelde.wordpress.com/2019/05/01/it-only-takes-simple-five-steps-to-secure-your-secrets-in-azure-functions/) (sandervandevelde.wordpress.com)
 * [Using Managed (System) Identities to access Azure Key Vault](https://www.serverlessnotes.com/docs/using-managed-system-identities-to-access-azure-key-vault) (serverlessnotes.com)
 * [Manage a function app - Work with Application Settings](https://learn.microsoft.com/en-us/azure/azure-functions/functions-how-to-use-azure-function-app-settings?tabs=portal) (learn.microsoft.com)