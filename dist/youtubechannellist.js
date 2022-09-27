var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { YouTubeData } from './youtubedata.js';
export { YouTubeChannelList };
class YouTubeChannelList {
    constructor(tableId, configuredChannels) {
        this.tableId = tableId;
        this.configuredChannels = configuredChannels;
    }
    //Update the markup with the latest data from the API
    fillTable() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            //Get a list of channel data from the API
            const youtubeData = new YouTubeData();
            const channelsList = yield youtubeData.getChannelData(this.configuredChannels);
            //Sort the list of channels by their subscriber count, in descending order (biggest to smallest)
            const sortedChannels = channelsList.sort((a, b) => b.SubscriberCount - a.SubscriberCount);
            //For each of the channels in the sorted list, create a row and add it to the table
            for (var index in sortedChannels) {
                //Create the row, showing a label and the subscriber count
                const row = document.createElement("tr");
                row.innerHTML = ("<td>" + sortedChannels[index].Label + "</td><td>" + sortedChannels[index].SubscriberCount + "</td>");
                //Add the row to the table that has ID provided
                (_b = (_a = document.getElementById(this.tableId)) === null || _a === void 0 ? void 0 : _a.querySelector("tbody")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            }
        });
    }
}
