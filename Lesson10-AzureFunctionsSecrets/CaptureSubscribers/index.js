const {google} = require('googleapis');
const {DefaultAzureCredential} = require('@azure/identity');
const {SecretClient} = require('@azure/keyvault-secrets');

module.exports = async function (context, req) {
    
    context.log('Beginning capture of YouTube subscribers.');

    /*Check for environment variables and report back if any are missing. Configuration needs to be checked first to ensure the developer gets 
     to a working environment faster.
    */
    const keyVaultName = process.env["KEY_VAULT_NAME"];
    const youtubeAPIKeySecretName =  process.env["KEY_YOUTUBE_API"];
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

    //Get the Channel ID that was passed in
    const channelId = (req.query.channelId || (req.body && req.body.channelId));

    //If no channelId provided, immediately stop processing
    if(!channelId){
        const noChannelIdMessage = "You must pass a value for required parameter 'channelId'.";
        context.log(noChannelIdMessage);
        context.res = {
            status: 500,
            body: noChannelIdMessage,
        };
        return;
    }

    //Get the API key from the key vault
    const keyVaultUri = `https://${keyVaultName}.vault.azure.net`;
    const credential = new DefaultAzureCredential();
    const secretClient = new SecretClient(keyVaultUri, credential);
    const apiKeySecret = await secretClient.getSecret(youtubeAPIKeySecretName);
    const apiKey = apiKeySecret.value;

    //If no API Key is found in the vault, we need to inform the calling function
    if(!apiKey){
        const noAPIKeySecret = `No API Key value was found in vault ${keyVaultName} and secret ${youtubeAPIKeySecretName}`;
        context.log(noAPIKeySecret);
        context.res = {
            status: 500,
            body: noAPIKeySecret,
        };
        return;
    }

    //Call the YouTube API for the channel data
    const youtube = google.youtube({
        version: 'v3',
        auth: apiKey,
    });

    const youtubeResponse = await youtube.channels.list({
        part: 'id,statistics',
        id: channelId,
    })

    //Extract the data from the response, if possible
    if(youtubeResponse.data && youtubeResponse.data.items && youtubeResponse.data.items.length){
        context.log(`YouTube data for '${channelId}':  ${youtubeResponse.data}`);
        context.res = {
            body: youtubeResponse.data,
        }
        return;
    }

    //If there is no data found, report back a 404 (no channelId found)
    const noChannelFoundMessage = `No data found in YouTube API with channel id '${channelId}'`;
    context.log(noChannelFoundMessage);
    context.res = {
        status: 404,
        body: noChannelFoundMessage,
    };
}