# pine
> vine clone over IPFS

![Demo of Pine](pine-demo.gif)

## How to run

Requires nodejs version 9.0.0 or higher and yarn

- Clone the repository
- Run `yarn` to install the dependencies (or `npm install` if you use npm)
- Run the `dev` command to serve frontend via either yarn or npm
  - `yarn dev` OR `npm run dev`
- Run the caching server via either yarn or npm
  - `yarn start` OR `npm start`

Now you should be able to see the application on localhost:8080

Navigating to the website, you should see the start page, showing
a "Record new Pine" in the bottom, and a permission dialog asking
for permission to access your camera. Accept that. Also, open up the
browser's javascript console, so you can see any potential errors (
currently doesn't handle errors very good)

Then click on "Record new Pine" to go to the recording screen.

Once on the recording screen, click and hold down on the camera
output to begin recording. You should see a progress-bar in the
bottom. Make sure to release the mouse before it fills up, as each
recording can only be ~6 seconds long.

Once you let go, press the "Publish" button and you should be able
to see a preview of your recording. If you're happy with it, click
"Publish" in the top-right, and your recording will be published
on IPFS. You can see the link being printed in your browser's
console.

## open problems

- How to keep track of "loops"
- How to keep track of all publishes?
- Help seed everyones content

## ux

Starts with full page with listing of videos

Button in bottom for recording

Recording screen shows video in fullscreen with
progress meter in the bottom

Once recorded something, show button in top right
to publish video

Publish video takes you to the preview screen which
replays the video for you

Publish page shows button in the bottom for actually
publishing the video

Once published, it shows you the submission in
the browser

## data structures

### list of videos

----------------

Upon opening, a peer should send `GET_VIDEOS_HEAD` message on `PINE` topic via
pubsub. Online peers will respond with `SEND_VIDEOS_HEAD` which is a hash of
the latest version that peer have seen of the list of videos. The peer who
requested the list will take the first seen message and fetch the list from that.

A list of videos looks like this:

```
[{
  title: 'Look, a funny cat!',
  video: '/ipfs/Qkamlfknawleknfal',
  created_at: '2017-10-08T16:05:42.023Z'
}]
```

It will also be possible to run `Hoster` nodes to listen and respond to queries
in case no other peers are online.

### view-count

View counts are maintained by super-nodes who are permissioned to increment the
view counters.

When normal nodes first starts, the request the latest head of the counting with
sending a `GET_VIEWS` message on topic `PINE` upon the super-nodes responds with
a `SEND_VIEWS` message containing the data-structure for the views.
