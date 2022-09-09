const {google} = require('googleapis');

module.exports = async function (context, req) {
    
    context.log('Beginning capture of YouTube subscribers.');

    //Setup the request data we need to call the API
    const apiKey = 'AIzaSyClnRkQON9_oUA9nXShlGKOwLXGRG2sqvY';
    const channelId = (req.query.channelId || (req.body && req.body.channelId));

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
    var responseMessage = "This HTTP triggered function executed successfully. Pass a channel ID in the query string or in the request body to retrieve subscriber count.";
    if(youtubeResponse.data && youtubeResponse.data.items && youtubeResponse.data.items.length){
        const { statistics: { subscriberCount, videoCount, viewCount } } = youtubeResponse.data.items[0];
        responseMessage = `The channel ${channelId} has ${subscriberCount} subscribers, ${videoCount} videos and ${viewCount} views.`;
        console.log(responseMessage);
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}