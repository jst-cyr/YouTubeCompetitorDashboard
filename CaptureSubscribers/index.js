const {google} = require('googleapis');
const {DefaultAzureCredential} = require('@azure/identity');
const {SecretClient} = require('@azure/keyvault-secrets');

module.exports = async function (context, req) {
    
    context.log('Beginning capture of YouTube subscribers.');

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
    const keyVaultName = "CaptureSubscribersVault";
    const keyVaultUri = `https://${keyVaultName}.vault.azure.net`;
    const credential = new DefaultAzureCredential();
    const secretClient = new SecretClient(keyVaultUri, credential);
    const apiKeySecret = await secretClient.getSecret("Youtube-API-Key");
    const apiKey = $(apiKeySecret.value);

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