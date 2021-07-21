# Lesson 1 - Retrieving subscription count for a channel

In this folder, learn how to use the YouTube API to retrieve the current subscription count for a channel and output it on the page.

## Technology used
- YouTube Channel API (v3): https://www.googleapis.com/youtube/v3/channels
- Static HTML
- Vanilla JavaScript (JS) (no other JS libraries or frameworks used)

## Running the sample
In the HTML file, you will see a working static HTML file that will let you see the current subscription counts of two channels. To get it running:

1. Open the HTML web page in your browser. It does not require a web server, as it uses a 'fetch' against the API URL instead of the initializing the client API.
2. Click on the "Update stats" button at the top of the page. This will trigger the call to the API and will fill in the "Subscribers" column.

Note that there is no additional styling or extra markup. The HTML file is made to be as simple as possible for learning purposes.