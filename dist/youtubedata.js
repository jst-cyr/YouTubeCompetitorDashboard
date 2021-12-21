var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export { YouTubeData };
class YouTubeData {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    //Get the subscriber count for a specified channel
    getChannelSubscribers(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            var subscriberCount = fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${this.apiKey}`)
                .then(response => {
                return response.json();
            })
                .then(data => {
                console.log(data);
                return data["items"][0].statistics.subscriberCount;
            });
            return subscriberCount;
        });
    }
    //Invokes the YouTube API to get data about all channels provided in the list of channels
    //RETURNS: An array of channel objects with the YouTube statistics data
    getChannelData(channelsList) {
        return __awaiter(this, void 0, void 0, function* () {
            //Build up a list of the IDs we want to get data for, separated by a comma
            var channelIds = channelsList.map((channel) => channel.ChannelId).join();
            //Fetch the data and then fill out the objects
            var youtubeChannelData = fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelIds}&key=${this.apiKey}`)
                .then(response => {
                return response.json();
            })
                .then(data => {
                console.log(data);
                //Map the data from YouTube into a new array of channel objects
                var channelData = data["items"].map(item => {
                    //Find the matching channel in the list that was provided
                    var matchedChannel = channelsList.find(channel => channel.ChannelId === item.id);
                    //Create a new object combining existing config data and the data from the YouTube API
                    return {
                        ChannelId: item.id,
                        Label: matchedChannel.Label,
                        SubscriberCount: item.statistics.subscriberCount,
                        ViewCount: item.statistics.viewCount,
                        VideoCount: item.statistics.videoCount,
                    };
                });
                return channelData;
            });
            return youtubeChannelData;
        });
    }
}
