module.exports = async function (context, req) {
    context.log('Beginning capture of YouTube subscribers.');

    const apiKey = 'AIzaSyClnRkQON9_oUA9nXShlGKOwLXGRG2sqvY';
    const channelId = (req.query.name || (req.body && req.body.name));
    const subscriberCount = 
        fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`)
        .then(response => {
            return response.json()
        })
        .then(data => {
            context.log(data);
            return data["items"][0].statistics.subscriberCount;
        });
    
    const responseMessage = channelId
        ? "Captured " + subscriberCount + " subscribers for " + channelId + "."
        : "This HTTP triggered function executed successfully. Pass a channel ID in the query string or in the request body to retrieve subscriber count.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}