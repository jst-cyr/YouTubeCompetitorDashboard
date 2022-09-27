var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export { YouTubeData, ChannelData };
class ChannelData {
    constructor(channelId, label, subscriberCount, viewCount, videoCount) {
        this.ChannelId = channelId;
        this.Label = label;
        this.SubscriberCount = subscriberCount;
        this.ViewCount = viewCount;
        this.VideoCount = videoCount;
    }
}
class YouTubeData {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    //Get the subscriber count for a specified channel
    getChannelSubscribers(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscriberCount = fetch(`https://jcy-dashboard-capturesubscribers.azurewebsites.net/api/capturesubscribers?channelId=${channelId}`)
                .then(response => {
                return response.json();
            })
                .then(data => {
                console.log(data);
                return Number(data["items"][0].statistics.subscriberCount);
            });
            return subscriberCount;
        });
    }
    //Invokes the YouTube API to get data about all channels provided in the list of channels
    //RETURNS: An array of channel objects with the YouTube statistics data
    getChannelData(channelsList) {
        return __awaiter(this, void 0, void 0, function* () {
            //Build up a list of the IDs we want to get data for, separated by a comma
            const channelIds = channelsList.map((channel) => channel.ChannelId).join();
            //Fetch the data and then fill out the objects
            var youtubeChannelData = fetch(`https://jcy-dashboard-capturesubscribers.azurewebsites.net/api/capturesubscribers?channelId=${channelIds}`)
                .then(response => {
                return response.json();
            })
                .then(data => {
                console.log(data);
                //Map the data from YouTube into a new array of channel objects
                var channelData = data["items"].map((item) => {
                    //Find the matching channel in the list that was provided
                    const matchedChannel = channelsList.find(channel => channel.ChannelId === item.id);
                    //Create a new object combining existing config data and the data from the YouTube API
                    return new ChannelData(item.id, matchedChannel ? matchedChannel.Label : item.id, item.statistics.subscriberCount, item.statistics.viewCount, item.statistics.videoCount);
                });
                return channelData;
            });
            return youtubeChannelData;
        });
    }
}
