const {google} = require('googleapis');

module.exports = async function (context, req) {
    
    context.log('Beginning capture of YouTube subscribers.');

    //Setup the request data we need to call the API
    const apiKey = 'AIzaSyClnRkQON9_oUA9nXShlGKOwLXGRG2sqvY';
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
        const channelData = { statistics: { subscriberCount, videoCount, viewCount } } = youtubeResponse.data.items[0];
        context.log(`The channel '${channelId}' has ${subscriberCount} subscribers, ${videoCount} videos and ${viewCount} views.`);
        context.res = {
            body: channelData,
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